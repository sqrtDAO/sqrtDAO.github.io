import { Address, getContract, PublicClient, WalletClient } from "viem";
import { getAddresses } from "./contract-addresses";
import { factoryV1Abi } from "./abis";

// --- FactoryV1 ---
export const getFactoryV1Contract = (client: WalletClient) =>
  getContract({
    address: getAddresses(client.chain!.id).factory,
    abi: factoryV1Abi,
    client,
  });

export const getFactoryV1ContractReadonly = (client: PublicClient) =>
  getContract({
    address: getAddresses(client.chain!.id).factory,
    abi: factoryV1Abi,
    client,
  });

export const getDistributorV1Contract = (
  client: WalletClient,
  address: Address,
) =>
  getContract({
    address,
    abi: factoryV1Abi,
    client,
  });

export const getDistributorV1ContractReadonly = (
  client: PublicClient,
  address: Address,
) =>
  getContract({
    address,
    abi: factoryV1Abi,
    client,
  });
