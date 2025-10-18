import {
  AlertTriangleIcon,
  InfoIcon,
  LogInIcon,
  SchoolIcon,
  ShieldIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Umedu — Login",
};

type Props = {
  searchParams: Promise<{ error: string }>;
};

export default async function Login({ searchParams }: Props) {
  const { session } = await getSession();
  const hasInvalidEmailError = (await searchParams).error === "invalid_email";

  if (session) {
    redirect("/forum");
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <section>
        <Navbar />
        <form className="mx-auto max-w-md">
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
                  <AlertTriangleIcon className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    <div>
                      Invalid email domain. Please use a valid{" "}
                      <span className="font-semibold">.edu email</span> to
                      access this platform.
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert
                  variant="default"
                  className="border-primary/20 bg-primary/10"
                >
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    <div>
                      Sign in with your{" "}
                      <span className="font-semibold">.edu email</span> to
                      access your school&apos;s private forum.
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <SchoolIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be assigned to a private forum based on your
                    educational institution&apos;s email domain.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <ShieldIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    Your email is only used for verification. We don&apos;t
                    store your personal data beyond what&apos;s needed for
                    authentication.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  By signing in, you confirm that you are{" "}
                  <span className="font-semibold">18 years of age</span> or
                  older and you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/guidelines"
                    className="text-primary hover:underline"
                  >
                    Community Guidelines
                  </Link>
                  .
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
                >
                  <LogInIcon className="size-5" />
                  Sign in with Google
                </Link>
              </Button>
            </CardContent>

            <Separator />

            <CardFooter className="flex flex-col space-y-4">
              <p className="text-xs text-muted-foreground/70 italic">
                This platform is not affiliated with any educational
                institution.
              </p>
            </CardFooter>
          </Card>
        </form>
      </section>

      <Footer />
    </div>
  );
}
