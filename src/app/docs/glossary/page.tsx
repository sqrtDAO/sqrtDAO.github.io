import type { Metadata } from "next";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/glossary/",
  "Glossary",
  "Definitions of sqrtDAO terms: epoch, participation token, distribution token, shares, drain, hooks, emission curves and more.",
);

const TERMS: { term: string; def: string }[] = [
  {
    term: "Allocation",
    def: "A recipient + amount pair minted as initial supply when a new token is created. The full token supply exists from block one.",
  },
  {
    term: "Allowlist",
    def: "An optional early-access phase where only signatures from a trusted signer can participate. After the allowlist deadline passes, participation opens to everyone.",
  },
  {
    term: "Basis points (bps)",
    def: "One hundredth of a percent. 50 bps = 0.5%, 10 000 bps = 100%. Used for protocol fees, buy-back shares and claim fees.",
  },
  {
    term: "Burn address",
    def: "0x000…dEaD — an address nobody can spend from. LP tokens are minted there at pool creation, and bought-back tokens are swapped straight into it.",
  },
  {
    term: "Claim delay",
    def: "A cooling-off window (in seconds) between an epoch ending and its rewards becoming claimable.",
  },
  {
    term: "Distribution token",
    def: "The token being given out by a distribution — the thing participants earn pro-rata slices of.",
  },
  {
    term: "Drain",
    def: "Releasing an ended epoch's locked participation fund to the distribution's configured shares. Triggered permissionlessly via callDrainHook after each epoch ends.",
  },
  {
    term: "Emission curve",
    def: "The function deciding each epoch's reward: fixed (constant), linear (base + slope), or exponential (growth or decay factor). Plugged in as an EmissionFunction contract.",
  },
  {
    term: "Epoch",
    def: "One fixed-length window in a distribution timeline. Rewards, totals and participation are tracked per epoch; currentEpoch is derived purely from the block timestamp.",
  },
  {
    term: "Hook",
    def: "A small contract that receives its share of a drained fund via approve-and-call. v1 ships TransferToHook (forwards to an address) and BuyAndBurnHookV3 (swaps and burns).",
  },
  {
    term: "LP tokens",
    def: "Uniswap V3 position receipts proving liquidity ownership. sqrtDAO mints them straight to the burn address, making pool liquidity permanently locked.",
  },
  {
    term: "Participation token",
    def: "The token participants lock into epochs. Not returned — drained epoch funds flow onward through shares.",
  },
  {
    term: "Permit2",
    def: "Uniswap's signature-based approval system. Launches can accept Permit2 signatures instead of pre-set ERC20 allowances.",
  },
  {
    term: "Pro-rata",
    def: "Your proportional slice: your lock divided by the epoch's total participation, times that epoch's reward.",
  },
  {
    term: "Share",
    def: "A percentage cut of every drained epoch fund, expressed in basis points, routed to a hook. All shares must sum to exactly 100% including the protocol fee.",
  },
  {
    term: "sqrtPriceX96",
    def: "Uniswap V3's price encoding — the square root of the price multiplied by 2⁹⁶. It sets a pool's starting price at creation.",
  },
];

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Glossary</h1>
      <p className="mt-5 text-body-l leading-relaxed text-secondary">
        The vocabulary used across these docs and in the contracts.
      </p>

      <dl className="mt-8">
        {TERMS.map(({ term, def }) => (
          <div key={term} className="border-t border-subtle py-6 first:border-t-0 first:pt-0">
            <dt id={term.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="font-medium text-primary">
              {term}
            </dt>
            <dd className="mt-2 text-body-l leading-relaxed text-secondary">{def}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}
