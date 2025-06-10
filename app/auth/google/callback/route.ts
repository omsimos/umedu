import { z } from "zod/v4";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";
import type { OAuth2Tokens } from "arctic";

import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";

import { db } from "@/db";
import { google } from "@/lib/oauth";
import { forumTable } from "@/db/schema";

const claimsSchema = z.object({
  sub: z.string(),
  email: z.email(),
});

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    console.log("Missing code, state, or code verifier");
    return new Response(null, {
      status: 400,
    });
  }
  if (state !== storedState) {
    console.log("State mismatch");
    return new Response(null, {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    console.log("Invalid code or client credentials");
    return new Response(null, {
      status: 400,
    });
  }
  const claims = claimsSchema.safeParse(decodeIdToken(tokens.idToken()));

  if (!claims.success) {
    console.log("Invalid ID token claims");
    return new Response(null, {
      status: 400,
    });
  }

  const email = claims.data.email; // for forum assignment only, this is not stored.

  const isEduEmail =
    email.split("@")[1].includes(".edu") ||
    process.env.WHITELIST?.includes(email); // whitelisted emails are for testing purposes

  if (!isEduEmail) {
    console.log("Invalid email domain");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login?error=invalid_email",
      },
    });
  }

  const forumId = email.split("@")[1];

  const forumExists = await db.query.forumTable.findFirst({
    where: eq(forumTable.id, forumId),
  });

  if (!forumExists) {
    await db.insert(forumTable).values({
      id: forumId,
    });
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, forumId);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/forum",
    },
  });
}
