# sqrtDAO webapp

## Analytics

Microsoft Clarity is consent-gated. The public project ID lives in
`src/utils/clarity.ts` as the default, so no build configuration is required:

```ts
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "zagww469ze";
```

`NEXT_PUBLIC_CLARITY_PROJECT_ID` is an optional override for previews or a
different Clarity project — not a secret.
Enable `localhost` and `127.0.0.1` in Clarity → Settings → Setup to test locally.

Custom events and tags are emitted from `src/utils/clarity.ts`; the consent banner is
`src/components/ConsentBanner/ConsentBanner.tsx`.
