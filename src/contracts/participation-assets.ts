import { base, sepolia } from "wagmi/chains";
import type { Address } from "viem";
import { robinhood } from "@/constants/ecosystems";

export type ParticipationAsset = {
  symbol: string;
  address: Address;
  decimals: number;
  /** Pay with native ETH through EthParticipationRouter (address is WETH). */
  native?: boolean;
};

// Participation/backing assets per chain. Add a chain here to support it.
const PARTICIPATION_ASSETS: Record<number, ParticipationAsset[]> = {
  [sepolia.id]: [
    // sqrtDAO root token is the participation token on Sepolia.
    {
      symbol: "ROOT",
      address: "0x40ce0bf2924a5f8870b9d3949972737b4494fabf",
      decimals: 18,
    },
  ],
  [base.id]: [
    // Canonical Base mainnet addresses.
    {
      symbol: "USDT",
      address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
      decimals: 6,
    },
    {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
    },
    {
      symbol: "ETH",
      address: "0x4200000000000000000000000000000000000006",
      decimals: 18,
      native: true,
    },
  ],
  [robinhood.id]: [
    {
      symbol: "USDT",
      address: "0xE246BC49b0598d7Cd9f0eAD48B885034f1254380",
      decimals: 6,
    },
    {
      symbol: "USDC",
      address: "0x80e0e24718dbFcad49ECAA6F1e6C89A190586cA8",
      decimals: 6,
    },
    {
      symbol: "ETH",
      address: "0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73",
      decimals: 18,
      native: true,
    },
  ],
};

/** Participation/backing assets offered per chain. */
export const getParticipationAssets = (chainId: number): ParticipationAsset[] =>
  PARTICIPATION_ASSETS[chainId] ?? [];
