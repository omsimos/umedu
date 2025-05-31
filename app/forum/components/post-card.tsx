import { Post } from "@/db/schema";
import { Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  post: Post;
}

export function PostCard({ post }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold leading-tight">
            {post.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {truncateContent(post.content)}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(post.createdAt ?? "")}</span>
          </div>
          {post.updatedAt !== post.createdAt && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>Updated {formatDate(post.updatedAt ?? "")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
