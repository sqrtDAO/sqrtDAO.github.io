import { type Address } from "viem";
import { base, mainnet, sepolia } from "wagmi/chains";
import { anvil } from "@/components/RainbowKitRoot/RainbowKitRoot";

export type ChainId =
  | typeof anvil.id
  | typeof base.id
  | typeof mainnet.id
  | typeof sepolia.id;

export interface ContractAddresses {
  factory: Address;
}

const addresses: Record<ChainId, ContractAddresses> = {
  [anvil.id]: {
    factory: "0x0000000000000000000000000000000000000000",
  },
  [base.id]: {
    factory: "0x0000000000000000000000000000000000000000",
  },
  [mainnet.id]: {
    factory: "0x0000000000000000000000000000000000000000",
  },
  [sepolia.id]: {
    factory: "0x0000000000000000000000000000000000000000",
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const entry = addresses[chainId as ChainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}`);
  return entry;
}
