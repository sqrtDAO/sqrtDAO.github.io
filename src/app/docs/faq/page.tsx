import type { Metadata } from "next";
import { Code, DocLink, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/faq/",
  "FAQ",
  "Answers to common questions about sqrtDAO: token locking, claiming, drains, immutability, fees and supported networks.",
);

type QAProps = { q: string; children: React.ReactNode };

const QA = ({ q, children }: QAProps) => (
  <div className="mt-10">
    <h3 className="font-display text-h4 font-semibold text-primary">{q}</h3>
    <div className="mt-3">{children}</div>
  </div>
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">FAQ</h1>
      <P>Short answers to the questions we hear most. Deeper detail is linked along the way.</P>

      <QA q="Do I get my participation tokens back?">
        <P>
          No. When an epoch ends, its fund is drained and split across the distribution&apos;s
          shares (protocol fee, buy back &amp; burn, custom recipients). Participating means
          spending the participation token in exchange for a pro-rata claim on the distribution
          token — that&apos;s what makes the backing real.
        </P>
      </QA>

      <QA q="When can I claim my rewards?">
        <P>
          After the epoch you joined has ended plus its{" "}
          <Code>CLAIM_DELAY_SECONDS</Code> cooling-off window. Rewards stay unclaimed until you
          call claim — nothing is auto-sent. Claims are batchable across epoch ranges.
        </P>
      </QA>

      <QA q="Can I cancel or withdraw a participation?">
        <P>
          No. There is no withdrawal function in DistributorV1 by design — locked funds are
          committed for the epochs you chose. That finality is what separates sqrtDAO from
          refundable presales.
        </P>
      </QA>

      <QA q="Who triggers the epoch drain?">
        <P>
          Anyone. <Code>callDrainHook</Code> is permissionless — after an epoch ends, any wallet or
          bot can release its fund to the configured shares. There is no keeper dependency and no
          way for anyone to redirect the funds elsewhere.
        </P>
      </QA>

      <QA q="What if nobody participates in an epoch?">
        <P>
          Nothing to drain: the hook call requires a non-zero fund, so empty epochs simply skip.
          Their emission reward stays in the distributor, unclaimed forever — which effectively
          reduces total sellable supply.
        </P>
      </QA>

      <QA q="Can a creator change the rules mid-sale?">
        <P>
          No. Every distribution parameter — epochs, curves, minimums, shares, delays — is fixed
          immutably at construction. Creators have no admin functions on their distributor.
        </P>
      </QA>

      <QA q="What does it cost?">
        <P>
          The protocol fee (in basis points) is taken from drained epoch funds as an automatic
          share. Claiming is free when you do it yourself; if you let a third-party bot claim for
          you, it earns whatever fee you opted into via <Code>setClaimFeeBps</Code>. Launching adds
          standard Uniswap V3 swap fees on pool interactions (0.3% tier).
        </P>
      </QA>

      <QA q="Is the liquidity safe?">
        <P>
          LP tokens are minted to the dead address at pool creation — liquidity can never be
          removed by anyone, including the team. Combined with buy back &amp; burns, backing only
          ever grows. See{" "}
          <DocLink href="/docs/buy-back-and-burn/">buy back &amp; burn</DocLink>.
        </P>
      </QA>

      <QA q="Which networks are supported?">
        <P>
          Sepolia testnet today, Base coming soon. Addresses live on the{" "}
          <DocLink href="/docs/contract-addresses/">contract addresses</DocLink> page.
        </P>
      </QA>
    </>
  );
}
