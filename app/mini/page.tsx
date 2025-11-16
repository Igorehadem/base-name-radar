"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/mini-apps";

export default function MiniApp() {
  useEffect(() => {
    // сообщаем Warpcast, что приложение загружено
    sdk.actions.ready();
  }, []);

  return (
    <main
      style={{
        background: "#0d0d0d",
        color: "white",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "sans-serif"
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "16px" }}>
        Base Name Radar
      </h1>

      <p style={{ fontSize: "20px", opacity: 0.7 }}>
        Mini App is running. UI will be added next.
      </p>
    </main>
  );
}
