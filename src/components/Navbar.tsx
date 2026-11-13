import {useState} from 'react';
import {Menu, Phone, X} from 'lucide-react';
import {RESTAURANT_INFO} from '../data/restaurant';

const NAV_LINKS = [
  {label: 'About', href: '#about'},
  {label: 'Specials', href: '#specials'},
  {label: 'Menu', href: '#menu'},
  {label: 'Gallery', href: '#gallery'},
  {label: 'Visit', href: '#visit'},
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#D4A853]/15 bg-[#120B0B]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-xl font-semibold tracking-tight text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-200 hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853] sm:text-2xl"
        >
          {RESTAURANT_INFO.name}
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm font-medium text-[#D6CBC3] whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#E8C67A] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#D4A853] after:transition-all after:duration-200 hover:after:w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4A853]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action (Click-to-Call) + Mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={RESTAURANT_INFO.phoneHref}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-[#9B1B20] px-4 py-2 text-xs font-semibold text-[#FAF6F0] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B22228] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 text-[#E8C67A]" aria-hidden="true" />
            <span className="hidden sm:inline">{RESTAURANT_INFO.phoneDisplay}</span>
            <span className="sm:hidden">Call Now</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-[#D4A853]/25 text-[#FAF6F0] transition-colors duration-150 hover:border-[#D4A853]/60 hover:text-[#E8C67A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A853] md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#D4A853]/15 bg-[#160D0D] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-base font-medium text-[#EDE4DC] transition-colors duration-150 hover:bg-[#9B1B20]/20 hover:text-[#E8C67A]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
