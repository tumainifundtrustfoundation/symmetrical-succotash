import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  HelpCircle,
  ChevronDown,
  Search,
  CreditCard,
  FileText,
  Calendar,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  MessageCircle,
  Download,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building,
  Home
} from 'lucide-react';

interface FAQSectionProps {
  onOpenJoiningInstructions?: () => void;
  onOpenVituMuhimu?: () => void;
  onOpenAdmissions?: () => void;
  onOpenMedicalForm?: () => void;
  onNavigate?: (sectionId: string) => void;
}

type FAQCategory = 'all' | 'fees' | 'joining' | 'schedules' | 'academics';

interface FAQItem {
  id: string;
  category: 'fees' | 'joining' | 'schedules' | 'academics';
  questionSw: string;
  questionEn: string;
  answerSw: string;
  answerEn: string;
  highlightsSw?: string[];
  highlightsEn?: string[];
  actionType?: 'joining' | 'fees' | 'vitu-muhimu' | 'medical' | 'contact' | 'call';
  actionLabelSw?: string;
  actionLabelEn?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenJoiningInstructions,
  onOpenVituMuhimu,
  onOpenAdmissions,
  onOpenMedicalForm,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItemIds, setOpenItemIds] = useState<Record<string, boolean>>({
    'fees-structure': true,
    'joining-download': true,
  });

  const toggleItem = (id: string) => {
    setOpenItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const faqData: FAQItem[] = useMemo(
    () => [
      // 1. School Fees & Payment Queries
      {
        id: 'fees-structure',
        category: 'fees',
        questionSw: 'Ada ya shule kwa wanafunzi wa Kutwa na Bweni ni kiasi gani kwa mwaka 2026/2027?',
        questionEn: 'What are the tuition and boarding fees for Day and Boarding students in 2026/2027?',
        answerSw:
          'Ada ya shule inatofautiana kulingana na hadhi ya mwanafunzi (Kutwa au Bweni). Kwa wanafunzi wa Bweni, gharama inajumuisha chakula kamili mara tatu kwa siku, malazi salama, umeme na maji ya uhakika, huduma za afya ya kwanza, na ada ya mafunzo ya vitendo maabara. Kwa wanafunzi wa Kutwa, inajumuisha ada ya masomo na chakula cha mchana. Mwongozo kamili wa ada na mchanganuo wa steshenari na mitihani unapatikana kwenye fomu rasmi ya Kujiunga.',
        answerEn:
          'School fees vary based on enrollment status (Day Scholar or Boarder). Boarding fees cover full board meals (3 times daily), secure accommodation, reliable utilities, first aid health services, and science laboratory practicals. Day scholar fees cover academic tuition and daily lunch. A comprehensive breakdown including examination and stationery contributions is detailed in the official Joining Instructions.',
        highlightsSw: [
          'Malipo yanajumuisha bima ya afya ya awali na maabara za kisasa',
          'Chakula bora chenye virutubisho kwa wanafunzi wote',
          'Mchanganuo halisi upo kwenye mwongozo wa benki na fomu rasmi',
        ],
        highlightsEn: [
          'Fees include basic health safety and modern laboratory practicals',
          'Nutritious balanced meals provided daily',
          'Exact itemized amounts appear on the official fee invoice schedule',
        ],
        actionType: 'fees',
        actionLabelSw: 'Tazama Sehemu ya Malipo ya Ada',
        actionLabelEn: 'View Fee Payment Section',
      },
      {
        id: 'fees-installments',
        category: 'fees',
        questionSw: 'Je, ada ya shule inaweza kulipwa kwa awamu (installments)?',
        questionEn: 'Can school fees be paid in installments?',
        answerSw:
          'Ndio, uongozi wa Shule ya Sekondari Uomboni unaruhusu malipo kwa awamu mbili kuu (Mhula wa Kwanza na Mhula wa Pili) ili kurahisisha wazazi na walezi kupanga bajeti. Awamu ya kwanza (60%) inatakiwa kulipwa kabla ya au wakati wa kuripoti shuleni mwanzoni mwa mwaka wa masomo, na awamu ya pili (40%) inalipwa kabla ya kuanza kwa muhula wa pili mwezi Julai.',
        answerEn:
          'Yes, Uomboni Secondary School management accommodates payment in two main termly installments to assist parents with financial planning. The first installment (60%) must be cleared before or upon reporting at the start of the academic year, and the second installment (40%) is due before the resumption of Term Two in July.',
        highlightsSw: [
          'Awamu ya 1 (60%): Kabla ya kufungua shule (Januari)',
          'Awamu ya 2 (40%): Kabla ya kufungua mhula wa pili (Julai)',
          'Hakuna mwanafunzi atakayeingia darasani bila stakabadhi rasmi ya benki',
        ],
        highlightsEn: [
          'Installment 1 (60%): Due before opening day (January)',
          'Installment 2 (40%): Due before Term 2 resumption (July)',
          'Official stamped bank pay-in slip is mandatory for classroom entry',
        ],
        actionType: 'fees',
        actionLabelSw: 'Mwongozo wa Malipo',
        actionLabelEn: 'Payment Guidelines',
      },
      {
        id: 'fees-bank-accounts',
        category: 'fees',
        questionSw: 'Je, akaunti rasmi za benki za shule na namba za malipo ni zipi?',
        questionEn: 'What are the official school bank accounts and payment channels?',
        answerSw:
          'Malipo yote ya ada na michango lazima yafanyike kupitia akaunti rasmi ya benki ya Shule ya Sekondari Uomboni (CRDB Bank - Namba ya Akaunti: 01J1079051400) au kupitia Namba ya Udhibiti wa Serikali (Government Control Number / GePG) inayotolewa na ofisi ya Mhasibu. TAHADHARI KUBWA: Shule haipokei pesa taslimu mkononi wala malipo kwenda namba binafsi za simu.',
        answerEn:
          'All tuition fees and institutional contributions must be deposited directly into Uomboni Secondary School official bank account (CRDB Bank - Account Number: 01J1079051400) or via the Government Electronic Payment Gateway (GePG Control Number) generated by the Bursar. STRICT WARNING: The school does not accept direct cash in hand or transfers to personal phone numbers.',
        highlightsSw: [
          'CRDB Bank: 01J1079051400 (Tawi la Moshi / Marangu)',
          'Andika jina kamili la mwanafunzi na namba ya mtihani kwenye pay-in slip',
          'Wasilisha slip halisi ya benki kwa Mhasibu (Bursar) kupata risiti halisi',
        ],
        highlightsEn: [
          'CRDB Bank: 01J1079051400 (Moshi / Marangu Branch)',
          'Write student full name and index number clearly on the deposit slip',
          'Submit original bank slip to the Bursar office to obtain the official receipt',
        ],
        actionType: 'fees',
        actionLabelSw: 'Tazama Maelezo ya Benki',
        actionLabelEn: 'View Bank Accounts',
      },
      {
        id: 'fees-receipt-verification',
        category: 'fees',
        questionSw: 'Je, mzazi anapataje risiti rasmi baada ya kufanya malipo?',
        questionEn: 'How does a parent receive an official receipt after payment?',
        answerSw:
          'Baada ya kulipa benki, mzazi anaweza kuleta stakabadhi halisi shuleni kwa Mhasibu au kutumia mfumo wetu wa mtandaoni (Online Fee Verification) kwenye tovuti hii kwa kuweka namba ya kumbukumbu ya muamala (Transaction Reference). Pia unaweza kutuma picha ya slip ya benki kupitia WhatsApp ya Ofisi ya Mhasibu (+255 782 558 127) na utatumiwa stakabadhi rasmi yenye muhuri ndani ya saa chache.',
        answerEn:
          'After depositing at the bank, parents can present the pay-in slip at the Bursar office or verify instantly through our online Fee Verification portal on this website by submitting the transaction reference. Alternatively, send a clear snapshot of the bank slip via official Bursar WhatsApp (+255 782 558 127) to receive an official stamped digital receipt.',
        highlightsSw: [
          'Uthibitisho wa papo hapo kupitia tovuti ya shule',
          'WhatsApp ya Mhasibu: +255 782 558 127',
          'Risiti inahifadhiwa kwenye kumbukumbu za mwanafunzi za kudumu',
        ],
        highlightsEn: [
          'Instant verification available via the school website',
          'Bursar WhatsApp Hotline: +255 782 558 127',
          'Receipt is archived permanently into student academic record',
        ],
        actionType: 'fees',
        actionLabelSw: 'Thibitisha Risiti Mtandaoni',
        actionLabelEn: 'Verify Receipt Online',
      },

      // 2. Joining Instructions & Admission Queries
      {
        id: 'joining-download',
        category: 'joining',
        questionSw: 'Nawezaje kupata Fomu Rasmi ya Maelekezo ya Kujiunga (Joining Instructions 2026/2027)?',
        questionEn: 'How can I obtain the official Joining Instructions Form for 2026/2027?',
        answerSw:
          'Fomu kamili ya Kujiunga (Official Joining Instructions 2026/2027) inapatikana bure kwa kupakua moja kwa moja hapa kwenye tovuti yetu kwa muundo wa PDF unaoweza kuchapishwa. Fomu hiyo inajumuisha maelekezo ya sheria za shule, vifaa vya bweni, mchanganuo wa sare, ratiba ya kuripoti, na Fomu ya Uchunguzi wa Afya (Medical Examination Form - Part B). Unaweza pia kuipata ofisini shuleni Marangu.',
        answerEn:
          'The complete official Joining Instructions 2026/2027 document is available for free instant PDF download directly on this website. The package incorporates school bylaws, boarding supplies checklist, uniform specifications, reporting dates, and the official Medical Examination Form (Part B). Hard copies are also accessible at the school administration office in Marangu.',
        highlightsSw: [
          'Inapakuliwa bure kwa muundo wa PDF tayari kwa kuchapishwa',
          'Inajumuisha Fomu ya Daktari (Medical Form)',
          'Ina maelekezo kamili ya sare za kike na kiume',
        ],
        highlightsEn: [
          'Free PDF download ready for printing',
          'Includes official Medical Examination Form',
          'Complete guidelines on boys and girls uniform specifications',
        ],
        actionType: 'joining',
        actionLabelSw: 'Pakua Fomu ya Kujiunga (PDF)',
        actionLabelEn: 'Download Joining Instructions (PDF)',
      },
      {
        id: 'joining-essential-items',
        category: 'joining',
        questionSw: 'Ni vitu gani muhimu (Vitu Muhimu) mwanafunzi wa bweni anatakiwa kuleta?',
        questionEn: 'What essential items must boarding students bring on arrival day?',
        answerSw:
          'Kila mwanafunzi wa bweni anapaswa kufika na: Godoro la sponji saizi 2.5 x 6 ft lenye unene wa kawaida, mashuka mawili ya rangi ya bluu iliyokoza na taulo, neti ya mbu yenye pembe nne (bluu au nyeupe), ndoo mbili za plastiki (lita 10 au 20), sahani, kijiko na kikombe cha bati au plastiki ngumu, tochi au taa ya dharura ya kuchaji, vifaa vya usafi binafsi (sabuni, mswaki, dawa), sare rasmi za shule na nguo za michezo kama zilivyoainishwa.',
        answerEn:
          'Every boarding student must arrive with: A standard foam mattress (2.5 x 6 ft), two navy/light blue bedsheets and a bath towel, a four-corner mosquito net, two durable plastic buckets (10L/20L), stainless steel/durable plate, spoon and cup, rechargeable emergency light/torch, personal toiletries (soap, toothbrush, toothpaste), and official school uniforms and sports tracksuits as stipulated.',
        highlightsSw: [
          'Godoro 2.5 x 6 ft & Mashuka 2 ya bluu',
          'Neti ya mbu ya pembe nne & Ndoo 2 za plastiki',
          'Vyombo vya chakula vya kudumu & Vifaa vya usafi',
        ],
        highlightsEn: [
          'Mattress 2.5 x 6 ft & 2 blue bedsheets',
          'Four-corner mosquito net & 2 plastic buckets',
          'Durable eating utensils & personal hygiene kit',
        ],
        actionType: 'vitu-muhimu',
        actionLabelSw: 'Orodha ya Vitu Muhimu vya Bweni',
        actionLabelEn: 'Boarding Essentials Checklist',
      },
      {
        id: 'joining-medical-form',
        category: 'joining',
        questionSw: 'Je, fomu ya uchunguzi wa afya (Medical Examination) inajazwa wapi?',
        questionEn: 'Where must the Medical Examination Form be completed and certified?',
        answerSw:
          'Sehemu ya uchunguzi wa afya (Medical Examination Form - Part B) lazima ijazwe na ithibitishwe na Mganga Mkuu wa Hospitali ya Serikali (District Medical Officer - DMO au Hospitali ya Wilaya/Mkoa). Uchunguzi huo unajumuisha upimaji wa kifua (TB/X-ray au Mantoux), maono ya macho, usikivu, magonjwa ya kuambukiza, na mzio (allergies). Fomu iliyosainiwa na kupigwa muhuri halisi wa hospitali lazima iwasilishwe siku ya kuripoti.',
        answerEn:
          'The Medical Examination Form (Part B) must be examined and signed by an official Government Medical Officer (DMO or recognized District/Regional Hospital). Health screening encompasses chest examination, vision acuity, hearing tests, infectious conditions, and chronic allergies. The certified form with hospital official rubber stamp must be physically submitted upon arrival on campus.',
        highlightsSw: [
          'Lazima ithibitishwe na Hospitali ya Serikali (DMO/RMO)',
          'Kipimo cha maono, kifua na afya ya jumla',
          'Inawasilishwa siku ya kwanza ya kuripoti shuleni',
        ],
        highlightsEn: [
          'Must be endorsed by a recognized Government Hospital (DMO/RMO)',
          'Eye screening, chest assessment, and general wellness tests',
          'Must be submitted in physical hard copy on arrival day',
        ],
        actionType: 'medical',
        actionLabelSw: 'Fungua Fomu ya Afya (PDF)',
        actionLabelEn: 'Open Medical Form (PDF)',
      },
      {
        id: 'joining-documents-needed',
        category: 'joining',
        questionSw: 'Ni nyaraka gani zinazotakiwa kuwasilishwa wakati wa kuripoti shuleni?',
        questionEn: 'What documents must be presented during registration on reporting day?',
        answerSw:
          'Mwanafunzi anapaswa kuwasilisha: 1. Fomu ya Kujiunga iliyojazwa kikamilifu na kusainiwa na mzazi/mlezi; 2. Fomu ya Afya iliyothibitishwa na daktari wa serikali; 3. Nakala ya Cheti cha Kuzaliwa (kutoka RITA); 4. Nakala ya matokeo ya mtihani wa NECTA (PSLE kwa Kidato cha 1, au CSEE kwa Kidato cha 5); 5. Picha nne (4) ndogo za rangi (Passport size) zenye usuli wa bluu; 6. Stakabadhi halisi ya benki ya malipo ya ada.',
        answerEn:
          'Students must present: 1. Fully completed Joining Instructions signed by parent/guardian; 2. Medical Examination Form stamped by government medical authority; 3. Copy of original Birth Certificate (RITA); 4. Official NECTA Results slip (PSLE for Form 1, CSEE for Form 5); 5. Four (4) recent passport-sized photographs with blue background; 6. Original bank pay-in slip of fee settlement.',
        highlightsSw: [
          'Fomu ya Kujiunga + Fomu ya Afya iliyopigwa muhuri',
          'Cheti cha Kuzaliwa (RITA) & Matokeo ya NECTA',
          'Picha 4 za pasipoti & Stakabadhi halisi ya benki',
        ],
        highlightsEn: [
          'Joining Form + Certified Medical Examination Form',
          'Official Birth Certificate (RITA) & NECTA result slip',
          '4 passport photos & original stamped bank pay-in slip',
        ],
        actionType: 'joining',
        actionLabelSw: 'Mchakato wa Kujiunga',
        actionLabelEn: 'Joining Process',
      },

      // 3. Academic Schedules & Calendars
      {
        id: 'schedules-terms',
        category: 'schedules',
        questionSw: 'Je, ratiba ya mihula ya masomo na likizo za mwaka 2026/2027 ikoje?',
        questionEn: 'What is the academic term and holiday calendar for 2026/2027?',
        answerSw:
          'Mwaka wa masomo umegawanyika katika mihula miwili kulingana na muongozo wa Wizara ya Elimu, Sayansi na Teknolojia: Mhula wa Kwanza huanza Januari na kuhitimishwa Juni, kukiwa na mapumziko mafupi ya katikati ya mhula (Mid-Term) mwezi Aprili. Mhula wa Pili huanza Julai na kuhitimishwa Desemba, kukiwa na mapumziko ya katikati ya muhula mwezi Septemba. Ratiba maalum ya kambi za mitihani ya NECTA kwa Kidato cha 2 na cha 4 huendelea kama inavyotangazwa na Mkuu wa Shule.',
        answerEn:
          'The academic year operates on two comprehensive terms synchronized with the Ministry of Education guidelines: Term One commences in January and closes in June, featuring a mid-term break in April. Term Two commences in July and concludes in December, featuring a mid-term break in September. Special academic revision bootcamps for candidate classes (Form 2 and Form 4) proceed as scheduled by the Headmaster.',
        highlightsSw: [
          'Mhula wa 1: Januari – Juni (Mapumziko ya Aprili)',
          'Mhula wa 2: Julai – Desemba (Mapumziko ya Septemba)',
          'Kambi maalum za maandalizi ya mitihani ya kitaifa (NECTA)',
        ],
        highlightsEn: [
          'Term 1: January – June (Mid-term break in April)',
          'Term 2: July – December (Mid-term break in September)',
          'Dedicated national examination revision bootcamps',
        ],
        actionType: 'contact',
        actionLabelSw: 'Uliza Ratiba ya Sasa',
        actionLabelEn: 'Ask Current Schedule',
      },
      {
        id: 'schedules-daily-routine',
        category: 'schedules',
        questionSw: 'Ratiba ya kawaida ya siku (Daily Timetable) ya mwanafunzi wa Uomboni inakuwaje?',
        questionEn: 'What does a typical daily timetable look like for a student at Uomboni?',
        answerSw:
          'Ratiba ya shule inalenga kujenga nidhamu thabiti ya kiakademia na malezi ya kiroho: 05:30 - 06:30 Asubuhi: Kuamka na maandalizi binafsi; 06:30 - 07:15: Kiamsha kinywa na ukaguzi wa usafi; 07:15 - 07:45: Mkutano wa gwaride la asubuhi (Morning Assembly); 08:00 - 14:30: Vipindi vya darasani na maabara (ikiwemo mapumziko mafupi na chai); 14:30 - 15:30: Chakula cha mchana na mapumziko; 16:00 - 17:30: Michezo, sanaa na vilabu vya masomo; 19:00 - 21:30: Maandalizi ya jioni (Evening Supervised Prep).',
        answerEn:
          'The daily regimen cultivates academic excellence, self-discipline and character: 05:30 - 06:30 AM: Rise, personal prep & quiet reflection; 06:30 - 07:15 AM: Breakfast & morning inspection; 07:15 - 07:45 AM: Morning assembly; 08:00 AM - 02:30 PM: Intensive classroom periods & laboratory experiments; 02:30 - 03:30 PM: Lunch & rest; 04:00 - 05:30 PM: Sports, athletics, and academic clubs; 07:00 - 09:30 PM: Evening supervised study prep.',
        highlightsSw: [
          'Vipindi vya darasani kuanzia 08:00 Asubuhi hadi 14:30 Mchana',
          'Michezo na klabu za sayansi kila jioni',
          'Jioni: Prep inayosimamiwa na walimu wa zamu',
        ],
        highlightsEn: [
          'Academic class hours from 08:00 AM to 02:30 PM',
          'Afternoon athletics and science club sessions',
          'Evening supervised prep guided by duty masters',
        ],
      },
      {
        id: 'schedules-necta-exams',
        category: 'schedules',
        questionSw: 'Mitihani ya Kitaifa ya NECTA hufanyika katika vipindi gani?',
        questionEn: 'When do the NECTA National Examinations take place at center S0486?',
        answerSw:
          'Shule ya Sekondari Uomboni ina namba ya kituo cha mtihani wa NECTA S0486. Mitihani hufanyika kulingana na ratiba rasmi ya Baraza la Mitihani la Taifa (NECTA): Mtihani wa Kidato cha Pili (FTNA) hufanyika mwezi Oktoba/Novemba; Mtihani wa Kidato cha Nne (CSEE) hufanyika mwezi Novemba; na Mtihani wa Kidato cha Sita (ACSEE) hufanyika mwezi Mei kila mwaka. Wanafunzi hufanya mitihani ya majaribio ya wilaya na mkoa mara kwa mara kupima utayari wao.',
        answerEn:
          'Uomboni Secondary School holds official NECTA Examination Center number S0486. National exams occur per the National Examinations Council of Tanzania calendar: Form Two National Assessment (FTNA) in October/November; Form Four Certificate of Secondary Education Examination (CSEE) in November; and Form Six Advanced Certificate (ACSEE) in May. Regular regional and district mock examinations precede these assessments.',
        highlightsSw: [
          'Kituo Rasmi cha NECTA: S0486 UOMBONI',
          'Form 2 FTNA: Oktoba / Novemba',
          'Form 4 CSEE: Novemba',
        ],
        highlightsEn: [
          'Official NECTA Center: S0486 UOMBONI',
          'Form 2 FTNA: October / November',
          'Form 4 CSEE: November',
        ],
      },

      // 4. Academic Streams & Facilities
      {
        id: 'academics-combinations',
        category: 'academics',
        questionSw: 'Ni michanganyiko ipi ya masomo (Combinations) inafundishwa kwa Kidato cha 5 na 6?',
        questionEn: 'What subject combinations are offered for Advanced Level (Form 5 & 6)?',
        answerSw:
          'Shule inatoa michepuo mikuu ya Sayansi, Sanaa, na Biashara: 1. Sayansi: PCM (Physics, Chemistry, Mathematics), PCB (Physics, Chemistry, Biology), na CBG (Chemistry, Biology, Geography); 2. Sanaa na Lugha: HKL (History, Kiswahili, English Language) na HGL (History, Geography, English Language); 3. Sayansi ya Jamii na Biashara: EGM (Economics, Geography, Mathematics) na ECA (Economics, Commerce, Accountancy). Masomo yote yana walimu wenye weledi na maabara za kisasa.',
        answerEn:
          'The school offers premier Advanced Level combinations across Science, Arts, and Business streams: 1. Science: PCM (Physics, Chemistry, Mathematics), PCB (Physics, Chemistry, Biology), CBG (Chemistry, Biology, Geography); 2. Arts & Humanities: HKL (History, Kiswahili, English Language), HGL (History, Geography, English Language); 3. Commercial: EGM (Economics, Geography, Mathematics), ECA (Economics, Commerce, Accountancy). Each track is led by certified specialist tutors.',
        highlightsSw: [
          'Sayansi: PCM, PCB, CBG',
          'Sanaa & Lugha: HKL, HGL',
          'Biashara & Jamii: EGM, ECA',
        ],
        highlightsEn: [
          'Science Streams: PCM, PCB, CBG',
          'Arts & Humanities: HKL, HGL',
          'Commerce & Economics: EGM, ECA',
        ],
        actionType: 'contact',
        actionLabelSw: 'Uliza Mwalimu Mkuu wa Taaluma',
        actionLabelEn: 'Consult Academic Master',
      },
      {
        id: 'academics-science-labs',
        category: 'academics',
        questionSw: 'Je, kuna maabara za kutosha kwa ajili ya mafunzo ya vitendo ya sayansi?',
        questionEn: 'Are there well-equipped laboratories for practical science learning?',
        answerSw:
          'Ndio, Shule ya Sekondari Uomboni inajivunia maabara tatu za kisasa za Sayansi zilizotengwa mahsusi: Maabara ya Fizikia (Physics), Maabara ya Kemia (Chemistry), na Maabara ya Biolojia (Biology). Kila maabara ina vifaa vya kutosha vya kisasa, kemikali salama, darubini, na mifumo ya usalama ya dharura. Vilevile, tunayo Maabara ya TEHAMA (Computer Laboratory) yenye kompyuta za kisasa na mtandao kwa ajili ya mafunzo ya teknolojia.',
        answerEn:
          'Yes, Uomboni Secondary School boasts three fully equipped modern science laboratories: Physics Lab, Chemistry Lab, and Biology Lab. Each facility contains certified experimental apparatus, safety showers, microscopes, and chemical reagents ensuring hands-on practical competence. Furthermore, our dedicated Computer & ICT Lab provides connected workstations for digital literacy and programming.',
        highlightsSw: [
          'Maabara 3 maalum: Fizikia, Kemia, na Biolojia',
          'Maabara ya Kompyuta na TEHAMA yenye mtandao',
          'Wataalamu wa maabara (Lab Technicians) waliohitimu',
        ],
        highlightsEn: [
          '3 dedicated labs: Physics, Chemistry, Biology',
          'Connected Computer & ICT digital lab',
          'Certified laboratory technicians on staff',
        ],
      },
    ],
    []
  );

  // Filter items based on category and search query
  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchSw =
        item.questionSw.toLowerCase().includes(q) ||
        item.answerSw.toLowerCase().includes(q) ||
        (item.highlightsSw &&
          item.highlightsSw.some((h) => h.toLowerCase().includes(q)));
      const matchEn =
        item.questionEn.toLowerCase().includes(q) ||
        item.answerEn.toLowerCase().includes(q) ||
        (item.highlightsEn &&
          item.highlightsEn.some((h) => h.toLowerCase().includes(q)));

      return matchSw || matchEn;
    });
  }, [faqData, selectedCategory, searchQuery]);

  const categories = [
    {
      id: 'all' as FAQCategory,
      labelSw: 'Maswali Yote',
      labelEn: 'All Questions',
      count: faqData.length,
      icon: Layers,
    },
    {
      id: 'fees' as FAQCategory,
      labelSw: 'Ada za Shule & Malipo',
      labelEn: 'School Fees & Banking',
      count: faqData.filter((f) => f.category === 'fees').length,
      icon: CreditCard,
    },
    {
      id: 'joining' as FAQCategory,
      labelSw: 'Kujiunga & Fomu Rasmi',
      labelEn: 'Joining & Admission',
      count: faqData.filter((f) => f.category === 'joining').length,
      icon: FileText,
    },
    {
      id: 'schedules' as FAQCategory,
      labelSw: 'Ratiba ya Masomo & Mihula',
      labelEn: 'Schedules & Academic Calendar',
      count: faqData.filter((f) => f.category === 'schedules').length,
      icon: Calendar,
    },
    {
      id: 'academics' as FAQCategory,
      labelSw: 'Michepuo & Maabara',
      labelEn: 'Streams & Laboratories',
      count: faqData.filter((f) => f.category === 'academics').length,
      icon: BookOpen,
    },
  ];

  const handleAction = (item: FAQItem) => {
    if (item.actionType === 'joining') {
      if (onOpenJoiningInstructions) onOpenJoiningInstructions();
      else if (onNavigate) onNavigate('admissions');
    } else if (item.actionType === 'fees') {
      if (onNavigate) onNavigate('fees');
    } else if (item.actionType === 'vitu-muhimu') {
      if (onOpenVituMuhimu) onOpenVituMuhimu();
      else if (onNavigate) onNavigate('admissions');
    } else if (item.actionType === 'medical') {
      if (onOpenMedicalForm) onOpenMedicalForm();
      else window.location.hash = '#medical';
    } else if (item.actionType === 'contact') {
      if (onNavigate) onNavigate('contact');
    } else {
      if (onNavigate) onNavigate('contact');
    }
  };

  return (
    <section
      id="faq"
      className="relative py-20 bg-gradient-to-b from-[#FFFFF0] via-[#F4F7FA] to-[#FFFFF0] text-[#102A43] overflow-hidden"
    >
      {/* Liquid background fluid refractions and glowing bubbles */}
      <div className="absolute top-1/4 left-5 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-8 w-96 h-96 rounded-full bg-amber-200/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-cyan-200/15 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Liquid Header Card */}
        <div className="liquid-panel text-white p-8 sm:p-10 mb-12 shadow-2xl relative">
          {/* Decorative fluid droplets & sheen */}
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 uppercase tracking-widest mb-4 shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {language === 'sw'
                  ? 'Kituo cha Majibu & Miongozo Rasmi'
                  : 'Official Answers & Knowledge Center'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight drop-shadow-md">
              {language === 'sw'
                ? 'Maswali Yanayoulizwa Mara kwa Mara (FAQ)'
                : 'Frequently Asked Questions (FAQ)'}
            </h2>

            <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed drop-shadow-xs mb-6">
              {language === 'sw'
                ? 'Pata majibu ya haraka na ya kina kuhusu ada za shule, utaratibu wa malipo ya benki, maelekezo ya kujiunga (Joining Instructions), fomu za afya, na ratiba rasmi ya masomo ya Shule ya Sekondari Uomboni (NECTA Kituo S0486).'
                : 'Get clear, authoritative answers regarding school fees, bank payment verification, joining instructions, boarding checklists, medical requirements, and academic term schedules at Uomboni Secondary School (NECTA S0486).'}
            </p>

            {/* Liquid Search Input inside header */}
            <div className="relative max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                <Search className="w-4 h-4 text-cyan-300" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta swali kuhusu ada, kujiunga, ratiba, maabara...'
                    : 'Search questions about fees, joining instructions, calendar...'
                }
                className="liquid-input w-full pl-10 pr-24 py-3 rounded-full text-xs sm:text-sm placeholder:text-slate-300/70"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-1.5 right-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  {language === 'sw' ? 'Futa' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Quick Floating Highlights Badge on Right */}
          <div className="hidden lg:flex flex-col gap-3 absolute top-8 right-8 z-10 w-72 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>{language === 'sw' ? 'Uhakiki Rasmi' : 'Verified Info'}</span>
            </div>
            <p className="text-[12px] text-slate-200 leading-snug">
              {language === 'sw'
                ? 'Miongozo yote imethibitishwa na Uongozi wa Shule, Mkuu wa Shule na Bodi ya Shule kwa mwaka 2026/2027.'
                : 'All responses verified by School Administration, Headmaster and Board for the 2026/2027 academic session.'}
            </p>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-cyan-200">
              <span>NECTA: S0486 UOMBONI</span>
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="w-3 h-3" /> 2026/2027
              </span>
            </div>
          </div>
        </div>

        {/* Liquid Category Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`liquid-btn flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isSelected
                    ? 'liquid-btn-navy !text-white !border-amber-400/80 shadow-md scale-105'
                    : 'liquid-btn-glass text-slate-800 hover:text-[#102A43] hover:border-slate-400'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-amber-300' : 'text-slate-600'
                  }`}
                />
                <span>{language === 'sw' ? cat.labelSw : cat.labelEn}</span>
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Results Summary (when active) */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
            <span>
              {language === 'sw' ? (
                <>
                  Imepatikana maswali <strong>{filteredFAQs.length}</strong> kwa
                  utafutaji wa "<strong>{searchQuery}</strong>"
                </>
              ) : (
                <>
                  Found <strong>{filteredFAQs.length}</strong> result
                  {filteredFAQs.length === 1 ? '' : 's'} matching "
                  <strong>{searchQuery}</strong>"
                </>
              )}
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              {language === 'sw' ? 'Onyesha Yote' : 'Show All'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredFAQs.length === 0 && (
          <div className="liquid-glass-card p-12 text-center my-8 bg-white/60">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-[#102A43] mb-2">
              {language === 'sw'
                ? 'Hakuna Swali Lililopatikana'
                : 'No Questions Found'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
              {language === 'sw'
                ? 'Hatujaweza kupata swali linalolingana na maneno uliyotafuta. Unaweza kujaribu neno lingine au uwasiliane nasi moja kwa moja.'
                : "We couldn't find any questions matching your query. Please try different keywords or contact the school office directly."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="liquid-btn liquid-btn-navy px-5 py-2.5 text-xs font-bold text-white cursor-pointer"
              >
                {language === 'sw' ? 'Onyesha Maswali Yote' : 'View All FAQs'}
              </button>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('contact')}
                  className="liquid-btn liquid-btn-gold px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  {language === 'sw' ? 'Wasiliana na Ofisi' : 'Contact School Office'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Accordion List with Liquid Glass Style */}
        <div className="space-y-4">
          {filteredFAQs.map((item, index) => {
            const isOpen = !!openItemIds[item.id];
            const q = language === 'sw' ? item.questionSw : item.questionEn;
            const a = language === 'sw' ? item.answerSw : item.answerEn;
            const highlights =
              language === 'sw' ? item.highlightsSw : item.highlightsEn;
            const actionLabel =
              language === 'sw' ? item.actionLabelSw : item.actionLabelEn;

            return (
              <div
                key={item.id}
                className={`transition-all duration-300 rounded-2xl overflow-hidden border ${
                  isOpen
                    ? 'liquid-glass-card-active shadow-xl bg-white/95 border-amber-400/50'
                    : 'liquid-glass-card bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left px-5 sm:px-7 py-5 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start gap-3 sm:gap-4 flex-grow">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#102A43] text-amber-300 shadow-md ring-2 ring-amber-300/40'
                          : 'bg-slate-100 text-[#102A43]'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      {/* Category Tag */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                          {item.category === 'fees'
                            ? language === 'sw'
                              ? 'Ada & Malipo'
                              : 'Fees & Banking'
                            : item.category === 'joining'
                            ? language === 'sw'
                              ? 'Kujiunga & Fomu'
                              : 'Joining Instructions'
                            : item.category === 'schedules'
                            ? language === 'sw'
                              ? 'Ratiba & Mihula'
                              : 'Academic Calendar'
                            : language === 'sw'
                            ? 'Michepuo & Taaluma'
                            : 'Academics & Labs'}
                        </span>
                      </div>

                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                          isOpen ? 'text-[#102A43]' : 'text-slate-800'
                        }`}
                      >
                        {q}
                      </h3>
                    </div>
                  </div>

                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? 'bg-amber-400 text-slate-950 rotate-180 shadow-md'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                {/* Accordion Content with Fluid Reveals */}
                {isOpen && (
                  <div className="px-5 sm:px-7 pb-6 pt-1 text-slate-700 border-t border-slate-100">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-700 mb-4 font-normal">
                      {a}
                    </p>

                    {/* Highlights bullet pills */}
                    {highlights && highlights.length > 0 && (
                      <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#102A43] mb-2.5 block flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === 'sw' ? 'Mambo ya Kuzingatia:' : 'Key Takeaways:'}</span>
                        </span>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Bottom Action buttons */}
                    {item.actionType && (
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleAction(item)}
                          className="liquid-btn liquid-btn-navy inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white cursor-pointer"
                        >
                          <span>{actionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {item.category === 'fees' && (
                          <span className="text-[12px] text-slate-500 flex items-center gap-1 font-medium">
                            <Building className="w-3.5 h-3.5 text-[#C9A227]" />
                            CRDB: 01J1079051400
                          </span>
                        )}
                        {item.category === 'joining' && onOpenJoiningInstructions && (
                          <button
                            onClick={onOpenJoiningInstructions}
                            className="liquid-btn liquid-btn-gold inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Pakua Fomu Sasa' : 'Download Form Now'}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Liquid Help & Assistance Callout Panel */}
        <div className="mt-12 liquid-panel p-6 sm:p-8 text-white relative shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-inner flex-shrink-0">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {language === 'sw'
                    ? 'Je, unalo swali ambalo halijajibiwa hapa?'
                    : 'Do you have a question not answered here?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
                  {language === 'sw'
                    ? 'Wasiliana moja kwa moja na Ofisi ya Mkuu wa Shule au Idara ya Malipo (Bursar Desk). Tupo tayari kukuhudumia siku zote za kazi.'
                    : 'Contact the Headmaster’s Office or Bursar Desk directly. Our administrative team is ready to assist you during all official working hours.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
              <a
                href="tel:+255782558127"
                className="liquid-btn liquid-btn-gold inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>+255 782 558 127</span>
              </a>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('contact')}
                  className="liquid-btn liquid-btn-frosted inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Tuma Ujumbe' : 'Send Message'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
