import { Card, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { Post } from "@/db/schema";
import { format, fromUnixTime } from "date-fns";
import { Calendar } from "lucide-react";

type Props = {
  post: Post;
};

export function PostCard({ post }: Props) {
  const formatDate = (date: number) => {
    return format(fromUnixTime(date), "MMM d, yyyy 'at' h:mm a");
  };

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-2 leading-tight">{post.title}</CardTitle>
        <div className="prose prose-sm min-w-0 break-words text-muted-foreground">
          <p className="leading-relaxed">{truncateContent(post.content)}</p>
        </div>
      </CardContent>
      <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Posted {formatDate(post.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
