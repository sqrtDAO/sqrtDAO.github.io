import type { Metadata } from "next";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/launch-a-token/",
  "Launch a token",
  "Step-by-step guide to launching a token with sqrtDAO: allocations, pool pricing, epoch distribution config, shares and the one-transaction deployment through FactoryV1.",
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Launch a token</h1>
      <P>
        A full launch is one call to{" "}
        <Code>createTokenAndLiquidityAndDistribution</Code> on{" "}
        <DocLink href="/docs/contracts-v1/">FactoryV1</DocLink>: it deploys your ERC20, opens its
        Uniswap V3 pool, and starts an epoch-based distribution — all in a single transaction. The
        wizard in the app walks these same fields; this page explains what each decision means.
      </P>

      <H2 id="step-1-token">1. Token</H2>
      <P>
        Name, symbol, and the initial allocation list (recipient + amount pairs) that is minted at
        construction. One thing to get right: the factory itself must be allocated{" "}
        <strong className="text-primary">
          total distribution amount + your liquidity deposit
        </strong>{" "}
        of the new token — it funds both the distributor and the pool from that allocation. The
        wizard handles this automatically.
      </P>

      <H2 id="step-2-market">2. Market</H2>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">Starting price.</strong> Expressed as{" "}
          <Code>sqrtPriceX96</Code>, the Uniswap V3 price encoding. This sets where trading begins.
        </LI>
        <LI>
          <strong className="text-primary">Liquidity.</strong> How much participation token and new
          token you seed the pool with. Leftover deposits are refunded to you after minting.
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
        When each epoch drains, its fund splits across configured shares. The protocol fee share is
        injected automatically, so the shares you configure must sum to{" "}
        <Code>100% − protocol fee</Code>. The interesting choice is the{" "}
        <strong className="text-primary">buy back &amp; burn</strong> cut: a percentage of every
        epoch&apos;s fund permanently bought off the market and burned. See{" "}
        <DocLink href="/docs/buy-back-and-burn/">buy back &amp; burn</DocLink>. Remaining shares can
        route to any address via TransferToHook (e.g. treasury, team vesting).
      </P>

      <H2 id="step-5-deploy">5. Sign &amp; deploy</H2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 marker:text-tertiary">
        <LI>
          Approve the tokens — or sign Permit2 permits, which the factory accepts for gasless-style
          approvals without pre-setting allowances.
        </LI>
        <LI>Submit the launch transaction.</LI>
        <LI>
          You receive two addresses: your token and its distributor. Verify both on the explorer and
          share the distribution link — participants do the rest.
        </LI>
      </ol>

      <Callout>
        After launch there is nothing to operate: epochs run on time alone, and anyone can
        permissionlessly trigger each epoch&apos;s drain. Your only job is talking to participants.
      </Callout>
    </>
  );
}
