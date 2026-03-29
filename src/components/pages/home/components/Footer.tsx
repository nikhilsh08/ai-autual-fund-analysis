'use client';

interface FooterColumn {
  heading: string;
  links: string[];
}

interface FooterProps {
  columns: FooterColumn[];
}

export default function Footer({ columns }: FooterProps) {
  return (
    <footer className="bg-ink" style={{ padding: '56px 0 80px' }}>
      <div className="max-w-[1080px] mx-auto px-5 md:px-7">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-9 mb-11">
          {/* Brand column */}
          <div>
            <div className="font-serif text-base font-bold text-cream/80 mb-3">
              cashflow<em className="text-cream/[.35] italic font-light">crew</em>
            </div>
            <p className="text-xs text-cream/[.38] leading-[1.7] max-w-[210px]">
              India's new-age personal finance education platform. risk-first frameworks. plain english.
              no hidden agenda.
            </p>
            <div className="font-serif text-[11px] italic text-cream/20 mt-3">
              version 1.0 — co-built with our community 🙏
            </div>
          </div>

          {/* Link columns */}
          {columns.map(({ heading, links }) => (
            <div key={heading}>
              <div className="text-[9px] tracking-[.12em] uppercase text-cream/[.26] mb-3.5">
                {heading}
              </div>
              {links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-xs text-cream/40 mb-2 hover:text-cream/60 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="py-4 border-t border-cream/[.07] text-[10px] text-cream/20 leading-[1.7]">
          <strong className="text-cream/30">disclaimer:</strong> all content is strictly for educational
          purposes only and should not be construed as investment advice. cashflowcrew and its founder
          are not SEBI-registered investment advisors. please consult a SEBI-registered advisor before
          making investment decisions.
        </div>

        {/* Copyright */}
        <div className="mt-4 text-[10px] text-cream/20">
          © 2026 cashflowcrew. all rights reserved.
        </div>
      </div>
    </footer>
  );
}
