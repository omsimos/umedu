import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ForumNavbar } from "./components/forum-navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }
  return (
    <div className="py-24">
      <ForumNavbar />
      {children}
    </div>
  );
}
