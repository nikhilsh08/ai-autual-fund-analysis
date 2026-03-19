import Link from "next/link";
import Image from "next/image";
import { CalendarDays, User } from "lucide-react";

interface BlogCardProps {
    blog: {
        title: string;
        slug: string;
        excerpt: string | null;
        thumbnail: string | null;
        createdAt: Date;
        author: {
            name: string | null;
            email: string;
        };
        tags: string[];
    };
}

export default function BlogCard({ blog }: BlogCardProps) {
    const defaultThumbnail = "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&q=80";

    return (
        <article className="group relative flex flex-col items-start justify-between rounded-2xl bg-card p-4 shadow-sm transition-all hover:shadow-md border border-border">
            <Link href={`/blogs/${blog.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View Blog Post</span>
            </Link>

            <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9] bg-cream-dark">
                {/* Standard next/image with a fallback generic thumbnail if none provided */}
                <Image
                    src={blog.thumbnail || defaultThumbnail}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between mt-4">
                <div>
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 z-20 relative">
                            {blog.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h3 className="mt-2 text-lg font-semibold leading-6 text-ink group-hover:text-accent line-clamp-2">
                        {blog.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-ink-secondary line-clamp-3">
                        {blog.excerpt || "Read more about this topic in the full article."}
                    </p>
                </div>

                <div className="relative mt-6 flex items-center gap-x-4">
                    <div className="text-sm leading-6 flex items-center gap-4 text-ink-muted">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="font-semibold text-ink">
                                {blog.author.name || "Admin"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CalendarDays className="h-4 w-4" />
                            <time dateTime={blog.createdAt.toISOString()}>
                                {new Intl.DateTimeFormat('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                }).format(blog.createdAt)}
                            </time>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
