import Link from "next/link";
import { getSession } from "@/lib/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

export async function ForumHeader() {
  const { session } = await getSession();

  return (
    <nav className="flex justify-between items-center mx-auto py-8 container">
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
