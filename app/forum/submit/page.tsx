import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Tag } from "@/db/schema";
import { getBaseUrl } from "@/lib/utils";
import { SubmitForm } from "./components/submit-form";
import { getQueryClient } from "@/lib/get-query-client";

export default async function SubmitPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery<Array<Tag>>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await fetch(`${getBaseUrl()}/api/tags`);
      if (!res.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await res.json();
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubmitForm />
    </HydrationBoundary>
  );
}
