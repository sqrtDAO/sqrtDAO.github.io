import { zeroAddress, type Address } from "viem";
import { base, baseSepolia, anvil, sepolia } from "wagmi/chains";

export type ChainId =
  | typeof anvil.id
  | typeof base.id
  | typeof baseSepolia.id
  | typeof sepolia.id;

export interface ContractAddresses {
  factoryV1: Address;
  rootToken: Address;
  fixedEmission: Address;
  linearEmission: Address;
  exponentialEmission: Address;
  transferToHook: Address;
  buyAndBurnHook: Address;
}

const addresses: Record<ChainId, ContractAddresses> = {
  [anvil.id]: {
    factoryV1: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    rootToken: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
    fixedEmission: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    linearEmission: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    exponentialEmission: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    transferToHook: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    buyAndBurnHook: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
  },
  [baseSepolia.id]: {
    factoryV1: "0x4d20cC2F43fE5D97d983Db4Ce941dce295B78b6c",
    rootToken: "0x0112525bB0bFeccFa3650bE04427e5C99cb94268", // root token
    fixedEmission: "0xECE320d5d55FcB77d76a0eE30006D65354595d36",
    linearEmission: "0xBF68b456c91A40260c534ce98912FD01aa3FCAC6",
    exponentialEmission: "0xbA5A285806c343AaD955a40FE4b6e5e607B752b6",
    transferToHook: "0xDFc2752691b3F93fEEe55356E1bbB856505e9BD3",
    buyAndBurnHook: "0xF22031bdF281a7F71Ad214801BE847A0BF174Ca8",
  },
  [sepolia.id]: {
    factoryV1: "0xf33e6214867Ee20fbB3E9E01C1195243280036fB",
    rootToken: "0x40ce0bf2924a5f8870b9d3949972737b4494fabf", // root token
    fixedEmission: "0xa01a4FAfE3833F34b105Ae5129DC89F479c8367B",
    linearEmission: "0xcdB592D529782D20f63e45420d169bb137A3DCF9",
    exponentialEmission: "0x89169F68f62026dC0451838dAD8F28951E572266",
    transferToHook: "0xC676049B0ec9C45af8346276a62d6dE22f8A1378",
    buyAndBurnHook: "0xC5C818297De826f9AfEe72f2544646E2dB1a3021",
  },
  [base.id]: {
    factoryV1: zeroAddress,
    rootToken: zeroAddress,
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
