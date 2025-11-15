"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function isFresh(ts: string) {
  return Date.now() - new Date(ts).getTime() < 10 * 60 * 1000;
}

export default function RecentPage() {
  const { data, error, isValidating } = useSWR("/api/radar", fetcher, {
    refreshInterval: 15000,
  });

  const isLoading = !data && !error;
  const list = data?.slice(0, 50) || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recently Freed Names</h1>

      {isLoading && <p style={styles.loading}>Loading...</p>}

      {!isLoading && (!data || data.length === 0) && (
        <p style={styles.empty}>No recently freed names yet.</p>
      )}

      <div style={styles.grid}>
        {list.map((item: any, i: number) => (
          <div
            key={i}
            style={{
              ...styles.card,
              borderColor: isFresh(item.timestamp) ? "#3b82f6" : "#333",
              boxShadow: isFresh(item.timestamp)
                ? "0 0 12px rgba(59,130,246,0.3)"
                : "none",
            }}
          >
            <div style={styles.name}>{item.name}</div>

            <div style={styles.meta}>
              Freed: {timeAgo(item.timestamp)}
            </div>

            <a href={`/check?name=${item.name}`} style={styles.link}>
              Check this name →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    color: "#eee",
  },
  title: {
    fontSize: "36px",
    fontWeight: "600",
    marginBottom: "30px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    opacity: 0.7,
  },
  empty: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: "20px",
    marginTop: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #333",
  },
  name: {
    fontSize: "30px",
    fontWeight: "700",
    marginBottom: "6px",
    letterSpacing: "0.4px",
    color: "#fff",
  },
  meta: {
    fontSize: "14px",
    opacity: 0.7,
    marginBottom: "12px",
  },
  link: {
    fontSize: "15px",
    marginTop: "6px",
    display: "inline-block",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
};
