"use client";

import { formatDate } from "@/lib/utils";

export function PostDate({ createdAt }: { createdAt: Date }) {
  return (
    <p className="text-muted-foreground text-sm mt-2">
      Posted at {formatDate(createdAt)}
    </p>
  );
}
