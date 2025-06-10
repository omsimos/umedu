import Link from "next/link";

export function Footer() {
  return (
    <footer className="pb-8 flex flex-col items-center text-muted-foreground text-sm">
      <div>
        <span className="font-bold tracking-tighter">
          um<i>edu</i>
        </span>{" "}
        by{" "}
        <Link href="https://www.instagram.com/josh.xfi/" target="_blank">
          @josh.xfi
        </Link>
      </div>
    </footer>
  );
}
