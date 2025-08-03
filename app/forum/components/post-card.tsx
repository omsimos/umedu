import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { CalendarIcon } from "lucide-react";

import { Post, Tag } from "@/db/schema";
import { formatDate, truncateContent } from "@/lib/utils";
import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  post: Post & { tags: Tag[] };
};

export function PostCard({ post }: Props) {
  return (
    <Card className="min-h-[200px] w-full justify-between overflow-hidden">
      <CardContent>
        <CardTitle className="mb-2 leading-tight truncate">
          {post.title}
        </CardTitle>
        <div className="min-w-0 break-words dark:prose-invert text-muted-foreground font-medium">
          <Markdown remarkPlugins={[remarkGfm]}>
            {truncateContent(post.content).replace(/\s+/g, " ")}
          </Markdown>
        </div>

        <div className="space-x-2 mt-4">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>

      </CardContent>

      <div className="space-y-6">
        <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
        <CardFooter className="text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Posted {formatDate(post.createdAt)}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
