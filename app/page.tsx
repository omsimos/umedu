import { MessageSquareTextIcon } from "lucide-react";
import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import { FlatMap } from "@/components/flat-map";
import { Footer } from "@/components/footer";
import { HighlightText } from "@/components/highlight-text";
import LightRays from "@/components/LightRays";
import { Navbar } from "@/components/navbar";
import ShinyText from "@/components/ShinyText";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={1}
        lightSpread={0.5}
        fadeDistance={1}
        rayLength={5}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0}
        className="custom-rays absolute inset-0 -z-10 opacity-40"
      />
      <section>
        <Navbar />
        <div className="flex items-center flex-col">
          <h1 className="font-extrabold tracking-tighter text-8xl">
            um<i>edu</i>
          </h1>
          <p className="text-muted-foreground font-medium text-center">
            open-source, anonymous,
            <DecryptedText
              text=" encrypted"
              animateOn="both"
              className="cursor-crosshair"
            />
            , private <i>edu</i> forums
          </p>

          <Button asChild className="mt-4" variant="outline">
            <Link href="/login">
              <ShinyText text="✨ Access your private forum" duration={3} />
              <MessageSquareTextIcon className="text-muted-foreground/50" />
            </Link>
          </Button>

          <div className="leading-7 text-center mt-16 text-muted-foreground">
            Fully{" "}
            <HighlightText>
              <Link className="hover:text-primary transition-all" href="/about">
                anonymous
              </Link>
            </HighlightText>{" "}
            and{" "}
            <HighlightText>
              <Link
                className="hover:text-primary transition-all"
                href="https://github.com/joshxfi/umedu"
                target="_blank"
              >
                open-source
              </Link>
            </HighlightText>
            platform for students to connect with their peers based on their{" "}
            <HighlightText>
              <Link className="hover:text-primary transition-all" href="/login">
                .edu
              </Link>
            </HighlightText>
            email. No personal information is stored, ensuring your privacy is
            protected.{" "}
            <Link
              href="/about"
              className="text-white  gap-1 group inline-flex hover:text-muted-foreground transition-all"
            >
              Learn more{" "}
              <span className="group-hover:translate-x-1.5 m transition-transform">
                {" "}
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>
      <div className="w-1/2 absolute left-0 right-0 mx-auto bottom-20 -z-10">
        <FlatMap />
      </div>
      <Footer />
    </div>
  );
}
