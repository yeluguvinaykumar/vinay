import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PhoneCall } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/site";

export async function HomeCta() {
  const site = await getSiteSettings();

  return (
    <section className="section-pad">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80"
            alt="Modern luxury home"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="hero-gradient absolute inset-0 opacity-95" />
          <div className="relative flex flex-col items-center gap-6 px-6 py-20 text-center text-white md:py-28">
            <h2 className="heading-display max-w-2xl text-3xl font-bold md:text-5xl">
              Ready to Find Your <span className="text-gradient-gold italic">Dream Property</span>?
            </h2>
            <p className="max-w-xl text-slate-300">
              Our expert agents will help you every step of the way — from first viewing to final signature.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="gold" className="gap-2 px-8">
                  Get in Touch <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href={`tel:${site.phone}`}>
                <Button size="lg" variant="white" className="gap-2 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20">
                  <PhoneCall className="h-4 w-4" /> {site.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}