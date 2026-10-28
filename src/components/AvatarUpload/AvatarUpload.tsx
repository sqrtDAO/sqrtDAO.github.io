"use client";

import { useId } from "react";
import Image from "next/image";
import { IconUpload } from "@tabler/icons-react";
import { useAvatarImage } from "@/hooks/useAvatarImage";
import { AVATAR_ALLOWED_MIME_TYPES } from "@/constants/avatar";
import "@/components/Button/Button.css";

type AvatarUploadProps = {
  /** Local blob preview, an https URL, or a stored `ipfs://<cid>` value. */
  image?: string | null;
  onPick: (file: File | undefined) => void;
  disabled?: boolean;
  /** Renders an outline button under the box that opens the same picker. */
  buttonLabel?: string;
  className?: string;
};

const AvatarUpload = ({ image, onPick, disabled, buttonLabel, className = "size-41" }: AvatarUploadProps) => {
  const id = useId();
  const { src, onError } = useAvatarImage(image ?? undefined);

  return (
    <>
      <input
        id={id}
        type="file"
        accept={AVATAR_ALLOWED_MIME_TYPES.join(",")}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => {
          onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <label
        htmlFor={id}
        className={`relative flex shrink-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-(--radius-l) border border-dashed border-subtle bg-surface ${
          disabled ? "" : "cursor-pointer hover:border-muted"
        } ${className}`}
      >
        {src ? (
          <Image src={src} alt="Token avatar" fill unoptimized onError={onError} className="object-cover" />
        ) : (
          <>
            <IconUpload size={20} className={disabled ? "text-disabled" : "text-primary"} />
            <span
              className={`text-body-s leading-5 tracking-[0.01em] ${disabled ? "text-disabled" : "text-primary"}`}
            >
              {disabled ? "No avatar" : "Upload token avatar"}
            </span>
          </>
        )}
      </label>
      {buttonLabel && !disabled && (
        <label htmlFor={id} className="sqrt-btn sqrt-btn--outline sqrt-btn--m w-full cursor-pointer">
          <span className="sqrt-btn__label">{buttonLabel}</span>
        </label>
      )}
    </>
  );
};

export default AvatarUpload;
