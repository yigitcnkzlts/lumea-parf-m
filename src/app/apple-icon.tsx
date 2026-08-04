import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141312",
          color: "#c9a775",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 600, letterSpacing: "-0.04em" }}>B</div>
        <div style={{ marginTop: 4, fontSize: 18, letterSpacing: "0.28em", color: "#c9a775" }}>BEE</div>
      </div>
    ),
    size,
  );
}
