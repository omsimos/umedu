import Link from "next/link";

export function Footer() {
  return (
    <footer className="pb-8 flex flex-col items-center text-muted-foreground text-sm">
      <div>
        <span className="font-bold tracking-tighter">
          um<i>edu</i>
        </span>{" "}
        by{" "}
        <Link href="https://github.com/omsimos" target="_blank">
          @omsimos
        </Link>
      </div>
    </footer>
  );
}
