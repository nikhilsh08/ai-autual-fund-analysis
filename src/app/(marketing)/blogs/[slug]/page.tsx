import { dataBasePrisma } from "@/lib/dbPrisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import { siteConfig } from "@/config/seo";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

// Helper function to estimate read time
function getReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

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

    const readTime = getReadTime(blog.content);
    const category = blog.tags && blog.tags.length > 0 ? blog.tags[0].toUpperCase() : "INSIGHTS";

    return (
        <article className="min-h-screen bg-cream">
            {/* Header */}
            <div className="pt-28 pb-8 px-5 md:px-7">
                <div className="max-w-[720px] mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/blogs"
                        className="inline-flex items-center text-sm text-ink-muted hover:text-accent transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        back to blogs
                    </Link>

                    {/* Category & Read Time */}
                    <div className="flex items-center gap-2 text-[11px] tracking-[.08em] text-ink-muted uppercase mb-6">
                        <span>{category}</span>
                        <span>·</span>
                        <span>{readTime} min read</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-serif font-black text-ink text-[clamp(32px,5vw,52px)] leading-[1.02] tracking-tighter mb-6">
                        {blog.title}
                    </h1>

                    {/* Excerpt/Subtitle */}
                    {blog.excerpt && (
                        <p className="text-[clamp(18px,2.5vw,22px)] text-ink-secondary font-light italic leading-relaxed mb-8">
                            {blog.excerpt}
                        </p>
                    )}

                    {/* Author & Date */}
                    <div className="flex items-center gap-4 text-sm text-ink-muted pb-8 border-b border-border">
                        <span className="font-medium text-ink">{blog.author.name || "CashFlowCrew"}</span>
                        <span>·</span>
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

            {/* Featured Image */}
            {blog.thumbnail && (
                <div className="max-w-[900px] mx-auto px-5 md:px-7 mb-12">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border shadow-lg">
                        <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 900px"
                        />
                    </div>
                </div>
            )}

            {/* Content Section */}
            <div className="max-w-[720px] mx-auto px-5 md:px-7 pb-20">
                <div
                    className="
                        text-[clamp(16px,1.8vw,18px)] text-ink-body leading-[1.85] font-light

                        [&>h1]:font-serif [&>h1]:font-black [&>h1]:text-[clamp(28px,4vw,42px)] [&>h1]:text-ink [&>h1]:mt-14 [&>h1]:mb-5 [&>h1]:leading-[1.02] [&>h1]:tracking-tighter
                        [&>h2]:font-serif [&>h2]:font-black [&>h2]:text-[clamp(24px,3vw,32px)] [&>h2]:text-ink [&>h2]:mt-14 [&>h2]:mb-5 [&>h2]:leading-[1.02] [&>h2]:tracking-tighter
                        [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-[clamp(20px,2.5vw,26px)] [&>h3]:text-ink [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:leading-tight [&>h3]:tracking-tight
                        [&>h4]:font-medium [&>h4]:text-lg [&>h4]:text-ink [&>h4]:mt-8 [&>h4]:mb-3

                        [&>p]:mb-6
                        [&_strong]:font-medium [&_strong]:text-ink
                        [&_em]:italic

                        [&>ul]:list-none [&>ul]:pl-0 [&>ul]:mb-6 [&>ul]:space-y-3
                        [&>ul>li]:relative [&>ul>li]:pl-6
                        [&>ul>li]:before:content-['→'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-accent [&>ul>li]:before:font-medium

                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:space-y-2
                        [&>ol>li]:pl-2

                        [&>blockquote]:my-10 [&>blockquote]:py-8 [&>blockquote]:px-8 [&>blockquote]:bg-cream-dark [&>blockquote]:border-l-4 [&>blockquote]:border-accent [&>blockquote]:rounded-r-xl
                        [&>blockquote]:text-[clamp(18px,2vw,22px)] [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:text-ink [&>blockquote]:leading-relaxed
                        [&_blockquote_p]:mb-0

                        [&_img]:block [&_img]:mx-auto [&_img]:rounded-xl [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto [&_img]:border [&_img]:border-border [&_img]:shadow-md

                        [&>figure]:my-10 [&>figure]:mx-0
                        [&_figure]:my-10 [&_figure]:mx-0
                        [&_figure_img]:mb-3
                        [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-ink-muted [&_figcaption]:mt-3 [&_figcaption]:italic

                        [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-accent/30 hover:[&_a]:decoration-accent

                        [&>hr]:my-12 [&>hr]:border-border

                        [&>pre]:bg-ink [&>pre]:text-cream [&>pre]:p-6 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:my-8 [&>pre]:text-sm
                        [&_code]:bg-cream-dark [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                        [&>pre_code]:bg-transparent [&>pre_code]:p-0

                        [&>div]:my-6
                        [&_table]:w-full [&_table]:my-8 [&_table]:border-collapse [&_table]:text-sm
                        [&_th]:bg-cream-dark [&_th]:border [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-medium [&_th]:text-ink
                        [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-3

                        [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-8 [&_iframe]:border [&_iframe]:border-border
                    "
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* Bottom CTA */}
                <div className="mt-16 pt-10 border-t border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <p className="text-ink-muted text-sm mb-1">enjoyed this article?</p>
                            <p className="text-ink font-medium">explore more insights on building wealth.</p>
                        </div>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-ink text-cream hover:-translate-y-0.5 transition-transform"
                        >
                            read more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-10 flex flex-wrap gap-2">
                        {blog.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 text-xs font-medium text-ink-secondary bg-cream-dark rounded-full border border-border"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
