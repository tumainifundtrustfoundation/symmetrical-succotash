import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  BookOpen,
  FlaskConical,
  Home,
  Trophy,
  Laptop,
  Building2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Compass,
  MapPin,
  Sparkles,
  Maximize2,
  Eye,
  CheckCircle2,
  Users,
  Clock,
  ShieldCheck,
  Layers,
  X,
  ArrowRight,
  School
} from 'lucide-react';

export interface CampusBuildingLocation {
  id: string;
  shortNameSw: string;
  shortNameEn: string;
  titleSw: string;
  titleEn: string;
  subtitleSw: string;
  subtitleEn: string;
  descriptionSw: string;
  descriptionEn: string;
  icon: React.ElementType;
  imageUrl: string;
  fallbackUrl: string;
  zoneSw: string;
  zoneEn: string;
  stats: {
    labelSw: string;
    labelEn: string;
    value: string;
  }[];
  tagsSw: string[];
  tagsEn: string[];
  keyHighlightsSw: string[];
  keyHighlightsEn: string[];
  operatingHoursSw: string;
  operatingHoursEn: string;
}

export const CAMPUS_LOCATIONS: CampusBuildingLocation[] = [
  {
    id: 'library',
    shortNameSw: 'Maktaba',
    shortNameEn: 'Library',
    titleSw: 'Maktaba Kuu ya Shule & Kituo cha Kujisomea',
    titleEn: 'Main Academic Library & Resource Center',
    subtitleSw: 'Vitabu 15,000+, Majarida ya Kielimu & E-Learning',
    subtitleEn: '15,000+ Volumes, Research Journals & E-Learning Pods',
    descriptionSw: 'Maktaba ya kisasa na tulivu iliyosheheni vitabu vyote vya mitaala ya NECTA, vitabu vya marejeo (reference books), mitihani ya miaka iliyopita na maeneo ya kujisomea binafsi au kwa makundi madogo chini ya uangalizi wa msimamizi wa maktaba.',
    descriptionEn: 'A serene, well-equipped academic library housing complete NECTA syllabus textbooks, reference encyclopedias, past examination papers, and quiet individual reading pods under full-time professional librarian support.',
    icon: BookOpen,
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: '/media/media_15.jpg',
    zoneSw: 'Kitalu cha Taaluma (Block A)',
    zoneEn: 'Academic Quadrangle (Block A)',
    stats: [
      { labelSw: 'Uwezo wa Wasomaji', labelEn: 'Reader Capacity', value: 'Wanafunzi 140+' },
      { labelSw: 'Vitabu Shuleni', labelEn: 'Total Books', value: '15,000+ Juzuu' },
      { labelSw: 'Huduma Maalum', labelEn: 'Special Services', value: 'NECTA Past Papers' },
      { labelSw: 'Muda wa Kazi', labelEn: 'Study Hours', value: 'Saa 1:00 Asb - 4:00 Usiku' },
    ],
    tagsSw: ['Vitabu vya NECTA', 'Silent Study Pods', 'Majarida ya Sayansi', 'E-Library'],
    tagsEn: ['NECTA Textbooks', 'Silent Study Pods', 'Science Journals', 'E-Library'],
    keyHighlightsSw: [
      'Mkusanyiko mkubwa wa vitabu vya Sayansi, Sanaa na Biashara',
      'Benki kamili ya mitihani ya Taifa ya NECTA na majibu yake',
      'Eneo tulivu la kujisomea usiku (Prep sessions) na mwangaza salama',
      'Huduma ya kuazima vitabu kupitia kadi ya maktaba ya mwanafunzi'
    ],
    keyHighlightsEn: [
      'Comprehensive collection across Sciences, Arts and Commercial streams',
      'Exhaustive NECTA national exam paper archives and marking guides',
      'Dedicated evening prep study spaces with solar-backed lighting',
      'Automated book borrowing and catalog system with student cards'
    ],
    operatingHoursSw: 'Jumatatu - Jumamosi: Saa 1:00 Asb - Saa 4:00 Usiku | Jumapili: Saa 8:00 Mchana - Saa 4:00 Usiku',
    operatingHoursEn: 'Monday - Saturday: 7:00 AM - 10:00 PM | Sunday: 2:00 PM - 10:00 PM',
  },
  {
    id: 'science-lab',
    shortNameSw: 'Maabara',
    shortNameEn: 'Science Lab',
    titleSw: 'Maabara za Sayansi (Fizikia, Kemia & Biolojia)',
    titleEn: 'Science Laboratories (Physics, Chemistry & Biology)',
    subtitleSw: 'Maabara 3 Mahususi za Majaribio ya Vitendo ya NECTA',
    subtitleEn: '3 Modern Dedicated Wings for NECTA Practical Experiments',
    descriptionSw: 'Majengo matatu maalum ya maabara yaliyo na mitambo ya gesi, kemikali zilizoidhinishwa, hadubini za kielektroniki, na zana zote za vipimo vya vitendo ili kuwaandaa wanafunzi kufaulu mitihani ya vitendo ya kidato cha pili na nne kwa alama za juu.',
    descriptionEn: 'Three purpose-built laboratory wings outfitted with gas pipelines, safety fume hoods, approved reagents, digital microscopes, and precision measurement equipment to give students rigorous practical mastery for Form 2 and Form 4 national exams.',
    icon: FlaskConical,
    imageUrl: '/media/media_13.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    zoneSw: 'Kitalu cha Sayansi (Science Wing B)',
    zoneEn: 'Science Complex (Science Wing B)',
    stats: [
      { labelSw: 'Majengo ya Maabara', labelEn: 'Lab Units', value: 'Maabara 3 Tofauti' },
      { labelSw: 'Uwezo kwa Kipindi', labelEn: 'Bench Capacity', value: 'Wanafunzi 65 kwa maabara' },
      { labelSw: 'Majaribio', labelEn: 'Practicals', value: 'NECTA Certified' },
      { labelSw: 'Vifaa vya Usalama', labelEn: 'Safety Gear', value: 'Showers & First Aid' },
    ],
    tagsSw: ['NECTA Practical Ready', 'Bomba za Gesi', 'Hadubini za Kisasa', 'Kemikali Salama'],
    tagsEn: ['NECTA Practical Certified', 'Gas Pipeline System', 'Precision Optics', 'Full Safety Gear'],
    keyHighlightsSw: [
      'Maabara ya Fizikia yenye vifaa vya umeme, optics na mechanics',
      'Maabara ya Kemia yenye mfumo salama wa hewa na kemikali safi',
      'Maabara ya Biolojia yenye sampuli halisi na hadubini za kidijitali',
      'Mafunzo ya vitendo ya kila wiki chini ya walimu na mafundi maabara waliobobea'
    ],
    keyHighlightsEn: [
      'Physics lab equipped with mechanics benches, circuit kits, and optics sets',
      'Chemistry lab featuring fume exhausts, safe reagent storage, and titration rigs',
      'Biology lab equipped with microscope banks and preserved botanical/anatomical specimens',
      'Weekly scheduled practical sessions led by experienced STEM masters and technicians'
    ],
    operatingHoursSw: 'Jumatatu - Ijumaa: Saa 1:30 Asb - Saa 10:30 Jioni (Na vipindi vya prep za jioni)',
    operatingHoursEn: 'Monday - Friday: 7:30 AM - 4:30 PM (Plus supervised practical preps)',
  },
  {
    id: 'dormitories',
    shortNameSw: 'Mabweni',
    shortNameEn: 'Dormitories',
    titleSw: 'Mabweni ya Wanafunzi (Hosteli za Wasichana na Wavulana)',
    titleEn: 'Student Hostels & Boarding Dormitories',
    subtitleSw: 'Malazi Safi, Salama & Malezi ya Kimaadili Saa 24',
    subtitleEn: 'Hygienic, Secure Living Facilities with 24/7 Pastoral Care',
    descriptionSw: 'Mabweni ya kisasa yaliyotengwa kwa nidhamu ya juu kwa wavulana na wasichana. Yanajumuisha vitanda imara, maji safi ya chemchem za Mlima Kilimanjaro, umeme wa uhakika na jenereta, huduma za Matron na Patron saa 24, na ulinzi thabiti.',
    descriptionEn: 'Modern, well-ventilated boarding houses separated for boys and girls. Featuring comfortable bunk spaces, pure gravity-fed Mount Kilimanjaro spring water, solar backup lighting, 24/7 resident matrons and patrons, and strict campus security.',
    icon: Home,
    imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&w=1200&q=80',
    zoneSw: 'Eneo la Malazi (Hostel Residential Quad)',
    zoneEn: 'Residential Living Quad (North & South)',
    stats: [
      { labelSw: 'Uwezo wa Malazi', labelEn: 'Bed Capacity', value: 'Wanafunzi 320+' },
      { labelSw: 'Usimamizi', labelEn: 'Supervision', value: 'Matron & Patron 24/7' },
      { labelSw: 'Maji Safi', labelEn: 'Water Source', value: 'Chemchem za Kilimanjaro' },
      { labelSw: 'Ulinzi wa Shule', labelEn: 'Campus Security', value: 'Waliofunzwa Saa 24' },
    ],
    tagsSw: ['Malezi ya Kiroho', 'Maji ya Chemchem', 'Ulinzi Saa 24', 'Usafi wa Hali ya Juu'],
    tagsEn: ['Pastoral Guidance', 'Fresh Mountain Water', '24/7 Guarded Perimeter', 'Strict Sanitation'],
    keyHighlightsSw: [
      'Mabweni yenye vyoo na bafu za kisasa zenye usafi unaosimamiwa kila siku',
      'Matron na Patron wanaolala hosteli kwa ajili ya msaada wa haraka wa afya na maadili',
      'Mpangilio wa ratiba ya usafi, maombi ya asubuhi na jioni, na mapumziko kwa wakati',
      'Zahanati ndogo ya shule (First Aid Bay) kwa ajili ya huduma za dharura za afya'
    ],
    keyHighlightsEn: [
      'Modern, sanitized washrooms inspected daily with continuous running water',
      'Resident matrons and patrons available round-the-clock for health & welfare needs',
      'Disciplined daily schedule with morning devotion, evening prayers, and fixed quiet hours',
      'Equipped school health bay for immediate medical first-aid response'
    ],
    operatingHoursSw: 'Funguliwa saa 24 kwa wanafunzi wa bweni chini ya taratibu za shule',
    operatingHoursEn: 'Open 24/7 for resident boarding students under school regulations',
  },
  {
    id: 'sports-field',
    shortNameSw: 'Viwanja vya Michezo',
    shortNameEn: 'Sports Field',
    titleSw: 'Viwanja vya Michezo, Mpira wa Miguu & Riadha',
    titleEn: 'Sports Grounds, Football Pitch & Athletics Arena',
    subtitleSw: 'Uwanja Kamili wa Mpira, Mpira wa Kikapu, Wavu & Mandhari ya Kibo',
    subtitleEn: 'Full 11-a-Side Pitch, Basketball, Volleyball & Kilimanjaro Views',
    descriptionSw: 'Viwanja vizuri vya nyasi asilia na uwanja wa michezo wenye hewa safi na mandhari ya Mlima Kilimanjaro. Vinatumika kwa mazoezi ya jioni, mashindano ya darasa kwa darasa, na maandalizi ya kombe la UMISETA ambapo Uomboni hushinda mara kwa mara.',
    descriptionEn: 'Expansive natural-turf athletic grounds nestled in fresh mountain air with awe-inspiring views of Mount Kilimanjaro. Hosts daily sports sessions, inter-class tournaments, and training for national UMISETA athletic championships.',
    icon: Trophy,
    imageUrl: '/media/media_16.jpg',
    fallbackUrl: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    zoneSw: 'Uwanja wa Mashariki (East Sports Complex)',
    zoneEn: 'East Sports Arena & Stadium Field',
    stats: [
      { labelSw: 'Uwanja Mkuu', labelEn: 'Pitch Dimensions', value: 'Standard 11-a-side' },
      { labelSw: 'Michezo Shuleni', labelEn: 'Sports Disciplines', value: 'Soka, Kikapu, Wavu, Riadha' },
      { labelSw: 'Mashindano', labelEn: 'Championships', value: 'UMISETA & Inter-House' },
      { labelSw: 'Mandhari', labelEn: 'Scenic View', value: 'Mlima Kilimanjaro' },
    ],
    tagsSw: ['Mabingwa UMISETA', 'Uwanja wa Mpira', 'Basketball & Volleyball', 'Mazoezi ya Afya'],
    tagsEn: ['UMISETA Champions', 'Full-size Pitch', 'Basketball & Volleyball', 'Health & Athletics'],
    keyHighlightsSw: [
      'Uwanja wa mpira wa miguu uliotunzwa wenye nyasi safi na magoli sanifu',
      'Viwanja vya mpira wa kikapu (basketball), wavu (volleyball) na netiboli',
      'Njia ya kukimbia (running track) kwa ajili ya riadha na mbio fupi na ndefu',
      'Walimu mahiri wa michezo (Sports Masters) wanaosimamia vipaji vya wanafunzi'
    ],
    keyHighlightsEn: [
      'Well-manicured standard football pitch with official regulation goalposts',
      'Dedicated courts for basketball, volleyball, and netball with night lights',
      'Perimeter athletic running track for sprints, distance races, and field events',
      'Dedicated Sports Masters coaching students to regional and national recognition'
    ],
    operatingHoursSw: 'Jumatatu - Jumamosi: Saa 10:30 Jioni - Saa 12:30 Jioni (Vipindi vya michezo na mazoezi)',
    operatingHoursEn: 'Monday - Saturday: 4:30 PM - 6:30 PM (Daily sports & team training sessions)',
  },
  {
    id: 'ict-lab',
    shortNameSw: 'TEHAMA / ICT',
    shortNameEn: 'ICT Lab',
    titleSw: 'Maabara ya Kompyuta & TEHAMA ya Kisasa',
    titleEn: 'Modern ICT & Computer Laboratory',
    subtitleSw: 'Kompyuta 50+ za Kisasa, Mtandao wa Kasi & Skrini Kubwa',
    subtitleEn: '50+ Workstations, High-Speed Internet & Digital Projection',
    descriptionSw: 'Kituo cha mafunzo ya teknolojia na kompyuta kinachotoa stadi za karne ya 21 kwa wanafunzi wote. Wanafunzi wanajifunza programu za ofisi, misingi ya coding na programu, kuandika haraka kwa kompyuta (typing skills), na utafiti wa kitaaluma.',
    descriptionEn: 'A high-speed technological hub imparting 21st-century digital competencies. Students learn computer fundamentals, office suites, coding logic, touch typing, and online educational research under expert IT faculty guidance.',
    icon: Laptop,
    imageUrl: '/media/media_8.jpg',
    fallbackUrl: '/media/media_15.jpg',
    zoneSw: 'Kitalu cha TEHAMA (Digital Wing B)',
    zoneEn: 'Digital Learning Wing (Tech Center B)',
    stats: [
      { labelSw: 'Kompyuta Shuleni', labelEn: 'PC Workstations', value: 'Kompyuta 50+ za Kisasa' },
      { labelSw: 'Mtandao', labelEn: 'Broadband', value: 'Fiber High-Speed Internet' },
      { labelSw: 'Mtaala', labelEn: 'Instruction', value: 'NECTA ICT & Stadi za Dijitali' },
      { labelSw: 'Viti kwa Kipindi', labelEn: 'Class Size', value: 'Wanafunzi 55 kwa wakati' },
    ],
    tagsSw: ['Fiber Internet', 'Coding & Typing', 'NECTA ICT Practical', 'Solar Inverter Backup'],
    tagsEn: ['Fiber High-Speed', 'Coding & Touch Typing', 'NECTA ICT Practical', 'Solar Inverter Backup'],
    keyHighlightsSw: [
      'Kompyuta zilizounganishwa na mtandao salama wa elimu na programu za kiada',
      'Skrini ya projekta (Digital Multimedia Projector) kwa maonyesho ya masomo',
      'Umeme thabiti unaoungwa mkono na solar inverters kuzuia kukatika kwa mawasiliano',
      'Ushiriki wa wanafunzi katika mitihani ya vitendo ya TEHAMA ya NECTA'
    ],
    keyHighlightsEn: [
      'Networked desktop stations loaded with educational software and typing tutors',
      'High-definition multimedia projector for visual lectures and interactive coding',
      'Solar-inverter battery power backup ensuring uninterrupted digital learning',
      'Comprehensive preparation for NECTA Form 2 & Form 4 ICT national assessments'
    ],
    operatingHoursSw: 'Jumatatu - Ijumaa: Saa 1:30 Asb - Saa 11:00 Jioni (Ratiba ya vipindi na studio za wazi)',
    operatingHoursEn: 'Monday - Friday: 7:30 AM - 5:00 PM (Class sessions and open tech club access)',
  },
  {
    id: 'admin-block',
    shortNameSw: 'Jengo la Utawala',
    shortNameEn: 'Admin Block',
    titleSw: 'Jengo Kuu la Utawala & Sebule ya Mapokezi',
    titleEn: 'Main Administration Block & Reception Suite',
    subtitleSw: 'Ofisi ya Mkuu wa Shule, Mtaaluma, Mhasibu & Sebule ya Wazazi',
    subtitleEn: 'Headmaster Suite, Academic Masters, Bursar & Parent Lounge',
    descriptionSw: 'Kitovu cha uongozi na usimamizi wa shule. Kina ofisi rasmi ya Mkuu wa Shule (Headmaster), Makamu, Mtaaluma Mkuu (Academic Master), Mhasibu (Bursar), Chumba cha Mikutano cha Walimu (Staffroom), na sehemu maalum ya kupokelea wazazi na wageni.',
    descriptionEn: 'The executive nerve center of Uomboni Secondary School. Houses the Headmaster\'s office, Deputy Head, Academic Master, Bursary cashier, staff consultation lounge, and welcoming reception area for visiting parents and school patrons.',
    icon: Building2,
    imageUrl: '/media/media_14.webp',
    fallbackUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    zoneSw: 'Lango Kuu (Campus Entrance Block)',
    zoneEn: 'Main Gate & Campus Entrance',
    stats: [
      { labelSw: 'Ofisi Kuu', labelEn: 'Executive Offices', value: 'Headmaster & Academic Master' },
      { labelSw: 'Huduma za Fedha', labelEn: 'Bursar Services', value: 'Uthibitisho wa Ada & Stakabadhi' },
      { labelSw: 'Mapokezi ya Wazazi', labelEn: 'Parent Lounge', value: 'Huduma Binafsi ya Ushauri' },
      { labelSw: 'Mawasiliano', labelEn: 'Direct Line', value: '+255 782 558 127' },
    ],
    tagsSw: ['Ofisi ya Mkuu wa Shule', 'Bursar & Ada', 'Mapokezi ya Wageni', 'Chumba cha Walimu'],
    tagsEn: ['Headmaster Suite', 'Bursar & Fees Desk', 'Parent Consultation', 'Faculty Staffroom'],
    keyHighlightsSw: [
      'Ofisi rasmi ya Mkuu wa Shule na Makamu Mkuu kwa ushauri wa kitaaluma',
      'Dirisha la Mhasibu wa shule kwa utoaji wa stakabadhi na miongozo ya malipo ya benki',
      'Sebule yenye heshima na utulivu kwa wazazi wanaokuja kufuatilia maendeleo ya watoto wao',
      'Mbao za matangazo rasmi ya Wizara ya Elimu na matokeo ya kitaifa ya NECTA'
    ],
    keyHighlightsEn: [
      'Official executive suites for Headmaster and Academic Master for consultations',
      'Bursar counter for fee payment verification, receipts, and bank advice slips',
      'Welcoming parent lounge for academic progress discussions with subject teachers',
      'Official notification boards displaying Ministry announcements and NECTA circulars'
    ],
    operatingHoursSw: 'Jumatatu - Ijumaa: Saa 1:30 Asb - Saa 9:30 Alasiri | Jumamosi: Saa 2:30 Asb - Saa 6:30 Mchana',
    operatingHoursEn: 'Monday - Friday: 7:30 AM - 3:30 PM | Saturday: 8:30 AM - 12:30 PM',
  },
];

interface InteractiveCampusTourProps {
  onOpenAdmissions?: () => void;
  onNavigate?: (sectionId: string) => void;
}

export const InteractiveCampusTour: React.FC<InteractiveCampusTourProps> = ({
  onOpenAdmissions,
  onNavigate,
}) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [selectedModalBuilding, setSelectedModalBuilding] = useState<CampusBuildingLocation | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const totalLocations = CAMPUS_LOCATIONS.length;

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlaying || isHovered || selectedModalBuilding !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalLocations);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered, selectedModalBuilding, totalLocations]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedModalBuilding) {
        if (e.key === 'Escape') setSelectedModalBuilding(null);
        return;
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + totalLocations) % totalLocations);
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % totalLocations);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModalBuilding, totalLocations]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalLocations) % totalLocations);
  }, [totalLocations]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalLocations);
  }, [totalLocations]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const handleImageError = (id: string) => {
    setImageErrorMap((prev) => ({ ...prev, [id]: true }));
  };

  const currentLocation = CAMPUS_LOCATIONS[activeIndex];
  const CurrentIcon = currentLocation.icon;

  return (
    <section
      id="campus-tour"
      className="relative py-16 sm:py-24 bg-gradient-to-b from-[#FFFFF0] via-[#F4F6F8] to-[#FFFFF0] border-t border-b border-[#102A43]/10 overflow-hidden"
    >
      {/* Decorative liquid background glow elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#102A43]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102A43]/5 border border-[#102A43]/15 text-[#102A43] text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#C9A227] animate-spin" style={{ animationDuration: '12s' }} />
            <span>
              {language === 'sw' ? 'Ziara ya Kidijitali ya Majengo ya Shule' : 'Interactive 3D Campus Tour'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#102A43] tracking-tight mb-4">
            {language === 'sw' ? (
              <>
                Tazama <span className="text-[#C9A227]">Majengo & Mandhari</span> ya Uomboni
              </>
            ) : (
              <>
                Explore Our <span className="text-[#C9A227]">World-Class Campus</span> & Facilities
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#102A43]/75 leading-relaxed">
            {language === 'sw'
              ? 'Tembelea majengo makuu ya shule yetu kuanzia Maktaba, Maabara za Sayansi, Mabweni ya kisasa hadi Viwanja vya Michezo chini ya kivuli cha Mlima Kilimanjaro.'
              : 'Take a virtual walk through our core academic, practical, boarding and athletic buildings situated on the scenic slopes of Mount Kilimanjaro in Marangu, Moshi.'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* QUICK BUTTONS FOR BUILDINGS ("nitaweka majengo pia iwe qas buttons") */}
        {/* ========================================================================= */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#102A43]/70 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-[#C9A227]" />
              {language === 'sw' ? 'Chagua Jengo (Bonyeza Kubadili):' : 'Select Campus Building (Quick Action Buttons):'}
            </span>
            <span className="text-[11px] font-semibold text-[#102A43]/60 hidden sm:inline">
              {activeIndex + 1} / {totalLocations} {language === 'sw' ? 'Majengo' : 'Buildings'}
            </span>
          </div>

          {/* Liquid Action Buttons Grid / Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {CAMPUS_LOCATIONS.map((loc, idx) => {
              const IconComp = loc.icon;
              const isActive = idx === activeIndex;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  className={`relative group px-3.5 py-3 rounded-xl border text-left transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#102A43] text-white border-[#C9A227] shadow-lg shadow-[#102A43]/20 scale-[1.02] ring-2 ring-[#C9A227]/40'
                      : 'bg-white hover:bg-[#102A43]/5 text-[#102A43] border-[#102A43]/15 hover:border-[#102A43]/30 shadow-xs'
                  }`}
                  aria-label={`View ${language === 'sw' ? loc.titleSw : loc.titleEn}`}
                >
                  {/* Glossy liquid accent strip for active button */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A227] via-amber-300 to-[#C9A227] animate-pulse" />
                  )}

                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'bg-[#C9A227] text-[#102A43]'
                          : 'bg-[#102A43]/10 text-[#102A43] group-hover:bg-[#102A43] group-hover:text-white'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-[#C9A227]'
                          : 'bg-[#102A43]/5 text-[#102A43]/60'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs sm:text-sm font-bold truncate">
                      {language === 'sw' ? loc.shortNameSw : loc.shortNameEn}
                    </div>
                    <div
                      className={`text-[11px] truncate font-medium ${
                        isActive ? 'text-[#FFFFF0]/80' : 'text-[#102A43]/60'
                      }`}
                    >
                      {language === 'sw' ? loc.zoneSw.split('(')[0] : loc.zoneEn.split('(')[0]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3D-LIKE CAROUSEL STAGE */}
        {/* ========================================================================= */}
        <div
          className="relative mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel Stage Container with 3D perspective */}
          <div
            className="relative h-[380px] sm:h-[460px] md:h-[500px] w-full flex items-center justify-center overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            {CAMPUS_LOCATIONS.map((loc, idx) => {
              // Calculate relative offset from active index
              let diff = idx - activeIndex;
              if (diff > totalLocations / 2) diff -= totalLocations;
              if (diff < -totalLocations / 2) diff += totalLocations;

              const isCenter = diff === 0;
              const isRight = diff === 1;
              const isLeft = diff === -1;
              const isFar = Math.abs(diff) > 1;

              // 3D transform computation
              let transform = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (isCenter) {
                transform = 'translateX(0%) translateZ(40px) rotateY(0deg) scale(1)';
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (isRight) {
                transform = 'translateX(55%) translateZ(-90px) rotateY(-22deg) scale(0.85)';
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (isLeft) {
                transform = 'translateX(-55%) translateZ(-90px) rotateY(22deg) scale(0.85)';
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                transform = 'translateX(95%) translateZ(-180px) rotateY(-35deg) scale(0.7)';
                zIndex = 10;
                opacity = 0.25;
              } else if (diff === -2) {
                transform = 'translateX(-95%) translateZ(-180px) rotateY(35deg) scale(0.7)';
                zIndex = 10;
                opacity = 0.25;
              } else {
                transform = `translateX(${diff * 120}%) translateZ(-300px) scale(0.5)`;
                zIndex = 5;
                opacity = 0;
              }

              const Icon = loc.icon;
              const hasImgError = imageErrorMap[loc.id];
              const imageSrc = hasImgError ? loc.fallbackUrl : loc.imageUrl;

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                      setIsAutoPlaying(false);
                    }
                  }}
                  className={`absolute w-[86%] sm:w-[75%] md:w-[65%] lg:w-[58%] max-w-[760px] h-[340px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 ease-out cursor-pointer select-none border ${
                    isCenter
                      ? 'border-[#C9A227]/70 shadow-2xl shadow-[#102A43]/40'
                      : 'border-white/20 filter brightness-90 hover:brightness-100'
                  }`}
                  style={{
                    transform,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Photo Layer */}
                  <img
                    src={imageSrc}
                    alt={language === 'sw' ? loc.titleSw : loc.titleEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => handleImageError(loc.id)}
                    loading={idx <= 2 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient overlays for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/45 to-black/20" />

                  {/* Liquid gloss top meniscus */}
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                  {/* Top Badges & Controls on Card */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A43]/85 backdrop-blur-md border border-[#C9A227]/40 text-[#FFFFF0] text-xs font-semibold shadow-md">
                      <Icon className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{language === 'sw' ? loc.zoneSw : loc.zoneEn}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[#FFFFF0] text-[11px] font-bold">
                        {idx + 1} / {totalLocations}
                      </span>
                      {isCenter && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModalBuilding(loc);
                          }}
                          className="px-3 py-1 rounded-full bg-[#C9A227] hover:bg-amber-400 text-[#102A43] text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                          title="Fungua Taarifa Kamili (Detailed Specs)"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span className="hidden sm:inline">{language === 'sw' ? 'Taarifa Kamili' : 'Full Details'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Content Area */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 text-white z-10 bg-gradient-to-t from-[#102A43] via-[#102A43]/90 to-transparent">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227] uppercase tracking-wider mb-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? loc.subtitleSw : loc.subtitleEn}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white mb-2 leading-tight">
                      {language === 'sw' ? loc.titleSw : loc.titleEn}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#FFFFF0]/85 line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed max-w-2xl">
                      {language === 'sw' ? loc.descriptionSw : loc.descriptionEn}
                    </p>

                    {/* Quick Specs Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
                      {(language === 'sw' ? loc.tagsSw : loc.tagsEn).slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-xs text-[11px] font-medium text-[#FFFFF0]"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#C9A227]" />
                          {tag}
                        </span>
                      ))}

                      {isCenter && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedModalBuilding(loc);
                          }}
                          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-[#C9A227] hover:text-white transition-colors cursor-pointer"
                        >
                          <span>{language === 'sw' ? 'Soma Zaidi' : 'Learn More'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Arrow Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous Campus Location"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#102A43]/90 hover:bg-[#102A43] text-white border-2 border-[#C9A227] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-6 h-6 text-[#C9A227]" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Campus Location"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#102A43]/90 hover:bg-[#102A43] text-white border-2 border-[#C9A227] flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-6 h-6 text-[#C9A227]" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* CAROUSEL INDICATOR BAR & CONTROLS */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#102A43]/15 shadow-sm mb-12">
          {/* Active Building Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#102A43] text-[#C9A227] flex items-center justify-center shadow-xs">
              <CurrentIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9A227]">
                {language === 'sw' ? 'Jengo Lililopo Sasa' : 'Current Highlight'}
              </div>
              <div className="text-sm font-black text-[#102A43]">
                {language === 'sw' ? currentLocation.titleSw : currentLocation.titleEn}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {CAMPUS_LOCATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  setIsAutoPlaying(false);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex
                    ? 'w-8 bg-[#C9A227]'
                    : 'w-2.5 bg-[#102A43]/20 hover:bg-[#102A43]/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action / Auto-play button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#102A43]/20 text-xs font-semibold text-[#102A43] hover:bg-[#102A43]/5 transition-colors cursor-pointer"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{language === 'sw' ? 'Sitisha (Pause)' : 'Pause Tour'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{language === 'sw' ? 'Endeleza (Auto)' : 'Auto Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setSelectedModalBuilding(currentLocation)}
              className="liquid-btn liquid-btn-navy inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-lg cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>{language === 'sw' ? 'Angalia Undani' : 'View Specs'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DETAILED STATS GRID OF CURRENT ACTIVE BUILDING */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-[#102A43]/15 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#102A43]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" />
                {language === 'sw' ? 'Vipengele & Takwimu za Jengo' : 'Facility Highlights & Key Statistics'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#102A43]">
                {language === 'sw' ? currentLocation.titleSw : currentLocation.titleEn}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#102A43]/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                {language === 'sw' ? currentLocation.operatingHoursSw : currentLocation.operatingHoursEn}
              </span>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {currentLocation.stats.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-xl bg-[#F4F6F8] border border-[#102A43]/10 flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold text-[#102A43]/60 mb-1">
                  {language === 'sw' ? stat.labelSw : stat.labelEn}
                </span>
                <span className="text-base sm:text-lg font-black text-[#102A43]">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Highlights checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {(language === 'sw' ? currentLocation.keyHighlightsSw : currentLocation.keyHighlightsEn).map(
              (item, kIdx) => (
                <div
                  key={kIdx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#102A43]/85"
                >
                  <div className="w-4 h-4 rounded-full bg-[#102A43] text-[#C9A227] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span>{item}</span>
                </div>
              )
            )}
          </div>

          {/* Bottom call to action */}
          <div className="pt-4 border-t border-[#102A43]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#102A43]/70 text-center sm:text-left">
              {language === 'sw'
                ? 'Ungependa kutembelea shule yetu ana kwa ana au kujiunga na Kidato cha 1 au Kuhamia?'
                : 'Interested in visiting our campus in person or applying for Form 1 / Transfers?'}
            </p>

            <div className="flex items-center gap-3">
              {onOpenAdmissions && (
                <button
                  onClick={onOpenAdmissions}
                  className="liquid-btn liquid-btn-gold px-4 py-2 text-xs font-black text-[#102A43] rounded-xl cursor-pointer"
                >
                  {language === 'sw' ? 'Omba Nafasi ya Kujiunga' : 'Apply for Admission'}
                </button>
              )}
              {onNavigate && (
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 text-xs font-bold text-[#102A43] bg-white border border-[#102A43]/20 hover:bg-[#102A43]/5 rounded-xl transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Wasiliana Nasi' : 'Contact Us'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DETAILED MODAL DIALOG */}
      {/* ========================================================================= */}
      {selectedModalBuilding && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedModalBuilding(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C9A227]/40 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-60 sm:h-72 w-full overflow-hidden rounded-t-3xl">
              <img
                src={
                  imageErrorMap[selectedModalBuilding.id]
                    ? selectedModalBuilding.fallbackUrl
                    : selectedModalBuilding.imageUrl
                }
                alt={language === 'sw' ? selectedModalBuilding.titleSw : selectedModalBuilding.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/40 to-transparent" />

              <button
                onClick={() => setSelectedModalBuilding(null)}
                aria-label="Close Building Details Modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#102A43]/80 hover:bg-[#102A43] text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block mb-1">
                  {language === 'sw' ? selectedModalBuilding.subtitleSw : selectedModalBuilding.subtitleEn}
                </span>
                <h3 className="text-xl sm:text-3xl font-black">
                  {language === 'sw' ? selectedModalBuilding.titleSw : selectedModalBuilding.titleEn}
                </h3>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A43]/60 mb-2">
                  {language === 'sw' ? 'Maelezo Rasmi ya Jengo' : 'Official Building Overview'}
                </h4>
                <p className="text-sm sm:text-base text-[#102A43]/85 leading-relaxed">
                  {language === 'sw' ? selectedModalBuilding.descriptionSw : selectedModalBuilding.descriptionEn}
                </p>
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A43]/60 mb-3">
                  {language === 'sw' ? 'Vipimo & Takwimu' : 'Specifications & Capacity'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedModalBuilding.stats.map((st, i) => (
                    <div key={i} className="p-3 bg-[#F4F6F8] rounded-xl border border-[#102A43]/10">
                      <span className="text-[10px] font-semibold text-[#102A43]/60 block mb-0.5">
                        {language === 'sw' ? st.labelSw : st.labelEn}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#102A43]">
                        {st.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A43]/60 mb-3">
                  {language === 'sw' ? 'Vipengele Muhimu Vinavyopatikana' : 'Key Facilities & Features'}
                </h4>
                <div className="space-y-2">
                  {(language === 'sw'
                    ? selectedModalBuilding.keyHighlightsSw
                    : selectedModalBuilding.keyHighlightsEn
                  ).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#102A43]/85">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operating hours */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-[#102A43] flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#C9A227] shrink-0" />
                <div>
                  <span className="font-bold block">
                    {language === 'sw' ? 'Masaa ya Matumizi na Huduma:' : 'Hours of Operation:'}
                  </span>
                  <span>
                    {language === 'sw'
                      ? selectedModalBuilding.operatingHoursSw
                      : selectedModalBuilding.operatingHoursEn}
                  </span>
                </div>
              </div>

              {/* Modal footer actions */}
              <div className="pt-4 border-t border-[#102A43]/10 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedModalBuilding(null)}
                  className="px-4 py-2 rounded-xl border border-[#102A43]/20 text-xs font-bold text-[#102A43] hover:bg-[#102A43]/5 transition-colors cursor-pointer"
                >
                  {language === 'sw' ? 'Funga' : 'Close'}
                </button>
                {onOpenAdmissions && (
                  <button
                    onClick={() => {
                      setSelectedModalBuilding(null);
                      onOpenAdmissions();
                    }}
                    className="liquid-btn liquid-btn-navy px-5 py-2 text-xs font-bold text-white rounded-xl cursor-pointer"
                  >
                    {language === 'sw' ? 'Omba Kujiunga na Shule' : 'Apply for Admission'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
