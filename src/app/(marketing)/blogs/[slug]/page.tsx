import { dataBasePrisma } from "@/lib/dbPrisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { siteConfig } from "@/config/seo";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

// Dynamic Metadata Generation
export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params;
    const blog = await dataBasePrisma.blog.findUnique({
        where: { slug },
    });

    if (!blog) {
        return {
            title: "Blog Not Found",
        };
    }

    const title = blog.seoTitle || blog.title;
    const description = blog.seoDesc || blog.excerpt || "Read this amazing blog post to learn more.";
    const imageUrl = blog.thumbnail || siteConfig?.ogImage || "";

    return {
        title: title,
        description: description,
        openGraph: {
            title,
            description,
            url: `${siteConfig?.url || "https://example.com"}/blogs/${slug}`,
            images: [{ url: imageUrl, alt: title }],
            type: "article",
            publishedTime: blog.createdAt.toISOString(),
            modifiedTime: blog.updatedAt.toISOString(),
            authors: ["Author"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export default async function BlogPostPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    const blog = await dataBasePrisma.blog.findUnique({
        where: { slug, isPublished: true },
        include: {
            author: { select: { name: true, email: true } },
        },
    });

    if (!blog) {
        return notFound();
    }

    const defaultThumbnail = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=1200&q=80";

    return (
        <article className="min-h-screen bg-white dark:bg-black pb-24">
            {/* Header / Hero Section */}
            <header className="relative w-full h-[50vh] min-h-[400px] bg-gray-900 border-b border-gray-200 dark:border-zinc-800">
                <Image
                    src={blog.thumbnail || defaultThumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40" />

                <div className="absolute bottom-0 left-0 w-full px-6 pb-12 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        <Link href="/blogs" className="inline-flex items-center text-sm text-gray-300 hover:text-white mb-6 font-medium transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to blogs
                        </Link>

                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {blog.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 leading-tight">
                            {blog.title}
                        </h1>

                        <div className="flex items-center gap-x-6 text-sm text-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-white/20 rounded-full">
                                    <User className="h-4 w-4 text-white" />
                                </div>
                                <span>{blog.author.name || "Admin"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                <time dateTime={blog.createdAt.toISOString()}>
                                    {new Intl.DateTimeFormat('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    }).format(blog.createdAt)}
                                </time>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content Section */}
            <div className="mx-auto max-w-3xl px-6 pt-16 lg:px-8">
                {/* For Tailwind users, standard HTML tags styling is applied here to mimic Prose */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300
                     [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-gray-900 [&>h2]:dark:text-white
                     [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3 [&>h3]:text-gray-900 [&>h3]:dark:text-white
                     [&>p]:mt-0 [&>p]:mb-6 [&>p]:leading-relaxed
                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6
                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                     [&>li]:mb-2
                     [&>blockquote]:border-l-4 [&>blockquote]:border-gray-200 [&>blockquote]:dark:border-zinc-700 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:dark:text-gray-400
                     [&>img]:rounded-xl [&>img]:my-8 [&>img]:w-full [&>img]:shadow-lg
                     [&>a]:text-blue-600 [&>a]:dark:text-blue-400 [&>a]:underline [&>a]:hover:text-blue-500
                    "
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
        </article>
    );
}
