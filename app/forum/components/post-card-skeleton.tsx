import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <Card className="h-[200px] w-full justify-between">
      <CardContent>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </CardContent>

      <div className="space-y-6">
        <div className="h-px bg-gradient-to-r from-transparent via-muted to-transparent" />
        <CardFooter className="text-xs">
          <div className="flex items-center gap-1">
            <Skeleton className="w-3.5 h-3.5 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
