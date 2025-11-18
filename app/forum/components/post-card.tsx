import { CalendarIcon, Clock3Icon, MessageCircleIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post, Tag } from "@/db/schema";
import { formatDate, truncateContent } from "@/lib/utils";

type Props = {
  post: Post & { tags: Tag[] };
};

export function PostCard({ post }: Props) {
  const sanitizedContent = truncateContent(post.content).replace(/\s+/g, " ");
  const wordCount = post.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 180));
  const showGradient = sanitizedContent.length > 180;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border bg-card/80 shadow-sm transition hover:border-zinc-500/40 hover:shadow-md pb-0">
      <CardHeader className="gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary/80">
          <MessageCircleIcon className="h-3.5 w-3.5" />
          Anonymous post
        </div>
        <CardTitle className="text-base font-semibold leading-snug text-foreground line-clamp-2">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="relative">
          <div className="min-w-0 rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>{sanitizedContent}</Markdown>
          </div>
          {showGradient && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-background via-background/30 to-transparent opacity-95 transition group-hover:opacity-60" />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="border border-transparent bg-secondary/70 text-secondary-foreground/80 transition group-hover:border-primary/30"
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-4 border-t bg-muted/30 px-6 py-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5 text-primary/70" />
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock3Icon className="h-3.5 w-3.5 text-primary/70" />
          <span>{readingTime} min read</span>
        </div>
      </CardFooter>
    </Card>
  );
}
