import { Address, Client, getContract } from "viem";
import { getAddresses } from "./contract-addresses";
import {
  distributorV1Abi,
  distributionV1FactoryAbi,
  factoryV1Abi,
  tokenV1Abi,
} from "./abis";

export const getFactoryV1Contract = (client: Client) =>
  getContract({
    address: getAddresses(client.chain!.id).factoryV1,
    abi: factoryV1Abi,
    client,
  });

export const getDistributionV1FactoryContract = (client: Client) =>
  getContract({
    address: getAddresses(client.chain!.id).distributorFactory,
    abi: distributionV1FactoryAbi,
    client,
  });

export const getDistributorV1Contract = (client: Client, address: Address) =>
  getContract({
    address,
    abi: distributorV1Abi,
    client,
  });

export const getTokenV1Contract = (client: Client, address: Address) =>
  getContract({
    address,
    abi: tokenV1Abi,
    client,
  });
