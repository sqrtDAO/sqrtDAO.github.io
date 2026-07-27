import { zeroAddress } from "viem";

export const EMPTY_PERMIT2 = {
  permit: {
    deadline: BigInt(0),
    nonce: BigInt(0),
    permitted: { token: zeroAddress, amount: BigInt(0) },
  },
  signature: "0x",
} as const;
