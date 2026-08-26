import type { Metadata } from "next";
import CodeBlock from "@/components/Docs/CodeBlock";
import { FundSplitDiagram, ParticipateFlowDiagram } from "@/components/Docs/diagrams";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/participate/",
  "How to participate",
  "Step-by-step guide to participating in a sqrtDAO distribution: choosing epochs, locking the participation token and claiming your pro-rata rewards.",
);

const STEPS = [
  {
    title: "Pick a distribution",
    body: "Connect your wallet on Sepolia and open a distribution from the list. Each listing shows the two tokens that matter: the participation token you lock, and the distribution token you can earn.",
  },
  {
    title: "Read the numbers",
    body: "Check the epoch duration and count (how long the sale runs), the emission curve (how rewards are spread across epochs), the minimum participation per epoch, the claim delay, and how much has already been locked.",
  },
  {
    title: "Choose your epochs and amount",
    body: "Pick a contiguous range of epochs and an amount per epoch. Your total cost — amount × number of epochs — is pulled in one transaction after you approve the participation token. You can participate for someone else by setting a different recipient.",
  },
  {
    title: "Wait for your epochs to end",
    body: `Your lock earns weight in every epoch of your range. After an epoch ends, its reward is fixed and — once the claim delay passes — claimable. Rewards sit unclaimed until you act; nothing is auto-sent.`,
  },
  {
    title: "Claim",
    body: "Claim pays out all epochs in a range at once. You can batch multiple ranges with repeated calls, or set a claim fee so a third-party bot claims on your behalf for a cut you control.",
  },
];

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">How to participate</h1>
      <P>
        Participating means locking the participation token during specific epochs. In exchange you
        get a <strong className="text-primary">pro-rata slice</strong> of each epoch&apos;s reward,
        paid in the distribution token. This page covers two separate things:{" "}
        <strong className="text-primary">your flow</strong> — what you do between locking and
        claiming — and <strong className="text-primary">the fund split</strong> — what happens under
        the hood to the tokens everyone locked.
      </P>

      <H2 id="your-flow">Your flow: participate → claim</H2>
      <ParticipateFlowDiagram />
      <ol className="mt-8 list-decimal space-y-6 pl-6 marker:text-tertiary">
        {STEPS.map((step, i) => (
          <LI key={i}>
            <strong className="text-primary">
              {i + 1}. {step.title}.
            </strong>{" "}
            {step.body}
          </LI>
        ))}
      </ol>

      <Callout>
        Some distributions start allowlisted: until the allowlist deadline passes, only wallets with
        a signature from the trusted signer can join. After it expires, anyone can participate.
      </Callout>

      <H2 id="claim-math">The claim math</H2>
      <P>Your slice of any epoch is one line of Solidity:</P>
      <CodeBlock
        caption="DistributorV1.sol — claim()"
        code={`claimAmount += (epochUserParticipation[epoch][_user] * rewardOf(epoch))
    / epochTotalParticipation[epoch];`}
      />
      <P>
        In words: <Code>your lock × that epoch&apos;s reward ÷ everything locked in that epoch</Code>.
        Fewer participants means a bigger slice — but also signals less demand for what you&apos;re
        buying into.
      </P>

      <H2 id="fund-split">Where your locked tokens go</H2>
      <P>
        Everything above is your side of the fence. Separately — and without any action from you or
        the creator — each ended epoch&apos;s fund moves on:
      </P>
      <FundSplitDiagram />
      <P>
        The participation token is not a deposit you get back. When an epoch ends, its entire fund
        is drained and routed to the distribution&apos;s configured shares — protocol fee, buy back
        &amp; burn, custom recipients. Treat participation as{" "}
        <strong className="text-primary">spending</strong> the participation token to acquire
        distribution token at an average price determined by everyone who participated alongside
        you.
      </P>
      <P>
        The mechanics of shares and hooks live on{" "}
        <DocLink href="/docs/epoch-distribution/">epoch-based distribution</DocLink>, and the most
        popular share — permanent buy pressure — on{" "}
        <DocLink href="/docs/buy-back-and-burn/">buy back &amp; burn</DocLink>.
      </P>
    </>
  );
}
