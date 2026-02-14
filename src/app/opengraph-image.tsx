import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Спести.бг - Сравни сметките си и спести";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            🐷
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Спести.бг
          </span>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Сравни сметките си за ток, вода и интернет
        </div>
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
          }}
        >
          {["⚡ Електричество", "💧 Вода", "📶 Интернет"].map((item) => (
            <div
              key={item}
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "22px",
                color: "white",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Безплатен калкулатор • Официални данни от КЕВР
        </div>
      </div>
    ),
    { ...size }
  );
}
