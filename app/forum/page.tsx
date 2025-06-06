import Link from "next/link";
import { redirect } from "next/navigation";
import { HomeIcon, InfoIcon, SquareCodeIcon } from "lucide-react";

import { getSession } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { Feed } from "./components/feed";
import { PostMessage } from "./components/post-message";
import { LogoutButton } from "./components/logout-button";
import { ForumNavbar } from "./components/forum-navbar";

export default async function Forum() {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center">
      <ForumNavbar forumId={session.forumId} />

      <section className="flex flex-col justify-center w-full">
        <Feed />
      </section>

      <section className="rounded-t-4xl bg-secondary w-full p-4 max-w-2xl mx-auto flex items-center justify-evenly fixed bottom-0 right-0 left-0">
        <Link href="/">
          <HomeIcon className="size-5" />
        </Link>
        <Link href="/about">
          <InfoIcon className="size-5" />
        </Link>
        <PostMessage />
        <Link href="https://github.com/joshxfi/umedu" target="_blank">
          <SquareCodeIcon className="size-5" />
        </Link>
        <form action={logout}>
          <LogoutButton />
        </form>
      </section>
    </div>
  );
}
