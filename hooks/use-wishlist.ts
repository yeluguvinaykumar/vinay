"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const KEY = "vinay:wishlist";

export function useWishlist() {
  const [ids, setIds, loaded] = useLocalStorage<string[]>(KEY, []);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    },
    [setIds]
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const count = ids.length;

  return { ids, toggle, has, count, loaded };
}