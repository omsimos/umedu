import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import { format, fromUnixTime } from "date-fns";

import { Post } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import { ForumNavbar } from "../components/forum-navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Umedu — Private Forum",
  robots: {
    index: false,
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <ForumNavbar forumId={post.forumId} />
        <h2 className="text-lg mt-24 font-semibold">{post.title}</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Posted at{" "}
          {format(fromUnixTime(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </p>
        <Separator className="my-4" />

        <div className="prose dark:prose-invert font-medium">
          <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>
      </div>

      <Footer />
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
