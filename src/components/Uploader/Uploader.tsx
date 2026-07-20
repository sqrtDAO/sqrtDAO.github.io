"use client";

import { useRef, useState, useCallback } from "react";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import "./Uploader.css";

export interface UploaderProps {
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  className?: string;
}

type UploaderState = "rest" | "hover" | "uploading" | "uploaded" | "hover-uploaded";

export default function Uploader({ onUpload, onRemove, className }: UploaderProps) {
  const [state, setState] = useState<UploaderState>("rest");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulate = useCallback((f: File) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setState("uploading");
    setProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20 + 5;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        setState("uploaded");
      } else {
        setProgress(Math.round(p));
      }
    }, 150);
  }, []);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    simulate(files[0]);
    onUpload?.(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl(null);
    setProgress(0);
    setState("rest");
    onRemove?.();
  };

  const isUploaded = state === "uploaded" || state === "hover-uploaded";
  const isHoverUploaded = state === "hover-uploaded";

  return (
    <div
      className={`uploader uploader--${state}${className ? ` ${className}` : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseEnter={() => {
        if (state === "rest") setState("hover");
        if (state === "uploaded") setState("hover-uploaded");
      }}
      onMouseLeave={() => {
        if (state === "hover") setState("rest");
        if (state === "hover-uploaded") setState("uploaded");
      }}
      onClick={() => {
        if (!isUploaded && state !== "uploading") inputRef.current?.click();
      }}
      role={!isUploaded ? "button" : undefined}
      aria-label={!isUploaded ? "Upload file" : undefined}
    >
      <input
        ref={inputRef}
        type="file"
        className="uploader__input"
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/*"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Background image when uploaded */}
      {isUploaded && imageUrl && (
        <div className="uploader__bg" aria-hidden="true">
          <img src={imageUrl} alt="" className="uploader__bg-img" />
          <div className={`uploader__bg-overlay${isHoverUploaded ? " is-dark" : ""}`} />
        </div>
      )}

      {/* Rest state */}
      {state === "rest" && (
        <IconUpload className="uploader__upload-icon" size={24} strokeWidth={1.5} />
      )}

      {/* Hover state */}
      {state === "hover" && (
        <div className="uploader__hover-content">
          <IconUpload className="uploader__upload-icon" size={24} strokeWidth={1.5} />
          <div className="uploader__hover-text">
            <span>Click to upload</span>
            <span className="uploader__hover-sub">or drag and drop</span>
          </div>
        </div>
      )}

      {/* Uploading state */}
      {state === "uploading" && (
        <div className="uploader__uploading-content">
          <div className="uploader__spinner" aria-hidden="true" />
          <div className="uploader__uploading-text">
            <span>{file?.name}</span>
            <span className="uploader__uploading-sub">{progress}%</span>
          </div>
        </div>
      )}

      {/* Uploaded state — show checkmark badge */}
      {state === "uploaded" && (
        <div className="uploader__check-badge" aria-label="Upload successful">
          <IconCheck size={20} strokeWidth={2} />
        </div>
      )}

      {/* Hover Uploaded state — show action buttons */}
      {isHoverUploaded && (
        <div className="uploader__actions">
          <Button
            variant="secondary"
            size="m"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Change
          </Button>
          <Button
            variant="primary"
            size="m"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="uploader__remove-btn"
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
