'use client';

import FadeIn from './FadeIn';

interface BlogArticle {
  id: string;
  tag?: string;
  date: string;
  readTime: string;
  category: string;
  title: string;
  subtitle: string;
  slug?: string;
  thumbnail?: string;
  author?: string;
  content?: string;
}

interface BlogSectionProps {
  articles: BlogArticle[];
  onArticleClick?: (article: BlogArticle) => void;
}

export default function BlogSectionServer({
  articles,
  onArticleClick,
}: BlogSectionProps) {
  const [featured, ...rest] = articles;

  return (
    <section
      id="blog"
      className="bg-card border-t border-border"
      style={{ padding: 'clamp(56px,7vw,96px) 0' }}
    >
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        {/* Heading */}
        <FadeIn>
          <div className="text-[11px] tracking-[.14em] uppercase text-ink-muted flex items-center gap-2.5 mb-4">
            <span className="w-[18px] h-px bg-ink-muted shrink-0" />
            free samples — a taste of what bundle members get
          </div>
          <h2
            className="font-serif font-black tracking-tighter leading-[1.05] text-ink mb-2.5"
            style={{ fontSize: 'clamp(26px,5vw,52px)' }}
          >
            what I wish someone had told me. <em className="font-light italic">I'm telling you.</em>
          </h2>
          <p className="text-sm text-ink-secondary font-light mb-8">
            Bundle members get content like this — and deeper — every two weeks. Here are a few pieces to start.
          </p>
        </FadeIn>

        {articles.length > 0 ? (
          <>
            {/* Featured article */}
            <FadeIn>
              <div
                onClick={() => onArticleClick?.(featured)}
                className="cursor-pointer bg-cream border border-border rounded-[18px] p-7 px-6 mb-6 hover:border-accent/30 transition-colors"
              >
                {featured.tag && (
                  <span className="text-[9px] font-bold px-2.5 py-[3px] rounded-pill bg-orange-700/[.12] text-orange-700 uppercase">
                    {featured.tag}
                  </span>
                )}
                <span className="text-[11px] text-ink-muted ml-2.5">
                  {featured.date} · {featured.readTime}
                </span>
                <h3
                  className="font-serif font-black text-ink leading-[1.15] mt-3 mb-2"
                  style={{ fontSize: 'clamp(22px,3.5vw,30px)' }}
                >
                  {featured.title}
                </h3>
                <div className="text-[15px] text-ink-secondary leading-[1.65] max-w-[600px] line-clamp-2 "
                dangerouslySetInnerHTML={{ __html: featured.content || "" }}
                >
                 
                </div>
                <div className="mt-4 text-[13px] text-accent font-semibold">read this →</div>
              </div>
            </FadeIn>

            {/* Grid of remaining articles */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {rest.map((a, i) => (
              <FadeIn key={a.id} delay={i * 0.05}>
                <div
                  onClick={() => onArticleClick?.(a)}
                  className="cursor-pointer bg-cream border border-border rounded-2xl p-[22px] px-5 h-full flex flex-col hover:border-accent/30 transition-colors"
                >
                  <div className="text-[10px] text-ink-muted uppercase mb-2">
                    {a.category}
                    {a.tag && (
                      <span className="ml-2 text-[9px] font-bold px-2 py-[2px] rounded-pill bg-accent/[.12] text-accent">
                        {a.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-base font-bold text-ink leading-[1.25] mb-2">{a.title}</h3>
                  <p className="text-[13px] text-ink-muted leading-[1.6] flex-1 mb-3.5 line-clamp-1"
                  dangerouslySetInnerHTML={{ __html: a.subtitle || "" }}
                  ></p>
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="text-[11px] text-ink-muted">{a.date}</span>
                    <span className="text-[11px] text-accent font-semibold">read →</span>
                  </div>
                </div>
              </FadeIn>
            ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-ink-secondary">No articles available.</p>
        )}
      </div>
    </section>
  );
}
