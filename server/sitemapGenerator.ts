export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const OFFICIAL_SITEMAP_ENTRIES: SitemapUrlEntry[] = [
  // 1. Root Homepage
  {
    loc: 'https://uombonisecondaryschool.netlify.app/',
    changefreq: 'daily',
    priority: 1.0,
  },
  // 2. High-Priority Official Results & National Exam Hub
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#necta',
    changefreq: 'daily',
    priority: 0.95,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#results',
    changefreq: 'weekly',
    priority: 0.9,
  },
  // 3. Portals & Intranets
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#portal',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#parent',
    changefreq: 'weekly',
    priority: 0.85,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#staff',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#academic',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#bursar',
    changefreq: 'monthly',
    priority: 0.75,
  },
  // 4. Admissions & Joining Instructions
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#admissions',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#joining',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#fees',
    changefreq: 'monthly',
    priority: 0.8,
  },
  // 5. School Curriculum & Academics
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#academics',
    changefreq: 'weekly',
    priority: 0.85,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#teachers',
    changefreq: 'monthly',
    priority: 0.75,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#students',
    changefreq: 'monthly',
    priority: 0.75,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#about',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#gallery',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#news',
    changefreq: 'weekly',
    priority: 0.75,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#contact',
    changefreq: 'monthly',
    priority: 0.7,
  },
  // 6. Auth Entry Points
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#login',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    loc: 'https://uombonisecondaryschool.netlify.app/#signup',
    changefreq: 'monthly',
    priority: 0.5,
  },
];

/**
 * Builds the complete XML sitemap content string dynamically.
 */
export function generateSitemapXml(
  customEntries?: SitemapUrlEntry[],
  currentDateIso?: string
): string {
  const entries = customEntries && customEntries.length > 0 ? customEntries : OFFICIAL_SITEMAP_ENTRIES;
  const today = currentDateIso || new Date().toISOString().split('T')[0];

  const xmlUrls = entries
    .map((item) => {
      const lastmod = item.lastmod || today;
      const freq = item.changefreq || 'weekly';
      const prio = (item.priority !== undefined ? item.priority : 0.7).toFixed(1);

      return `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>
`;
}
