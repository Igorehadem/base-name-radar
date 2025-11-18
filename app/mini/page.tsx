"use client";

import { useEffect, useState } from "react";

// --- Mini App safe SDK loader ---
function loadSdkSafely() {
  try {
    return require("@farcaster/mini-apps-sdk").sdk;
  } catch {
    return null;
  }
}

export default function MiniPage() {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    const _sdk = loadSdkSafely();

    if (_sdk?.actions) {
      try {
        _sdk.actions.ready();
        console.log("Mini App → ready()");
        setSdkReady(true);
      } catch (e) {
        console.log("SDK ready() failed:", e);
      }
    } else {
      console.log("Browser mode (no SDK)");
    }
  }, []);

  return (
    <div
      style={{
        padding: 24,
        fontSize: 22,
        background: "#000",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1>Base ENS + FName Checker</h1>

      {sdkReady ? (
        <p>Warpcast Mini App initialized ✓</p>
      ) : (
        <p>Browser preview (SDK disabled)</p>
      )}

      <p style={{ marginTop: 20 }}>
        Open a frame with input to check names.
      </p>
    </div>
  );
}
