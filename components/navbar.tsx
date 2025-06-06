import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center py-6">
      <Link href="/" className="font-bold tracking-tighter">
        um<i>edu</i>
      </Link>
      <ModeToggle />
    </nav>
  );
}
