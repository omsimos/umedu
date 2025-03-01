import Link from "next/link";

export function Footer() {
  return (
    <footer className="mx-auto pb-8 pt-24 container flex flex-col items-center justify-center text-muted-foreground text-sm">
      <div>
        <span className="font-bold tracking-tighter">
          um<i>edu</i>
        </span>{" "}
        by{" "}
        <Link href="https://www.instagram.com/josh.xfi/" target="_blank">
          @joshxfi
        </Link>
      </div>
    </footer>
  );
}
