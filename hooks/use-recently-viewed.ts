"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  coverImage: string | null;
  city: string;
  viewedAt: number;
}

const KEY = "vinay:recently-viewed";
const MAX = 8;

export function useRecentlyViewed() {
  const [items, setItems] = useLocalStorage<RecentlyViewedItem[]>(KEY, []);

  const add = useCallback(
    (item: Omit<RecentlyViewedItem, "viewedAt">) => {
      setItems((prev) => [
        { ...item, viewedAt: Date.now() },
        ...prev.filter((i) => i.id !== item.id),
      ].slice(0, MAX));
    },
    [setItems]
  );

  const clear = useCallback(() => setItems([]), [setItems]);

  return { items, add, clear };
}

/** Client-safe hook for property pages: records a view after mount. */
export function useTrackRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt"> | null) {
  const { add } = useRecentlyViewed();
  useEffect(() => {
    if (item) add(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);
  return add;
}