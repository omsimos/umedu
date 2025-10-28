"use client";

import { useThrottledCallback } from "@tanstack/react-pacer/throttler";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { AlertCircleIcon, MessageCircleDashedIcon } from "lucide-react";
import { useEffect } from "react";
import { HoverPrefetchLink } from "@/components/hover-prefetch-link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
      wait: 3000,
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
      {allPosts.length === 0 && !isFetching && (
        <Alert>
          <MessageCircleDashedIcon />
          <AlertTitle>No posts yet</AlertTitle>
          <AlertDescription>
            Start the conversation by creating a new post!
          </AlertDescription>
        </Alert>
      )}

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
    </div>
  );
}
