import { NextRequest } from "next/server";
import { fetchArticles, fetchCategoryBySlug } from "@/src/lib/wp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const per_page = Number(searchParams.get("per_page") ?? "9");
    const page = Number(searchParams.get("page") ?? "1");
    const order = (searchParams.get("order") as "asc" | "desc") || "asc";
    const orderby = searchParams.get("orderby") || "date";
    const categorySlug = searchParams.get("categorySlug");

    let categoryId: number | undefined = undefined;
    if (categorySlug) {
      const cat = await fetchCategoryBySlug(categorySlug);
      categoryId = cat?.id;
      if (!categoryId) {
        return new Response(JSON.stringify({ items: [], hasMore: false }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
    }

    const items = await fetchArticles({ per_page, page, order, orderby, category: categoryId });

    // WordPress returns total via headers, but through server fetch we don't have it here.
    // Heuristic: if we received less than per_page, there are no more pages.
    const hasMore = items.length === per_page;

    return new Response(JSON.stringify({ items, hasMore }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}


