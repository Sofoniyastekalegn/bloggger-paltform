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
      <section className="group relative mb-10 overflow-hidden rounded-xl">
        <Image
          src="/blog-information-website-concept-workplace-260nw-1189626925.webp"
          alt="Blog hero"
          width={1600}
          height={600}
          unoptimized
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="h-52 w-full transform object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 sm:h-72 md:h-80 lg:h-96"
          priority
        />
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