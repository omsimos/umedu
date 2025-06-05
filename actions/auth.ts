"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { deleteSessionTokenCookie, invalidateSession } from "@/lib/session";

export async function logout() {
  const { session } = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  await invalidateSession(session.id);
  deleteSessionTokenCookie();
  return redirect("/login");
}
