"use client";

import Image from "next/image";
import Link from "next/link";
import { WPArticle } from "@/lib/wp";
import { getAuthor, getFeaturedImage } from "@/lib/wp";

type BlogCardProps = {
  article: WPArticle;
  baseLink?: string;
};

export default function BlogCard({ article, baseLink = "/article" }: BlogCardProps) {
  const img = getFeaturedImage(article);
  const author = getAuthor(article);
  const href = `${baseLink}/${article.slug}`;
  return (
    <li className="group rounded-xl border p-4 transition-shadow hover:shadow-lg">
      {img.url ? (
        <Link href={href} className="mb-3 block overflow-hidden rounded-lg">
          <Image
            src={img.url}
            alt={img.alt}
            width={600}
            height={400}
            className="h-40 w-full transform rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      ) : null}
      <h2 className="mb-2 text-lg font-semibold">
        <Link href={href} className="hover:underline">
          <span dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
        </Link>
      </h2>
      <p className="mb-1 text-xs text-gray-500">{new Date(article.date).toLocaleDateString()}</p>
      <p className="mb-3 text-sm text-gray-600">{author ? `By ${author.name}` : null}</p>
      <Link href={href} className="inline-block text-sm text-blue-600 hover:underline">
        Read more
      </Link>
    </li>
  );
}


