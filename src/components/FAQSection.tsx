import React, { useState, useId } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  ChevronDown,
  Search,
  HelpCircle,
  FileText,
  Clock,
  Shirt,
  DollarSign,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: 'admissions' | 'uniforms' | 'schedules' | 'fees';
  questionSw: string;
  questionEn: string;
  answerSw: string;
  answerEn: string;
  keyPointsSw?: string[];
  keyPointsEn?: string[];
}

interface FAQSectionProps {
  onOpenAdmissions?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenAdmissions,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open the first question by default
    'faq-3': true, // Open uniform question by default
  });

  const searchInputId = useId();

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'admissions',
      questionSw: 'Je, ni sifa zipi za kujiunga na Kidato cha Kwanza (Form One) na Pre-Form One?',
      questionEn: 'What are the admission requirements for Form One and Pre-Form One (2026/2027)?',
      answerSw:
        'Shule ya Sekondari Uomboni inapokea wavulana na wasichana kwa mfumo wa Bweni (Boarding) na Kutwa (Day Scholars). Udahili wa Kidato cha Kwanza unazingatia ufaulu wa mtihani wa kumaliza elimu ya msingi (PSLE) au kufaulu mtihani wa usaili wa ndani ya shule. Pia tunatoa mafunzo maalum ya Pre-Form One kuanzia mwezi Septemba kwa wahitimu wa Darasa la Saba ili kuwajengea umahiri thabiti katika lugha ya Kiingereza, Hisabati, Sayansi na mbinu za kujisomea sekondari.',
      answerEn:
        'Uomboni Secondary School admits both boys and girls for both Boarding and Day programs. Form One admission considers successful completion of the Primary School Leaving Examination (PSLE) or passing our internal entrance assessment. We also conduct an intensive Pre-Form One foundation course starting every September to build solid competencies in English Language, Basic Mathematics, Science concepts, and secondary-level study skills.',
      keyPointsSw: [
        'Ufaulu wa Darasa la Saba au kufanya mtihani wa usaili wa shule',
        'Kozi ya Pre-Form One huanza kila Septemba kwa maandalizi ya kina',
        'Nafasi zinapatikana kwa wavulana na wasichana (Bweni na Kutwa)',
      ],
      keyPointsEn: [
        'PSLE pass mark or completion of school diagnostic interview',
        'Pre-Form One orientation classes commence every September',
        'Available for both boys and girls in boarding and day streams',
      ],
    },
    {
      id: 'faq-2',
      category: 'admissions',
      questionSw: 'Fomu za maombi ya kujiunga (Joining Instructions) zinapatikana wapi?',
      questionEn: 'Where can prospective parents obtain application forms and Joining Instructions?',
      answerSw:
        'Fomu za kujiunga na maelekezo kamili ya shule (Joining Instructions) zinapatikana kwa urahisi: 1) Pakua moja kwa moja mtandaoni kupitia tovuti hii (sehemu ya Udahili), 2) Ofisi ya Mkuu wa Shule Uomboni iliyopo Marangu Magharibi, 3) Moshi Bookshop mjini Moshi, na 4) Kituo cha Ngarenaro. Fomu zote zilizojazwa zinatakiwa kurudishwa ofisini zikiwa na nakala za cheti cha kuzaliwa, ripoti ya maendeleo ya shule ya awali, na picha nne za pasipoti.',
      answerEn:
        'Official application forms and comprehensive Joining Instructions can be obtained from: 1) Instant online download right here on this portal (Admissions section), 2) Headmaster’s Office at Uomboni campus in Marangu West, 3) Moshi Bookshop in Moshi Town, and 4) Ngarenaro designated center. Completed forms must be submitted alongside a copy of the student’s birth certificate, recent academic progress report, and four passport-sized photographs.',
      keyPointsSw: [
        'Pakua mtandaoni kupitia kitufe cha Udahili kwenye tovuti hii',
        'Ofisi ya Mkuu wa Shule Marangu, Moshi Bookshop, na Ngarenaro',
        'Ambatisha cheti cha kuzaliwa, ripoti ya shule na picha 4 za pasipoti',
      ],
      keyPointsEn: [
        'Direct digital download via the Admissions button on this website',
        'Available at Campus Office Marangu, Moshi Bookshop, and Ngarenaro',
        'Attach birth certificate, academic transcript, and 4 passport photos',
      ],
    },
    {
      id: 'faq-3',
      category: 'uniforms',
      questionSw: 'Sare rasmi za Shule ya Sekondari Uomboni zikoje na sheria zake ni zipi?',
      questionEn: 'What is the official school uniform dress code and what are the regulations?',
      answerSw:
        'Sare rasmi ya Uomboni inazingatia staha, nidhamu na utambulisho wa shule: Wavulana huvaa suruali ndefu za dark navy blue zilizoshonwa kwa heshima (hairuhusiwi mtindo wa kubana au mlegezo), mashati meupe ya mikono mifupi yenye nembo rasmi ya shule kifuani, sweta rasmi ya dark navy yenye nembo ya shule na mistari ya dhahabu, tai ya shule, mkanda mweusi wa ngozi usio na nembo kubwa, na viatu vyeusi vya ngozi vya kamba. Wasichana huvaa sketi ndefu za dark navy blue (zinazovuka magoti kwa heshima), mashati meupe yenye nembo, sweta rasmi ya shule, soksi ndefu nyeupe, na viatu vyeusi vya ngozi bapa. Sare zote za kitaasisi zinapaswa kuwa safi na zimenyoshwa kila siku.',
      answerEn:
        'Our official uniform reflects neatness, moral discipline, and school identity: Boys wear modest dark navy blue trousers (skinny or low-waist alterations are strictly prohibited), white short-sleeved shirts with the embroidered official school crest on the left chest, school dark navy knit sweater with gold trim and badge, school tie, plain black leather belt, and black lace-up leather shoes. Girls wear modest dark navy blue skirts (strictly below knee length), white collared shirts with school crest, official knit sweater, white knee-high socks, and flat black leather shoes. All uniforms must be kept clean, well-pressed, and unaltered.',
      keyPointsSw: [
        'Rangi rasmi: Dark Navy Blue na Sharti jeupe lenye Nembo Rasmi ya Uomboni',
        'Sweta rasmi ya dark navy yenye mistari ya dhahabu na beji ya shule',
        'Viatu vyeusi vya ngozi (vya kamba kwa wavulana, bapa kwa wasichana)',
        'Mtindo wowote wa kubana au kurekebisha mshono nje ya mwongozo haukubaliki',
      ],
      keyPointsEn: [
        'Official palette: Institutional Dark Navy Blue & White with Embroidered Crest',
        'Official school sweater with gold striping and verified badge',
        'Standard black leather shoes (lace-ups for boys, flat shoes for girls)',
        'Any tight fitting or altered uniform tailoring is strictly prohibited',
      ],
    },
    {
      id: 'faq-4',
      category: 'uniforms',
      questionSw: 'Kuna mavazi gani ya ziada kwa ajili ya Bweni, Kanisa, na Michezo?',
      questionEn: 'What additional attire is required for Boarding, Church, and Sports?',
      answerSw:
        'Kwa wanafunzi wa Bweni na shughuli za ziada: 1) Sare ya Michezo: T-shirt rasmi ya michezo ya Uomboni, bukta au tracksuit ya shule na viatu vya michezo (sneakers). 2) Mavazi ya Kanisani (Jumapili): Mavazi nadhifu ya heshima yaliyoidhinishwa kwenye mwongozo wa kujiunga kwa ajili ya Misa Takatifu na ibada. 3) Nguo za jioni/shamba: Tracksuit na mavazi mepesi nadhifu kwa ajili ya usafi na kazi za mikono jioni. Mavazi ya nyumbani yasiyo na staha hayaruhusiwi kambini.',
      answerEn:
        'For boarding students and extra-curriculars: 1) Physical Education & Games: Official Uomboni PE T-shirt, school athletic shorts/tracksuit, and sports trainers. 2) Sunday Worship & Liturgy: Neat Sunday church attire compliant with campus moral guidelines for Eucharistic celebrations. 3) Casual Campus Wear: Modest tracksuits and casual work clothes designated for dormitory time and environmental maintenance. Indecent or flamboyant street wear is strictly prohibited on campus.',
      keyPointsSw: [
        'T-shirt rasmi ya michezo ya Uomboni na viatu vya michezo (sneakers)',
        'Nguo nadhifu za heshima za ibada ya Jumapili na Misa Takatifu',
        'Mavazi ya staha pekee yanaruhusiwa ndani ya hosteli na mazingira ya shule',
      ],
      keyPointsEn: [
        'Official Uomboni sports PE shirt with sports running shoes',
        'Modest Sunday church attire for Holy Mass and religious fellowship',
        'Decent casual clothing strictly regulated in dormitories and compound',
      ],
    },
    {
      id: 'faq-5',
      category: 'schedules',
      questionSw: 'Ratiba ya siku ikoje kwa wanafunzi wa Kutwa (Day Scholars)?',
      questionEn: 'What is the daily timetable and routine for Day Scholars?',
      answerSw:
        'Wanafunzi wa kutwa huanza siku yao mapema: Saa 1:00 Asubuhi (07:00 AM) ni kuwasili shuleni na kujiandaa; Saa 1:15 - 1:45 Asubuhi ni Mkutano Mkuu wa Asubuhi (Morning Assembly), ukaguzi wa sare na usafi, na sala; Saa 1:45 Asubuhi hadi Saa 7:30 Mchana ni vipindi vya masomo ya darasani na maabara (kukiwa na mapumziko ya chai saa 4:00 asubuhi); Saa 7:30 - 8:30 Mchana ni chakula cha mchana shuleni; Saa 8:30 - 10:00 Jioni ni vipindi vya alasiri na ushauri wa kitaaluma; Saa 10:00 - 10:45 Jioni ni michezo na usafi wa mazingira kabla ya kuondoka kuelekea nyumbani.',
      answerEn:
        'Day scholars follow a disciplined, prompt daily schedule: 07:00 AM — Campus arrival and classroom preparation; 07:15 - 07:45 AM — Morning assembly, uniform/grooming inspection, and devotion; 07:45 AM - 01:30 PM — Academic subject lessons and science lab practicals (with tea break at 10:00 AM); 01:30 - 02:30 PM — Nutritious hot lunch in the dining hall; 02:30 - 04:00 PM — Afternoon instructional periods and remedial tutorials; 04:00 - 04:45 PM — Sports, co-curricular clubs, and campus environmental care before safe dismissal home.',
      keyPointsSw: [
        '07:00 AM: Kufika shuleni / Morning check-in',
        '07:15 - 07:45 AM: Mkutano wa asubuhi (Assembly) na ukaguzi wa sare',
        '07:45 AM - 01:30 PM: Vipindi vya asubuhi na vitendo vya maabara',
        '01:30 - 02:30 PM: Chakula cha mchana shuleni (Hot nutritious lunch)',
        '04:45 PM: Kumaliza ratiba ya michezo na kuondoka kwenda nyumbani',
      ],
      keyPointsEn: [
        '07:00 AM: Campus arrival and morning check-in',
        '07:15 - 07:45 AM: Morning assembly, inspection and devotion',
        '07:45 AM - 01:30 PM: Class lectures and science practicals',
        '01:30 - 02:30 PM: Hot campus lunch served to all students',
        '04:45 PM: Daily dismissal following sports and clubs',
      ],
    },
    {
      id: 'faq-6',
      category: 'schedules',
      questionSw: 'Ratiba ya saa 24 ya wanafunzi wa Bweni (Boarding Students) inapangwaje?',
      questionEn: 'How is the 24-hour daily boarding schedule organized for resident students?',
      answerSw:
        'Maisha ya bweni Uomboni yanajenga nidhamu thabiti ya kibinafsi: Saa 11:30 Asubuhi (05:30 AM) kuamka, usafi wa hosteli na sala ya asubuhi; Saa 12:15 Asubuhi (06:15 AM) kifungua kinywa dining hall; Saa 1:00 Asubuhi kujiunga na wanafunzi wa kutwa darasani hadi jioni; Saa 10:30 Jioni (04:30 PM) michezo, kuoga na maandalizi binafsi; Saa 12:30 Jioni (06:30 PM) chakula cha jioni; Saa 1:00 - 3:30 Usiku (07:00 PM - 09:30 PM) ni masomo ya jioni (Evening Supervised Study Prep) madarasani chini ya usimamizi wa walimu wa zamu; Saa 3:45 Usiku sala ya jioni; na Saa 4:00 Usiku (10:00 PM) taa huzimwa (Lights Out) kwa ajili ya usingizi salama.',
      answerEn:
        'Boarding life at Uomboni fosters structured independence and academic stamina: 05:30 AM — Wake-up, dormitory bed making, hygiene, and morning prayer; 06:15 AM — Wholesome breakfast in the dining hall; 07:00 AM — Join academic assembly and classroom lessons with day scholars; 04:30 PM — Sports, laundry, showers, and recreation; 06:30 PM — Evening dinner; 07:00 - 09:30 PM — Strictly monitored evening prep study in academic classrooms under faculty supervision; 09:45 PM — Night prayer and roll call; 10:00 PM — Lights out for restful sleep.',
      keyPointsSw: [
        '05:30 AM: Kuamka, usafi wa vyumba na maombi ya asubuhi',
        '07:00 PM - 09:30 PM: Masomo ya jioni (Evening Prep) chini ya usimamizi wa walimu',
        '10:00 PM: Taa kuzimwa (Lights Out) ili kuhakikisha usingizi wa kutosha na afya',
        'Jumamosi: Masomo ya ziada na usafi; Jumapili: Misa Takatifu na malezi ya kiroho',
      ],
      keyPointsEn: [
        '05:30 AM: Wake-up, room inspection, and personal devotion',
        '07:00 PM - 09:30 PM: Supervised classroom evening prep study',
        '10:00 PM: Lights out to preserve student rest and well-being',
        'Weekends: Saturday remedial prep & laundry; Sunday Mass & fellowship',
      ],
    },
    {
      id: 'faq-7',
      category: 'fees',
      questionSw: 'Ada inalipwaje na kuna utaratibu wa kulipa kwa awamu (Installments)?',
      questionEn: 'How are school fees paid and can parents pay in installments?',
      answerSw:
        'Ndio, uongozi wa shule unatambua hali za wazazi na unaruhusu kulipa ada kwa awamu nne (Terms/Installments) mwanzoni mwa kila robo ya mwaka wa masomo. Malipo yote hufanywa moja kwa moja benki kwenye akaunti rasmi za shule: CRDB Bank (A/C: 0150248900100) au NMB Bank (A/C: 22110023456), au kupitia namba rasmi ya malipo ya simu (Lipa Namba M-Pesa / Tigo Pesa: 5882194). Malipo ya taslimu (Cash) hayapokelewi shuleni kwa sababu za kiusalama na uwazi wa kifedha.',
      answerEn:
        'Yes, school administration provides family-friendly payment flexibility, permitting fees to be paid in four convenient installments at the start of each academic term. All payments are made directly via official banking channels: CRDB Bank (A/C: 0150248900100) or NMB Bank (A/C: 22110023456), or through official mobile merchant Lipa Namba (M-Pesa / Tigo Pesa: 5882194). Cash transactions are strictly not handled on campus for safety and fiscal transparency.',
      keyPointsSw: [
        'Ada inaweza kulipwa kwa awamu 4 kwa mwaka wa masomo',
        'Akaunti za Benki: CRDB Bank (0150248900100) na NMB Bank (22110023456)',
        'Lipa Namba ya Simu: 5882194 (M-Pesa na Tigo Pesa)',
        'Stakabadhi ya benki (Bank Pay-in slip) lazima iwasilishwe kwa Bursar',
      ],
      keyPointsEn: [
        'Fees payable in 4 manageable termly installments per academic year',
        'Bank Accounts: CRDB Bank (0150248900100) and NMB Bank (22110023456)',
        'Mobile Merchant: Lipa Namba 5882194 (M-Pesa and Tigo Pesa)',
        'Original bank deposit slip must be presented to School Bursar',
      ],
    },
    {
      id: 'faq-8',
      category: 'admissions',
      questionSw: 'Je, wanafunzi wa uhamisho (Kidato cha II na III) wanapokelewa?',
      questionEn: 'Are transfer students accepted into Form Two and Form Three?',
      answerSw:
        'Ndio, Shule ya Sekondari Uomboni inapokea wanafunzi wa uhamisho kwa Kidato cha Pili na Tatu kulingana na upatikanaji wa nafasi darasani na mabwenini. Mzazi anapaswa kuleta: 1) Ripoti rasmi za maendeleo ya kitaaluma (Term Report Cards) za shule anayotoka, 2) Barua ya uthibitisho wa tabia njema kutoka kwa Mkuu wa Shule aliyotoka, na 3) Namba rasmi ya mtihani/PREM. Wanafunzi wote wa uhamisho hufanyiwa usaili maalum wa kimasomo kabla ya kukubaliwa rasmi.',
      answerEn:
        'Yes, Uomboni Secondary School accepts mid-stream transfers into Form Two and Form Three, subject to vacancy in academic streams and boarding accommodations. Parents must present: 1) Official terminal report cards from the previous school, 2) A letter of good conduct signed by the former Head of School, and 3) The student’s verified NECTA PREM registration number. All transfer applicants complete a diagnostic academic assessment before admission is formalized.',
      keyPointsSw: [
        'Nafasi zipo kwa Kidato cha II na III kwa wavulana na wasichana',
        'Leta ripoti za kitaaluma, barua ya uthibitisho wa tabia na namba ya PREM',
        'Mwanafunzi atafanya mtihani mfupi wa usaili wa kupima uwezo',
      ],
      keyPointsEn: [
        'Vacancies available for Form Two and Three (boys and girls)',
        'Present previous academic transcripts, character letter, and PREM code',
        'Diagnostic assessment required to confirm appropriate placement',
      ],
    },
  ];

  const categories = [
    { id: 'all', labelSw: 'Maswali Yote', labelEn: 'All Questions', count: faqs.length },
    { id: 'admissions', labelSw: 'Udahili & Fomu', labelEn: 'Admissions & Entry', count: faqs.filter(f => f.category === 'admissions').length },
    { id: 'uniforms', labelSw: 'Sare za Shule', labelEn: 'School Uniforms', count: faqs.filter(f => f.category === 'uniforms').length },
    { id: 'schedules', labelSw: 'Ratiba ya Siku', labelEn: 'Daily Schedules', count: faqs.filter(f => f.category === 'schedules').length },
    { id: 'fees', labelSw: 'Ada na Malipo', labelEn: 'Fees & Payment', count: faqs.filter(f => f.category === 'fees').length },
  ];

  // Filtering
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const qText = (faq.questionSw + ' ' + faq.questionEn).toLowerCase();
    const aText = (faq.answerSw + ' ' + faq.answerEn).toLowerCase();
    return qText.includes(query) || aText.includes(query);
  });

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isSwahili = language === 'sw';

  return (
    <section
      id="faq"
      className="py-20 sm:py-24 bg-white border-t border-b border-[#102A43]/10 relative"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A227] tracking-wider uppercase mb-2">
            <HelpCircle className="w-4 h-4 text-[#C9A227]" />
            <span>
              {isSwahili ? 'Miongozo na Majibu ya Haraka' : 'Guidance & Answers for Parents'}
            </span>
          </div>
          <h2
            id="faq-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]"
          >
            {isSwahili
              ? 'Maswali Yanayoulizwa Mara kwa Mara'
              : 'Frequently Asked Questions'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
            {isSwahili
              ? 'Pata majibu ya kina na mwongozo rasmi kuhusu taratibu za udahili, mahitaji ya sare za shule, ratiba ya kila siku ya masomo na bweni, na utaratibu wa malipo ya ada Shule ya Sekondari Uomboni.'
              : 'Find authoritative answers regarding our admission process, official uniform regulations, structured daily class and boarding timetables, and flexible installment fee payment options at Uomboni Secondary School.'}
          </p>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Category Tabs (Segmented Buttons) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFF0] rounded-md border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#102A43] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-[#102A43] hover:bg-white'
                }`}
              >
                <span>{isSwahili ? cat.labelSw : cat.labelEn}</span>
                <span className="ml-1.5 opacity-70 text-[10px]">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Real-time Search Input */}
          <div className="relative w-full md:w-72">
            <label htmlFor={searchInputId} className="sr-only">
              {isSwahili ? 'Tafuta swali au mada' : 'Search questions or topics'}
            </label>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id={searchInputId}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isSwahili ? 'Tafuta sare, udahili, ratiba...' : 'Search uniform, admission, schedule...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FFFFF0] border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227] transition-all text-[#102A43] placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery.trim() && (
          <div className="mt-4 text-xs text-slate-500">
            {isSwahili
              ? `Yamepatikana maswali ${filteredFaqs.length} yanayolingana na "${searchQuery}":`
              : `Found ${filteredFaqs.length} results matching "${searchQuery}":`}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="mt-6 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center bg-[#FFFFF0] rounded-lg border border-dashed border-slate-300 p-8">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#102A43]">
                {isSwahili
                  ? 'Hakuna maswali yaliyolingana na utafutaji wako'
                  : 'No questions matched your search criteria'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isSwahili
                  ? 'Jaribu kubadilisha maneno ya utafutaji au wasiliana moja kwa moja na ofisi ya shule.'
                  : 'Try modifying your search query or contact the school administration office directly.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-1.5 text-xs font-semibold bg-[#102A43] text-white rounded hover:bg-[#0A1C2E] transition-colors cursor-pointer"
              >
                {isSwahili ? 'Onyesha Maswali Yote' : 'Reset All Filters'}
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = Boolean(openItemIds[faq.id]);
              const question = isSwahili ? faq.questionSw : faq.questionEn;
              const answer = isSwahili ? faq.answerSw : faq.answerEn;
              const keyPoints = isSwahili ? faq.keyPointsSw : faq.keyPointsEn;

              const getCategoryBadge = () => {
                switch (faq.category) {
                  case 'admissions':
                    return {
                      label: isSwahili ? 'Udahili' : 'Admission',
                      icon: <FileText className="w-3.5 h-3.5 text-[#C9A227]" />,
                    };
                  case 'uniforms':
                    return {
                      label: isSwahili ? 'Sare za Shule' : 'Uniform',
                      icon: <Shirt className="w-3.5 h-3.5 text-[#C9A227]" />,
                    };
                  case 'schedules':
                    return {
                      label: isSwahili ? 'Ratiba ya Siku' : 'Schedule',
                      icon: <Clock className="w-3.5 h-3.5 text-[#C9A227]" />,
                    };
                  case 'fees':
                    return {
                      label: isSwahili ? 'Ada & Malipo' : 'Fees',
                      icon: <DollarSign className="w-3.5 h-3.5 text-[#C9A227]" />,
                    };
                  default:
                    return {
                      label: isSwahili ? 'Miongozo' : 'General',
                      icon: <HelpCircle className="w-3.5 h-3.5 text-[#C9A227]" />,
                    };
                }
              };

              const badge = getCategoryBadge();

              return (
                <div
                  key={faq.id}
                  className={`rounded-lg border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#FFFFF0] border-[#102A43]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#102A43]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Topic Category Indicator */}
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-0.5 shrink-0">
                        {badge.icon}
                        <span>{badge.label}</span>
                        <span aria-hidden="true" className="text-slate-300 mx-1">·</span>
                      </span>

                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-[#102A43] leading-snug">
                          {question}
                        </h3>
                        {/* Mobile category text */}
                        <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-bold text-[#C9A227] uppercase tracking-wider mt-1">
                          {badge.label}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#102A43] text-white rotate-180'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-4 sm:px-5 pb-5 pt-0 animate-in fade-in duration-200"
                    >
                      <div className="pt-3 border-t border-slate-200/80">
                        <p className="text-xs sm:text-sm text-slate-700 leading-[1.8] font-normal">
                          {answer}
                        </p>

                        {/* Bulleted Key Takeaways */}
                        {keyPoints && keyPoints.length > 0 && (
                          <div className="mt-4 p-3.5 bg-white rounded-md border border-slate-200/80">
                            <span className="text-[11px] font-bold text-[#102A43] uppercase tracking-wider block mb-2">
                              {isSwahili ? 'Mambo Muhimu ya Kuzingatia:' : 'Key Summary Points:'}
                            </span>
                            <ul className="space-y-1.5">
                              {keyPoints.map((point, ptIdx) => (
                                <li
                                  key={ptIdx}
                                  className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Action Callout Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-lg bg-[#102A43] text-[#FFFFF0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#C9A227]">
              {isSwahili ? 'Je, una swali la ziada?' : 'Have Further Questions?'}
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
              {isSwahili
                ? 'Ofisi ya Mkuu wa Shule iko wazi kusaidia wazazi na wanafunzi'
                : 'Our Administration is Ready to Assist Your Family'}
            </h3>
            <p className="text-xs sm:text-sm text-[#FFFFF0]/85 leading-relaxed font-normal">
              {isSwahili
                ? 'Wasiliana nasi moja kwa moja kwa simu au tembelea ofisi zetu za shule Marangu Magharibi, Moshi Vijijini kwa ushauri wa kitaaluma na ufafanuzi wowote.'
                : 'Reach out via phone, email, or visit our campus in Marangu West, Moshi Rural for individualized admissions guidance and academic counseling.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            {onOpenAdmissions && (
              <button
                type="button"
                onClick={onOpenAdmissions}
                className="px-5 py-3 rounded-md bg-[#FFFFF0] text-[#102A43] font-semibold text-xs hover:bg-white transition-colors cursor-pointer text-center shadow-xs"
              >
                {isSwahili ? 'Omba Udahili Sasa' : 'Apply for Admission'}
              </button>
            )}

            <a
              href="tel:+255767207688"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md border border-[#C9A227] text-[#FFFFF0] font-semibold text-xs hover:bg-[#C9A227]/20 transition-colors cursor-pointer text-center"
            >
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>0767 207 688</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
