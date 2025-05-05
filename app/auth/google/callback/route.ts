import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { type } from "arktype";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import { decodeIdToken } from "arctic";

import type { OAuth2Tokens } from "arctic";

const Claims = type({
  sub: "string",
  email: "string",
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
    // Invalid code or client credentials
    console.log("Invalid code or client credentials");
    return new Response(null, {
      status: 400,
    });
  }
  const claims = Claims(decodeIdToken(tokens.idToken()));

  let email = "";

  if (claims instanceof type.errors) {
    console.log(claims.summary);
  } else {
    email = claims.email;
  }

  const isEduEmail = email.split("@")[1].includes(".edu");

  if (!isEduEmail) {
    console.log("Invalid email domain");
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login?error=invalid_email",
      },
    });
  }

  const channelId = email.split("@")[1].split(".")[0];

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, channelId);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
