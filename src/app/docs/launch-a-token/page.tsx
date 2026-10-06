import type { Metadata } from "next";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/launch-a-token/",
  "Launch a token",
  "Step-by-step guide to launching a token with sqrtDAO: allocations, metadata, pool pricing, epoch distribution config and shares through FactoryV1.",
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Launch a token</h1>
      <P>
        Launching is two steps. First <Code>createToken</Code> on{" "}
        <DocLink href="/docs/contracts-v1/">FactoryV1</DocLink> deploys your ERC20 with its
        allocations and metadata. Then <Code>createLiquidityAndDistribution</Code> opens the
        Uniswap V3 pool and starts the epoch-based distribution for that token. The wizard in the app
        walks these same fields; this page explains what each decision means.
      </P>

      <H2 id="step-1-token">1. Token</H2>
      <P>
        Name, symbol, an initial allocation list (recipient, amount, and optional vesting
        start/duration), and optional on-chain metadata (description, links, avatar). Tokens are
        created via the <Code>TokenConfig</Code> struct; the wallet you launch with becomes the
        token owner and can update metadata until it is locked.
      </P>

      <H2 id="step-2-market">2. Market</H2>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">Starting price.</strong> Expressed as{" "}
          <Code>sqrtPriceX96</Code>, the Uniswap V3 price encoding. This sets where trading begins.
        </LI>
        <LI>
          <strong className="text-primary">Liquidity.</strong> How much participation token and
          distribution token you seed the pool with. For a token you already hold, you approve both
          amounts to the factory; leftover deposits are refunded after minting.
        </LI>
        <LI>
          <strong className="text-primary">Locked forever.</strong> The fee tier is fixed at 0.3%
          and LP tokens are minted straight to the dead address — nobody can ever withdraw this
          liquidity, including you.
        </LI>
      </ul>

      <H2 id="step-3-distribution">3. Distribution</H2>
      <P>The sale side of the launch — each field maps straight onto DistributorConfig:</P>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">Epochs.</strong> Count and duration. 100 epochs × 1 hour
          = a ~4 day slow sale; longer windows smooth out price discovery.
        </LI>
        <LI>
          <strong className="text-primary">Emission curve.</strong> How much of the supply each
          epoch releases: fixed, linear ramp, or exponential decay (front-loaded). See{" "}
          <DocLink href="/docs/epoch-distribution/">epoch-based distribution</DocLink>.
        </LI>
        <LI>
          <strong className="text-primary">Minimum participation.</strong> Filters dust entries per
          epoch.
        </LI>
        <LI>
          <strong className="text-primary">Claim delay.</strong> A cooling-off window between an
          epoch ending and claims unlocking.
        </LI>
        <LI>
          <strong className="text-primary">Allowlist (optional).</strong> Restrict early epochs to
          signed wallets; opens permissionlessly after the deadline.
        </LI>
      </ul>

      <H2 id="step-4-shares">4. Shares &amp; hooks</H2>
      <P>
        When each epoch ends, its fund is released and split across configured shares. The protocol
        fee and the buy-back-and-burn share are injected automatically, so the shares you configure
        must sum to <Code>100% − protocol fee − buy back &amp; burn</Code>. The remaining share is
        the founder cut, routed to any address via TransferToHook. See{" "}
        <DocLink href="/docs/buy-back-and-burn/">buy back &amp; burn</DocLink>.
      </P>

      <H2 id="step-5-deploy">5. Sign &amp; deploy</H2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 marker:text-tertiary">
        <LI>Create and launch the token (owner: your connected wallet).</LI>
        <LI>
          Approve the participation token and the distribution token to the factory, then submit the
          distribution launch transaction.
        </LI>
        <LI>
          You receive the token and distributor addresses. Verify both on the explorer and share the
          distribution link — participants do the rest.
        </LI>
      </ol>

      <Callout>
        After launch there is nothing to operate: epochs run on time alone. Releases use the{" "}
        <Code>CreatorOrFactory</Code> policy, so you (the creator) or the factory operator can
        release an ended epoch&apos;s fund. Your only job is talking to participants.
      </Callout>
    </>
  );
}
