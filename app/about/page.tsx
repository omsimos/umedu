import Link from "next/link";
import { GitPullRequestArrowIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <section>
        <Navbar />

        <div className="space-y-12">
          <Alert className="mt-4">
            <GitPullRequestArrowIcon className="h-4 w-4" />
            <AlertDescription>
              <p>
                This platform is fully open-source. View source code on{" "}
                <Link
                  href="https://github.com/joshxfi/umedu"
                  target="_blank"
                  className="underline"
                >
                  GitHub.
                </Link>
              </p>
            </AlertDescription>
          </Alert>

          <div>
            <h2 className="font-semibold border-b pb-2 text-3xl tracking-tight">
              About the platform
            </h2>
            <p className="leading-7 mt-4 text-muted-foreground">
              Umedu is a social platform that automatically creates private
              forums for students based on their <i>.edu</i> email address. For
              example, if you authenticate with an email like{" "}
              <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                hello@myschool.edu.ph
              </code>
              , you’ll be able to access the{" "}
              <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                myschool
              </code>{" "}
              private forum.
            </p>
          </div>

          <div>
            <h2 className="font-semibold border-b pb-2 text-3xl tracking-tight">
              Anonymity and privacy
            </h2>
            <p className="leading-7 mt-4 text-muted-foreground">
              To protect the privacy of our users,{" "}
              <strong>
                we do not store your email address or any personal information.
              </strong>{" "}
              Authenticating with your school email simply creates a session in
              your browser that grants access to a private forum based on your{" "}
              <i>.edu</i> email domain.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
