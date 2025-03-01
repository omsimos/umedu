import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center mx-auto py-8 container">
      <div className="font-bold tracking-tighter">um<i>edu</i></div>
      <ModeToggle />
    </nav>
  );
}
