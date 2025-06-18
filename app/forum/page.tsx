import {
  dehydrate,
  HydrationBoundary,
  infiniteQueryOptions,
} from "@tanstack/react-query";
import { Feed } from "./components/feed";
import { getQueryClient } from "@/lib/get-query-client";

const postOptions = infiniteQueryOptions({
  queryKey: ["feed"],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `${process.env.APP_URL}/api/posts?cursor=${pageParam}`
      : `${process.env.APP_URL}/api/posts`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

export default async function ForumPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(postOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Feed />
    </HydrationBoundary>
  );
}
