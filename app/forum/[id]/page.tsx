import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import { format, fromUnixTime } from "date-fns";

import { Post } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import { ForumNavbar } from "../components/forum-navbar";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="w-full mx-auto p-4">
      <ForumNavbar forumId={post.forumId} />
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Posted at{" "}
        {format(fromUnixTime(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
      </p>
      <Separator className="my-4" />

      <div className="prose dark:prose-invert font-medium">
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </div>
    </div>
  );
}

async function getPost(id: string): Promise<Post> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/posts/${id}`,
    {
      cache: "force-cache",
      next: {
        tags: [`post-${id}`],
      },
    },
  );

  if (!res.ok) notFound();

  return res.json();
}
