"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Button } from "@/components/Button/Button";
import { AVATAR_CROP_SIZE } from "@/constants/avatar";
import { cropImageToPng } from "@/utils/crop-image";

export default function AvatarCropDialog({
  src,
  onClose,
  onCropped,
}: {
  src: string;
  onClose: () => void;
  onCropped: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onConfirm = async () => {
    if (!cropPixels || saving) return;
    setSaving(true);
    onCropped(
      await cropImageToPng(src, cropPixels, AVATAR_CROP_SIZE),
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-label="Crop avatar"
    >
      <div
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-square w-full">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCropPixels(pixels)}
          />
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full accent-white"
          aria-label="Zoom"
        />
        <div className="flex w-full justify-end gap-2">
          <Button variant="outline" size="m" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="m"
            onClick={onConfirm}
            disabled={saving}
          >
            Crop
          </Button>
        </div>
      </div>
    </div>
  );
}
