import DOMPurify from 'dompurify';

/**
 * Sanitize admin-authored HTML before rendering with dangerouslySetInnerHTML.
 * Posts are authored by trusted admins, but this is defense-in-depth.
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'rel'],
  });
}

/** Ensure external links in content open safely. */
export function hardenLinks(root) {
  if (!root) return;
  root.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer noopener');
    }
  });
}