import type { Metadata } from "next";
import CodeBlock from "@/components/Docs/CodeBlock";
import { ArchitectureDiagram } from "@/components/Docs/diagrams";
import { Callout, Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { CONTRACTS_REPO_URL } from "../docs-nav";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/contracts-v1/",
  "Contracts v1",
  "Annotated walkthrough of the sqrtDAO v1 contracts: TokenV1, TokenV1Factory, DistributorV1, DistributionV1Factory and FactoryV1 — with Solidity source excerpts.",
);

const OVERVIEW = [
  {
    name: "FactoryV1",
    role: "Single entry point. Orchestrates token creation, pool creation and distribution setup; injects the protocol fee and optional buy-back-and-burn shares.",
  },
  {
    name: "TokenV1",
    role: "Minimal ERC20 (OpenZeppelin) that mints fixed initial allocations at construction.",
  },
  {
    name: "TokenV1Factory",
    role: "Deploys TokenV1 instances and records who requested each one.",
  },
  {
    name: "DistributorV1",
    role: "The epoch engine: participation, pro-rata rewards, claiming, drain hooks, allowlists.",
  },
  {
    name: "DistributionV1Factory",
    role: "Deploys DistributorV1 instances and keeps a list of all distributions for the website.",
  },
];

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Contracts v1</h1>
      <P>
        v1 consists of five contracts plus a few small libraries and hooks.{" "}
        <Code>FactoryV1</Code> is the only contract end users interact with directly; everything else
        is deployed through it.
      </P>

      <ArchitectureDiagram />
      <div className="mt-6 overflow-x-auto rounded-l border border-subtle">
        <table className="w-full min-w-[560px] border-collapse text-body">
          <tbody>
            {OVERVIEW.map((row) => (
              <tr key={row.name} className="border-t border-subtle first:border-t-0">
                <td className="w-56 px-4 py-3 align-top font-medium text-primary">{row.name}</td>
                <td className="px-4 py-3 align-top leading-relaxed text-secondary">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="tokenv1-tokenv1factory">TokenV1 &amp; TokenV1Factory</H2>
      <P>
        <Code>TokenV1</Code> is deliberately boring: a plain OpenZeppelin ERC20 whose constructor
        mints the entire initial supply to configured allocations. No taxes, no minting later, no
        owner.
      </P>
      <CodeBlock
        caption="TokenV1.sol"
        code={`constructor(string memory _name, string memory _symbol, Allocation[] memory _allocations) ERC20(_name, _symbol) {
    uint256 totalSupply_ = 0;
    for (uint256 i = 0; i < _allocations.length; i++) {
        require(_allocations[i].recipient != address(0), "Invalid recipient");
        totalSupply_ += _allocations[i].amount;
        _mint(_allocations[i].recipient, _allocations[i].amount);
    }
    require(totalSupply_ > 0, "Total supply must be > 0");
}`}
      />
      <P>
        <Code>TokenV1Factory</Code> deploys tokens on request and stores the requester per token in{" "}
        <Code>creatorOf</Code>, so anyone can verify a token was created through the protocol:
      </P>
      <CodeBlock
        caption="TokenV1Factory.sol — createToken() (trimmed)"
        code={`tokenAddress = address(new TokenV1(_name, _symbol, _allocations));
creatorOf[tokenAddress] = _creator;
tokenList.push(tokenAddress);
emit NewToken(tokenAddress);`}
      />

      <H2 id="distributorv1">DistributorV1</H2>
      <P>
        The heart of the protocol — one immutable instance per distribution. All behaviour is fixed
        at construction via its config:
      </P>
      <CodeBlock
        caption="DistributorV1.sol — DistributorConfig"
        code={`struct DistributorConfig {
    address distributionToken;          // token given out to participants
    address participationToken;         // token received when users participate
    uint256 epochDuration;              // length of each epoch (seconds)
    uint256 startTimestamp;             // when epoch 0 begins
    uint256 minParticipation;           // minimum per-epoch amount
    uint256 claimDelaySeconds;          // wait after an epoch ends before claiming
    bool allowFutureEpochParticipation;
    Share[] shares;                     // where drained epoch funds go
    EmissionFunction emissionFunction;  // computes each epoch's reward
    address allowlistSigner;            // address(0) = allowlist disabled
    uint256 allowlistDeadline;
    uint256 numberOfEpochs;
    uint256 totalDistributionAmount;
}`}
      />
      <P>
        Beyond <Code>participate</Code> and <Code>claim</Code> (detailed in{" "}
        <DocLink href="/docs/epoch-distribution/">epoch-based distribution</DocLink>), it exposes
        batch helpers (<Code>participateMany</Code>, <Code>claimMany</Code>) for power users and
        bots, third-party claim fees (<Code>setClaimFeeBps</Code>), and read helpers the app uses to
        render distributions: <Code>getContractInfo</Code>, <Code>getEpochInfo</Code> and{" "}
        <Code>discoverRewards</Code>.
      </P>

      <H2 id="distributionv1factory">DistributionV1Factory</H2>
      <P>
        Deploys distributors and keeps an append-only list so the website can page through every
        distribution ever created without scanning events:
      </P>
      <CodeBlock
        caption="DistributionV1Factory.sol — createDistributor()"
        code={`distributorAddress = address(new DistributorV1(_creator, _config));
creatorOf[distributorAddress] = _creator;
distributionList.push(distributorAddress);
emit NewDistributor(distributorAddress);`}
      />

      <H2 id="factoryv1">FactoryV1</H2>
      <P>
        The orchestrator. It owns the protocol fee (set by governance), holds references to both
        sub-factories and hooks, and composes them into one-click flows. The flagship function runs
        the whole launch:
      </P>
      <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-tertiary">
        <LI>Deploys the new token with its allocations.</LI>
        <LI>
          Creates the Uniswap V3 pool at the chosen price and adds liquidity — LP tokens are sent to
          the dead address, locking liquidity forever.
        </LI>
        <LI>Injects the buy-back-and-burn share if requested.</LI>
        <LI>
          Deploys the distributor and funds it with the full distribution amount of the new token.
        </LI>
      </ol>
      <CodeBlock
        caption="FactoryV1.sol — createTokenAndLiquidityAndDistribution() (trimmed)"
        code={`tokenAddress = createToken(_tokenName, _tokenSymbol, _tokenAllocations);
_config.distributionToken = tokenAddress;

createPoolAndAddLiquidity(
    _config.participationToken, tokenAddress, _sqrtPriceX96,
    _participationTokenAmountDesired, _distributionTokenAmountDesired,
    false, _participationPermit2, _emptyPermit2()
);

if (_buyBackAndBurnShareBps != 0) _injectBuyAndBurnShare(_config, _buyBackAndBurnShareBps);

distributorAddress = createDistributor(_config, false);`}
      />
      <Callout>
        Supporting pieces: <Code>SharesLib</Code> (basis-point splits validated to sum to 100%),{" "}
        <Code>HookLib</Code> (approve-and-call plumbing), the three emission curves, and the{" "}
        <Code>TransferToHook</Code>/<Code>BuyAndBurnHookV3</Code> hooks. Full source is on GitHub at{" "}
        <DocLink href={CONTRACTS_REPO_URL} external>
          sqrtDAO/contracts
        </DocLink>{" "}
        under <Code>src/v1</Code>.
      </Callout>
    </>
  );
}
