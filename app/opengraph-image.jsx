import { ImageResponse } from "next/og";

export const alt = "ScaleMatrix AI — AI lead generation & outreach";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg,#07070b 40%,#241f5c)",
        color: "#f4f3fa",
      }}
    >
      <div style={{ fontSize: 34, color: "#b3acff", letterSpacing: 4 }}>
        SCALEMATRIX AI
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
          Book 10–15 qualified sales meetings every month.
        </div>
        <div style={{ fontSize: 34, color: "#9a97ab", marginTop: 28 }}>
          AI lead generation &amp; personalized outreach on autopilot.
        </div>
      </div>
    </div>,
    size,
  );
}
