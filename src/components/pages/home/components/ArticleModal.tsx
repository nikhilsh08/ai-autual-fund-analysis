'use client';

interface Article {
  id: string;
  tag?: string;
  date: string;
  readTime: string;
  category: string;
  title: string;
  subtitle: string;
  content?: string;
}

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  if (!article) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-lg overflow-y-auto flex justify-center px-5 py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-[20px] max-w-[680px] w-full relative self-start border border-border"
        style={{ padding: "clamp(24px,5vw,48px)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream-dark border-none text-ink-secondary text-lg cursor-pointer flex items-center justify-center hover:bg-cream-darkest transition-colors"
        >
          ×
        </button>

        {/* Meta */}
        <p className="text-[10px] tracking-[.12em] uppercase text-ink-muted mb-2">
          {article.category} · {article?.readTime} read
        </p>

        {/* Title */}
        <h2
          className="font-serif font-black text-ink tracking-tighter leading-[1.1] mb-2.5"
          style={{ fontSize: "clamp(22px,4vw,34px)" }}
        >
          {article.title}
        </h2>
        <hr className="border-none border-t border-border mb-6" />

        {/* Body */}
        <div className="text-base text-ink-body leading-[1.9] font-light [&>p]:mb-4 [&>strong]:font-medium [&>strong]:text-ink">
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
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />
        </div>
      </div>
    </div>
  );
}
