import { CONTRACTS_REPO_URL } from "./docs-nav";

export type DocSearchEntry = {
  path: string;
  anchor?: string;
  title: string;
  text: string;
};

export const docSearchIndex: DocSearchEntry[] = [
  {
    path: "/docs/",
    title: "Getting started",
    text: "sqrtDAO is fair-launch infrastructure for tokens. Distribution runs slowly across epochs instead of an instant sale. Two ways in: launch a new token, or distribute an existing one.",
  },
  {
    path: "/docs/",
    anchor: "how-a-launch-works",
    title: "Getting started — How a launch works",
    text: "FactoryV1 deploys the token, creates a Uniswap V3 pool with burned LP tokens, and deploys a DistributorV1. Participants lock the participation token per epoch. Ended epochs drain their fund to hooks. Participants claim pro-rata rewards after the claim delay.",
  },
  {
    path: "/docs/",
    anchor: "two-ways-in",
    title: "Getting started — Two ways in",
    text: "Launch a brand new token with createTokenAndLiquidityAndDistribution, or distribute a token you already own with createDistributor.",
  },
  {
    path: "/docs/contract-addresses/",
    title: "Contract addresses",
    text: "Deployed contract addresses per chain, loaded from contract-addresses.ts. Sepolia testnet is live with FactoryV1, root token, emission curves, hooks and factories. Base is not deployed yet.",
  },
  {
    path: "/docs/epoch-distribution/",
    anchor: "one-sale-many-epochs",
    title: "Epoch-based distribution — One sale, many epochs",
    text: "A distribution timeline is split into equal-length epochs. The current epoch number is (now - start timestamp) / epoch duration.",
  },
  {
    path: "/docs/epoch-distribution/",
    anchor: "participate",
    title: "Epoch-based distribution — Participate",
    text: "participate locks amountPerEpoch of the participation token for each epoch in a range, upfront. Minimum participation applies. Optional allowlist signature window before opening to everyone. Participation can target a recipient other than the sender.",
  },
  {
    path: "/docs/epoch-distribution/",
    anchor: "rewards-per-epoch",
    title: "Epoch-based distribution — Rewards per epoch",
    text: "rewardOf(epoch) asks the emission function how much distribution token that epoch releases. Preset curves: FixedEmission constant amount, LinearEmission base plus slope, ExponentialEmission growth or decay factor.",
  },
  {
    path: "/docs/epoch-distribution/",
    anchor: "claiming",
    title: "Epoch-based distribution — Claiming",
    text: "After an epoch ends and the claim delay passes, claim pays your pro-rata share: user participation divided by total epoch participation times the epoch reward. Third parties can claim on your behalf for a fee you set in basis points.",
  },
  {
    path: "/docs/epoch-distribution/",
    anchor: "draining-epoch-funds",
    title: "Epoch-based distribution — Draining epoch funds",
    text: "callDrainHook releases each ended epoch's participation fund and splits it across configured shares. Shares are percentage cuts in basis points routed to hooks via approveAndCall, e.g. protocol fee or buy back and burn.",
  },
  {
    path: "/docs/buy-back-and-burn/",
    anchor: "what-it-does",
    title: "Buy back & burn — What it does",
    text: "A configurable share of every epoch's drained participation fund is swapped from the participation token to the distribution token on Uniswap V3, and everything received is sent to the dead address, permanently removing it from supply.",
  },
  {
    path: "/docs/buy-back-and-burn/",
    anchor: "how-its-configured",
    title: "Buy back & burn — How it's configured",
    text: "At launch time the creator picks a share in basis points. FactoryV1 injects a Share routing that cut of every drained epoch fund to BuyAndBurnHookV3 with the pool path baked in. Shares must sum to 100% including the protocol fee.",
  },
  {
    path: "/docs/buy-back-and-burn/",
    anchor: "the-burn-mechanics",
    title: "Buy back & burn — The burn mechanics",
    text: "BuyAndBurnHookV3.buyAndBurn pulls the caller's allowance, approves the Uniswap V3 swap router, and runs exactInput with the burn address as recipient. LP tokens are also burned at pool creation so liquidity can never be pulled.",
  },
  {
    path: "/docs/buy-back-and-burn/",
    anchor: "why-it-matters",
    title: "Buy back & burn — Why it matters",
    text: "Buy pressure scales with real participation volume, supply shrinks as epochs pass, and liquidity backing cannot be withdrawn because LP tokens are sent to the dead address at creation.",
  },
  {
    path: "/docs/participate/",
    title: "How to participate",
    text: "Step-by-step guide: pick a distribution, read epoch numbers, choose epochs and amount per epoch, approve and lock, wait for the claim delay, then claim your pro-rata rewards. Participation tokens are not returned.",
  },
  {
    path: "/docs/participate/",
    anchor: "what-happens-to-your-tokens",
    title: "How to participate — What happens to your tokens",
    text: "Locked participation tokens are drained to configured shares after each epoch ends. Participating means spending the participation token to earn distribution token pro-rata.",
  },
  {
    path: "/docs/launch-a-token/",
    title: "Launch a token",
    text: "One transaction on FactoryV1 deploys your ERC20 with allocations, opens a Uniswap V3 pool with burned LP at sqrtPriceX96 price, and starts an epoch distribution with emission curve, minimum participation, claim delay and optional allowlist.",
  },
  {
    path: "/docs/launch-a-token/",
    anchor: "step-4-shares",
    title: "Launch a token — Shares & hooks",
    text: "Protocol fee share is injected automatically; configure remaining shares to sum to 100% minus protocol fee, including an optional buy back and burn cut in basis points.",
  },
  {
    path: "/docs/faq/",
    title: "FAQ",
    text: "Do I get participation tokens back? When can I claim? Can I withdraw? Who drains epochs? What if nobody participates? Can creators change rules? What fees apply? Is liquidity safe? Which networks?",
  },
  {
    path: "/docs/glossary/",
    title: "Glossary",
    text: "Definitions: allocation, allowlist, basis points, burn address, claim delay, distribution token, drain, emission curve, epoch, hook, LP tokens, participation token, Permit2, pro-rata, share, sqrtPriceX96.",
  },
  {
    path: "/docs/contracts-v1/",
    title: "Contracts v1 — Overview",
    text: `Five contracts power v1: TokenV1, TokenV1Factory, DistributorV1, DistributionV1Factory and FactoryV1, plus supporting libs (SharesLib, HookLib) and hook contracts. Full source on GitHub at ${CONTRACTS_REPO_URL}.`,
  },
  {
    path: "/docs/contracts-v1/",
    anchor: "tokenv1-tokenv1factory",
    title: "Contracts v1 — TokenV1 & TokenV1Factory",
    text: "TokenV1 is a plain OpenZeppelin ERC20 minting fixed initial allocations to recipients at construction. TokenV1Factory deploys instances and records the creator of every token for provenance checks.",
  },
  {
    path: "/docs/contracts-v1/",
    anchor: "distributorv1",
    title: "Contracts v1 — DistributorV1",
    text: "The core engine. Holds the epoch mappings, participate, claim, callDrainHook, view helpers getContractInfo, getEpochInfo, discoverRewards, allowlist signature verification and third-party claim fees.",
  },
  {
    path: "/docs/contracts-v1/",
    anchor: "distributionv1factory",
    title: "Contracts v1 — DistributionV1Factory",
    text: "Deploys DistributorV1 instances, tracks creatorOf and keeps the full distributor list so the website can page through all distributions.",
  },
  {
    path: "/docs/contracts-v1/",
    anchor: "factoryv1",
    title: "Contracts v1 — FactoryV1",
    text: "Single entry point orchestrating everything: createToken, createDistributor with injected protocol fee share, createPoolAndAddLiquidity with burned LP, Permit2 support, and createTokenAndLiquidityAndDistribution combining all three steps.",
  },
];
