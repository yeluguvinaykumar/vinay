"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroSearchBar } from "@/components/shared/hero-search-bar";

export function HomeHero() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <section ref={ref} className="hero-gradient relative min-h-[92vh] overflow-hidden pt-32 pb-20">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 -z-0">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80"
          alt="Luxury home at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1739]/70 via-[#0b1739]/40 to-background" />
      </motion.div>

      <div className="container-site relative z-10 flex min-h-[70vh] flex-col items-center justify-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-300 backdrop-blur-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          Premium Real Estate Since 2008
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="heading-display max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl"
        >
          Find Your <span className="text-gradient-gold italic">Dream</span> Property
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-lg text-slate-300 md:text-xl"
        >
          Discover premium apartments, villas, and commercial properties — handpicked for a lifetime of comfort.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/properties">
            <Button size="lg" variant="gold" className="gap-2 px-8">
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              size="lg"
              variant="white"
              className="gap-2 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <PhoneCall className="h-4 w-4" /> Contact Us
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 w-full max-w-4xl"
        >
          <HeroSearchBar />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-14 flex flex-col items-center gap-1 text-white/70"
        >
          <span className="text-xs uppercase tracking-[0.25em]">Scroll to explore</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}