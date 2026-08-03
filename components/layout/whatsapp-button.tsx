"use client";

import * as React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton({ number }: { number: string }) {
  const [show, setShow] = React.useState(false);

  if (!number) return null;

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-[60] transition-all duration-300 ${
          show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <div className="w-72 rounded-2xl border bg-card p-4 shadow-2xl">
          <div className="mb-3 flex items-center gap-3">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
              alt="VINAY support"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="text-sm font-bold">VINAY Support</p>
              <p className="text-xs text-emerald-500">Online now</p>
            </div>
          </div>
          <p className="mb-3 rounded-xl rounded-tl-none bg-muted p-3 text-sm">Hi there! 👋 How can we help you find your dream property today?</p>
          <a
            href={`https://wa.me/${number}?text=Hi%20VINAY!%20I%27m%20interested%20in%20your%20properties.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
          >
            <MessageCircle className="h-4 w-4" /> Start Chat
          </a>
        </div>
      </div>

      <button
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Close WhatsApp chat" : "Open WhatsApp chat"}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 hover:bg-emerald-600"
      >
        {show ? (
          <span className="text-2xl leading-none">×</span>
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </button>
    </>
  );
}