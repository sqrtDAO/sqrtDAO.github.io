"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconCopy, IconHammer, IconRocket, IconUpload } from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { WizardShell, WizardTitle } from "@/components/WizardShell/WizardShell";
import { useInput } from "@/hooks/useInput";
import { MAINNET_DISTRIBUTE_HREF, MAINNET_DISTRIBUTE_WIZARD_HREF } from "@/constants/links";
import "@/components/Input/Input.css";

type Step = "form" | "receiver" | "done";

const UPCOMING_CHAINS = [
  { name: "Robinhood", src: "/mainnet/chains/robinhood.svg", width: 94 },
  { name: "Arc", src: "/mainnet/chains/arc.svg", width: 53 },
  { name: "Hyperliquid", src: "/mainnet/chains/hyperliquid.svg", width: 113 },
  { name: "Ethereum", src: "/mainnet/chains/ethereum.svg", width: 78 },
];

// Static stand-ins until the teammate wires wallet + launch results.
const MOCK_ADDRESS = "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH";
const MOCK_TOKEN = { name: "sqrtDAO", symbol: "SQRT", supply: "18,000,000 SQRT" };

const bodyM = "text-body leading-5.5 tracking-[0.01em]";
const bodyS = "text-body-s leading-5 tracking-[0.01em]";

const ChainChip = ({ src, name, width, active = false }: { src: string; name: string; width: number; active?: boolean }) => (
  <button
    type="button"
    disabled={!active}
    aria-pressed={active}
    onClick={() => {
      /* TODO: teammate wires onEcosystemChange */
    }}
    className={`flex shrink-0 items-center rounded-m border border-muted px-4 py-3 ${active ? "bg-raised" : "cursor-not-allowed"}`}
  >
    <Image src={src} alt={name} width={width} height={18} className="h-4.5 w-auto" />
  </button>
);

// Figma 11452:98526 (desktop: base, then "Upcoming" wrap) / 14432:102149 (mobile: one scrolling row, no label)
const EcosystemPicker = () => (
  <div className="flex w-full flex-col gap-2.5">
    <p className={`${bodyM} text-primary`}>Choose ecosystem</p>
    <div className="flex w-full gap-2 overflow-x-auto xl:flex-col xl:items-start xl:gap-6 xl:overflow-visible">
      <ChainChip src="/mainnet/chains/base.svg" name="Base" width={71} active />
      <div className="contents xl:flex xl:flex-wrap xl:items-baseline xl:gap-2">
        <p className={`hidden ${bodyM} text-tertiary xl:block`}>Upcoming</p>
        {UPCOMING_CHAINS.map((chain) => (
          <ChainChip key={chain.name} {...chain} />
        ))}
      </div>
    </div>
  </div>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div className="flex w-full flex-col gap-2">
    <div className="flex h-2 items-center">
      <Divider />
    </div>
    <p className={`${bodyS} text-tertiary`}>{children}</p>
  </div>
);

const AvatarUpload = ({ className = "" }: { className?: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <label
      className={`relative size-41 shrink-0 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-l border border-dashed border-subtle bg-surface hover:border-muted ${className}`}
    >
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setPreview(URL.createObjectURL(file));
          /* TODO: teammate wires onAvatarUpload(file) */
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
};

const TextArea = ({ label, placeholder }: { label: string; placeholder: string }) => {
  const [value, setValue] = useState("");
  return (
    <label className="flex w-full flex-col gap-2">
      <span className={`${bodyM} text-primary`}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={`h-21 resize-none rounded-m border border-subtle bg-transparent px-3 py-3 ${bodyS} text-primary placeholder:text-tertiary focus:border-muted focus:outline-none`}
      />
    </label>
  );
};

const FormStep = ({ onContinue }: { onContinue: () => void }) => {
  const name = useInput("");
  const symbol = useInput("");
  const supply = useInput("");
  const website = useInput("");
  const github = useInput("");
  const x = useInput("");
  const discord = useInput("");
  // Figma uses this placeholder for all four link fields.
  const linkPlaceholder = "How many tokens to create?";

  return (
    <>
      <WizardTitle
        title="Launch token"
        description="Creating a new token is free and easy, but the actual fight is about its PRICE."
      />
      <div className="flex w-full items-start gap-6">
        <AvatarUpload className="hidden xl:flex" />
        <div className="flex flex-1 flex-col gap-4">
          <EcosystemPicker />
          <SectionLabel>Primary informations</SectionLabel>
          <AvatarUpload className="flex xl:hidden" />
          <Input state={name} label="Token Name" placeholder="The full name, e.g. Dev Protocol." />
          <Input state={symbol} label="Token symbol" placeholder="The ticker, e.g. DEV." />
          <Input state={supply} label="Total supply" placeholder="How many tokens to create?" />
          <SectionLabel>Optional informations</SectionLabel>
          <TextArea label="Description" placeholder="Briefly describe your token" />
          <Input state={website} label="Website link" placeholder={linkPlaceholder} />
          <Input state={github} label="Github link" placeholder={linkPlaceholder} />
          <Input state={x} label="X link" placeholder={linkPlaceholder} />
          <Input state={discord} label="Discord link" placeholder={linkPlaceholder} />
        </div>
      </div>
      <Actions>
        <Link href={MAINNET_DISTRIBUTE_HREF} className="sqrt-btn sqrt-btn--outline sqrt-btn--m flex-1 xl:flex-none">
          <span className="sqrt-btn__label">Cancel</span>
        </Link>
        <Button variant="primary" size="m" className="flex-1 xl:flex-none" onClick={onContinue}>
          Continue
        </Button>
      </Actions>
    </>
  );
};

const Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full items-center justify-end gap-4">{children}</div>
);

// Figma 11314:96755 — Input with an inline action button; reuses Input.css since Input's button is fixed to "Paste".
// Default receiver (connected wallet) shows as placeholder until "Change receiver" unlocks the field.
const ReceiverField = () => {
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState("");
  return (
    <div className="sqrt-input">
      <div className="flex flex-col gap-1">
        <label htmlFor="receiver" className="sqrt-input__label">
          Receiver address
        </label>
        <p className={`${bodyS} text-secondary`}>
          By default we’ll send it to your connected wallet. you can change the receiver here.
        </p>
      </div>
      <div className="sqrt-input__field">
        <input
          id="receiver"
          className="sqrt-input__el"
          value={value}
          placeholder={MOCK_ADDRESS}
          readOnly={!editable}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          className="sqrt-input__paste"
          onClick={() => {
            setEditable(true);
            /* TODO: teammate wires onChangeReceiver */
          }}
        >
          Change receiver
        </button>
      </div>
    </div>
  );
};

const ReceiverStep = ({ onBack, onLaunch }: { onBack: () => void; onLaunch: () => void }) => (
  <>
    <WizardTitle title="One more thing!" description="Where do you want to have your new-born token?" />
    <ReceiverField />
    <Actions>
      <Button variant="outline" size="m" className="flex-1 xl:flex-none" onClick={onBack}>
        Cancel
      </Button>
      <Button
        variant="primary"
        size="m"
        className="flex-1 xl:flex-none"
        leadingIcon={<IconRocket size={18} />}
        onClick={onLaunch}
      >
        Launch
      </Button>
    </Actions>
  </>
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
          /* TODO: teammate wires onCopy */
        }}
      />
    </div>
  </div>
);

const DoneStep = () => (
  <>
    <WizardTitle title="Token created and transferred!" />
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full items-start gap-2.5 rounded-m bg-surface p-4">
        <Image
          src="/mainnet/token-avatar-placeholder.png"
          alt=""
          width={72}
          height={72}
          className="size-14 shrink-0 rounded-full xl:size-18"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="text-body-l leading-6 tracking-[0.02em] text-primary xl:text-h4 xl:leading-none xl:font-medium xl:tracking-normal">
            {MOCK_TOKEN.name}
          </p>
          <div className={`flex items-center gap-4 ${bodyM} text-secondary`}>
            <span>{MOCK_TOKEN.symbol}</span>
            <span className="w-px self-stretch bg-subtle" aria-hidden="true" />
            <span>{MOCK_TOKEN.supply}</span>
          </div>
          <CopyRow label="Token contract" value={MOCK_ADDRESS} />
          <CopyRow label="Receiver Address" value={MOCK_ADDRESS} />
          <Button
            variant="outline"
            size="m"
            className="self-start"
            onClick={() => {
              /* TODO: teammate wires onAddToWallet */
            }}
          >
            Add to wallet
          </Button>
        </div>
      </div>
      <p className={`${bodyM} text-secondary`}>Next step:</p>
      <p className="text-h4 leading-none font-medium text-primary">Now you just have to distribute your token.</p>
    </div>
    <Actions>
      <Link
        href={MAINNET_DISTRIBUTE_WIZARD_HREF}
        onClick={() => {
          /* TODO: teammate wires onSetUpDistribution */
        }}
        className="sqrt-btn sqrt-btn--primary sqrt-btn--m flex-1 xl:flex-none"
      >
        <span className="sqrt-btn__icon" aria-hidden="true">
          <IconHammer size={18} />
        </span>
        <span className="sqrt-btn__label">Set up distribution</span>
      </Link>
    </Actions>
  </>
);

// Figma 11254:94165 (desktop) / 14467:103469 (mobile)
const LaunchWizard = () => {
  const [step, setStep] = useState<Step>("form");

  return (
    <WizardShell closeHref={MAINNET_DISTRIBUTE_HREF}>
      <div className="flex w-full flex-col gap-8">
        {step === "form" && (
          <FormStep
            onContinue={() => {
              /* TODO: teammate wires onContinue (validation) */
              setStep("receiver");
            }}
          />
        )}
        {step === "receiver" && (
          <ReceiverStep
            onBack={() => setStep("form")}
            onLaunch={() => {
              /* TODO: teammate wires onLaunch (deploy + transfer) */
              setStep("done");
            }}
          />
        )}
        {step === "done" && <DoneStep />}
      </div>
    </WizardShell>
  );
};

export default LaunchWizard;
