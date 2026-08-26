"use client";

import { useRef, useState } from "react";
import { IconChevronLeft, IconPhotoPlus } from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import { useInput } from "@/hooks/useInput";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import { IconButton } from "@/components/IconButton/IconButton";
import { Button } from "@/components/Button/Button";
import "./TokenLaunch.css";
import { parseUnits } from "viem";
import {
  composeModifiers,
  commaModifier,
  decimalOnlyModifier,
  noModifier,
  uppercaseModifier,
} from "@/utils/modifier";
import {
  nonZeroAmountValidator,
  requiredValidator,
  validateAll,
} from "@/utils/validator";
import {
  AVATAR_ALLOWED_MIME_TYPES,
  AVATAR_MAX_FILE_SIZE,
} from "@/constants/avatar";

type AvatarStatus = "idle" | "ready" | "rejected";

const AVATAR_HINTS: Record<AvatarStatus, string> = {
  idle: "Optional — click to set an avatar",
  ready: "Avatar ready",
  rejected: "PNG, JPEG, GIF or WebP up to 5 MB",
};

export default function TokenLaunch(props: {
  onCancel: () => void;
  onFinish: (tokenDetails: TokenDetails) => void;
}) {
  const name = useInput("", noModifier, requiredValidator("Name"));
  const symbol = useInput("", uppercaseModifier, requiredValidator("Symbol"));
  const totalSupply = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    nonZeroAmountValidator,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>("idle");

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    if (
      !AVATAR_ALLOWED_MIME_TYPES.includes(file.type) ||
      file.size > AVATAR_MAX_FILE_SIZE
    ) {
      setAvatarStatus("rejected");
      return;
    }
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    avatarFileRef.current = file;
    setAvatarStatus("ready");
  };

  const onContinueClick = async () => {
    if (!validateAll(name, symbol, totalSupply)) return;
    props.onFinish({
      name: name.value,
      symbol: symbol.value,
      decimals: 18,
      totalSupply: parseUnits(totalSupply.value.replace(/,/g, ""), 18),
      avatarFile: avatarFileRef.current ?? undefined,
    });
  };

  return (
    <div className="tl-backdrop">
      <div className="tl-chrome">
        <Header />
        <TestnetRibbon />
      </div>
      <div className="tl-scroll">
        <div className="tl-panel">
          <div>
            <IconButton
              variant="outline"
              size="m"
              icon={<IconChevronLeft size={24} strokeWidth={2} />}
              onClick={props.onCancel}
              aria-label="Go back"
            />
          </div>

          <div className="tl-content">
            <div className="tl-text">
              <h2 className="tl-title">Launch token</h2>
              <p className="tl-subtitle">
                Creating a new token is free and easy, but the actual fight is
                about its PRICE.
              </p>
            </div>

            <div className="tl-row">
              <div className="tl-avatar">
                <button
                  type="button"
                  className="tl-avatar-picker"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Set token avatar"
                >
                  <TokenAvatar seed={symbol.value} imageUrl={previewUrl ?? undefined} />
                  {avatarStatus !== "ready" && (
                    <span className="tl-avatar-picker__glyph" aria-hidden="true">
                      <IconPhotoPlus size={20} strokeWidth={2} />
                    </span>
                  )}
                </button>
                <p
                  className={`tl-avatar-hint${avatarStatus === "rejected" ? " is-error" : ""}`}
                >
                  {AVATAR_HINTS[avatarStatus]}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={AVATAR_ALLOWED_MIME_TYPES.join(",")}
                  hidden
                  onChange={(e) => {
                    onPickFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="tl-form">
                <Input
                  state={name}
                  label="Token Name"
                  placeholder="The full name, e.g. Dev Protocol."
                />
                <Input
                  state={symbol}
                  label="Token symbol"
                  placeholder="The ticker, e.g. DEV."
                />
                <Input
                  state={totalSupply}
                  label="Total supply"
                  placeholder="How many tokens to create?"
                />
              </div>
            </div>

            <div className="tl-footer">
              <Button variant="outline" size="m" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="m" onClick={onContinueClick}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  avatarFile?: File;
};
