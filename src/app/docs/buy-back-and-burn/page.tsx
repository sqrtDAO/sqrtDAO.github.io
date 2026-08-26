import type { Metadata } from "next";
import CodeBlock from "@/components/Docs/CodeBlock";
import { BuyBackBurnFlowDiagram } from "@/components/Docs/diagrams";
import { Code, DocLink, H2, LI, P } from "@/components/Docs/prose";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/buy-back-and-burn/",
  "Buy back & burn",
  "How sqrtDAO turns epoch participation into permanent buy pressure: a configurable share of every drained epoch fund is swapped on Uniswap V3 and the proceeds are burned.",
);

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Buy back &amp; burn</h1>

      <H2 id="what-it-does">What it does</H2>
      <P>
        Buy back &amp; burn is one of the hooks a distribution can route its funds to. A configured
        percentage of every drained epoch&apos;s participation fund is swapped from the
        participation token into the distribution token on its Uniswap V3 pool — and everything the
        swap returns goes straight to the dead address (
        <Code>
          0x…dEaD
        </Code>
        ), permanently removing it from supply.
      </P>
      <P>
        In practice: real participation volume creates sustained buy pressure on the token, and the
        bought tokens never come back.
      </P>

      <BuyBackBurnFlowDiagram />

      <H2 id="how-its-configured">How it&apos;s configured</H2>
      <P>
        When launching with{" "}
        <Code>
          createTokenAndLiquidityAndDistribution
        </Code>
        , the creator picks a share in basis points. The factory injects a matching{" "}
        <Code>
          Share
        </Code>{" "}
        into the distributor config, with the swap path (participation token → pool fee tier →
        distribution token) baked in at deployment:
      </P>
      <CodeBlock
        caption="FactoryV1.sol — _injectBuyAndBurnShare()"
        code={`bytes memory path = abi.encodePacked(
    _config.participationToken, LIQUIDITY_POOL_FEE, _config.distributionToken
);

_config.shares = SharesLib.append(
    _config.shares,
    Share({
        shareBps: _shareBps,
        hook: Hook({
            contractAddress: address(BUY_AND_BURN_HOOK),
            callData: abi.encodeCall(BuyAndBurnHookV3.buyAndBurn, (path))
        })
    })
);`}
      />
      <P>
        All shares — protocol fee, buy back &amp; burn, any custom recipients — must sum to exactly
        100%, which is validated at construction. Set the share to zero to launch without it.
      </P>

      <H2 id="the-burn-mechanics">The burn mechanics</H2>
      <P>
        When an epoch drains (see{" "}
        <DocLink href="/docs/epoch-distribution/">epoch-based distribution</DocLink>), each share
        receives its cut via approve-and-call. The hook then swaps its allowance through Uniswap V3
        with the burn address as recipient:
      </P>
      <CodeBlock
        caption="BuyAndBurnHookV3.sol — buyAndBurn() (trimmed)"
        code={`uint256 amountIn = token.allowance(msg.sender, address(this));
token.safeTransferFrom(msg.sender, address(this), amountIn);
token.forceApprove(UNISWAP_SWAP_ROUTER_ADDRESS, amountIn);

amountOut = IUniswapV3SwapRouter(UNISWAP_SWAP_ROUTER_ADDRESS).exactInput(
    ExactInputParams({ path: _path, recipient: BURN_ADDRESS, amountIn: amountIn, amountOutMinimum: 0 })
);`}
      />

      <H2 id="why-it-matters">Why it matters</H2>
      <ul className="mt-4 list-disc space-y-3 pl-6 marker:text-tertiary">
        <LI>
          <strong className="text-primary">Backing that can&apos;t be pulled.</strong> At pool
          creation, LP tokens are minted straight to the dead address — liquidity can never be
          withdrawn by anyone, including the team.
        </LI>
        <LI>
          <strong className="text-primary">Demand follows usage.</strong> Buy pressure scales with
          actual participation instead of relying on promises or emissions schedules.
        </LI>
        <LI>
          <strong className="text-primary">Deflationary by design.</strong> Every epoch that runs
          shrinks circulating supply — no manual burns, no multisig involvement.
        </LI>
      </ul>
    </>
  );
}
