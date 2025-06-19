import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Feed } from "./components/feed";
import { postOptions } from "@/lib/post-options";
import { getQueryClient } from "@/lib/get-query-client";

export default async function ForumPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(postOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Feed />
    </HydrationBoundary>
  );
}
