import React from "react";
import Link from "next/link";

// /src/app/category/[slug]/page.tsx


const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://wordpress-1518583-5839077.cloudwaysapps.com/wp-json";
const POSTS_ENDPOINT = `${WP_API_URL}/wp/v2/posts`;
const CATEGORIES_ENDPOINT = `${WP_API_URL}/wp/v2/categories`;

async function getCategoryBySlug(slug: string) {
    const res = await fetch(`${CATEGORIES_ENDPOINT}?slug=${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const categories = await res.json();
    return categories[0] || null;
}

async function getPostsByCategory(categoryId: number) {
    const res = await fetch(`${POSTS_ENDPOINT}?categories=${categoryId}&_embed`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
}

type Params = { slug: string };

export default async function CategoryPage({ params }: { params: Params }) {
    const { slug } = params;
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
                <ul className="space-y-6">
                    {posts.map((post: any) => (
                        <li key={post.id} className="border-b pb-4">
                            <Link href={`/post/${post.slug}`}>
                                <a className="text-xl font-semibold hover:underline">{post.title.rendered}</a>
                            </Link>
                            {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                                <img
                                    src={post._embedded["wp:featuredmedia"][0].source_url}
                                    alt={post.title.rendered}
                                    className="my-2 w-full max-w-md"
                                />
                            )}
                            <div
                                className="text-gray-700"
                                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}