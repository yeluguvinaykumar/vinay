import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="hero-gradient flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center text-white">
      <Compass className="mb-8 h-20 w-20 animate-spin text-amber-400" style={{ animationDuration: "8s" }} />
      <p className="font-display text-[7rem] font-black leading-none text-white/15 md:text-[10rem]">404</p>
      <h1 className="heading-display -mt-10 text-3xl font-bold md:text-5xl">Page Not Found</h1>
      <p className="mt-4 max-w-md text-slate-300">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get you back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/">
          <Button variant="gold" size="lg" className="gap-2">
            <Home className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
        <Link href="/properties">
          <Button
            variant="white"
            size="lg"
            className="gap-2 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            Browse Properties
          </Button>
        </Link>
      </div>
    </div>
  );
}