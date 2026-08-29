import { zeroAddress, type Address } from "viem";
import { base, anvil, sepolia } from "wagmi/chains";

export type ChainId = typeof anvil.id | typeof base.id | typeof sepolia.id;

export interface ContractAddresses {
  factoryV1: Address;
  rootToken: Address;
  fixedEmission: Address;
  linearEmission: Address;
  exponentialEmission: Address;
  transferToHook: Address;
  buyAndBurnHook: Address;
  tokenFactory: Address;
  distributorFactory: Address;
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
    tokenFactory: "0xtodo",
    distributorFactory: "0xtodo",
  },
  [sepolia.id]: {
    factoryV1: "0x2821d8Fd1Ed684008d36f61074ACdc88299971e3",
    rootToken: "0x40ce0bf2924a5f8870b9d3949972737b4494fabf",
    fixedEmission: "0xfA0f8aBdd46BD55F7E915981f54A61B2CeD25dD8",
    linearEmission: "0xf3B24aC2eCf80c911E801AB68C3Ccf3799174574",
    exponentialEmission: "0xc131817C3B02048762AD2D8D04Cd608966ef8482",
    transferToHook: "0xfea9055f9A0E963D9e7d1a0AC2D7B19aC42793b4",
    buyAndBurnHook: "0x50C1EcD6B79731DE92Ee9BAcD1b87d6298b414aD",
    tokenFactory: "0x533ee7D342F2258b0d6E8f537DdE99f2aBe2701d",
    distributorFactory: "0x533E7f8e7B4a741D0B0142b5aE97C5649E3f39f0",
  },
  [base.id]: {
    // WARNING: when you deployed on base make sure you update .env file of server
    factoryV1: zeroAddress,
    rootToken: zeroAddress,
    fixedEmission: zeroAddress,
    linearEmission: zeroAddress,
    exponentialEmission: zeroAddress,
    transferToHook: zeroAddress,
    buyAndBurnHook: zeroAddress,
    tokenFactory: zeroAddress,
    distributorFactory: zeroAddress,
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const entry = addresses[chainId as ChainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}`);
  return entry;
}
