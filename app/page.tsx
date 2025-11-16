"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState(".");

  async function checkName() {
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

  return (
    <div style={{
      maxWidth: 480,
      margin: "40px auto",
      padding: "20px",
      fontFamily: "sans-serif"
    }}>
      <h1>Base Name Checker</h1>

      <input
        placeholder="yourname.base"
        value={name}
        onChange={(e) => {
          let v = e.target.value.toLowerCase().trim();
        
          // запрет пробелов и недопустимых символов
          v = v.replace(/[^a-z0-9-.]/g, "");
        
          // авто-добавление .base при вводе имени без точки
          if (v && !v.includes(".")) {
            v = v + ".base";
          }
        
          // если человек начинает стирать — не мешаем
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
          Press “Check” to verify <b>{name}</b>
        </div>
      )}

      <button
        onClick={checkName}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer"
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
        <div style={{ marginTop: "20px" }}>
          <div><b>Status:</b> {result.status}</div>
          <div><b>Available:</b> {String(result.available)}</div>
          <div style={{ marginTop: "10px" }}>{result.hint}</div>
        </div>
      )}
    </div>
  );
}
