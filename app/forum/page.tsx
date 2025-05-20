import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ForumHeader } from "./components/forum-header";

export default async function Forum() {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <ForumHeader />
      <h1>hello, welcome to {session.forumId}</h1>
    </div>
  );
}
