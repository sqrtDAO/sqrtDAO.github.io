import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0D12",
        color: "#F5F5F5",
        fontFamily: "system-ui, sans-serif",
        gap: 16,
      }}
    >
      <h1 style={{ fontSize: 72, margin: 0, fontWeight: 600 }}>404</h1>
      <p style={{ fontSize: 18, margin: 0, color: "#A0A0A0" }}>Page not found</p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          color: "#6366f1",
          textDecoration: "underline",
          fontSize: 14,
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
