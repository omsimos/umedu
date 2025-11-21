import { GitPullRequestArrowIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { DockNav } from "@/components/dock-nav";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Umedu — About",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between pb-16">
      <section>
        <Navbar />
        <DockNav logout={logout} />

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
              <strong>
                No user accounts, no personal data, and no emails are ever
                stored.
              </strong>{" "}
              Umedu does not keep any user tables or identity information in our
              database.
              <br />
              <br />
              When you log in with your <i>.edu</i> email, we use it only to
              determine your school’s private forum—specifically, we extract the
              domain (for example,{" "}
              <code className="rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                myschool.edu.ph
              </code>
              ) to assign you to the right forum.{" "}
              <strong>
                Even in your session, only the forum ID is stored—never your
                email address itself.
              </strong>
              <br />
              <br />
              This approach ensures there’s no trace of your personal
              information or identity anywhere in our system, providing true
              privacy by design.
            </p>
          </div>

          <div>
            <h2 className="font-semibold border-b pb-2 text-3xl tracking-tight">
              Security and encryption
            </h2>
            <p className="leading-7 mt-4 text-muted-foreground">
              For your peace of mind, all post titles and content on Umedu are
              encrypted using the industry-standard{" "}
              <span className="font-semibold">AES-GCM</span> (Advanced
              Encryption Standard in Galois/Counter Mode) algorithm before they
              are stored. This means that even if someone were to access the
              database directly, your posts would remain completely unreadable
              without the secure encryption key.
              <br />
              <br />
              <span className="font-semibold">
                What does this mean for you?
              </span>{" "}
              Only authorized actions on the platform can decrypt and display
              your posts. We do not store decryption keys alongside your data,
              and your content is protected both at rest and in transit.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
