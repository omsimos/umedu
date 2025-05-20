import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ForumHeader } from "./components/forum-header";
import { MessageForm } from "./components/message-form";

export default async function Forum() {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container">
      <ForumHeader />
      <section className="max-w-3xl mx-auto mt-8">
        <MessageForm />
        <h1>hello, welcome to {session.forumId}</h1>
      </section>
    </div>
  );
}
