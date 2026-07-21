import { type Address } from "viem";
import { base, baseSepolia,anvil} from "wagmi/chains";

export type ChainId =
  | typeof anvil.id
  | typeof base.id
  | typeof baseSepolia.id;

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
  [baseSepolia.id]: {
    factory: "0x0000000000000000000000000000000000000000",
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const entry = addresses[chainId as ChainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}`);
  return entry;
}
