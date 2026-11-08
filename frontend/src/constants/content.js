// Every claim here traces to a public source — no invented statistics.
// Sources: tactyqal.com/about, LinkedIn, Product Hunt, Indie Hackers, ToolMage.

export const BRAND = {
  name: 'Tactyqal Labs',
  tagline: 'AI Coach for Startup Founders & CEOs',
  mission:
    'Tactyqal Labs helps aspiring entrepreneurs turn ideas into real, revenue-generating products through AI-augmented mentorship, no-code tooling, and one-on-one guidance.',
  founder: 'Partha Chakraborty',
  founderBio:
    'Founded by experienced venture capitalist Partha Chakraborty, Tactyqal exists so every founder can get personalised advice — not generic courses.',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Programs', href: '/#services' },
  { label: 'Process', href: '/#process' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
];

export const HERO = {
  eyebrow: 'Idea → Product Hunt launch in 30 days',
  headline: 'Turn your idea into a real app — with a mentor who has built before.',
  subhead:
    'Tactyqal Labs pairs young entrepreneurs with 1:1 mentorship, no-code and AI tooling, and the playbook to launch a revenue-generating product in 30 days. No group classes. No fluff.',
  primaryCta: { label: 'Start your 30-day journey', href: '/#contact' },
  secondaryCta: { label: 'Explore the programs', href: '/#services' },
  proofPoints: [
    { value: '1:1', label: 'Personal mentorship' },
    { value: '30 days', label: 'Idea to launch' },
    { value: 'No-code + AI', label: 'Anyone can build' },
  ],
};

export const ABOUT = {
  eyebrow: 'Why Tactyqal exists',
  heading: 'Built by a VC who kept getting the same question: “How do I start?”',
  body: [
    'After leaving the venture firm he worked with, our founder kept receiving emails from founders asking for advice. That demand became Tactyqal — a platform where every founder can access personalised, practical guidance instead of generic startup content.',
    'Today, Tactyqal Labs combines an AI-powered startup coach with hands-on 1:1 mentorship. We help founders brainstorm and validate ideas, find cofounders, build thought leadership through AI-augmented content, and turn rough concepts into launch-ready products.',
  ],
  pillars: [
    { title: 'Founder-first', text: 'Advice shaped around your idea, stage, and constraints — never a one-size-fits-all curriculum.' },
    { title: 'Execution over theory', text: 'You leave with a working product, a pitch, and a launch plan — not just notes.' },
    { title: 'AI as leverage', text: 'No-code and AI tools remove the technical barrier so you can focus on customers.' },
  ],
};

export const SERVICES = {
  eyebrow: 'Programs & services',
  heading: 'Everything you need to go from idea to launch',
  subhead: 'Verified offerings from Tactyqal’s public programme and service pages.',
  items: [
    {
      icon: 'Lightbulb',
      title: 'Idea validation & brainstorming',
      description:
        'Pressure-test your concept, map the market, and shape a sharp problem statement before you write a line of code.',
    },
    {
      icon: 'Users',
      title: 'Co-founder matching',
      description:
        'Get help finding a full-time cofounder — technical or non-technical — so you are not building alone.',
    },
    {
      icon: 'PenLine',
      title: 'AI-augmented brand & content',
      description:
        'Build thought leadership and a brand using AI-assisted content creation and marketing workflows.',
    },
    {
      icon: 'Presentation',
      title: 'Pitch deck & storytelling',
      description:
        'Craft a pitch deck that communicates traction, vision, and ask clearly — ready for investors and launch day.',
    },
    {
      icon: 'Rocket',
      title: '30-day app launch program',
      description:
        '1:1 mentorship and no-code/AI development to build and launch a real app — from idea to Product Hunt in 30 days.',
    },
    {
      icon: 'Globe',
      title: 'Offshore growth marketing',
      description:
        'AI-augmented offshore marketers help entrepreneurs grow their business while saving significantly on hiring costs.',
    },
  ],
};

export const PROCESS = {
  eyebrow: 'How it works',
  heading: 'A clear path from idea to launch',
  steps: [
    {
      number: '01',
      title: 'Discover & validate',
      description:
        'A 1:1 session to clarify the problem, customer, and unique angle. You leave with a validated idea and a scorecard.',
    },
    {
      number: '02',
      title: 'Research & position',
      description:
        'Map competitors, define your wedge, and shape the narrative that will make your product stand out.',
    },
    {
      number: '03',
      title: 'Design & build',
      description:
        'Use no-code and AI tools with guided mentorship to build a working MVP — no engineering background required.',
    },
    {
      number: '04',
      title: 'Launch & learn',
      description:
        'Ship to Product Hunt, run your first growth experiments, and iterate with feedback from real users.',
    },
  ],
};

export const CTA = {
  heading: 'Your idea deserves more than a notebook.',
  body:
    'Join a small cohort of founders building real products with 1:1 mentorship, AI leverage, and a launch deadline that keeps you accountable.',
  primary: { label: 'Apply for mentorship', href: '/#contact' },
  secondary: { label: 'Read founder stories on the blog', href: '/blog' },
};

export const FOOTER = {
  description:
    'Tactyqal Labs helps founders turn ideas into revenue-generating products through AI-augmented mentorship and no-code execution.',
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/#about' },
        { label: 'Programs', href: '/#services' },
        { label: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Contact', href: '/#contact' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tactyqal-labs/' },
        { label: 'Product Hunt', href: 'https://www.producthunt.com/products/build-your-dream-app-in-30-days' },
        { label: 'Indie Hackers', href: 'https://www.indiehackers.com/product/tactyqal' },
      ],
    },
  ],
  legal: `© ${new Date().getFullYear()} Tactyqal Labs. All rights reserved.`,
};