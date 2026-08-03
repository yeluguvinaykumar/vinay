"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I book a property viewing?",
    a: "Open any property page and click “Book a Viewing”. Pick a date and time slot, and our agent will confirm your visit by email within a few hours.",
  },
  {
    q: "Can I get a mortgage estimate?",
    a: "Yes! Every property page includes a mortgage calculator. Enter your down payment, interest rate and term to see an instant monthly estimate.",
  },
  {
    q: "Do you help first-time buyers?",
    a: "Absolutely — it's our specialty. Our agents guide you through budgeting, pre-approval, neighbourhood research, negotiation and closing.",
  },
  {
    q: "Are the listings verified?",
    a: "All VINAY listings are verified by our team. We confirm ownership, pricing and availability before publishing any property.",
  },
  {
    q: "How are rent payments handled?",
    a: "Rental agreements are managed directly between landlord and tenant. VINAY provides verified listings and can connect you with property managers.",
  },
  {
    q: "What documents do I need to make an offer?",
    a: "Typically a photo ID, proof of funds or pre-approval letter. Your agent will walk you through the exact requirements for your city.",
  },
  {
    q: "Can I list my property with VINAY?",
    a: "Yes. Contact us and our team will prepare professional photos, write compelling descriptions and market your property across our platform.",
  },
  {
    q: "What areas do you cover?",
    a: "We operate in 25+ cities across the United States including San Francisco, New York, Chicago, Austin and Seattle.",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={cn(
              "overflow-hidden rounded-2xl border bg-card transition-shadow",
              isOpen && "shadow-navy border-primary/30"
            )}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 font-display text-base font-bold md:text-lg">{f.q}</span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180 text-primary")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="px-6 pb-5 pl-[76px] text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}