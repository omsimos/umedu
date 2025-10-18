import { cookies } from "next/headers";
import { cache } from "react";
import { type SessionValidationResult, validateSessionToken } from "./session";

export const getSession = cache(async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return { session: null };
  }
  const result = await validateSessionToken(token);
  return result;
});
