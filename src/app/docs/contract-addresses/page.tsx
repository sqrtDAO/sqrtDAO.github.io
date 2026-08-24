import type { Metadata } from "next";
import { sepolia } from "wagmi/chains";
import { zeroAddress } from "viem";
import AddressTag from "@/components/AddressTag/AddressTag";
import { Code, H2, P } from "@/components/Docs/prose";
import { getAddresses, type ContractAddresses } from "@/contracts/contract-addresses";
import { docMetadata } from "../metadata";

export const metadata: Metadata = docMetadata(
  "/docs/contract-addresses/",
  "Contract addresses",
  "Deployed sqrtDAO v1 contract addresses per network: FactoryV1, root token, emission curves, hooks and factories. Sepolia testnet is live; Base coming soon.",
);

type AddressRow = {
  key: keyof ContractAddresses;
  name: string;
  description: string;
};

const ADDRESS_ROWS: AddressRow[] = [
  { key: "factoryV1", name: "FactoryV1", description: "Main entry point — creates tokens, pools and distributions" },
  { key: "rootToken", name: "Root token", description: "sqrtDAO's own token" },
  { key: "tokenFactory", name: "TokenV1Factory", description: "Deploys new ERC20 tokens" },
  { key: "distributorFactory", name: "DistributionV1Factory", description: "Deploys DistributorV1 instances" },
  { key: "fixedEmission", name: "FixedEmission", description: "Emission curve — constant reward per epoch" },
  { key: "linearEmission", name: "LinearEmission", description: "Emission curve — base + slope per epoch" },
  { key: "exponentialEmission", name: "ExponentialEmission", description: "Emission curve — growth or decay per epoch" },
  { key: "transferToHook", name: "TransferToHook", description: "Hook forwarding its share to a recipient (used for the protocol fee)" },
  { key: "buyAndBurnHook", name: "BuyAndBurnHookV3", description: "Hook swapping its share and burning the proceeds" },
];

const AddressTable = ({ chainId }: { chainId: number }) => {
  const addresses = getAddresses(chainId);
  return (
    <div className="mt-4 overflow-x-auto rounded-l border border-subtle">
      <table className="w-full min-w-[560px] border-collapse text-body">
        <thead>
          <tr className="bg-raised text-left">
            <th className="px-4 py-3 text-label font-medium uppercase tracking-wider text-tertiary">Contract</th>
            <th className="px-4 py-3 text-label font-medium uppercase tracking-wider text-tertiary">Address</th>
          </tr>
        </thead>
        <tbody>
          {ADDRESS_ROWS.map((row) => {
            const address = addresses[row.key];
            const deployed = address !== zeroAddress;
            return (
              <tr key={row.key} className="border-t border-subtle">
                <td className="px-4 py-3 align-top">
                  <span className="font-medium text-primary">{row.name}</span>
                  <span className="mt-0.5 block text-caption text-tertiary">{row.description}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  {deployed ? (
                    <AddressTag value={address} />
                  ) : (
                    <span className="text-caption italic text-disabled">Not deployed yet</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default function Page() {
  return (
    <>
      <h1 className="font-display text-h2 font-bold text-primary sm:text-h1">Contract addresses</h1>
      <P>
        Addresses below are loaded straight from{" "}
        <Code>
          src/contracts/contract-addresses.ts
        </Code>{" "}
        — the same source of truth the app itself uses. Click any address to copy it.
      </P>

      <H2 id="sepolia">Sepolia (testnet)</H2>
      <P>The full v1 stack is deployed and usable on Sepolia.</P>
      <AddressTable chainId={sepolia.id} />

      <H2 id="base">Base</H2>
      <P>Contracts are not deployed on Base yet. This page will update once mainnet deployment happens.</P>

      <H2 id="local">Local development (Anvil)</H2>
      <P>
        For local development against Anvil, addresses live in{" "}
        <Code>
          contract-addresses.ts
        </Code>{" "}
        too, but they rotate on every fresh deploy — always redeploy and re-sync rather than
        hardcoding them anywhere.
      </P>
    </>
  );
}
