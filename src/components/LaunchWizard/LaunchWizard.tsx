"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconCopy,
  IconHammer,
  IconRocket,
  IconUpload,
  IconWallet,
} from "@tabler/icons-react";
import { decodeEventLog, formatUnits, parseUnits, type Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { WizardShell, WizardTitle } from "@/components/WizardShell/WizardShell";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import AvatarCropDialog from "@/components/AvatarCropDialog/AvatarCropDialog";
import { useInput } from "@/hooks/useInput";
import {
  amountValidator,
  addressValidator,
  requiredValidator,
  validateAll,
} from "@/utils/validator";
import {
  commaModifier,
  composeModifiers,
  decimalOnlyModifier,
  uppercaseModifier,
} from "@/utils/modifier";
import { getFactoryV1Contract } from "@/contracts/contracts";
import { factoryV1Abi, tokenV1FactoryAbi } from "@/contracts/abis";
import { getAddresses } from "@/contracts/contract-addresses";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import { showToast } from "@/hooks/useToast";
import { viewTransactionAction } from "@/utils/explorer-utils";
import { predictCid, requestUploadLink, uploadToIpfs } from "@/utils/avatar-api";
import { AVATAR_ALLOWED_MIME_TYPES, AVATAR_MAX_FILE_SIZE } from "@/constants/avatar";

type Step = "form" | "receiver" | "done";
type AvatarStatus = "idle" | "pending" | "done" | "error" | "skipped";

const bodyM = "text-body leading-5.5 tracking-[0.01em]";
const bodyS = "text-body-s leading-5 tracking-[0.01em]";

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex w-full flex-col gap-2">
    <div className="flex h-2 items-center">
      <Divider />
    </div>
    <p className={`${bodyS} text-tertiary`}>{children}</p>
  </div>
);

const Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full items-center justify-end gap-4">{children}</div>
);

const AvatarUpload = ({
  preview,
  onPick,
}: {
  preview: string | null;
  onPick: (file: File | undefined) => void;
}) => (
  <label className="relative flex size-41 shrink-0 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-(--radius-l) border border-dashed border-subtle bg-surface hover:border-muted">
    <input
      type="file"
      accept={AVATAR_ALLOWED_MIME_TYPES.join(",")}
      className="sr-only"
      onChange={(e) => {
        onPick(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
    {preview ? (
      <Image src={preview} alt="Token avatar" fill unoptimized className="object-cover" />
    ) : (
      <>
        <IconUpload size={20} className="text-primary" />
        <span className={`${bodyS} text-primary`}>Upload token avatar</span>
      </>
    )}
  </label>
);

const CopyRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex w-full flex-col gap-1">
    <p className={`${bodyM} text-secondary`}>{label}</p>
    <div className="flex items-center gap-4">
      <p className="min-w-0 flex-1 truncate text-body-l leading-6 tracking-[0.02em] text-primary xl:flex-none">
        {value}
      </p>
      <IconButton
        variant="secondary"
        size="s"
        aria-label={`Copy ${label}`}
        icon={<IconCopy size={16} />}
        onClick={() => {
          navigator.clipboard.writeText(value).catch(() => {});
          showToast("copy.address");
        }}
      />
    </div>
  </div>
);

const LaunchWizard = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();

  const [step, setStep] = useState<Step>("form");
  const [launching, setLaunching] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{
    token: Address;
    name: string;
    symbol: string;
    supply: bigint;
  } | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<AvatarStatus>("idle");
  const [avatarCid, setAvatarCid] = useState<string | null>(null);

  const name = useInput("", undefined, requiredValidator("Name"));
  const symbol = useInput("", uppercaseModifier, requiredValidator("Symbol"));
  const supply = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    amountValidator,
  );
  const description = useInput("");
  const website = useInput("");
  const github = useInput("");
  const x = useInput("");
  const discord = useInput("");
  const [changeReceiver, setChangeReceiver] = useState(false);
  const receiver = useInput(
    "",
    undefined,
    (v) => (v.trim() === "" ? null : addressValidator(v)),
  );

  const receiverAddress = useMemo(
    () => (changeReceiver && receiver.value.trim() ? (receiver.value.trim() as Address) : address),
    [changeReceiver, receiver.value, address],
  );

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    if (
      !AVATAR_ALLOWED_MIME_TYPES.includes(file.type) ||
      file.size > AVATAR_MAX_FILE_SIZE
    ) {
      showToast("generic.error");
      return;
    }
    setCropSrc(URL.createObjectURL(file));
  };

  const onCropped = (file: File) => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setAvatarFile(file);
  };

  const uploadAvatar = async (token: Address, cid: string, chainId: number) => {
    setAvatarStatus("pending");
    try {
      if (!walletClient) throw new Error("wallet not connected");
      const { upload_url } = await requestUploadLink(token, cid, chainId);
      const uploadedCid = await uploadToIpfs(avatarFile!, upload_url);
      if (uploadedCid !== cid) throw new Error("CID mismatch");
      setAvatarStatus("done");
    } catch (e) {
      console.error(e);
      setAvatarStatus("error");
    }
  };

  const onLaunch = async () => {
    if (launching) return;
    if (!isConnected || !address) {
      openConnectModal?.();
      return;
    }
    if (!walletClient || !publicClient) return;
    if (!validateAll(name, symbol, supply)) {
      setStep("form");
      return;
    }
    if (changeReceiver && !receiver.validate()) return;

    setLaunching(true);
    const chainId = walletClient.chain.id;
    const addresses = getAddresses(chainId);
    const totalSupply = parseUnits(supply.value.replace(/,/g, ""), 18);

    // Predict the avatar CID first so it can be committed in initialMetadata.
    let cid: string | null = null;
    if (avatarFile) {
      try {
        cid = await predictCid(avatarFile);
      } catch (e) {
        console.error("avatar CID prediction failed", e);
      }
    }

    const metadata = [
      { key: "avatar", value: cid ? `ipfs://${cid}` : "" },
      { key: "description", value: description.value },
      { key: "website", value: website.value },
      { key: "github", value: github.value },
      { key: "x", value: x.value },
      { key: "discord", value: discord.value },
    ].filter((entry) => entry.value.trim() !== "");

    const config = {
      name: name.value.trim(),
      symbol: symbol.value.trim(),
      allocations: [
        {
          recipient: receiverAddress!,
          amount: totalSupply,
          startTime: BigInt(0),
          duration: BigInt(0),
        },
      ],
      initialMetadata: metadata,
      metadataEditable: true,
    };

    const toastId = "token-launch";
    showToast("deploy.pending", { id: toastId });
    try {
      const factory = getFactoryV1Contract(walletClient);
      const args = [config] as const;
      await publicClient.simulateContract({
        address: factory.address,
        abi: factoryV1Abi,
        functionName: "createToken",
        args,
        account: address,
      });
      const hash = await factory.write.createToken(args, {
        account: walletClient.account,
        chain: walletClient.chain,
      });
      const receipt = await publicClient
        .waitForTransactionReceipt({ hash })
        .catch((e) => {
          console.error(e);
          // The wallet broadcast the tx, so the token may already exist. A
          // receipt-fetch failure (e.g. the RPC refusing the call) must never
          // read as "creation failed" — surface the tx instead.
          showToast("deploy.unconfirmed", {
            id: toastId,
            action: viewTransactionAction(chainId, hash),
          });
          return null;
        });
      if (!receipt) return;
      if (receipt.status === "reverted") {
        showToast("deploy.failed", { id: toastId, action: viewTransactionAction(chainId, hash) });
        throw new Error("createToken reverted");
      }

      let tokenAddress: Address | undefined;
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: tokenV1FactoryAbi,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === "NewToken") {
            tokenAddress = (event.args as { tokenAddress: Address }).tokenAddress;
          }
        } catch {}
      }
      if (!tokenAddress) throw new Error("NewToken event not found");

      showToast("deploy.success", {
        id: toastId,
        params: { symbol: config.symbol },
        action: viewTransactionAction(chainId, hash),
      });
      setResult({
        token: tokenAddress,
        name: config.name,
        symbol: config.symbol,
        supply: totalSupply,
      });
      setStep("done");

      if (avatarFile && cid) {
        setAvatarCid(cid);
        void uploadAvatar(tokenAddress, cid, chainId);
      } else {
        setAvatarStatus("skipped");
      }
    } catch (e) {
      console.error(e);
      showToast("deploy.failed", { id: toastId });
    } finally {
      setLaunching(false);
    }
  };

  const onRetryAvatar = () => {
    if (!result || !avatarCid) return;
    void uploadAvatar(result.token, avatarCid, walletClient!.chain.id);
  };

  return (
    <WizardShell closeHref="/">
      <div className="flex w-full flex-col gap-8">
        {step === "form" && (
          <>
            <WizardTitle
              title="Launch token"
              description="Creating a new token is free and easy, but the actual fight is about its PRICE."
            />
            <div className="flex w-full items-start gap-6">
              <AvatarUpload preview={preview} onPick={onPickFile} />
              <div className="flex flex-1 flex-col gap-4">
                <SectionLabel>Primary informations</SectionLabel>
                <Input state={name} label="Token Name" placeholder="The full name, e.g. Dev Protocol." />
                <Input state={symbol} label="Token symbol" placeholder="The ticker, e.g. DEV." />
                <Input
                  state={supply}
                  label="Total supply"
                  placeholder="How many tokens to create?"
                  suffix={symbol.value || undefined}
                />
                <SectionLabel>Optional informations</SectionLabel>
                <Input state={description} label="Description" placeholder="Briefly describe your token" />
                <Input state={website} label="Website link" placeholder="https://…" />
                <Input state={github} label="Github link" placeholder="https://…" />
                <Input state={x} label="X link" placeholder="https://…" />
                <Input state={discord} label="Discord link" placeholder="https://…" />
              </div>
            </div>
            <Actions>
              <Link href="/" className="sqrt-btn sqrt-btn--outline sqrt-btn--m">
                Cancel
              </Link>
              <Button
                variant="primary"
                size="m"
                onClick={() => {
                  if (!isConnected) {
                    openConnectModal?.();
                    return;
                  }
                  if (!validateAll(name, symbol, supply)) return;
                  setStep("receiver");
                }}
              >
                Continue
              </Button>
            </Actions>
          </>
        )}

        {step === "receiver" && (
          <>
            <WizardTitle
              title="One more thing!"
              description="Where do you want to have your new-born token?"
            />
            <div className="sqrt-input">
              <div className="flex flex-col gap-1">
                <label htmlFor="receiver" className="sqrt-input__label">
                  Receiver address
                </label>
                <p className={`${bodyS} text-secondary`}>
                  By default we’ll send it to your connected wallet. You can change the receiver here.
                </p>
              </div>
              <div className="sqrt-input__field">
                <input
                  id="receiver"
                  className="sqrt-input__el"
                  value={changeReceiver ? receiver.value : ""}
                  placeholder={address ?? "Connect wallet"}
                  readOnly={!changeReceiver}
                  onChange={(e) => receiver.onChange(e.target.value)}
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="sqrt-input__paste"
                  onClick={() => setChangeReceiver(true)}
                >
                  Change receiver
                </button>
              </div>
            </div>
            <Actions>
              <Button variant="outline" size="m" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button
                variant="primary"
                size="m"
                leadingIcon={<IconRocket size={18} />}
                disabled={launching}
                onClick={onLaunch}
              >
                {launching ? "Launching…" : "Launch"}
              </Button>
            </Actions>
          </>
        )}

        {step === "done" && result && (
          <>
            <WizardTitle title="Token created!" />
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-start gap-2.5 rounded-m bg-surface p-4">
                <TokenAvatar
                  seed={result.symbol}
                  imageUrl={avatarStatus === "done" ? preview ?? undefined : undefined}
                  size={72}
                  className="shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                  <p className="text-body-l leading-6 tracking-[0.02em] text-primary xl:text-h4 xl:font-medium">
                    {result.name}
                  </p>
                  <div className={`flex items-center gap-4 ${bodyM} text-secondary`}>
                    <span>{result.symbol}</span>
                    <span className="w-px self-stretch bg-subtle" aria-hidden="true" />
                    <span>{formatUnits(result.supply, 18)} {result.symbol}</span>
                  </div>
                  <CopyRow label="Token contract" value={result.token} />
                  <CopyRow
                    label="Receiver Address"
                    value={receiverAddress ?? ""}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="m"
                      leadingIcon={<IconWallet size={18} />}
                      onClick={async () => {
                        if (!walletClient) return;
                        await walletClient.watchAsset({
                          type: "ERC20",
                          options: {
                            address: result.token,
                            symbol: result.symbol,
                            decimals: 18,
                          },
                        });
                      }}
                    >
                      Add to wallet
                    </Button>
                  </div>
                </div>
              </div>

              {avatarStatus === "pending" && (
                <p className={`${bodyM} text-secondary`}>Uploading avatar…</p>
              )}
              {avatarStatus === "error" && (
                <div className="flex flex-col gap-2 rounded-m border border-danger bg-surface p-4">
                  <p className={`${bodyM} text-danger`}>
                    Avatar upload failed. Your token is live — retry or skip.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="s" onClick={onRetryAvatar}>
                      Retry
                    </Button>
                    <Button
                      variant="outline"
                      size="s"
                      onClick={() => setAvatarStatus("skipped")}
                    >
                      Skip
                    </Button>
                  </div>
                </div>
              )}

              <p className={`${bodyM} text-secondary`}>Next step:</p>
              <p className="text-h4 leading-none font-medium text-primary">
                Now you just have to distribute your token.
              </p>
            </div>
            <Actions>
              <Link
                href={`${DISTRIBUTION_LAUNCH_HREF}?token=${result.token}`}
                className="sqrt-btn sqrt-btn--primary sqrt-btn--m flex-1 xl:flex-none"
              >
                <span className="sqrt-btn__icon" aria-hidden="true">
                  <IconHammer size={18} />
                </span>
                <span className="sqrt-btn__label">Set up distribution</span>
              </Link>
            </Actions>
          </>
        )}
      </div>

      {cropSrc && (
        <AvatarCropDialog src={cropSrc} onClose={() => setCropSrc(null)} onCropped={onCropped} />
      )}
    </WizardShell>
  );
};

export default LaunchWizard;
