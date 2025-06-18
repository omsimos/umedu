"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { reset: resetQuery } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleReset = () => {
    reset();
    resetQuery();
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangleIcon className="h-6 w-6 text-destructive" />
        </div>
        <CardTitle className="text-xl font-semibold">
          Something went wrong!
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We encountered an unexpected error. Please try again or contact
          support if the problem persists.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.env.NODE_ENV === "development" && (
          <Alert variant="destructive">
            <AlertDescription className="text-sm font-mono">
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <Button onClick={handleReset} className="w-full">
            <RefreshCwIcon />
            Try again
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go to homepage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
