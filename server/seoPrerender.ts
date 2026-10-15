/**
 * Uomboni Secondary School (NECTA S0486)
 * Server-Side SEO & Bot Prerendering Service
 *
 * Delivers clean, semantic, crawler-accessible HTML for search engines and social platforms
 * (Googlebot, Bingbot, YandexBot, DuckDuckBot, Applebot, WhatsApp, Facebook, X/Twitter)
 * with zero JavaScript dependency.
 */

export function isSearchEngineBot(userAgent: string = ''): boolean {
  if (!userAgent) return false;
  const botPattern = /googlebot|bingbot|yandex|duckduckbot|slurp|baiduspider|sogou|exabot|facebot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|petalbot|crawling|spider/i;
  return botPattern.test(userAgent);
}

export interface PrerenderPageData {
  title: string;
  description: string;
  canonicalUrl: string;
  heading: string;
  subheading: string;
  swContent: string;
  enContent: string;
  keywords: string;
}

export function getPublicPageSeoData(path: string): PrerenderPageData {
  const cleanPath = path.toLowerCase().split('?')[0].replace(/\/$/, '') || '/';

  switch (cleanPath) {
    case '/admission-documents':
      return {
        title: 'Nyaraka za Udahili & Fomu Rasmi | Uomboni Secondary School (NECTA S0486)',
        description: 'Pakua fomu rasmi za udahili na kujiunga na Shule ya Sekondari Uomboni: Fomu ya Maombi, Upimaji wa Afya (Medical Form), Makubaliano ya Mzazi/Mlezi, Sheria na Kanuni za Shule na Orodha ya Vitu Muhimu.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/admission-documents',
        heading: 'Nyaraka Rasmi za Udahili • Official Student Admission Documents',
        subheading: 'Shule ya Sekondari Uomboni • Kidato cha I - IV (Form 1 - 4 Admissions)',
        keywords: 'Uomboni Secondary School admissions, Fomu za kujiunga Uomboni, Joining Instructions Uomboni, Medical Examination Form Uomboni, Sheria za shule Uomboni',
        swContent: `
          <article>
            <h2>Pakua Nyaraka Zote za Udahili na Kujiunga na Shule</h2>
            <p>Shule ya Sekondari Uomboni inawakaribisha wanafunzi wanaojiunga na Kidato cha Kwanza (Form I) pamoja na wanaohamia Kidato cha Pili na cha Tatu (Transfers). Hapa chini ni orodha ya nyaraka zote zilizoidhinishwa:</p>
            <ul>
              <li><strong>Fomu Rasmi ya Maombi ya Udahili (Student Admission Application Form):</strong> Taarifa za msingi za mwanafunzi na rekodi ya kitaaluma.</li>
              <li><strong>Fomu ya Upimaji wa Afya (Medical Examination Form):</strong> Upimaji kamili unaofanywa na daktari aliyesajiliwa serikalini.</li>
              <li><strong>Fomu ya Makubaliano ya Mzazi/Mlezi (Parent/Guardian Undertaking Form):</strong> Maadili, malezi na wajibu wa ada.</li>
              <li><strong>Maelekezo Rasmi ya Kujiunga (Official Joining Instructions 2026/2027):</strong> Miongozo yote ya kufika shuleni, ada na vifaa.</li>
              <li><strong>Sheria na Kanuni za Shule (School Rules and Regulations):</strong> Kanuni za bweni, nidhamu na miongozo ya malezi.</li>
              <li><strong>Orodha ya Mahitaji Muhimu ya Mwanafunzi (Required Items Checklist):</strong> Sare, madaftari, vifaa vya usafi na matumizi binafsi.</li>
            </ul>
          </article>
        `,
        enContent: `
          <article>
            <h2>Official Student Admission & Enrollment Portal</h2>
            <p>Welcome to Uomboni Secondary School admission portal. All official documents for incoming Form I and transfer students are available for direct review and download:</p>
            <p>Located in Marangu, Moshi, Kilimanjaro, Tanzania under the Catholic Diocese of Moshi. We provide boarding and day education for both boys and girls.</p>
          </article>
        `,
      };

    case '/admissions':
      return {
        title: 'Udahili & Joining Instructions | Uomboni Secondary School',
        description: 'Taarifa kamili za udahili wa wanafunzi wa Kidato cha 1 hadi 4 Shule ya Sekondari Uomboni, Marangu, Moshi. Ratiba ya masomo, ada na maelekezo ya kujiunga.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/admissions',
        heading: 'Udahili wa Wanafunzi • Student Admissions',
        subheading: 'Kidato cha Kwanza hadi cha Nne • Form 1 to Form 4 Admissions',
        keywords: 'Uomboni Secondary School admissions, udahili Uomboni, kujiunga na kidato cha kwanza Marangu Moshi',
        swContent: `
          <article>
            <h2>Mwongozo wa Udahili na Kujiunga na Uomboni Secondary School</h2>
            <p>Shule ya Sekondari Uomboni inatoa elimu bora ya sekondari ya kawaida (O-Level) kwa mchepuo wa Sayansi, Sanaa na Biashara. Nafasi zipo kwa wanafunzi wa bweni na wa kutwa.</p>
            <p>Taratibu za maombi zinajumuisha kujaza fomu ya maombi, kupimwa afya kwenye kituo cha afya kilichosajiliwa, na kuwasilisha vivuli vya vyeti vya kuzaliwa na matokeo ya darasa la saba.</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Admissions & Enrollment Overview</h2>
            <p>Uomboni Secondary School welcomes applications for Ordinary Level secondary education. We provide boarding and day options with modern laboratory facilities and high moral discipline.</p>
          </article>
        `,
      };

    case '/about':
      return {
        title: 'Kuhusu Sisi | Uomboni Secondary School Marangu Moshi Kilimanjaro',
        description: 'Fahamu historia, dira, dhima na maadili ya Shule ya Sekondari Uomboni iliyoko Marangu, Moshi Vijijini, Kilimanjaro chini ya Jimbo Katoliki la Moshi.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/about',
        heading: 'Kuhusu Shule ya Sekondari Uomboni • About Our School',
        subheading: 'Kaulimbiu: "Tujiendeleze Sisi Wenyewe" & "Elimu ni Mwanga na Maadili Mema"',
        keywords: 'Uomboni Secondary School, Uomboni Secondary School Marangu, Shule ya Sekondari Uomboni, Historia ya Uomboni Sec, Moshi Kilimanjaro',
        swContent: `
          <article>
            <h2>Historia na Maadili ya Shule</h2>
            <p>Shule ya Sekondari Uomboni ni shule ya Kikatoliki iliyo chini ya Jimbo Katoliki la Moshi, iko katika Kijiji cha Uomboni, Kata ya Marangu Magharibi, Wilaya ya Moshi Vijijini, Mkoani Kilimanjaro.</p>
            <p>Shule inazingatia malezi thabiti ya kiroho, nidhamu ya juu, na ufaulu wa kiwango cha juu katika mitihani ya kitaifa ya NECTA (Center S0486).</p>
            <p>Mazingira ya shule ni tulivu na ya kijani kibichi kwenye miteremko ya Mlima Kilimanjaro, yakimwezesha mwanafunzi kusoma kwa utulivu na amani.</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Our Heritage and Academic Mission</h2>
            <p>Uomboni Secondary School is an esteemed secondary institution rooted in Catholic ethos under the Catholic Diocese of Moshi, situated along the tranquil slopes of Mount Kilimanjaro in Marangu, Tanzania.</p>
            <p>We nurture students to achieve academic brilliance, spiritual depth, and ethical leadership in service to society.</p>
          </article>
        `,
      };

    case '/academics':
      return {
        title: 'Taaluma & Masomo | Uomboni Secondary School (NECTA S0486)',
        description: 'Mitaala na masomo yanayofundishwa Shule ya Sekondari Uomboni: Sayansi (Fizikia, Kemia, Baiolojia), Hisabati, Sanaa, Biashara, Lugha na TEHAMA (ICT).',
        canonicalUrl: 'https://www.uomboniss.sc.tz/academics',
        heading: 'Taaluma na Mitaala • Academic Curriculum',
        subheading: 'NECTA Examination Center Number S0486',
        keywords: 'Uomboni Secondary School NECTA S0486, Taaluma Uomboni, Sayansi Uomboni, ICT Lab Uomboni',
        swContent: `
          <article>
            <h2>Mitaala na Miundombinu ya Kitaaluma</h2>
            <p>Shule yetu inafuata mtaala rasmi wa Wizara ya Elimu, Sayansi na Teknolojia wa Tanzania kwa Kidato cha I hadi IV. Masomo yanajumuisha:</p>
            <ul>
              <li><strong>Sayansi & Hisabati:</strong> Physics, Chemistry, Biology, Basic Mathematics, Additional Mathematics.</li>
              <li><strong>Lugha:</strong> Kiingereza (English), Kiswahili, Fasihi ya Kiingereza (Literature).</li>
              <li><strong>Sayansi za Jamii:</strong> Historia (History), Jiografia (Geography), Uraia (Civics).</li>
              <li><strong>Biashara & TEHAMA:</strong> Utunzaji Hesabu (Bookkeeping), Biashara (Commerce), Sayansi ya Kompyuta & TEHAMA (ICT).</li>
              <li><strong>Dini:</strong> Elimu ya Dini ya Kikristo (Bible Knowledge) na Malezi ya Kiroho.</li>
            </ul>
          </article>
        `,
        enContent: `
          <article>
            <h2>Academic Excellence & Programs</h2>
            <p>Uomboni Secondary School delivers a comprehensive O-Level curriculum adhering to Tanzania Institute of Education standards, bolstered by modern science and ICT laboratories.</p>
          </article>
        `,
      };

    case '/results':
      return {
        title: 'Matokeo ya Mitihani & NECTA S0486 | Uomboni Secondary School',
        description: 'Tazama matokeo rasmi ya mitihani ya NECTA (CSEE & FTNA) ya Shule ya Sekondari Uomboni (Kituo S0486). Rekodi za ufaulu wa kitaifa na tathmini za mitihani.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/results',
        heading: 'Matokeo Rasmi ya Mitihani • Examination Results',
        subheading: 'Kituo cha Mitihani NECTA S0486 • NECTA Examination Center S0486',
        keywords: 'Uomboni Secondary School results, Matokeo ya NECTA Uomboni S0486, Matokeo ya Kidato cha Nne Uomboni, CSEE Uomboni, FTNA Uomboni',
        swContent: `
          <article>
            <h2>Ufaulu wa Mitihani ya Kitaifa (NECTA) na Mitihani ya Ndani</h2>
            <p>Shule ya Sekondari Uomboni (NECTA Center S0486) inajivunia historia imara ya ufaulu katika mitihani ya Kidato cha Pili (FTNA) na Kidato cha Nne (CSEE).</p>
            <p>Wanafunzi na wazazi wanaweza kuthibitisha matokeo rasmi kupitia namba zao za mitihani kwenye tovuti yetu au kupitia kiunganishi rasmi cha Baraza la Mitihani la Tanzania (NECTA).</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Official Academic Performance & NECTA Records</h2>
            <p>Review accredited NECTA performance reports for Center S0486. Uomboni Secondary School consistently demonstrates high pass rates and division rankings in national assessments.</p>
          </article>
        `,
      };

    case '/campus-tour':
      return {
        title: 'Miundombinu & Ziara ya Shule | Uomboni Secondary School',
        description: 'Tazama miundombinu ya kisasa ya Shule ya Sekondari Uomboni: Maabara za Sayansi, Maktaba, Mabweni ya Wavulana na Wasichana, Viwanja vya Michezo na Mazingira ya Marangu.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/campus-tour',
        heading: 'Ziara ya Shule na Miundombinu • Campus Facilities & Tour',
        subheading: 'Mazingira Mazuri ya Kujifunzia Kijiji cha Uomboni, Marangu, Kilimanjaro',
        keywords: 'Uomboni Secondary School campus tour, maabara za sayansi Uomboni, mabweni Uomboni, viwanja vya michezo Uomboni',
        swContent: `
          <article>
            <h2>Miundombinu ya Kisasa kwa Ajili ya Malezi Kamili</h2>
            <p>Shule ya Sekondari Uomboni inamiliki majengo bora na miundombinu inayomwezesha mwanafunzi kukuza vipaji vyake:</p>
            <ul>
              <li><strong>Maabara za Sayansi:</strong> Maabara zilizosheheni vifaa vya kisasa kwa ajili ya majaribio ya Fizikia, Kemia na Baiolojia.</li>
              <li><strong>Maktaba ya Kisasa:</strong> Vitabu vya kiada, ziada na majarida ya kielimu.</li>
              <li><strong>Mabweni Salama:</strong> Mabweni yenye ulinzi na uangalizi wa masaa 24 kwa wavulana na wasichana.</li>
              <li><strong>Viwanja vya Michezo:</strong> Mpira wa miguu, pete (netball), mpira wa wavu (volleyball) na riadha.</li>
              <li><strong>Bwalo la Chakula:</strong> Lishe bora, safi na yenye virutubisho kwa wanafunzi wa bweni na kutwa.</li>
            </ul>
          </article>
        `,
        enContent: `
          <article>
            <h2>Modern School Campus & Amenities</h2>
            <p>Explore our campus facilities including fully-equipped science laboratories, an expansive library, safe dormitories, sports fields, and dining amenities on the slopes of Kilimanjaro.</p>
          </article>
        `,
      };

    case '/fees':
      return {
        title: 'Ada na Malipo ya Shule | Uomboni Secondary School',
        description: 'Mwongozo rasmi wa ada ya shule, malipo ya benki (CRDB Bank, NMB Bank) na namba za malipo za kielektroniki (Control Numbers & M-Pesa Lipa Namba) Shule ya Sekondari Uomboni.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/fees',
        heading: 'Taarifa za Ada na Malipo ya Benki • School Fees & Banking',
        subheading: 'Akaunti Rasmi za Benki za Shule ya Sekondari Uomboni',
        keywords: 'Ada ya Uomboni Secondary School, Malipo ya benki Uomboni, CRDB Uomboni, NMB Uomboni, Ada ya bweni Marangu',
        swContent: `
          <article>
            <h2>Mwongozo Rasmi wa Malipo ya Ada ya Shule</h2>
            <p>Ada zote za Shule ya Sekondari Uomboni zinalipwa kupitia akaunti rasmi za benki za shule au mifumo iliyoidhinishwa na uongozi:</p>
            <ul>
              <li><strong>CRDB Bank:</strong> Akaunti Na. 0150248900100 (Jina: Uomboni Secondary School)</li>
              <li><strong>NMB Bank:</strong> Akaunti Na. 22110023456 (Jina: Uomboni Secondary School)</li>
              <li><strong>Lipa kwa Simu / M-Pesa / Tigo Pesa:</strong> Lipa Namba 5882194</li>
            </ul>
            <p>Wazazi na walezi wanashauriwa kuhifadhi stakabadhi halisi ya benki na kuwasilisha ofisi ya Mhasibu wa Shule (Bursar) kwa uthibitisho.</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Approved School Fee Structure & Banking Details</h2>
            <p>Official bank accounts and payment channels for school tuition and boarding fees. Parents must retain original deposit slips for bursar reconciliation.</p>
          </article>
        `,
      };

    case '/teachers':
      return {
        title: 'Walimu na Uongozi wa Shule | Uomboni Secondary School',
        description: 'Kutana na walimu waliohitimu na uongozi wa kitaaluma wa Shule ya Sekondari Uomboni, Marangu, Moshi Vijijini, Kilimanjaro.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/teachers',
        heading: 'Walimu na Uongozi wa Shule • Faculty & Administration',
        subheading: 'Wataalamu Wenye Weledi na Maadili Mema ya Kufundisha',
        keywords: 'Walimu wa Uomboni Secondary, Uongozi wa Shule Uomboni, Mkuu wa Shule Uomboni Marangu Moshi',
        swContent: `
          <article>
            <h2>Uongozi na Idara za Kufundisha</h2>
            <p>Shule ya Sekondari Uomboni inajivunia walimu wenye shahada na stashahada kutoka vyuo vikuu vinavyotambulika, wakiwa na weledi mkubwa katika ufundishaji wa sayansi, sanaa na biashara.</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Dedicated Faculty & Leadership</h2>
            <p>Our educators are passionate professionals committed to academic rigor, student mentorship, and holistic character formation.</p>
          </article>
        `,
      };

    case '/news':
      return {
        title: 'Habari na Matangazo ya Shule | Uomboni Secondary School',
        description: 'Pata matangazo rasmi, taarifa za kufungua shule, mikutano ya wazazi na matukio ya kitaaluma ya Shule ya Sekondari Uomboni.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/news',
        heading: 'Habari na Matangazo • News & Announcements',
        subheading: 'Matukio Muhimu ya Shule ya Sekondari Uomboni',
        keywords: 'Habari za Uomboni Secondary School, Matangazo ya shule Uomboni, Kufungua shule Uomboni 2026/2027',
        swContent: `
          <article>
            <h2>Matangazo Rasmi ya Uongozi wa Shule</h2>
            <p>Hapa utapata matangazo yote ya hivi punde kuhusu ratiba za kufungua shule, mikutano ya wazazi na walimu (PTA), na matukio ya kitaaluma.</p>
          </article>
        `,
        enContent: `
          <article>
            <h2>Official School News & Bulletins</h2>
            <p>Stay informed with current events, academic calendars, PTA gatherings, and official announcements from school administration.</p>
          </article>
        `,
      };

    case '/contact':
      return {
        title: 'Mawasiliano na Mahali Tulipo | Uomboni Secondary School Marangu Moshi',
        description: 'Wasiliana na ofisi ya Mkuu wa Shule ya Sekondari Uomboni: Simu +255 782 558 127, Barua pepe uombonisec@gmail.com, Kijiji cha Uomboni, Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/contact',
        heading: 'Mawasiliano na Mahali Tulipo • Contact & Directions',
        subheading: 'Kijiji cha Uomboni, Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania',
        keywords: 'Wasiliana na Uomboni Secondary School, Namba ya simu Uomboni Secondary, Mahali ilipo Uomboni Secondary Marangu Moshi Kilimanjaro',
        swContent: `
          <article>
            <h2>Mawasiliano Rasmi ya Shule ya Sekondari Uomboni</h2>
            <ul>
              <li><strong>Mahali:</strong> Kijiji cha Uomboni, Kata ya Marangu Magharibi, Wilaya ya Moshi Vijijini, Mkoani Kilimanjaro, Tanzania.</li>
              <li><strong>Anwani ya Posta:</strong> S.L.P. 243, Marangu, Kilimanjaro.</li>
              <li><strong>Simu ya Ofisi / Mkuu wa Shule:</strong> +255 782 558 127</li>
              <li><strong>Barua Pepe Rasmi:</strong> uombonisec@gmail.com</li>
              <li><strong>Mmiliki / Msimamizi:</strong> Jimbo Katoliki la Moshi (Catholic Diocese of Moshi).</li>
              <li><strong>Masaa ya Ofisi:</strong> Jumatatu - Ijumaa: Saa 1:30 Asubuhi - Saa 11:00 Jioni; Jumamosi: Saa 2:00 Asubuhi - Saa 7:00 Mchana.</li>
            </ul>
          </article>
        `,
        enContent: `
          <article>
            <h2>Official Contact Information & Location</h2>
            <p>Uomboni Secondary School is situated in Uomboni Village, Marangu Magharibi Ward, Moshi Rural District, Kilimanjaro Region, Tanzania.</p>
            <p>Telephone: +255 782 558 127 | Email: uombonisec@gmail.com | P.O. Box 243, Marangu, Tanzania.</p>
          </article>
        `,
      };

    default: // Homepage '/'
      return {
        title: 'Uomboni Secondary School | Official Website & NECTA S0486 | Marangu, Moshi',
        description: 'Tovuti Rasmi ya Shule ya Sekondari Uomboni (NECTA S0486), Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania. Udahili wa Kidato cha 1-4, Fomu za Kujiunga, Matokeo ya Mitihani, Maabara za Kisasa, Bweni na Portal ya Taaluma.',
        canonicalUrl: 'https://www.uomboniss.sc.tz/',
        heading: 'Shule ya Sekondari Uomboni • Uomboni Secondary School',
        subheading: 'NECTA Examination Center Number S0486 • Marangu, Moshi Vijijini, Kilimanjaro',
        keywords: 'Uomboni Secondary School, Uomboni Secondary School Marangu, Uomboni Secondary School Moshi Kilimanjaro, Shule ya Sekondari Uomboni, Uomboni Secondary School official website, Uomboni Secondary School NECTA S0486, Uomboni Secondary School admissions, Uomboni Secondary School results',
        swContent: `
          <article>
            <h2>Karibu Shule ya Sekondari Uomboni (NECTA S0486)</h2>
            <p>Shule ya Sekondari Uomboni ni shule rasmi ya sekondari ya kutwa na bweni kwa wavulana na wasichana (Kidato cha I hadi IV), iliyoko katika mazingira tulivu ya Kijiji cha Uomboni, Kata ya Marangu Magharibi, Wilaya ya Moshi Vijijini, Mkoani Kilimanjaro, Tanzania chini ya Jimbo Katoliki la Moshi.</p>
            <p>Kaulimbiu yetu ni <em>"Tujiendeleze Sisi Wenyewe"</em> na <em>"Elimu ni Mwanga na Maadili Mema"</em>. Tunatoa mafunzo bora ya mitaala ya kitaifa ya Sayansi, Sanaa, Biashara, Lugha na TEHAMA.</p>
            <h3>Huduma Kuu Zinazopatikana Mtandaoni:</h3>
            <ul>
              <li><a href="/admission-documents"><strong>Nyaraka Rasmi za Udahili (Admission Documents):</strong></a> Pakua Fomu ya Maombi ya Udahili, Upimaji wa Afya, Sheria za Shule, na Maelekezo ya Kujiunga.</li>
              <li><a href="/results"><strong>Matokeo ya Mitihani (NECTA & School Results):</strong></a> Kagua matokeo rasmi ya Kituo cha Mitihani S0486.</li>
              <li><a href="/campus-tour"><strong>Ziara ya Shule (Interactive Campus Tour):</strong></a> Tazama maabara za sayansi, maktaba, mabweni na viwanja vya michezo.</li>
              <li><a href="/fees"><strong>Mwongozo wa Ada na Benki:</strong></a> Taarifa rasmi za malipo ya benki CRDB na NMB.</li>
              <li><a href="/contact"><strong>Mawasiliano na Mahali Tulipo:</strong></a> Simu +255 782 558 127, Marangu, Moshi Vijijini, Kilimanjaro.</li>
            </ul>
          </article>
        `,
        enContent: `
          <article>
            <h2>Welcome to Uomboni Secondary School</h2>
            <p>Official website for Uomboni Secondary School (NECTA Center S0486), located in Marangu, Moshi Rural, Kilimanjaro, Tanzania. Delivering holistic academic and moral education for Ordinary Level students with boarding and day options.</p>
          </article>
        `,
      };
  }
}

/**
 * Render a complete, valid semantic HTML page for search bots and crawlers
 */
export function renderBotCrawlerHtml(path: string): string {
  const data = getPublicPageSeoData(path);

  return `<!doctype html>
<html lang="sw">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${data.title}</title>
  <link rel="canonical" href="${data.canonicalUrl}" />
  <meta name="description" content="${data.description}" />
  <meta name="keywords" content="${data.keywords}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="author" content="Uomboni Secondary School" />
  <meta name="google-site-verification" content="OiKxkWE1ZkCpfPPY2tJlvEFzuCJsHDziti_dKN1VfPw" />

  <!-- OpenGraph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${data.canonicalUrl}" />
  <meta property="og:site_name" content="Uomboni Secondary School" />
  <meta property="og:title" content="${data.title}" />
  <meta property="og:description" content="${data.description}" />
  <meta property="og:image" content="https://www.uomboniss.sc.tz/uomboni_flyer_2026.jpg" />
  <meta property="og:locale" content="sw_TZ" />
  <meta property="og:locale:alternate" content="en_US" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${data.canonicalUrl}" />
  <meta name="twitter:title" content="${data.title}" />
  <meta name="twitter:description" content="${data.description}" />
  <meta name="twitter:image" content="https://www.uomboniss.sc.tz/uomboni_flyer_2026.jpg" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HighSchool",
        "@id": "https://www.uomboniss.sc.tz/#school",
        "name": "Uomboni Secondary School",
        "alternateName": ["Shule ya Sekondari Uomboni", "Uomboni Sec", "Uomboni Secondary School Marangu"],
        "identifier": "NECTA S0486",
        "url": "https://www.uomboniss.sc.tz/",
        "logo": "https://www.uomboniss.sc.tz/logo.uomboni.jpg",
        "image": "https://www.uomboniss.sc.tz/uomboni_flyer_2026.jpg",
        "telephone": "+255782558127",
        "email": "uombonisec@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kijiji cha Uomboni, Marangu Magharibi",
          "addressLocality": "Moshi Vijijini",
          "addressRegion": "Kilimanjaro",
          "postalCode": "P.O. Box 243, Marangu",
          "addressCountry": "TZ"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -3.25685,
          "longitude": 37.48725
        }
      },
      {
        "@type": "WebPage",
        "@id": "${data.canonicalUrl}",
        "url": "${data.canonicalUrl}",
        "name": "${data.title}",
        "description": "${data.description}",
        "isPartOf": {
          "@type": "WebSite",
          "url": "https://www.uomboniss.sc.tz/",
          "name": "Uomboni Secondary School"
        }
      }
    ]
  }
  </script>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #102a43; background: #fffff0; margin: 0; padding: 0; }
    header { background: #064e3b; color: #ffffff; padding: 24px 20px; text-align: center; }
    header h1 { margin: 0 0 6px 0; font-size: 26px; color: #fef08a; }
    header p { margin: 0; font-size: 14px; color: #a7f3d0; }
    nav { background: #102a43; padding: 12px 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }
    nav a { color: #fde047; text-decoration: none; font-size: 13px; font-weight: 600; }
    nav a:hover { text-decoration: underline; }
    main { max-width: 900px; margin: 24px auto; padding: 0 20px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 32px; }
    h2 { color: #064e3b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
    h3 { color: #102a43; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    footer { background: #102a43; color: #e2e8f0; padding: 24px 20px; text-align: center; font-size: 13px; margin-top: 40px; }
    footer a { color: #fde047; }
    .interactive-banner { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center; }
    .interactive-banner a { display: inline-block; background: #064e3b; color: #ffffff; padding: 10px 20px; border-radius: 6px; font-weight: bold; text-decoration: none; margin-top: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>${data.heading}</h1>
    <p>${data.subheading}</p>
  </header>

  <nav aria-label="Main Navigation">
    <a href="/">Home (Mwanzo)</a>
    <a href="/admission-documents">Nyaraka za Udahili (Admission Docs)</a>
    <a href="/about">Kuhusu Shule (About)</a>
    <a href="/academics">Taaluma (Academics)</a>
    <a href="/results">Matokeo (NECTA S0486)</a>
    <a href="/campus-tour">Ziara ya Shule (Campus Tour)</a>
    <a href="/fees">Ada & Malipo (Fees)</a>
    <a href="/teachers">Walimu (Teachers)</a>
    <a href="/news">Habari (News)</a>
    <a href="/contact">Mawasiliano (Contact)</a>
  </nav>

  <main>
    <div class="interactive-banner">
      <p><strong>Uomboni Secondary School Portal:</strong> Tembelea tovuti yetu ya kidijitali kwa matumizi kamili ya mfumo wa udahili, matokeo na huduma za mtandaoni.</p>
      <a href="${data.canonicalUrl}">Fungua Mfumo Kamili wa Tovuti (Launch Portal) &rarr;</a>
    </div>

    ${data.swContent}
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
    ${data.enContent}
  </main>

  <footer>
    <p>&copy; ${new Date().getFullYear()} Uomboni Secondary School (NECTA S0486) &bull; Catholic Diocese of Moshi.</p>
    <p>Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania &bull; Simu: +255 782 558 127 &bull; Barua Pepe: uombonisec@gmail.com</p>
    <p><a href="/sitemap.xml">XML Sitemap</a> &bull; <a href="/robots.txt">Robots.txt</a> &bull; <a href="/admission-documents">Nyaraka za Udahili</a></p>
  </footer>
</body>
</html>`;
}
