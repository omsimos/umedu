"use client";

import { useThrottledCallback } from "@tanstack/react-pacer/throttler";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  AlertCircleIcon,
  MessageCircleDashedIcon,
  MessageCirclePlusIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import DecryptedText from "@/components/DecryptedText";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import ShinyText from "@/components/ShinyText";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { Separator } from "@/components/ui/separator";
import type { Post, Tag } from "@/db/schema";
import { PostCard } from "./components/post-card";
import { PostCardSkeleton } from "./components/post-card-skeleton";

type PostsResponse = {
  posts: (Post & { tags: Tag[] })[];
  nextCursor: string | null;
};

export default function FeedPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<PostsResponse>({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }) => {
      const url = pageParam ? `/api/posts?cursor=${pageParam}` : "/api/posts";

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    estimateSize: () => 200,
    paddingEnd: 100,
    overscan: 6,
  });

  const handleNextPage = useThrottledCallback(
    () => {
      fetchNextPage();
    },
    {
      wait: 2000,
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: virtualizer.getVirtualItems is stable
  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index >= allPosts.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      handleNextPage();
    }
  }, [
    hasNextPage,
    allPosts.length,
    isFetchingNextPage,
    handleNextPage,
    virtualizer.getVirtualItems(),
  ]);

  const items = virtualizer.getVirtualItems();

  if (error) {
    return (
      <div className="w-full mx-auto">
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto space-y-3">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <ProgressiveBlur position="bottom" height="20%" className="fixed" />
      <div>
        <div className="relative overflow-hidden rounded-t-3xl border-b-0 border bg-linear-to-br from-primary/5 via-background to-transparent p-6 shadow-sm dark:from-zinc-900 dark:via-zinc-900/70 dark:to-background">
          <div className="space-y-3">
            <Badge variant="outline">
              <ShinyText text="📚 Private forum" duration={3} />
            </Badge>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                usls.edu.ph
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Your campus peers are reading in real time. Share honest wins,
                worries, or random shower thoughts.
              </p>
            </div>
          </div>
        </div>

        <Card className="relative overflow-hidden border-dashed bg-card/80 shadow-none rounded-t-none">
          <CardHeader className="gap-2">
            <CardTitle className="text-2xl">
              Share it anonymously in seconds.
            </CardTitle>
            <ShinyText
              text="Real students. Instant support. Zero judgment."
              className="text-base font-medium"
            />
          </CardHeader>

          <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheckIcon className="size-4 text-emerald-500" />
              <DecryptedText
                text="Identity protection is always on."
                animateOn="both"
                className="cursor-crosshair"
              />
            </p>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/forum/submit">
                Craft a post
                <MessageCirclePlusIcon className="size-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {allPosts.length === 0 && !isFetching && (
        <Alert>
          <MessageCircleDashedIcon />
          <AlertTitle>No posts just yet</AlertTitle>
          <AlertDescription className="gap-2">
            <p>
              Your note could be the first spark - drop a question or story.
            </p>
            <Button asChild size="sm">
              <Link href="/forum/submit">Start the conversation</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Separator className="my-8" />

      <section id="latest-discussions" aria-live="polite" className="space-y-4">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Latest discussions
        </p>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {items.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allPosts.length - 1;
            const post = allPosts[virtualRow.index];

            if (!isLoaderRow && !post) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    <PostCardSkeleton />
                  ) : (
                    <div className="text-center mt-4 text-muted-foreground">
                      Nothing more to load
                    </div>
                  )
                ) : (
                  <HoverPrefetchLink
                    href={`/posts/${post.id}`}
                    key={post.id}
                    className="block mb-3"
                  >
                    <PostCard key={post.id} post={post} />
                  </HoverPrefetchLink>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
