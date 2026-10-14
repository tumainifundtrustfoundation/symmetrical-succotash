export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const CANONICAL_SITE_URL = 'https://www.uomboniss.sc.tz';

export const OFFICIAL_SITEMAP_ENTRIES: SitemapUrlEntry[] = [
  // 1. Root Homepage
  {
    loc: `${CANONICAL_SITE_URL}/`,
    changefreq: 'daily',
    priority: 1.0,
  },
  // 2. Admissions & Joining Instructions
  {
    loc: `${CANONICAL_SITE_URL}/admissions`,
    changefreq: 'weekly',
    priority: 0.95,
  },
  {
    loc: `${CANONICAL_SITE_URL}/joining-instructions`,
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    loc: `${CANONICAL_SITE_URL}/vitu-muhimu`,
    changefreq: 'weekly',
    priority: 0.85,
  },
  // 3. Official Examination Results & NECTA S0486 Hub
  {
    loc: `${CANONICAL_SITE_URL}/results`,
    changefreq: 'weekly',
    priority: 0.95,
  },
  // 4. School Curriculum & Academics
  {
    loc: `${CANONICAL_SITE_URL}/academics`,
    changefreq: 'weekly',
    priority: 0.85,
  },
  // 5. School Fees & Bank Accounts
  {
    loc: `${CANONICAL_SITE_URL}/fees`,
    changefreq: 'monthly',
    priority: 0.85,
  },
  // 6. About School, History & Leadership
  {
    loc: `${CANONICAL_SITE_URL}/about`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  // 7. Physical Location, Directions & GPS
  {
    loc: `${CANONICAL_SITE_URL}/location`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  // 8. Contact Information & Administration
  {
    loc: `${CANONICAL_SITE_URL}/contact`,
    changefreq: 'monthly',
    priority: 0.8,
  },
  // 9. News, Events & Academic Calendar
  {
    loc: `${CANONICAL_SITE_URL}/news`,
    changefreq: 'weekly',
    priority: 0.8,
  },
  // 10. Campus Tour & Photo Gallery
  {
    loc: `${CANONICAL_SITE_URL}/gallery`,
    changefreq: 'monthly',
    priority: 0.75,
  },
  // 11. Student & Parents Digital Portal
  {
    loc: `${CANONICAL_SITE_URL}/portal`,
    changefreq: 'weekly',
    priority: 0.7,
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${xmlUrls}
</urlset>
`;
}
