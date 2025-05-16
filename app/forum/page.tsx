import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Forum() {
  const { session } = await getSession();

  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <h1>hello, welcome to {session.forumId}</h1>
    </div>
  );
}
