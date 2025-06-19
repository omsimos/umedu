import { Post } from "@/db/schema";
import { infiniteQueryOptions, isServer } from "@tanstack/react-query";
import { getBaseUrl } from "./utils";

type PostsResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export function getApiBaseUrl() {
  if (!isServer) {
    return "";
  }

  return getBaseUrl();
}

export const postOptions = infiniteQueryOptions<PostsResponse>({
  queryKey: ["feed"],
  queryFn: async ({ pageParam }) => {
    const url = pageParam
      ? `${getApiBaseUrl()}/api/posts?cursor=${pageParam}`
      : `${getApiBaseUrl()}/api/posts`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  },
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
