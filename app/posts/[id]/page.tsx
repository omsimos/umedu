import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";

import { Post } from "@/db/schema";
import { Footer } from "@/components/footer";
import { formatUnixDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ForumNavbar } from "@/app/forum/components/forum-navbar";
import { ShareButton } from "./components/share-button";

export const metadata: Metadata = {
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
        <ForumNavbar
          forumId={post.forumId}
          renderButtons={() => <ShareButton title={post.title} />}
        />
        <div>
          <div>
            <h2 className="text-lg mt-24 font-semibold">{post.title}</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Posted at {formatUnixDate(post.createdAt)}
            </p>
          </div>
        </div>

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
  const res = await fetch(`${process.env.APP_URL}/api/posts/${id}`, {
    cache: "force-cache",
    next: {
      tags: [`post-${id}`],
    },
  });

  if (!res.ok) notFound();

  return res.json();
}
