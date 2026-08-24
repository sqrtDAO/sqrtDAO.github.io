import type { Metadata } from "next";
import CodeBlock from "@/components/Docs/CodeBlock";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/epoch-distribution/",
  "Epoch-based distribution",
  "How sqrtDAO distributes tokens: equal-length epochs, pro-rata participation, per-epoch emission curves, claim delays and drain hooks that route epoch funds onward.",
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">
        Epoch-based distribution
      </h1>
      <P>
        Every distribution on sqrtDAO runs on the same engine: a fixed supply of a distribution
        token is released over a series of equal-length <strong className="text-primary">epochs</strong>,
        and anyone who locks the participation token during an epoch earns a pro-rata slice of that
        epoch&apos;s reward. This page walks through the lifecycle.
      </P>

      <H2 id="one-sale-many-epochs">One sale, many epochs</H2>
      <P>
        A distribution starts at a fixed timestamp and is divided into{" "}
        <Code>
          NUMBER_OF_EPOCHS
        </Code>{" "}
        windows of{" "}
        <Code>
          EPOCH_DURATION
        </Code>{" "}
        seconds each. The current epoch is derived purely from time — no oracle, no keeper:
      </P>
      <CodeBlock caption="DistributorV1.sol — currentEpoch()" code={`function currentEpoch() public view returns (uint256) {
    return (block.timestamp - STARTING_TIMESTAMP) / EPOCH_DURATION;
}`} />

      <H2 id="participate">Participate</H2>
      <P>
        To join, you call{" "}
        <Code>
          participate
        </Code>{" "}
        with an amount <em>per epoch</em> and a range of epochs. The full cost (
        <Code>
          amountPerEpoch × range.length
        </Code>
        ) is pulled upfront, and your address accumulates weight in every epoch of the range. You can
        also participate on behalf of a different recipient:
      </P>
      <CodeBlock
        caption="DistributorV1.sol — participate() (trimmed)"
        code={`PARTICIPATION_TOKEN.safeTransferFrom(msg.sender, address(this), _range.length * _amountPerEpoch);

for (uint256 i = 0; i < _range.length; i++) {
    uint256 epoch = _range.from + i;
    epochTotalParticipation[epoch] += _amountPerEpoch;
    epochUserParticipation[epoch][_recipient] += _amountPerEpoch;
}`}
      />
      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-tertiary">
        <LI>
          Each epoch enforces a{" "}
          <Code>
            MIN_PARTICIPATION
          </Code>{" "}
          floor per participant.
        </LI>
        <LI>
          A distribution can start allowlisted: while the allowlist window is active, only
          signatures from a trusted signer can participate; after it expires the doors open for
          everyone.
        </LI>
        <LI>
          Whether future epochs accept participation is a per-distribution flag (
          <Code>
            ALLOW_FUTURE_EPOCH_PARTICIPATION
          </Code>
          ).
        </LI>
      </ul>

      <H2 id="rewards-per-epoch">Rewards per epoch</H2>
      <P>
        How much of the distribution token each epoch releases is decided by a pluggable{" "}
        <strong className="text-primary">emission function</strong>. Three presets ship with v1:
      </P>
      <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">FixedEmission</strong> — same reward every epoch.
        </LI>
        <LI>
          <strong className="text-primary">LinearEmission</strong> — reward = base + slope × epoch,
          so it can ramp up or wind down linearly.
        </LI>
        <LI>
          <strong className="text-primary">ExponentialEmission</strong> — reward = initial ×
          factor^epoch, supporting both growth (&gt;1) and decay (&lt;1).
        </LI>
      </ul>
      <CodeBlock
        caption="DistributorV1.sol — rewardOf()"
        code={`function rewardOf(uint256 epoch) public view returns (uint256) {
    return emissionFunction.emissionContract.calculate(emissionFunction.curveConfig, epoch);
}`}
      />

      <H2 id="claiming">Claiming</H2>
      <P>
        Once an epoch has ended and its{" "}
        <Code>
          CLAIM_DELAY_SECONDS
        </Code>{" "}
        have passed, your slice is:
      </P>
      <CodeBlock
        caption="DistributorV1.sol — claim() (core math)"
        code={`claimAmount += (epochUserParticipation[epoch][_user] * rewardOf(epoch))
    / epochTotalParticipation[epoch];`}
      />
      <P>
        Your share is simply your weight divided by the epoch&apos;s total participation. Claims are
        batchable across ranges, and third parties can claim on someone else&apos;s behalf — the
        account owner sets an optional fee in basis points (
        <Code>
          setClaimFeeBps
        </Code>
        ) to pay whoever runs the claiming bot for them.
      </P>

      <H2 id="draining-epoch-funds">Draining epoch funds</H2>
      <P>
        The participation token locked in an epoch doesn&apos;t sit there forever. After an epoch
        ends, anyone can call{" "}
        <Code>
          callDrainHook
        </Code>
        , which forwards the whole epoch fund to the distribution&apos;s configured{" "}
        <strong className="text-primary">shares</strong> — percentage cuts in basis points that must
        sum to 100%:
      </P>
      <CodeBlock
        caption="DistributorV1.sol — callDrainHook() (trimmed)"
        code={`uint256 fund;
for (uint256 i = nextEpochToRelease; i < currEpoch; i++) {
    fund += epochTotalParticipation[i];
}
nextEpochToRelease = currEpoch;

for (uint256 i = 0; i < shares.length; i++) {
    shares[i].approveAndCall(PARTICIPATION_TOKEN, fund);
}`}
      />
      <Callout>
        Shares make distributions composable: one share might send a cut to the protocol treasury,
        another might buy back and burn the distributed token — see{" "}
        <DocLink href="/docs/buy-back-and-burn/">buy back &amp; burn</DocLink>.
      </Callout>
    </>
  );
}
