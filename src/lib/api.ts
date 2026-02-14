// ============ Live API integrations (all free, no auth) ============

const EUR_TO_BGN = 1.95583;

// ---- Eurostat HICP Monthly Inflation ----

interface HicpDataPoint {
  period: string; // "2024-01"
  value: number; // year-on-year % change
}

export interface HicpSeries {
  electricity: HicpDataPoint[];
  gas: HicpDataPoint[];
  water: HicpDataPoint[];
  telecom: HicpDataPoint[];
  overall: HicpDataPoint[];
}

function parseEurostatJson(data: Record<string, unknown>): HicpDataPoint[] {
  const result: HicpDataPoint[] = [];
  try {
    const dim = data.dimension as Record<string, unknown>;
    const timeObj = dim.time as Record<string, unknown>;
    const cat = timeObj.category as Record<string, unknown>;
    const timeIndex = cat.index as Record<string, number>;
    const vals = data.value as Record<string, number>;

    const periods = Object.entries(timeIndex).sort((a, b) => a[1] - b[1]);
    for (const [period, idx] of periods) {
      const v = vals[String(idx)];
      if (v !== undefined && v !== null) {
        result.push({ period, value: v });
      }
    }
  } catch {
    // malformed response
  }
  return result;
}

export async function fetchHicpData(): Promise<HicpSeries | null> {
  const base =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_manr?geo=BG&sinceTimePeriod=2024-01";

  const codes: Record<keyof HicpSeries, string> = {
    electricity: "CP0451",
    gas: "CP0452",
    water: "CP0441",
    telecom: "CP0830",
    overall: "CP00",
  };

  try {
    const entries = Object.entries(codes) as [keyof HicpSeries, string][];
    const results = await Promise.all(
      entries.map(async ([key, coicop]) => {
        const res = await fetch(`${base}&coicop=${coicop}`, {
          next: { revalidate: 86400 },
        });
        const json = await res.json();
        return [key, parseEurostatJson(json)] as const;
      })
    );
    return Object.fromEntries(results) as unknown as HicpSeries;
  } catch {
    return null;
  }
}

// ---- Eurostat Energy Prices: BG vs EU ----

export interface EnergyPriceComparison {
  period: string;
  prices: { country: string; label: string; eurPerKwh: number; bgnPerKwh: number }[];
}

export async function fetchEnergyPriceComparison(): Promise<EnergyPriceComparison | null> {
  const url =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_204?geo=BG&geo=RO&geo=DE&geo=EU27_2020&unit=KWH&tax=I_TAX&currency=EUR&nrg_cons=TOT_KWH&freq=S&sinceTimePeriod=2024-S1";

  const labels: Record<string, string> = {
    BG: "България",
    RO: "Румъния",
    DE: "Германия",
    EU27_2020: "ЕС средно",
  };

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();

    const dim = data.dimension as Record<string, unknown>;
    const geoObj = dim.geo as Record<string, unknown>;
    const geoCat = geoObj.category as Record<string, unknown>;
    const geoIndex = geoCat.index as Record<string, number>;
    const timeObj = dim.time as Record<string, unknown>;
    const timeCat = timeObj.category as Record<string, unknown>;
    const timeIndex = timeCat.index as Record<string, number>;
    const vals = data.value as Record<string, number>;

    // Get latest time period
    const periods = Object.entries(timeIndex).sort((a, b) => b[1] - a[1]);
    const latestPeriod = periods[0]?.[0];
    const latestTimeIdx = periods[0]?.[1];
    if (!latestPeriod) return null;

    const numGeos = Object.keys(geoIndex).length;
    const prices: EnergyPriceComparison["prices"] = [];

    for (const [geo, gIdx] of Object.entries(geoIndex)) {
      // Flat index = geoIdx * numTimes + timeIdx (Eurostat uses geo,time dimension order)
      const flatIdx = gIdx * periods.length + latestTimeIdx;
      const v = vals[String(flatIdx)];
      if (v !== undefined) {
        prices.push({
          country: geo,
          label: labels[geo] || geo,
          eurPerKwh: v,
          bgnPerKwh: v * EUR_TO_BGN,
        });
      }
    }

    prices.sort((a, b) => a.eurPerKwh - b.eurPerKwh);

    return { period: latestPeriod, prices };
  } catch {
    return null;
  }
}

// ---- Open-Meteo Weather ----

export interface WeatherData {
  currentTemp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  forecast: { date: string; min: number; max: number }[];
  heatingDays: number; // days below 15°C in next 7 days
}

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  sofia: { lat: 42.6977, lon: 23.3219 },
  plovdiv: { lat: 42.1354, lon: 24.7453 },
  varna: { lat: 43.2141, lon: 27.9147 },
  burgas: { lat: 42.5048, lon: 27.4626 },
};

export async function fetchWeather(
  city: string = "sofia"
): Promise<WeatherData | null> {
  const coords = CITY_COORDS[city] || CITY_COORDS.sofia;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Sofia&forecast_days=7`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    const forecast: WeatherData["forecast"] = [];
    let heatingDays = 0;

    for (let i = 0; i < data.daily.time.length; i++) {
      const min = data.daily.temperature_2m_min[i];
      const max = data.daily.temperature_2m_max[i];
      forecast.push({
        date: data.daily.time[i],
        min,
        max,
      });
      if ((min + max) / 2 < 15) heatingDays++;
    }

    return {
      currentTemp: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      forecast,
      heatingDays,
    };
  } catch {
    return null;
  }
}

// ---- ECB Interest Rate (already used, extracted here) ----

export interface EcbRate {
  period: string;
  consumerRate: number | null;
}

export async function fetchEcbRate(): Promise<EcbRate | null> {
  try {
    const res = await fetch(
      "https://data-api.ecb.europa.eu/service/data/MIR/M.BG.B.A2B.A.C.A.2250.EUR.N?lastNObservations=1&format=csvdata",
      { next: { revalidate: 86400 } }
    );
    const text = await res.text();
    const lines = text.trim().split("\n");
    if (lines.length >= 2) {
      const headers = lines[0].split(",");
      const values = lines[1].split(",");
      const periodIdx = headers.indexOf("TIME_PERIOD");
      const valueIdx = headers.indexOf("OBS_VALUE");
      const period = periodIdx >= 0 ? values[periodIdx] : "";
      const rate = valueIdx >= 0 ? parseFloat(values[valueIdx]) : NaN;
      return {
        period: period || "",
        consumerRate: isNaN(rate) ? null : rate,
      };
    }
  } catch {
    // ECB API not available
  }
  return null;
}

// ---- Air Quality ----

export interface AirQuality {
  pm10: number;
  pm25: number;
  aqi: number;
  label: string;
}

export async function fetchAirQuality(
  city: string = "sofia"
): Promise<AirQuality | null> {
  const coords = CITY_COORDS[city] || CITY_COORDS.sofia;
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&current=pm10,pm2_5,european_aqi&timezone=Europe/Sofia`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();
    const aqi = data.current.european_aqi;

    let label = "Добро";
    if (aqi > 100) label = "Много лошо";
    else if (aqi > 75) label = "Лошо";
    else if (aqi > 50) label = "Умерено";
    else if (aqi > 25) label = "Задоволително";

    return {
      pm10: data.current.pm10,
      pm25: data.current.pm2_5,
      aqi,
      label,
    };
  } catch {
    return null;
  }
}
