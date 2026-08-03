"use client";

import { motion, useInView } from "framer-motion";
import * as React from "react";

interface RevealProps {
  children?: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  once = true,
  duration = 0.6,
  className,
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}