import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/contracts/abis.ts",
  plugins: [
    foundry({
      project: "../contracts",
      forge: { build: false },
      include: [
        "BuyAndBurnHookV3.sol/**",
        "DistributorV1.sol/**",
        "ExponentialEmission.sol/**",
        "FactoryV1.sol/**",
        "FixedEmission.sol/**",
        "LinearEmission.sol/**",
        "TokenV1.sol/**",
        "TransferToHook.sol/**",
        "DistributionV1Factory.sol/**",
        "TokenV1Factory.sol/**",
      ],
    }),
    react(),
  ],
});
