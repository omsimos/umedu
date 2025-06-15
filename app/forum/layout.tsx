import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  HomeIcon,
  InfoIcon,
  MessageCirclePlusIcon,
  SquareCodeIcon,
} from "lucide-react";

import { logout } from "@/actions/auth";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ForumNavbar } from "./components/forum-navbar";
import { LogoutButton } from "./components/logout-button";

export const metadata: Metadata = {
  title: "Umedu — Private Forum",
  robots: {
    index: false,
  },
};

export default async function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <section className="flex flex-col items-center mt-24">
      <ForumNavbar forumId={session.forumId} />

      {children}

      <section className="rounded-t-4xl bg-secondary w-full p-4 max-w-xl mx-auto flex items-center justify-evenly fixed bottom-0 right-0 left-0">
        <Link href="/">
          <HomeIcon className="size-5" />
        </Link>
        <Link href="/about">
          <InfoIcon className="size-5" />
        </Link>
        <Button asChild size="icon">
          <Link href="/forum/submit">
            <MessageCirclePlusIcon className="size-6" />
          </Link>
        </Button>
        <Link href="https://github.com/joshxfi/umedu" target="_blank">
          <SquareCodeIcon className="size-5" />
        </Link>
        <form action={logout}>
          <LogoutButton />
        </form>
      </section>
    </section>
  );
}
