export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  ogImage: string;
}

export const CANONICAL_SITE_URL = 'https://www.uomboniss.sc.tz';
export const DEFAULT_OG_IMAGE = `${CANONICAL_SITE_URL}/uomboni_official_logo.jpg`;

export const PAGE_SEO_MAP: Record<string, PageSeoConfig> = {
  '/': {
    title: 'Uomboni Secondary School | Official Results & Academic Portal (NECTA S0486)',
    description:
      'Tovuti Rasmi ya Shule ya Sekondari Uomboni (NECTA S0486), Marangu Magharibi, Moshi Vijijini, Kilimanjaro. Mfumo kamili wa Udahili, Matokeo ya NECTA, Maisha ya Bweni, Vilabu, Walimu, Picha, Malipo ya Ada na Portal ya Wanafunzi.',
    canonicalUrl: `${CANONICAL_SITE_URL}/`,
    keywords: [
      'Uomboni Secondary School',
      'Shule ya Sekondari Uomboni',
      'NECTA S0486',
      'Uomboni Marangu',
      'Uomboni Moshi Kilimanjaro',
      'Udahili Uomboni',
      'Matokeo ya NECTA Uomboni',
      'Joining Instructions Uomboni',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/admissions': {
    title: 'Udahili & Maombi ya Kujiunga 2026/2027 | Uomboni Secondary School',
    description:
      'Nafasi za masomo Kidato cha I hadi IV (Kutwa na Bweni) katika Shule ya Sekondari Uomboni, Marangu Magharibi, Moshi. Pakua fomu ya kujiunga na maelezo ya ada.',
    canonicalUrl: `${CANONICAL_SITE_URL}/admissions`,
    keywords: [
      'Udahili Uomboni 2026',
      'Nafasi za Kujiunga Uomboni',
      'Joining Instructions Uomboni',
      'Form One Selection Uomboni',
      'Shule ya Bweni Marangu',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/joining-instructions': {
    title: 'Fomu Rasmi ya Kujiunga na Shule 2027 (Joining Instructions) | Uomboni Secondary School',
    description:
      'Fomu rasmi na maelekezo ya kujiunga na Shule ya Sekondari Uomboni (2027): Tarehe ya kufunguliwa 07/01/2027, mchanganuo wa ada ya bweni (TZS 1,600,000/=), sare na vifaa (TZS 224,000/=), akaunti za benki (CRDB, NMB, Mkombozi) na mahitaji ya bweni.',
    canonicalUrl: `${CANONICAL_SITE_URL}/joining-instructions`,
    keywords: [
      'Fomu ya Kujiunga Uomboni 2027',
      'Joining Instructions Uomboni 2027',
      'Ada ya Shule Uomboni',
      'Akaunti za Benki Uomboni',
      'Mahitaji ya Bweni Uomboni',
      'Form One Joining Instructions 2027',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/vitu-muhimu': {
    title: 'Vitu Muhimu vya Kujiunga na Shule | Uomboni Secondary School',
    description:
      'Orodha rasmi ya vitu muhimu vya kujiunga na Shule ya Sekondari Uomboni (NECTA S0486): Vifaa vya masomo na daftari, sare za shule, mahitaji ya bweni, sanduku la bati, nyaraka za usajili na vitu vilivyopigwa marufuku.',
    canonicalUrl: `${CANONICAL_SITE_URL}/vitu-muhimu`,
    keywords: [
      'Vitu Muhimu Uomboni',
      'Mahitaji ya Kujiunga Uomboni',
      'Orodha ya Vitu vya Shule Uomboni',
      'Sare za Shule Uomboni',
      'Vifaa vya Bweni Uomboni Secondary',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/results': {
    title: 'Matokeo Rasmi ya Mitihani & NECTA S0486 | Uomboni Secondary School',
    description:
      'Tazama matokeo rasmi ya NECTA CSEE Kidato cha Nne, mitihani ya majaribio ya kanda na mkoa, pamoja na ripoti za kina za maendeleo ya wanafunzi wa Shule ya Sekondari Uomboni.',
    canonicalUrl: `${CANONICAL_SITE_URL}/results`,
    keywords: [
      'Matokeo ya NECTA S0486',
      'Uomboni Secondary School NECTA',
      'Matokeo Kidato cha Nne Uomboni',
      'CSEE Results Uomboni',
      'NECTA Marangu Moshi',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/academics': {
    title: 'Taaluma & Mitaala ya Masomo | Shule ya Sekondari Uomboni',
    description:
      'Mitaala ya NECTA kwa Kidato cha I - IV: Sayansi (Fizikia, Kemia, Baiolojia), Biashara na Sanaa. Maabara za kisasa, maktaba na maandalizi thabiti ya mitihani ya taifa.',
    canonicalUrl: `${CANONICAL_SITE_URL}/academics`,
    keywords: [
      'Taaluma Uomboni',
      'Masomo Uomboni',
      'Mitaala NECTA',
      'Sayansi na Biashara Uomboni',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/fees': {
    title: 'Ada ya Shule & Mchanganuo wa Benki | Uomboni Secondary School',
    description:
      'Mchanganuo wa ada ya shule ya bweni (TZS 1,600,000/=) na kutwa (TZS 850,000/=). Akaunti za CRDB (0150248900100), NMB (22110023456) na Mkombozi Bank za Shule ya Sekondari Uomboni.',
    canonicalUrl: `${CANONICAL_SITE_URL}/fees`,
    keywords: [
      'Ada ya Uomboni',
      'School Fees Uomboni',
      'CRDB Uomboni',
      'NMB Uomboni',
      'Mkombozi Bank Uomboni',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/about': {
    title: 'Kuhusu Sisi & Historia | Shule ya Sekondari Uomboni (NECTA S0486)',
    description:
      'Fahamu historia ya Shule ya Sekondari Uomboni tangu kuanzishwa kwake, maono, dhamira, wito wa shule na mazingira tulivu ya kujisomea yaliyoko Marangu Magharibi, Moshi Vijijini.',
    canonicalUrl: `${CANONICAL_SITE_URL}/about`,
    keywords: [
      'Kuhusu Uomboni',
      'Historia ya Shule ya Uomboni',
      'Marangu Magharibi Sekondari',
      'Catholic Diocese of Moshi',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/location': {
    title: 'Mahali Tulipo & Ramani ya Shule | Uomboni Secondary School',
    description:
      'Eneo la Shule ya Sekondari Uomboni, Marangu Magharibi, Moshi Vijijini, Kilimanjaro. GPS Coordinates: -3.25685, 37.48725. Maelekezo kamili ya kufika shuleni kutoka Himo na Moshi Mjini.',
    canonicalUrl: `${CANONICAL_SITE_URL}/location`,
    keywords: [
      'Mahali Tulipo Uomboni',
      'GPS Uomboni Secondary',
      'Marangu Moshi Directions',
      'Coordinates Uomboni',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/contact': {
    title: 'Wasiliana Nasi | Shule ya Sekondari Uomboni, Marangu Moshi',
    description:
      'Wasiliana na uongozi wa Shule ya Sekondari Uomboni: Simu +255 782 558 127, barua pepe info@uomboniss.sc.tz, eneo la shule Marangu Magharibi, Moshi Vijijini.',
    canonicalUrl: `${CANONICAL_SITE_URL}/contact`,
    keywords: [
      'Wasiliana na Uomboni',
      'Mawasiliano Uomboni Secondary',
      'Marangu Magharibi Moshi',
      'Simu ya Mkuu wa Shule Uomboni',
    ],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/news': {
    title: 'Habari, Matukio & Kalenda ya Shule | Uomboni Secondary School',
    description:
      'Habari za hivi punde, kalenda ya mihula ya masomo, matukio ya kitaaluma, mahafali na matangazo rasmi ya Shule ya Sekondari Uomboni.',
    canonicalUrl: `${CANONICAL_SITE_URL}/news`,
    keywords: ['Habari za Uomboni', 'Kalenda ya Shule', 'Matukio Uomboni'],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/gallery': {
    title: 'Matukio ya Picha & Maktaba ya Shule | Uomboni Secondary School',
    description:
      'Picha za shule, mandhari maridadi ya Mlima Kilimanjaro na Marangu, majengo ya shule, maabara za sayansi na shughuli za wanafunzi wa Uomboni.',
    canonicalUrl: `${CANONICAL_SITE_URL}/gallery`,
    keywords: ['Picha za Uomboni', 'School Gallery Uomboni', 'Mazingira ya Marangu'],
    ogImage: DEFAULT_OG_IMAGE,
  },
  '/portal': {
    title: 'School Portal & Dashboard | Uomboni Secondary School (NECTA S0486)',
    description:
      'Lango kuu la mtandao wa ndani la Shule ya Sekondari Uomboni: Dashibodi ya wanafunzi, wazazi, na walimu kwa ajili ya maendeleo ya kitaaluma na taarifa za shule.',
    canonicalUrl: `${CANONICAL_SITE_URL}/portal`,
    keywords: ['Portal Uomboni', 'Student Portal Uomboni', 'School Dashboard Uomboni S0486'],
    ogImage: DEFAULT_OG_IMAGE,
  },
};

/**
 * Injects page-specific meta tags into raw HTML template
 */
export function injectSeoMetaTags(rawHtml: string, pathname: string): string {
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, '') || '/';
  const config = PAGE_SEO_MAP[normalizedPath] || PAGE_SEO_MAP['/'];

  let modified = rawHtml;

  // Replace Title
  modified = modified.replace(
    /<title>.*?<\/title>/i,
    `<title>${config.title}</title>`
  );

  // Replace Meta Description
  modified = modified.replace(
    /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="description" content="${config.description}" />`
  );

  // Replace Canonical URL
  modified = modified.replace(
    /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i,
    `<link rel="canonical" href="${config.canonicalUrl}" />`
  );

  // Replace OpenGraph Title & Description & URL
  modified = modified.replace(
    /<meta\s+property=["']og:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:title" content="${config.title}" />`
  );
  modified = modified.replace(
    /<meta\s+property=["']og:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:description" content="${config.description}" />`
  );
  modified = modified.replace(
    /<meta\s+property=["']og:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta property="og:url" content="${config.canonicalUrl}" />`
  );

  // Replace Twitter Title & Description & URL
  modified = modified.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${config.title}" />`
  );
  modified = modified.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${config.description}" />`
  );
  modified = modified.replace(
    /<meta\s+name=["']twitter:url["']\s+content=["'].*?["']\s*\/?>/i,
    `<meta name="twitter:url" content="${config.canonicalUrl}" />`
  );

  return modified;
}
