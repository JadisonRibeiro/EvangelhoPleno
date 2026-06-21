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
          alignItems: "center",
          justifyContent: "center",
          background: "#4F46E5",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 90,
            height: 130,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 33,
              top: 0,
              width: 24,
              height: 130,
              background: "#ffffff",
              borderRadius: 6,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 8,
              top: 38,
              width: 74,
              height: 24,
              background: "#ffffff",
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
