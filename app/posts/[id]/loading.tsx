import { ForumNavbar } from "@/app/forum/components/forum-navbar";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <ForumNavbar />

        {/* Main Content Skeleton */}
        <div>
          {/* Title Skeleton */}
          <div className="mt-24">
            <div className="h-7 bg-muted rounded w-3/4 animate-pulse" />
          </div>

          {/* Date Skeleton */}
          <div className="mt-2">
            <div className="h-4 bg-muted rounded w-48 animate-pulse" />
          </div>

          <Separator className="my-4" />

          {/* Content Skeleton */}
          <div className="prose dark:prose-invert font-medium max-w-none">
            <div className="space-y-4">
              {/* Paragraph skeletons */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-11/12 animate-pulse" />
                <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/5 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
