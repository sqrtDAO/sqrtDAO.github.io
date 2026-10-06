import { type Address } from "viem";
import { base, sepolia } from "wagmi/chains";

export type ChainId = typeof base.id | typeof sepolia.id;

export interface ContractAddresses {
  factoryV1: Address;
  fixedEmission: Address;
  linearEmission: Address;
  exponentialEmission: Address;
  transferToHook: Address;
  buyAndBurnHook: Address;
  tokenFactory: Address;
  distributorFactory: Address;
  ethParticipationRouter: Address;
  feeVault: Address;
  weth: Address;
}

// Each chain is listed in full on purpose — the two deployments happen to share
// addresses today (same deployer, nonce 0), but they must stay independently editable.
const addresses: Record<ChainId, ContractAddresses> = {
  [sepolia.id]: {
    factoryV1: "0x0d7c71B0E33636555C237899DfF80F847637186e",
    fixedEmission: "0xa616f9d40DfBe52836B47744BcF2F4be0cDE4ACb",
    linearEmission: "0xDA9A1c5F6424EE64e814bF40Eb95c952Ee296AD8",
    exponentialEmission: "0x77EaAff0F59440E8B2227843FBCd2F7513C7ef61",
    transferToHook: "0xaC7073380A91415D9bfEB57b6492CC628d146B42",
    buyAndBurnHook: "0xD778ea77847aBf6234E0383226fb5f7b7a08aB45",
    tokenFactory: "0x79323C318392Bffd0Db521866DdC5c8bBfc2a659",
    distributorFactory: "0x948F9cfdf9d7Dd53df16aC060012b14A7D0CBeE6",
    ethParticipationRouter: "0xD9412770F615B059A35cd2bA8207Cf0157225304",
    feeVault: "0xE89B5AF07821A69c9755DFDE7DB0eD2E49Ae7FCc",
    weth: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  },
  [base.id]: {
    factoryV1: "0x0d7c71B0E33636555C237899DfF80F847637186e",
    fixedEmission: "0xa616f9d40DfBe52836B47744BcF2F4be0cDE4ACb",
    linearEmission: "0xDA9A1c5F6424EE64e814bF40Eb95c952Ee296AD8",
    exponentialEmission: "0x77EaAff0F59440E8B2227843FBCd2F7513C7ef61",
    transferToHook: "0xaC7073380A91415D9bfEB57b6492CC628d146B42",
    buyAndBurnHook: "0xD778ea77847aBf6234E0383226fb5f7b7a08aB45",
    tokenFactory: "0x79323C318392Bffd0Db521866DdC5c8bBfc2a659",
    distributorFactory: "0x948F9cfdf9d7Dd53df16aC060012b14A7D0CBeE6",
    ethParticipationRouter: "0xD9412770F615B059A35cd2bA8207Cf0157225304",
    feeVault: "0xE89B5AF07821A69c9755DFDE7DB0eD2E49Ae7FCc",
    weth: "0x4200000000000000000000000000000000000006",
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const entry = addresses[chainId as ChainId];
  if (!entry) throw new Error(`Unsupported chain: ${chainId}`);
  return entry;
}