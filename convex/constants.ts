import { Doc } from "./_generated/dataModel";

export const DURATIONS = {
  POST_EXPIRATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;

export const POST_STATUS: Record<string, Doc<"posts">["status"]> =
  {
    VALID: "valid",
    EXPIRED: "expired",
  } as const;