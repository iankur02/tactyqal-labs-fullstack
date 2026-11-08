import { Link } from 'react-router-dom';
import { Linkedin, ArrowUpRight } from 'lucide-react';
import { BRAND, FOOTER } from '@/constants/content';
import Container from '@/components/ui/Container';

export default function Footer() {
  return (
    <footer className="border-t border-brand-950/10 bg-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-brand-950">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-950 text-white">
              <span className="font-display text-lg leading-none">T</span>
            </span>
            {BRAND.name}
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-brand-950/60">{FOOTER.description}</p>
          <a
            href="https://www.linkedin.com/company/tactyqal-labs/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            <Linkedin className="h-4 w-4" /> Follow on LinkedIn
          </a>
        </div>

        {FOOTER.columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-950/50">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-950/70 hover:text-brand-600"
                    >
                      {link.label} <ArrowUpRight className="h-3 w-3" />
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm text-brand-950/70 hover:text-brand-600">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <div className="border-t border-brand-950/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-950/50 sm:flex-row">
          <span>{FOOTER.legal}</span>
          <span>Built by the Tactyqal Labs engineering team.</span>
        </Container>
      </div>
    </footer>
  );
}