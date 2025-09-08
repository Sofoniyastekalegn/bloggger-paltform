import Image from "next/image";
import Link from "next/link";
import { fetchArticles, fetchCategories } from "../lib/wp";
import ItemList from "@/components/ItemList";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [articles, categories] = await Promise.all([
    fetchArticles({ per_page: 9, order: "asc", orderby: "date" }),
    fetchCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative mb-10 overflow-hidden rounded-xl">
        <Image
          src="/globe.svg"
          alt="Hero"
          width={1600}
          height={600}
          className="h-52 w-full object-cover sm:h-72 md:h-80 lg:h-96"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl">Latest Articles</h1>
        </div>
      </section>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-3 text-sm">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="rounded-full border px-3 py-1 hover:bg-gray-50">
              {c.name}
            </Link>
          ))}
        </nav>
      </header>

      <ItemList initialItems={articles} baseLink="/article" order="asc" orderby="date" perPage={9} />
    </div>
  );
}