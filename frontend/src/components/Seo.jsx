import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Tactyqal Labs';
const DEFAULT_DESCRIPTION =
  'Tactyqal Labs helps founders turn ideas into revenue-generating products through AI-augmented mentorship and no-code execution.';
const DEFAULT_OG_IMAGE = '/og-default.svg';

function upsertMeta({ name, property, content }) {
  if (!content) return;
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (name) tag.setAttribute('name', name);
    if (property) tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink({ rel, href }) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  type = 'website',
  noIndex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    upsertMeta({ name: 'description', content: description });
    upsertMeta({ name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' });

    // Open Graph
    upsertMeta({ property: 'og:site_name', content: SITE_NAME });
    upsertMeta({ property: 'og:title', content: fullTitle });
    upsertMeta({ property: 'og:description', content: description });
    upsertMeta({ property: 'og:type', content: type });
    upsertMeta({ property: 'og:url', content: window.location.href });
    upsertMeta({ property: 'og:image', content: image || DEFAULT_OG_IMAGE });

    // Twitter
    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta({ name: 'twitter:title', content: fullTitle });
    upsertMeta({ name: 'twitter:description', content: description });
    upsertMeta({ name: 'twitter:image', content: image || DEFAULT_OG_IMAGE });

    // Canonical
    upsertLink({ rel: 'canonical', href: window.location.origin + pathname });

    // Structured data (removed on unmount)
    let script = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      if (script) document.head.removeChild(script);
    };
  }, [title, description, image, type, noIndex, jsonLd, pathname]);

  return null;
}