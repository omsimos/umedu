"use client";

import { CalendarIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function PostDate({ createdAt }: { createdAt: Date }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
      <CalendarIcon className="h-3.5 w-3.5" />
      {formatDate(createdAt)}
    </span>
  );
}
