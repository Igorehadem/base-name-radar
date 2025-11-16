"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  async function checkName() {
    if (!name) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/check-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, format: "mini" })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setResult(data);
      }

    } catch (e) {
      setError("Network error");
    }

    setLoading(false);
  }
  // simple loading animation
  useEffect(() => {
    if (!loading) {
      setDots(".");
      return;
    }
  
    const i = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? "." : prev + "."));
    }, 300);
  
    return () => clearInterval(i);
  }, [loading]);
  // auto-check with debounce
  useEffect(() => {
    if (!name) return; // п
  
    // 
    setResult(null);
    setError(null);
  
    const timer = setTimeout(() => {
      // 
      checkName();
    }, 600);
  
    return () => clearTimeout(timer);
  }, [name]);
  
  return (
    <div style={{
      maxWidth: 480,
      margin: "40px auto",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "40px" }}>🔍</span>
      </div>

      <h1 style={{ fontSize: "22px", textAlign: "center", marginBottom: "20px" }}>
        Base Name Checker
      </h1>

      <input
        placeholder="yourname.base"
        value={name}
        onChange={(e) => {
          let v = e.target.value.toLowerCase().trim();
        
          // 
          v = v.replace(/[^a-z0-9-.]/g, "");
        
          // 
          if (v && !v.includes(".")) {
            v = v + ".base";
          }
        
          // 
          if (v === ".base") v = "";
          setName(v);
          setResult(null);
          setError(null);
        }}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px"
        }}
      />

      {!loading && name && !result && !error && (
        <div style={{ marginBottom: "10px", color: "#888" }}>
          Checking will start automatically…
        </div>
      )}

      <button
        onClick={checkName}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "12px",
          border: "none",
          background: loading ? "#444" : "#1cbf4a",
          color: "#fff",
          fontWeight: "bold",
          marginTop: "10px"
        }}
      >

        {loading ? `Checking${dots}` : "Check"}
      </button>

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            background: "#111",
            color: "#fff",
            border:
              result.status === "available"
                ? "1px solid #1cbf4a"
                : result.status === "expired"
                ? "1px solid #ffb94f"
                : "1px solid #e74c3c",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "6px",
              color:
                result.status === "available"
                  ? "#1cbf4a"
                  : result.status === "expired"
                  ? "#ffb94f"
                  : "#e74c3c",
            }}
          >
            {result.status.toUpperCase()}
          </div>
      
          <div style={{ marginBottom: "10px", opacity: 0.9 }}>
            {result.hint}
          </div>
      
          <div style={{ fontSize: "13px", opacity: 0.6 }}>
            {result.available
              ? "This name can be registered."
              : "This name is not available."}
          </div>
        </div>
      )}
    </div>
  );
}
