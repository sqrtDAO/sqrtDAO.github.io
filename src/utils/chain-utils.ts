import { anvil, base, baseSepolia, sepolia } from "viem/chains";

export const chainToName = (chainId: number): string => {
  switch (chainId) {
    case sepolia.id:
      return sepolia.name;
    case base.id:
      return base.name;
    case anvil.id:
      return anvil.name;
    case baseSepolia.id:
      return baseSepolia.name;
    default:
      return "unknown";
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case sepolia.id:
      return true;
    case base.id:
      return false;
    case anvil.id:
      return true;
    case baseSepolia.id:
      return true;
    default:
      throw "invalid chain";
  }
};
