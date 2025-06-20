import { Metadata } from "next";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";

import { Post } from "@/db/schema";
import { Footer } from "@/components/footer";
import { PostDate } from "./components/post-date";
import { Separator } from "@/components/ui/separator";
import { ShareButton } from "./components/share-button";
import { getBaseUrl, truncateContent } from "@/lib/utils";
import { ForumNavbar } from "@/app/forum/components/forum-navbar";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  const title = `Umedu – ${post.title}`;
  const description = truncateContent(post.content, 160);

  return {
    metadataBase: new URL(`https://umedu.omsimos.com/posts/${id}`),
    title: `Umedu | ${post.title}`,
    description: truncateContent(post.content),
    openGraph: {
      type: "website",
      siteName: "Umedu",
      url: `https://umedu.omsimos.com/posts/${id}`,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: false,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="mb-8">
        <ForumNavbar
          forumId={post.forumId}
          renderButtons={() => <ShareButton title={post.title} />}
        />
        <div>
          <div>
            <h2 className="text-lg mt-24 font-semibold">{post.title}</h2>
            <PostDate createdAt={post.createdAt} />
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
  const res = await fetch(`${getBaseUrl()}/api/posts/${id}`, {
    cache: "force-cache",
    next: {
      tags: [`post-${id}`],
    },
  });

  if (!res.ok) notFound();

  return res.json();
}
