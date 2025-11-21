import { eq } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ForumNavbar } from "@/app/forum/components/forum-navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 180));

  return (
    <div className="flex min-h-screen flex-col">
      <ForumNavbar
        forumId={post.forumId}
        renderButtons={() => <ShareButton title={post.title} />}
      />
      <main className="mt-24 flex flex-1 flex-col gap-6 pb-16">
        <Link href="/forum">
          <ArrowLeftIcon className="text-zinc-600 hover:opacity-65 transition-opacity  z-50" />
        </Link>
        <Card className="relative overflow-hidden border bg-linear-to-br from-primary/5 via-background to-background shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(161,98,7,0.12),transparent_45%)] opacity-80" />
          <CardHeader className="relative space-y-4">
            <Badge
              variant="secondary"
              className="w-fit text-xs uppercase tracking-wide"
            >
              Anonymous thread
            </Badge>
            <CardTitle className="text-2xl font-semibold leading-tight sm:text-3xl">
              {post.title}
            </CardTitle>
            <CardDescription className="flex flex-wrap gap-2 text-sm">
              {post.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-secondary/70 text-secondary-foreground/80"
                >
                  {tag.name}
                </Badge>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative flex flex-wrap gap-3 text-sm text-muted-foreground">
            <PostDate createdAt={post.createdAt} />
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium">
              {wordCount.toLocaleString()} words
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium">
              {readingTime} min read
            </span>
          </CardContent>
        </Card>

        <section className="rounded-3xl border bg-card/80 p-6 shadow-sm">
          <div className="prose prose-neutral max-w-none text-base leading-relaxed dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
          </div>
        </section>

        <Separator className="my-4" />
      </main>

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
