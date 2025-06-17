/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AlertCircle, MessageCircleDashedIcon } from "lucide-react";
import { useThrottledCallback } from "@tanstack/react-pacer/throttler";

import type { Post } from "@/db/schema";
import { PostCard } from "./components/post-card";
import { PostCardSkeleton } from "./components/post-card-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PostsResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export default function ForumPage() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery<PostsResponse>({
    queryKey: ["posts"],
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

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 220,
    gap: 10,
    paddingEnd: 100,
  });

  const handleNextPage = useThrottledCallback(
    () => {
      fetchNextPage();
    },
    {
      wait: 3000,
    },
  );

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

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
    fetchNextPage,
    allPosts.length,
    isFetchingNextPage,
    handleNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (error) {
    return (
      <div className="w-full mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load posts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[700px] w-full overflow-auto">
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
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allPosts.length - 1;
          const post = allPosts[virtualRow.index];

          return (
            <div
              key={virtualRow.index}
              className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
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
                <Link
                  href={`/posts/${post.id}`}
                  key={post.id}
                  className="block"
                >
                  <PostCard key={post.id} post={post} />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
