import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 24, fontSize: 18 }}>
      <h1>Unified ENS + FNames Name Checker</h1>
      <p style={{ maxWidth: 480, lineHeight: 1.5 }}>
        Проверяй сразу два мира: <strong>name.eth</strong> в ENS и{" "}
        <strong>fname</strong> в Farcaster.
      </p>
      <Link
        href="/check"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "10px 18px",
          borderRadius: 999,
          background: "#3b82f6",
          color: "#f9fafb",
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Open checker
      </Link>
    </div>
  );
}
