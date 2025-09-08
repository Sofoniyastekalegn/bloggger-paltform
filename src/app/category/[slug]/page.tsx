import React from "react";
import ItemList from "@/components/ItemList";

// /src/app/category/[slug]/page.tsx


const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://wordpress-1518583-5839077.cloudwaysapps.com/wp-json";
const RESOURCE = (process.env.NEXT_PUBLIC_WP_RESOURCE || "article").replace(/^\/+|\/+$/g, "");
const POSTS_ENDPOINT = `${WP_API_URL}/wp/v2/${RESOURCE}`;
const CATEGORIES_ENDPOINT = `${WP_API_URL}/wp/v2/categories`;

async function getCategoryBySlug(slug: string) {
    const res = await fetch(`${CATEGORIES_ENDPOINT}?slug=${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const categories = await res.json();
    return categories[0] || null;
}

async function getPostsByCategory(categoryId: number) {
    const res = await fetch(`${POSTS_ENDPOINT}?categories=${categoryId}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [] as WPListPost[];
    return res.json();
}

type Params = { slug: string };

type CategoryPageProps = { params: Promise<Params> };

// Minimal shape for list rendering from WP API
type WPListPost = {
    id: number;
    slug: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    _embedded?: {
        [key: string]: unknown;
        "wp:featuredmedia"?: Array<{ source_url?: string }>;
    };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return <div className="container mx-auto p-4">Category not found.</div>;
    }

    const posts = await getPostsByCategory(category.id);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Category: {category.name}</h1>
            {posts.length === 0 ? (
                <p>No posts found in this category.</p>
            ) : (
                <ItemList initialItems={posts as any} baseLink="/article" categorySlug={category.slug} order="asc" orderby="date" perPage={9} />
            )}
        </div>
    );
}