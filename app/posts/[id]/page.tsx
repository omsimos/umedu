import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ForumNavbar } from "@/app/forum/components/forum-navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { postTable } from "@/db/schema";
import { safeDecrypt, truncateContent } from "@/lib/utils";
import { PostDate } from "./components/post-date";
import { ShareButton } from "./components/share-button";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  const title = `Umedu – ${post?.title}`;
  const description = truncateContent(post?.content ?? "", 160);

  return {
    metadataBase: new URL(`https://umedu.omsimos.com/posts/${id}`),
    title: `Umedu | ${post?.title}`,
    description: truncateContent(post?.content ?? ""),
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

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="mb-8">
        <ForumNavbar
          forumId={post.forumId}
          renderButtons={() => <ShareButton title={post.title} />}
        />
        <div className="space-y-2">
          <h2 className="text-lg mt-24 font-semibold">{post.title}</h2>

          <div className="space-x-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>

          <PostDate createdAt={post.createdAt} />
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

async function getPost(id: string) {
  const post = await unstable_cache(
    async () =>
      db.query.postTable.findFirst({
        where: eq(postTable.id, id),
        with: {
          tagsToPosts: {
            with: {
              tag: true,
            },
          },
        },
      }),
    [id],
    {
      tags: [`post:${id}`],
      revalidate: 120,
    },
  )();

  if (!post) {
    return null;
  }

  const { tagsToPosts, ...rest } = post;

  const title = await safeDecrypt(rest.title);
  const content = await safeDecrypt(rest.content);

  return {
    ...rest,
    title,
    content,
    tags: tagsToPosts.map((t) => t.tag),
  };
}
