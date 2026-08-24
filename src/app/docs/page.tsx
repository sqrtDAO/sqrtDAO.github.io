import type { Metadata } from "next";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "./metadata";

export const metadata: Metadata = docMetadata(
  "/docs/",
  "Getting started",
  "sqrtDAO is fair-launch infrastructure for tokens: slow pro-rata distribution across epochs, backing that can't be pulled, and no gatekeepers. Learn how a launch works and how to participate.",
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Getting started</h1>
      <P>
        sqrtDAO is launch-and-distribute infrastructure for tokens. Instead of an instant sale,
        distribution happens slowly across <strong className="text-primary">epochs</strong> —
        fixed windows in which participants lock a token and share that epoch&apos;s reward pro-rata.
        The backing that flows in never sits idle: when an epoch ends, its funds move on through
        configurable hooks (protocol fee, buy back &amp; burn, custom recipients). No gatekeepers,
        nothing to pull.
      </P>

      <H2 id="how-a-launch-works">How a launch works</H2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 marker:text-tertiary">
        <LI>
          A creator configures the distribution — number and length of epochs, an emission curve for
          per-epoch rewards, minimum participation, claim delay — and{" "}
          <strong className="text-primary">FactoryV1</strong> deploys everything in one transaction:
          the token (if new), a Uniswap V3 pool whose LP tokens are burned, and a{" "}
          <strong className="text-primary">DistributorV1</strong> funded with the full distribution
          amount.
        </LI>
        <LI>
          During each epoch, anyone can <strong className="text-primary">participate</strong> by
          locking the participation token. The locked amount counts toward every epoch they chose.
        </LI>
        <LI>
          When an epoch ends, its fund is <strong className="text-primary">drained</strong> and split
          across shares — e.g. a protocol fee and a buy-back-and-burn cut.
        </LI>
        <LI>
          After the claim delay passes, participants{" "}
          <strong className="text-primary">claim</strong> their pro-rata slice of that epoch&apos;s
          reward.
        </LI>
      </ol>

      <H2 id="two-ways-in">Two ways in</H2>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">Launch a token.</strong>{" "}
          <Code>
            createTokenAndLiquidityAndDistribution
          </Code>{" "}
          creates the ERC20, opens its pool, and starts the epoch distribution in one call.
        </LI>
        <LI>
          <strong className="text-primary">Distribute an existing token.</strong>{" "}
          <Code>
            createDistributor
          </Code>{" "}
          sets up an epoch-based distribution for a token you already hold.
        </LI>
      </ul>

      <H2 id="explore">Explore the docs</H2>
      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-tertiary">
        <LI>
          <DocLink href="/docs/participate/">How to participate</DocLink> — join a distribution and
          claim rewards, step by step.
        </LI>
        <LI>
          <DocLink href="/docs/launch-a-token/">Launch a token</DocLink> — from allocations to a
          funded epoch sale in one transaction.
        </LI>
        <LI>
          <DocLink href="/docs/epoch-distribution/">Epoch-based distribution</DocLink> — how
          participation, rewards, claiming and draining work.
        </LI>
        <LI>
          <DocLink href="/docs/buy-back-and-burn/">Buy back &amp; burn</DocLink> — how epoch funds
          become permanent buy pressure.
        </LI>
        <LI>
          <DocLink href="/docs/contract-addresses/">Contract addresses</DocLink> — deployed
          contracts per network.
        </LI>
        <LI>
          <DocLink href="/docs/contracts-v1/">Contracts v1</DocLink> — annotated source code of all
          contracts.
        </LI>
        <LI>
          <DocLink href="/docs/faq/">FAQ</DocLink> and{" "}
          <DocLink href="/docs/glossary/">glossary</DocLink> — quick answers and definitions.
        </LI>
      </ul>

      <Callout>
        The protocol is currently live on the Sepolia testnet; Base is coming soon. See{" "}
        <DocLink href="/docs/contract-addresses/">contract addresses</DocLink>.
      </Callout>
    </>
  );
}
