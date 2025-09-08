"use client";

import { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import type { WPArticle } from "@/lib/wp";

type ItemListProps = {
  initialItems: WPArticle[];
  baseLink?: string;
  categorySlug?: string;
  initialPage?: number;
  perPage?: number;
  order?: "asc" | "desc";
  orderby?: string;
};

export default function ItemList({
  initialItems,
  baseLink = "/article",
  categorySlug,
  initialPage = 1,
  perPage = 9,
  order = "asc",
  orderby = "date",
}: ItemListProps) {
  const [items, setItems] = useState<WPArticle[]>(initialItems);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(initialItems.length >= perPage);
  const [loading, setLoading] = useState<boolean>(false);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        per_page: String(perPage),
        page: String(page + 1),
        order,
        orderby,
      });
      if (categorySlug) params.set("categorySlug", categorySlug);
      const res = await fetch(`/api/articles?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      const nextItems: WPArticle[] = data.items ?? [];
      setItems((prev) => [...prev, ...nextItems]);
      setPage((p) => p + 1);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setItems(initialItems);
    setPage(initialPage);
    setHasMore(initialItems.length >= perPage);
  }, [initialItems, initialPage, perPage]);

  return (
    <div>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => (
          <BlogCard key={article.id} article={article} baseLink={baseLink} />
        ))}
      </ul>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}


