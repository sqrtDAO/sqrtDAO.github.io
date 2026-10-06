import Alert from "@/components/Alert/Alert";

// Figma 12057:114449 — participation review dialog, imported (non-sqrtDAO) tokens only.
const ImportedTokenAlert = () => (
  <Alert
    tone="live"
    title="Imported token"
    description="This token was created outside sqrtDAO and imported to distribute. Everything about the distribution is enforced by our protocol. But the token contract itself is the founder's. Worth a look before you join."
  />
);

export default ImportedTokenAlert;
