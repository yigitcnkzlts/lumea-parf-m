import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141312",
          color: "#c9a775",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.04em",
        }}
      >
        B
      </div>
    ),
    size,
  );
}
