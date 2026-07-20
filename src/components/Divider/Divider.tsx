"use client";

import "./Divider.css";

export default function Divider({ className }: { className?: string }) {
  return <div className={`sqrt-divider${className ? ` ${className}` : ""}`} role="separator" aria-hidden="true" />;
}
