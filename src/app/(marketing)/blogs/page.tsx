import { dataBasePrisma } from "@/lib/dbPrisma";
import BlogCard from "@/components/templates/blogs/BlogCard";
import { Metadata } from "next";
import { siteConfig } from "@/config/seo";

export const metadata: Metadata = {
    title: "Insightful Blogs | Wealth Generation & Mutual Funds",
    description: "Read our latest articles on mutual funds, market trends, and strategies for wealth building.",
    openGraph: {
        title: "Insightful Blogs | Wealth Generation & Mutual Funds",
        description: "Read our latest articles on mutual funds, market trends, and strategies for wealth building.",
        url: `${siteConfig?.url || "https://example.com"}/blogs`,
        images: [{ url: siteConfig?.ogImage || "", width: 1200, height: 630, alt: "Our Blog" }],
        type: "website",
    },
};

// Next.js config for caching since data changes somewhat frequently for blogs
export const revalidate = 3600; // Revalidate every hour

export default async function BlogsPage() {
    const blogs = await dataBasePrisma.blog.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: {
            author: { select: { name: true, email: true } },
        },
    });

    return (
        <div className="bg-white dark:bg-black py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                        Our Latest Articles
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-zinc-400">
                        Expert insights to help you navigate mutual funds, personal finance, and long-term wealth building.
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {blogs.length === 0 ? (
                        <div className="col-span-full pt-12 pb-24 text-center text-gray-500">
                            No articles found. Please check back later!
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <BlogCard key={blog.id} blog={blog} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
