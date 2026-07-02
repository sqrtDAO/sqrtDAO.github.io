"use client";

import "./DataRow.css";

export interface DataRowProps {
  label: string;
  value: string;
  className?: string;
}

export default function DataRow({ label, value, className }: DataRowProps) {
  return (
    <div className={`data-row${className ? ` ${className}` : ""}`}>
      <span className="data-row__label">{label}</span>
      <span className="data-row__value">{value}</span>
    </div>
  );
}
