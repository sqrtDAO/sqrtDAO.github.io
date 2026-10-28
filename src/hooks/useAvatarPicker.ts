"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/hooks/useToast";
import { AVATAR_ALLOWED_MIME_TYPES, AVATAR_MAX_FILE_SIZE } from "@/constants/avatar";

// Pick → crop → local preview. Feed `cropSrc` to AvatarCropDialog.
export const useAvatarPicker = () => {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    if (!AVATAR_ALLOWED_MIME_TYPES.includes(picked.type) || picked.size > AVATAR_MAX_FILE_SIZE) {
      showToast("generic.error");
      return;
    }
    setCropSrc(URL.createObjectURL(picked));
  };

  const closeCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const onCropped = (cropped: File) => {
    closeCrop();
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(cropped);
    });
    setFile(cropped);
  };

  const reset = () => {
    closeCrop();
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setFile(null);
  };

  // Revoke blob URLs when they're replaced or the wizard unmounts.
  useEffect(() => () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
  }, [cropSrc]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  return { cropSrc, file, preview, pick, closeCrop, onCropped, reset };
};
