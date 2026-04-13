'use client';

interface NavbarProps {
  links: string[];
  scrolled: boolean;
}

export default function Navbar({ links, scrolled }: NavbarProps) {
  return (
    <nav
      className={`
        sticky top-0 z-[100] bg-cream/[.96] backdrop-blur-2xl border-b border-border
        transition-[padding] duration-[250ms]
        ${scrolled ? 'py-2.5' : 'py-4'}
      `}
    >
      <div className="max-w-[1080px] mx-auto px-7 md:px-7 flex items-center justify-between">
        {/* Logo */}
        <span className="font-serif text-[17px] font-bold text-ink">
          cashflow<em className="text-accent font-light italic">crew</em>
        </span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="px-3.5 py-[7px] text-[13px] text-ink-secondary hover:text-ink transition-colors"
            >
              {link}
            </a>
          ))}
          <a
            href="https://cashflowcrew.trainercentralsite.in/clientapp/login"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 inline-flex items-center gap-2 px-5 py-[9px] rounded-pill text-xs font-medium bg-black text-white hover:bg-neutral-800 hover:-translate-y-px transition-all"
          >
            login
          </a>
          <a
            href="#courses"
            className="ml-2 inline-flex items-center gap-2 px-5 py-[9px] rounded-pill text-xs font-medium bg-ink text-cream hover:-translate-y-px transition-transform"
          >
            explore courses →
          </a>
        </div>
      </div>
    </nav>
  );
}
