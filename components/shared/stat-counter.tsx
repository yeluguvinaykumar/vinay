"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { useCountUp } from "@/hooks/use-count-up";

export function StatCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2200,
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(value, duration, inView);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}