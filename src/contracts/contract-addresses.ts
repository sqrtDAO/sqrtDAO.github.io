import { zeroAddress, type Address } from "viem";
import { base, baseSepolia, anvil } from "wagmi/chains";

export type ChainId = typeof anvil.id | typeof base.id | typeof baseSepolia.id;

export interface ContractAddresses {
  factoryV1: Address;
  usdt: Address;
  fixedEmission: Address;
  linearEmission: Address;
  exponentialEmission: Address;
  transferToHook: Address;
  buyAndBurnHook: Address;
}

const addresses: Record<ChainId, ContractAddresses> = {
  [anvil.id]: {
    factoryV1: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    usdt: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    fixedEmission: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    linearEmission: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    exponentialEmission: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    transferToHook: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    buyAndBurnHook: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  },
  [base.id]: {
    factoryV1: zeroAddress,
    usdt: zeroAddress,
    fixedEmission: zeroAddress,
    linearEmission: zeroAddress,
    exponentialEmission: zeroAddress,
    transferToHook: zeroAddress,
    buyAndBurnHook: zeroAddress,
  },
  [baseSepolia.id]: {
    factoryV1: zeroAddress,
    usdt: zeroAddress,
    fixedEmission: zeroAddress,
    linearEmission: zeroAddress,
    exponentialEmission: zeroAddress,
    transferToHook: zeroAddress,
    buyAndBurnHook: zeroAddress,
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const entry = addresses[chainId as ChainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}`);
  return entry;
}
