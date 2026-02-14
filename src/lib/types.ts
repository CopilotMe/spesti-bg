// ============ Electricity ============

export interface BillComponent {
  id: string;
  name: string;
  rate: number; // лв/kWh без ДДС
  explanationKey: string;
}

export interface ElectricityProvider {
  id: string;
  name: string;
  region: string;
  coverageAreas: string[];
  dayRate: number; // лв/kWh с ДДС
  nightRate: number;
  singleRate: number;
  breakdown: BillComponent[];
}

export interface ElectricityResult {
  provider: ElectricityProvider;
  totalWithVat: number;
  breakdown: { component: BillComponent; amount: number }[];
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export type MeterType = "single" | "dual";

export interface ElectricityInput {
  meterType: MeterType;
  dayKwh: number;
  nightKwh: number;
}

// ============ Water ============

export interface WaterProvider {
  id: string;
  name: string;
  city: string;
  supplyRate: number; // лв/m³ без ДДС
  sewerageRate: number;
  treatmentRate: number;
  totalRateWithVat: number;
}

export interface WaterResult {
  provider: WaterProvider;
  supplyAmount: number;
  sewerageAmount: number;
  treatmentAmount: number;
  subtotal: number;
  vat: number;
  totalWithVat: number;
  differenceFromCheapest: number;
  isCheapest: boolean;
}

export interface WaterInput {
  consumptionM3: number;
}

// ============ Telecom ============

export interface TelecomPlan {
  id: string;
  operator: string;
  operatorName: string;
  planName: string;
  type: "prepaid" | "postpaid";
  monthlyFee: number;
  dataGb: number;
  minutes: number | "unlimited";
  sms: number | "unlimited";
  contractMonths: number | null;
  extras: string[];
}

export interface InternetPlan {
  id: string;
  provider: string;
  providerName: string;
  planName: string;
  speedMbps: number;
  monthlyFee: number;
  technology: string;
}

// ============ Explanations ============

export interface Explanation {
  term: string;
  simple: string;
  icon: string;
}
