import Link from "next/link";
import { AntennaIcon, GitPullRequestArrowIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  return (
    <div className="container mx-auto flex items-center flex-col">
      <h1 className="font-extrabold tracking-tighter text-8xl">
        um<i>edu</i>
      </h1>
      <p className="text-muted-foreground font-medium">
        open-source, anonymous, private <i>edu</i> forums
      </p>

      <Button className="mt-4" variant="outline">
        Access your private channel <AntennaIcon />
      </Button>

      <section className="max-w-lg text-left mt-24 w-full space-y-12">
        <div>
          <h2 className="font-semibold border-b pb-2 text-3xl tracking-tight">
            About the platform
          </h2>
          <p className="leading-7 mt-4 text-muted-foreground">
            Umedu is a social platform that automatically creates encrypted and
            private channels for students based on their <i>edu</i> email. For
            example, if you authenticate with an email of{" "}
            <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              hello@myschool.edu.ph
            </code>{" "}
            you will be able to access the{" "}
            <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
              myschool
            </code>{" "}
            channel.
          </p>
        </div>

        <div>
          <h2 className="font-semibold border-b pb-2 text-3xl tracking-tight">
            Anonymity and privacy
          </h2>
          <p className="leading-7 mt-4 text-muted-foreground">
            In order to protect the privacy of our users,{" "}
            <strong>
              we do not store your email or any personal information.
            </strong>{" "}
            Authenticating with your school email allows the platform to create
            a session for your browser to access a private channel based on your{" "}
            <i>edu</i> email.
          </p>
        </div>

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
      </section>
    </div>
  );
}
