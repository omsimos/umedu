import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";

export function ForumNavbar({ forumId }: { forumId?: string }) {
  return (
    <nav className="flex justify-between items-center w-full max-w-xl mx-auto py-6 fixed top-0 left-0 right-0 bg-background container">
      <div className="flex items-center gap-2">
        <Link href="/forum" className="font-bold tracking-tighter">
          um<i>edu</i>
        </Link>
        {forumId && <Badge>{forumId.split(".")[0]}</Badge>}
      </div>

      <ModeToggle />
    </nav>
  );
}
