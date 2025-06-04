import Link from "next/link";
import { HomeIcon, InfoIcon, LogOutIcon, SquareCodeIcon } from "lucide-react";

import { Feed } from "./components/feed";
import { PostMessage } from "./components/post-message";

export default async function Forum() {
  return (
    <div className="flex flex-col items-center">
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
        <Link href="/about">
          <LogOutIcon className="size-5" />
        </Link>
      </section>
    </div>
  );
}
