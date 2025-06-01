import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

export async function ForumHeader() {
  const { session } = await getSession();

  return (
    <nav className="flex justify-between items-center w-full max-w-2xl mx-auto py-6 fixed top-0 left-0 right-0 px-4 bg-background">
      <div className="flex items-center gap-2">
        <Link href="/" className="font-bold tracking-tighter">
          um<i>edu</i>
        </Link>
        <Badge>{session?.forumId.split(".")[0]}</Badge>
      </div>

      <ModeToggle />
    </nav>
  );
}
