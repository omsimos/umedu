import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { logout } from "@/actions/auth";
import { DockNav } from "@/components/dock-nav";
import { getSession } from "@/lib/auth";
import { ForumNavbar } from "./components/forum-navbar";

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
      <DockNav logout={logout} />
    </section>
  );
}
