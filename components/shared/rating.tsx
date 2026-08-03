import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, className, size = 16 }: { value: number; className?: string; size?: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.4;
  return (
    <div className={cn("flex items-center gap-0.5 text-amber-400", className)} aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />;
        if (i === full && hasHalf)
          return <StarHalf key={i} style={{ width: size, height: size }} fill="currentColor" strokeWidth={0} />;
        return <Star key={i} style={{ width: size, height: size }} className="opacity-30" />;
      })}
    </div>
  );
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="transition-transform hover:scale-110"
          aria-label={`${i + 1} star`}
        >
          <Star
            className={i < value ? "text-amber-400" : "text-muted-foreground/40"}
            fill={i < value ? "currentColor" : "none"}
            size={24}
          />
        </button>
      ))}
    </div>
  );
}