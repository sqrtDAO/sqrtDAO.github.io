import { Address, Client, getContract } from "viem";
import { getAddresses } from "./contract-addresses";
import {
  distributorV1Abi,
  distributionV1FactoryAbi,
  ethParticipationRouterAbi,
  factoryV1Abi,
  tokenV1Abi,
  weth9Abi,
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

export const getEthParticipationRouterContract = (client: Client) =>
  getContract({
    address: getAddresses(client.chain!.id).ethParticipationRouter,
    abi: ethParticipationRouterAbi,
    client,
  });

export const getWethContract = (client: Client) =>
  getContract({
    address: getAddresses(client.chain!.id).weth,
    abi: weth9Abi,
    client,
  });
