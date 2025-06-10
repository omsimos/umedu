import { Navbar } from "@/components/navbar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Footer } from "@/components/footer";

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <section>
        <Navbar />
        <div className="mx-auto max-w-md">
          <Card className="w-full">
            <CardHeader className="text-center">
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-56 mx-auto" />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Alert skeleton */}
              <div className="border rounded-lg p-4 bg-primary/10 border-primary/20">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* First info section */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                {/* Second info section */}
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>

              {/* Terms text skeleton */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              {/* Sign in button skeleton */}
              <Skeleton className="w-full h-[44px] rounded-full" />
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col space-y-4">
              <Skeleton className="h-3 w-64 mx-auto" />
            </CardFooter>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
