"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import { showToast } from "@/hooks/useToast";
import "./AddressTag.css";

export interface AddressTagProps {
  value: string;
  className?: string;
}

const COPIED_LABEL = "Copied!";
const COPIED_DURATION_MS = 1500;

function truncateAddress(addr: string): string {
  if (addr.length <= 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AddressTag({ value, className }: AddressTagProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const handleClick = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(value)
      .then(() => {
        showToast("copy.address");
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
      })
      .catch(() => showToast("generic.error"));
  }, [value]);

  return (
    <button
      type="button"
      className={`address-tag${copied ? " is-copied" : ""}${className ? ` ${className}` : ""}`}
      onClick={handleClick}
    >
      <IconCopy size={16} strokeWidth={1.75} />
      {copied ? COPIED_LABEL : truncateAddress(value)}
    </button>
  );
}
