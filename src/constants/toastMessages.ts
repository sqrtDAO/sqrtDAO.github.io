export type ToastType = "success" | "error" | "info" | "pending";

export type ToastMessageKey =
  | "wallet.connected"
  | "wallet.disconnected"
  | "wallet.connectFailed"
  | "network.switched"
  | "network.wrong"
  | "network.switchFailed"
  | "deploy.pending"
  | "deploy.success"
  | "deploy.failed"
  | "deploy.rejected"
  | "launch.pending"
  | "launch.success"
  | "launch.failed"
  | "launch.rejected"
  | "approve.pending"
  | "approve.success"
  | "approve.failed"
  | "approve.rejected"
  | "participate.pending"
  | "participate.success"
  | "participate.multiSuccess"
  | "participate.failed"
  | "participate.rejected"
  | "participate.epochClosed"
  | "participate.ended"
  | "claim.pending"
  | "claim.success"
  | "claim.failed"
  | "claim.rejected"
  | "claim.tooEarly"
  | "claim.nothing"
  | "copy.link"
  | "copy.address"
  | "copy.txhash"
  | "reminder.success"
  | "reminder.failed"
  | "share.failed"
  | "data.loadFailed"
  | "session.expired"
  | "generic.error";

type ToastMessageDef = { type: ToastType; copy: string };

// copy may contain {placeholders} filled in via formatToastCopy at call time.
// Source: sqrtDAO Toast / System Message System doc (2026-08-25).
export const TOAST_MESSAGES: Record<ToastMessageKey, ToastMessageDef> = {
  "wallet.connected": { type: "success", copy: "Wallet connected" },
  "wallet.disconnected": { type: "info", copy: "Wallet disconnected" },
  "wallet.connectFailed": { type: "error", copy: "Couldn't connect your wallet. Try again." },

  "network.switched": { type: "success", copy: "Switched to {chain}" },
  "network.wrong": { type: "error", copy: "Wrong network — switch to {chain} to continue." },
  "network.switchFailed": { type: "error", copy: "Couldn't switch network. Try from your wallet." },

  "deploy.pending": { type: "pending", copy: "Deploying your token…" },
  "deploy.success": { type: "success", copy: "Token created — {symbol} is live on-chain." },
  "deploy.failed": { type: "error", copy: "Token creation didn't go through. Please try again." },
  "deploy.rejected": { type: "info", copy: "Deployment cancelled." },

  "launch.pending": { type: "pending", copy: "Launching your distribution…" },
  "launch.success": { type: "success", copy: "Your distribution is live." },
  "launch.failed": { type: "error", copy: "Launch didn't go through. Please try again." },
  "launch.rejected": { type: "info", copy: "Launch cancelled. You can launch when ready." },

  "approve.pending": { type: "pending", copy: "Approving {asset}…" },
  "approve.success": { type: "success", copy: "{asset} approved. You can participate now." },
  "approve.failed": { type: "error", copy: "Approval didn't go through. Please try again." },
  "approve.rejected": { type: "info", copy: "Approval cancelled." },

  "participate.pending": { type: "pending", copy: "Joining epoch {epoch}…" },
  "participate.success": {
    type: "success",
    copy: "You're in epoch {epoch}. It settles at close — same price for everyone.",
  },
  "participate.multiSuccess": { type: "success", copy: "You're in {n} epochs, from {first} to {last}." },
  "participate.failed": { type: "error", copy: "Your participation didn't go through. Please try again." },
  "participate.rejected": { type: "info", copy: "Participation cancelled. You can try again when ready." },
  "participate.epochClosed": {
    type: "error",
    copy: "Epoch {epoch} closed before this landed. Review the next epoch and try again.",
  },
  "participate.ended": {
    type: "error",
    copy: "This distribution has finished — your participation didn't go through.",
  },

  "claim.pending": { type: "pending", copy: "Claiming your {symbol}…" },
  "claim.success": { type: "success", copy: "Claimed — {amount} {symbol} is in your wallet." },
  "claim.failed": { type: "error", copy: "Claim didn't go through. Please try again." },
  "claim.rejected": { type: "info", copy: "Claim cancelled. Your tokens stay claimable." },
  "claim.tooEarly": { type: "error", copy: "Not claimable yet — available after {date}." },
  "claim.nothing": { type: "info", copy: "You have nothing to claim here." },

  "copy.link": { type: "success", copy: "Link copied" },
  "copy.address": { type: "success", copy: "Address copied" },
  "copy.txhash": { type: "success", copy: "Transaction hash copied" },
  "reminder.success": {
    type: "success",
    copy: "Reminder downloaded — open it to add the claim date to your calendar.",
  },
  "reminder.failed": { type: "error", copy: "Couldn't create the reminder. Note the date: {date} UTC." },
  "share.failed": { type: "error", copy: "Couldn't open share. Link copied instead." },

  "data.loadFailed": { type: "error", copy: "Couldn't load this right now. Retry." },
  "session.expired": { type: "info", copy: "Your session refreshed. Please try that again." },
  "generic.error": { type: "error", copy: "Something went wrong. Please try again." },
};
