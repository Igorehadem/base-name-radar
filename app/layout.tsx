export const metadata = {
  title: "Base Name Checker & Radar",
  description: "Check Base/Farcaster names availability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{
        background: "#111",
        color: "#eee",
        fontFamily: "sans-serif",
        margin: 0,
        padding: 0
      }}>
        {children}
      </body>
    </html>
  );
}
