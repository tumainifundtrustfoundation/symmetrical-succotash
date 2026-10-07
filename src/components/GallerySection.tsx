import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ExternalLink,
  Camera,
  Info,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  titleSw: string;
  titleEn: string;
  category: 'Environment' | 'Buildings' | 'Classrooms' | 'Laboratories' | 'Sports' | 'Events' | 'Faculty' | 'Admissions';
  categorySw: string;
  imageUrl: string;
  highResUrl: string;
  width: number;
  height: number;
  descriptionSw: string;
  descriptionEn: string;
}

export const GallerySection: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 100% Genuine, Unaltered Photography of Uomboni Secondary School (Catholic Diocese of Moshi, Marangu)
  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-campus-slopes',
      titleSw: 'Mandhari ya Shule na Miinuko ya Mlima Kilimanjaro',
      titleEn: 'Campus Grounds on the Slopes of Mount Kilimanjaro',
      category: 'Environment',
      categorySw: 'Mazingira & Mandhari',
      imageUrl: '/media/media_14.webp',
      highResUrl: '/media/media_14.webp',
      width: 1024,
      height: 768,
      descriptionSw: 'Mazingira tulivu ya kijani kibichi yenye hewa safi ya milimani huko Marangu Magharibi, yanayomwezesha mwanafunzi kutuliza akili na kuzingatia masomo ya kitaaluma.',
      descriptionEn: 'Tranquil, lush green study environment on the slopes of Mount Kilimanjaro in Marangu West, providing ideal climatic conditions for high academic concentration.',
    },
    {
      id: 'gal-admin-block',
      titleSw: 'Jengo Kuu la Utawala na Madarasa ya Sekondari',
      titleEn: 'Administration Block & Academic Classrooms',
      category: 'Buildings',
      categorySw: 'Majengo ya Shule',
      imageUrl: '/media/media_6.webp',
      highResUrl: '/media/media_6.webp',
      width: 1000,
      height: 750,
      descriptionSw: 'Ofisi za Mkuu wa Shule, vyumba vya walimu, na madarasa makubwa yenye mwanga wa kutosha na madawati rasmi kwa wanafunzi wa Kidato cha 1 hadi cha 4.',
      descriptionEn: 'Administrative headquarters, faculty staffrooms, and well-ventilated, illuminated classrooms for Ordinary Level secondary students.',
    },
    {
      id: 'gal-students-class',
      titleSw: 'Wanafunzi Darasani Wakiwa na Sare Rasmi za Shule',
      titleEn: 'Students in Classrooms with Official School Uniforms',
      category: 'Classrooms',
      categorySw: 'Madarasa na Masomo',
      imageUrl: '/media/media_15.jpg',
      highResUrl: '/media/media_15.jpg',
      width: 1024,
      height: 768,
      descriptionSw: 'Wanafunzi wa Uomboni wakiwa darasani wakifuatilia mafunzo ya mwalimu kwa umakini na nidhamu ya hali ya juu wakiwa wamevaa sare rasmi za shule.',
      descriptionEn: 'Disciplined Uomboni students seated in classroom instruction wearing official institutional uniforms during core subject lectures.',
    },
    {
      id: 'gal-science-lab',
      titleSw: 'Vifaa vya Maabara ya Sayansi (Physics, Chemistry & Biology)',
      titleEn: 'Science Laboratories Practical Experiment Workstations',
      category: 'Laboratories',
      categorySw: 'Maabara ya Sayansi',
      imageUrl: '/media/media_13.jpg',
      highResUrl: '/media/media_13.jpg',
      width: 346,
      height: 768,
      descriptionSw: 'Maabara kamili zilizosheheni vifaa vya kisasa vya majaribio ya vitendo kwa masomo ya Fizikia, Kemia na Biolojia kwa maandalizi ya mitihani ya NECTA.',
      descriptionEn: 'Hands-on practical science apparatus for Physics, Chemistry, and Biology experiments aligned with national examination syllabus standards.',
    },
    {
      id: 'gal-football-team',
      titleSw: 'Timu ya Mpira wa Miguu ya Shule Uwanjani',
      titleEn: 'Uomboni School Football Team on Campus Pitch',
      category: 'Sports',
      categorySw: 'Michezo & Vipaji',
      imageUrl: '/media/media_16.jpg',
      highResUrl: '/media/media_16.jpg',
      width: 1024,
      height: 461,
      descriptionSw: 'Kikosi cha wachezaji wa timu ya mpira wa miguu ya Uomboni wakiwa uwanjani na jezi rasmi za shule kabla ya kuanza mechi za mashindano ya UMISETA.',
      descriptionEn: 'Uomboni Secondary School football squad lined up on the sports field in official school athletic kits ahead of regional inter-school matches.',
    },
    {
      id: 'gal-mass-liturgy',
      titleSw: 'Misa Takatifu ya Shukrani na Malezi ya Kiroho',
      titleEn: 'Solemn Eucharistic Mass & Spiritual Formation',
      category: 'Events',
      categorySw: 'Ibada & Matukio',
      imageUrl: '/media/media_12.jpg',
      highResUrl: '/media/media_12.jpg',
      width: 1024,
      height: 461,
      descriptionSw: 'Jumuia ya shule ikishiriki ibada ya Misa Takatifu na Padre Mlezi chini ya Jimbo Katoliki la Moshi kuombea amani, hekima na ufaulu wa kitaaluma.',
      descriptionEn: 'The campus community assembled for Holy Mass and pastoral blessing under the Catholic Diocese of Moshi, fostering faith, humility, and moral purpose.',
    },
    {
      id: 'gal-ict-lab',
      titleSw: 'Maabara ya Kisasa ya Kompyuta na TEHAMA',
      titleEn: 'Modern ICT Computer Lab & Digital Competency Suite',
      category: 'Laboratories',
      categorySw: 'Maabara ya Sayansi',
      imageUrl: '/media/media_8.jpg',
      highResUrl: '/media/media_8.jpg',
      width: 1000,
      height: 450,
      descriptionSw: 'Wanafunzi wakipata mafunzo ya vitendo ya kompyuta, mifumo ya kidijitali, na utafiti wa kitaaluma katika chumba cha kisasa cha kompyuta.',
      descriptionEn: 'Practical digital literacy workstations enabling research, computer applications, and technological competence for all students.',
    },
    {
      id: 'gal-faculty-teachers',
      titleSw: 'Walimu na Uongozi wa Shule ya Sekondari Uomboni',
      titleEn: 'Teaching Faculty & Institutional Leadership Team',
      category: 'Faculty',
      categorySw: 'Walimu & Uongozi',
      imageUrl: '/media/media_17.webp',
      highResUrl: '/media/media_17.webp',
      width: 1024,
      height: 461,
      descriptionSw: 'Picha rasmi ya jopo la walimu wenye weledi na uzoefu mkubwa katika ufundishaji, maadili mema na usimamizi wa karibu wa wanafunzi.',
      descriptionEn: 'Official portrait of the dedicated teaching faculty and academic administration committed to academic rigor and moral excellence.',
    },
    {
      id: 'gal-sports-day',
      titleSw: 'Mashindano ya Riadha na Bonanza la Michezo',
      titleEn: 'Track & Field Athletics Tournament & School Sports Day',
      category: 'Sports',
      categorySw: 'Michezo & Vipaji',
      imageUrl: '/media/media_10.jpg',
      highResUrl: '/media/media_10.jpg',
      width: 1000,
      height: 450,
      descriptionSw: 'Wanafunzi wakishiriki michezo mbalimbali ya riadha, mpira wa wavu na pete kwa ajili ya afya ya mwili, ushirikiano na ujasiri.',
      descriptionEn: 'Students competing in track and field athletics, volleyball, and physical fitness activities fostering health and camaraderie.',
    },
    {
      id: 'gal-chapel-worship',
      titleSw: 'Kituo cha Ibada na Maadili Mema ya Kikristo',
      titleEn: 'Campus Chapel & Moral Guidance Fellowship',
      category: 'Events',
      categorySw: 'Ibada & Matukio',
      imageUrl: '/media/media_9.jpg',
      highResUrl: '/media/media_9.jpg',
      width: 1000,
      height: 450,
      descriptionSw: 'Ibada za kila juma na mafundisho ya kiroho yanayomjenga mwanafunzi kuwa raia mwadilifu, mwenye hofu ya Mungu na heshima kwa jamii.',
      descriptionEn: 'Weekly liturgical fellowship and moral counselling guiding young women and men toward ethical responsibility and integrity.',
    },
    {
      id: 'gal-evening-prep',
      titleSw: 'Kujisomea kwa Utulivu na Masomo ya Ziada (Evening Prep)',
      titleEn: 'Supervised Evening Study Prep & Peer Academic Revision',
      category: 'Classrooms',
      categorySw: 'Madarasa na Masomo',
      imageUrl: '/media/media_7.webp',
      highResUrl: '/media/media_7.webp',
      width: 581,
      height: 252,
      descriptionSw: 'Wanafunzi wa bweni wakijisomea nyakati za jioni madarasani chini ya usimamizi wa karibu wa walimu wa zamu ili kufanya marudio ya masomo.',
      descriptionEn: 'Supervised evening prep and collaborative revision hours ensuring steady academic mastery and diligent homework completion.',
    },
    {
      id: 'gal-admissions-flyer',
      titleSw: 'Tangazo Rasmi la Udahili na Fomu ya Kujiunga 2026/2027',
      titleEn: 'Official 2026/2027 Admission & Joining Instructions Poster',
      category: 'Admissions',
      categorySw: 'Udahili & Fomu',
      imageUrl: '/uomboni_flyer_2026.jpg',
      highResUrl: '/uomboni_flyer_2026.jpg',
      width: 896,
      height: 1200,
      descriptionSw: 'Fomu rasmi na maelekezo ya kujiunga na Pre-Form One, Kidato cha 1 na cha 3. Maelezo ya benki, ada na mawasiliano ya ofisi ya Mkuu wa Shule.',
      descriptionEn: 'Official printed admission notice detailing Pre-Form One commencement, Form 1 & 3 entry, bank account numbers, and fee structure.',
    },
  ];

  const categories = [
    { id: 'All', labelSw: 'Picha Zote', labelEn: 'All Photos' },
    { id: 'Environment', labelSw: 'Mazingira & Mandhari', labelEn: 'Campus & Slopes' },
    { id: 'Classrooms', labelSw: 'Madarasa & Masomo', labelEn: 'Classrooms' },
    { id: 'Laboratories', labelSw: 'Maabara ya Sayansi', labelEn: 'Laboratories & ICT' },
    { id: 'Sports', labelSw: 'Michezo & Vipaji', labelEn: 'Athletics & Teams' },
    { id: 'Events', labelSw: 'Ibada & Matukio', labelEn: 'Liturgy & Events' },
    { id: 'Faculty', labelSw: 'Walimu & Uongozi', labelEn: 'Teaching Faculty' },
    { id: 'Admissions', labelSw: 'Tangazo la Udahili', labelEn: 'Admissions Flyer' },
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const selectedPhoto = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  }, [selectedIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  }, [selectedIndex, filteredItems.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  // Prevent background scroll when lightbox is active
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const isSwahili = language === 'sw';

  return (
    <section
      id="gallery"
      className="py-20 sm:py-24 bg-white border-t border-b border-[#102A43]/10"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C9A227] tracking-wider uppercase mb-2">
              <Camera className="w-4 h-4 text-[#C9A227]" />
              <span>
                {isSwahili ? 'Picha Halisi za Shule' : 'Authentic School Photography'}
              </span>
            </div>
            <h2
              id="gallery-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]"
            >
              {isSwahili ? 'Picha na Mazingira ya Shule' : 'Official School Gallery'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
              {isSwahili
                ? 'Tazama picha halisi na za ubora wa juu za Shule ya Sekondari Uomboni zikionyesha majengo ya shule, maabara za sayansi na TEHAMA, wanafunzi wakiwa na sare darasani, michezo, na ibada katika miinuko ya Mlima Kilimanjaro, Marangu.'
                : 'Explore high-resolution, uncompressed original photographs capturing our campus facilities, science and ICT laboratories, students in class with official uniforms, athletic matches, and chapel worship in Marangu.'}
            </p>
          </div>

          {/* Category Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFF0] rounded-md border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedIndex(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#102A43] text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-[#102A43] hover:bg-white'
                }`}
              >
                {isSwahili ? cat.labelSw : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Photography Grid - Generous spacing, clean presentation, zero distortion */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((photo, index) => {
            const title = isSwahili ? photo.titleSw : photo.titleEn;
            const categoryLabel = isSwahili ? photo.categorySw : photo.category;
            const description = isSwahili ? photo.descriptionSw : photo.descriptionEn;

            return (
              <div
                key={photo.id}
                onClick={() => setSelectedIndex(index)}
                className="bg-[#FFFFF0] rounded-lg border border-[#102A43]/12 overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIndex(index);
                  }
                }}
                aria-label={`Open photo: ${title}`}
              >
                {/* Image Container with Natural Photographic Proportions */}
                <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                  <img
                    src={photo.imageUrl}
                    alt={title}
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Subtle hover affordance */}
                  <div className="absolute inset-0 bg-[#102A43]/0 group-hover:bg-[#102A43]/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2.5 rounded-full bg-white/95 text-[#102A43] shadow-md flex items-center gap-1.5 text-xs font-semibold">
                      <Eye className="w-4 h-4 text-[#C9A227]" />
                      <span>{isSwahili ? 'Tazama Halisi' : 'View High-Res'}</span>
                    </span>
                  </div>

                  {/* Category Chip */}
                  <span className="absolute top-2.5 left-2.5 bg-[#102A43]/90 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-xs">
                    {categoryLabel}
                  </span>
                </div>

                {/* Caption Details */}
                <div className="p-5 bg-white border-t border-slate-100 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#102A43] leading-snug group-hover:text-[#102A43]/85 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono text-slate-400">
                      {photo.width} × {photo.height}px
                    </span>
                    <span className="font-semibold text-[#102A43] group-hover:text-[#C9A227] inline-flex items-center gap-1 transition-colors">
                      <span>{isSwahili ? 'Fungua Picha' : 'Enlarge'}</span>
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Resolution Photography Lightbox */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label="High-resolution image viewer"
          >
            {/* Top Toolbar */}
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white py-2 px-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase">
                  {isSwahili ? selectedPhoto.categorySw : selectedPhoto.category}
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80 font-mono">
                  {isSwahili
                    ? `Picha ${selectedIndex! + 1} ya ${filteredItems.length}`
                    : `Photo ${selectedIndex! + 1} of ${filteredItems.length}`}
                </span>
                <span className="hidden sm:inline-block text-xs text-white/50 font-mono">
                  ({selectedPhoto.width} × {selectedPhoto.height}px)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Open uncompressed asset in new tab */}
                <a
                  href={selectedPhoto.highResUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs inline-flex items-center gap-1.5 px-3"
                  title={isSwahili ? 'Fungua faili asilia' : 'Open raw original file'}
                >
                  <ExternalLink className="w-4 h-4 text-[#C9A227]" />
                  <span className="hidden sm:inline">
                    {isSwahili ? 'Faili Asilia' : 'Original Raw'}
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
                  aria-label="Close photo preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Viewport with High-Res Image Display */}
            <div
              className="relative w-full max-w-6xl flex-grow flex items-center justify-center overflow-hidden my-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Button */}
              {filteredItems.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer border border-white/20 hover:scale-105"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* The Original Image (Rendered at true aspect ratio, never distorted) */}
              <div className="max-h-[72vh] sm:max-h-[76vh] max-w-full flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.highResUrl}
                  alt={isSwahili ? selectedPhoto.titleSw : selectedPhoto.titleEn}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="max-h-[72vh] sm:max-h-[76vh] max-w-full w-auto object-contain rounded shadow-2xl select-none"
                  style={{
                    imageRendering: 'auto',
                  }}
                  decoding="sync"
                />
              </div>

              {/* Next Button */}
              {filteredItems.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer border border-white/20 hover:scale-105"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
            </div>

            {/* Bottom Caption Bar */}
            <div
              className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-5 text-white z-10 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {isSwahili ? selectedPhoto.titleSw : selectedPhoto.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-white/85 mt-1.5 leading-relaxed">
                {isSwahili ? selectedPhoto.descriptionSw : selectedPhoto.descriptionEn}
              </p>
              <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-white/60">
                <span>Shule ya Sekondari Uomboni · NECTA S0486 · Marangu, Moshi</span>
                <span>Keyboard: &larr; / &rarr; kusogeza, Esc kufunga</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
