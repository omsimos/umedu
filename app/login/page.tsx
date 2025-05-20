"use client";

import type React from "react";

import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LogInIcon, School, Shield, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";

export default function Login() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const searchParams = useSearchParams();
  const hasInvalidEmailError = searchParams.get("error") === "invalid_email";

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isAgeVerified) {
      e.preventDefault();
      toast.error("Age verification required", {
        description: "You must confirm that you are 18 or older to continue.",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to Umedu
            </CardTitle>
            <CardDescription>
              Connect with your academic community
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {hasInvalidEmailError ? (
              <Alert
                variant="destructive"
                className="border-destructive/20 bg-destructive/10"
              >
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  <div>
                    Invalid email domain. Please use a valid{" "}
                    <span className="font-semibold">.edu email</span> to access
                    this platform.
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert
                variant="default"
                className="border-primary/20 bg-primary/10"
              >
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-foreground">
                  <div>
                    Sign in with your{" "}
                    <span className="font-semibold">.edu email</span> to access
                    your school&apos;s private forum.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <School className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  You&apos;ll be assigned to a private forum based on your
                  educational institution&apos;s email domain.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Your email is only used for verification. We don&apos;t store
                  your personal data beyond what&apos;s needed for
                  authentication.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="age-verification"
                  checked={isAgeVerified}
                  onCheckedChange={(checked) =>
                    setIsAgeVerified(checked === true)
                  }
                />
                <label
                  htmlFor="age-verification"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                >
                  I confirm that I am 18 years of age or older.
                </label>
              </div>

              <p className="text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/guidelines"
                  className="text-primary hover:underline"
                >
                  Community Guidelines.
                </Link>
              </p>
            </div>

            <Button
              className="w-full rounded-full h-[44px] px-4 font-medium text-base"
              variant="outline"
              asChild
            >
              <Link
                href="/auth/google"
                className="flex items-center justify-center gap-2"
                onClick={handleSignInClick}
              >
                <LogInIcon className="size-5" />
                Sign in with Google
              </Link>
            </Button>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col space-y-4">
            <p className="text-xs text-muted-foreground/70 italic">
              This platform is not affiliated with any educational institution.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
