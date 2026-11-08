import Seo from '@/components/Seo';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Process from './Process';
import BlogPreview from './BlogPreview';
import CTA from './CTA';

const ORG_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tactyqal Labs',
  url: 'https://tactyqal.com',
  description:
    'Tactyqal Labs helps founders turn ideas into revenue-generating products through AI-augmented mentorship and no-code execution.',
  founder: { '@type': 'Person', name: 'Partha Chakraborty' },
  sameAs: [
    'https://www.linkedin.com/company/tactyqal-labs/',
    'https://www.producthunt.com/products/build-your-dream-app-in-30-days',
    'https://www.indiehackers.com/product/tactyqal',
  ],
};

export default function HomePage() {
  return (
    <>
      <Seo
        description="Turn your idea into a revenue-generating app. Tactyqal Labs pairs founders with 1:1 mentorship, AI tooling, and a 30-day launch playbook."
        jsonLd={ORG_JSON_LD}
      />
      <Hero />
      <About />
      <Services />
      <Process />
      <BlogPreview />
      <CTA />
    </>
  );
}