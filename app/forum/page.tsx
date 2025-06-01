import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ForumHeader } from "./components/forum-header";
import { PostMessage } from "./components/post-message";
import { HomeIcon, InfoIcon, LogOutIcon, SquareCodeIcon } from "lucide-react";
import Link from "next/link";
import { Feed } from "./components/feed";

export default async function Forum() {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <ForumHeader />

      <section className="max-w-2xl flex flex-col justify-center mt-8 py-24 w-full">
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
        <Link href="/about">
          <LogOutIcon className="size-5" />
        </Link>
      </section>
    </div>
  );
}
