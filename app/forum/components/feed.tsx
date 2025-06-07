"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertCircle, Loader2, MessageCircleDashedIcon } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { Post } from "@/db/schema";
import { PostCard } from "./post-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PostsResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export function Feed() {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
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

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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
          <div key={i} className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div>
      {allPosts.length > 0 ? (
        <div className="space-y-4">
          {allPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id} className="block">
              <PostCard key={post.id} post={post} />
            </Link>
          ))}

          <div ref={ref} className="h-10 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading more posts...</span>
              </div>
            )}
          </div>

          {/* Manual load more button as fallback */}
          {hasNextPage && !isFetchingNextPage && (
            <div className="flex justify-center pt-4">
              <Button onClick={() => fetchNextPage()} variant="outline">
                Load More Posts
              </Button>
            </div>
          )}

          {!hasNextPage && allPosts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You&apos;ve reached the end!
              </p>
            </div>
          )}
        </div>
      ) : (
        <Alert>
          <MessageCircleDashedIcon />
          <AlertTitle>No posts yet</AlertTitle>
          <AlertDescription>
            Start the conversation by creating a new post!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
