import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Compass,
  Phone,
  Mail,
  Clock,
  Car,
  Bus,
  Check,
  Copy,
  Mountain,
  Share2,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

interface MapSectionProps {
  onOpenAdmissions?: () => void;
}

// Rasmi: GPS Coordinates na Taarifa za Eneo za Shule ya Sekondari Uomboni
// Marangu, Wilaya ya Moshi Vijijini, Mkoa wa Kilimanjaro, Tanzania
export const UOMBONI_LOCATION_CONFIG = {
  schoolName: 'UOMBONI SECONDARY SCHOOL',
  swahiliName: 'SHULE YA SEKONDARI UOMBONI',
  nectaCode: 'S0486',
  district: 'Wilaya ya Moshi Vijijini (Moshi Rural District)',
  ward: 'Kata ya Marangu Magharibi (Marangu West)',
  village: 'Kijiji cha Uomboni (Uomboni Village)',
  region: 'Mkoa wa Kilimanjaro, Tanzania',
  physicalAddress: 'Kijiji cha Uomboni, Marangu Magharibi, S.L.P. 243, Marangu - Moshi, Tanzania',
  coordinates: {
    lat: -3.25685,
    lng: 37.48725,
  },
  // URL rasmi ya maelekezo ya kufika shuleni kupitia Google Maps Directions
  googleMapsDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=-3.25685%2C37.48725',
  // URL ya kutazama eneo na alama kwenye Google Maps
  googleMapsSearchUrl: 'https://www.google.com/maps/search/?api=1&query=-3.25685,37.48725',
  altitudeMeters: '1,450m usawa wa bahari (Above Sea Level)',
  distanceFromMoshiTown: 'Takriban km 38 kutoka Moshi Mjini kupitia barabara ya Himo - Marangu',
  contacts: {
    phone: '+255 782 558 127',
    email: 'uombonisec@gmail.com',
  },
};

export const MapSection: React.FC<MapSectionProps> = ({ onOpenAdmissions }) => {
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyCoords = () => {
    const coordString = `${UOMBONI_LOCATION_CONFIG.coordinates.lat}, ${UOMBONI_LOCATION_CONFIG.coordinates.lng}`;
    navigator.clipboard?.writeText(coordString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard?.writeText(UOMBONI_LOCATION_CONFIG.physicalAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Google Maps Embed salama yenye marker ya Uomboni Secondary School bila kuhitaji client secret API key
  const mapEmbedUrl = `https://maps.google.com/maps?q=${UOMBONI_LOCATION_CONFIG.coordinates.lat},${UOMBONI_LOCATION_CONFIG.coordinates.lng}(Uomboni+Secondary+School)&hl=sw&z=15&output=embed`;

  return (
    <section id="location" className="py-16 sm:py-24 bg-[#FFFFF0] border-t border-b border-[#102A43]/10 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#102A43]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. SEHEMU YA KICHWA: MAHALI TULIPO | OUR LOCATION                          */}
        {/* ========================================================================= */}
        <div className="text-center sm:text-left max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold uppercase tracking-wider border border-emerald-300/80 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Ramani &amp; GPS • Location &amp; Directions</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102A43] tracking-tight leading-[1.15]">
            Mahali Tulipo | Our Location
          </h2>

          <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            Tembelea Uomboni Secondary School, Marangu, Moshi, Kilimanjaro, Tanzania.
          </p>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Shule yetu ipo katika mazingira tulivu na ya kijani kibichi kwenye miteremko ya Mlima Kilimanjaro, Kata ya Marangu Magharibi, Wilaya ya Moshi Vijijini. Mazingira haya salama yanatoa hewa safi ya mlimani inayomwezesha mwanafunzi kujifunza kwa utulivu na malezi mema ya kimaadili.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. GPS COORDINATES & INSTITUTIONAL LOCATION STATS CARDS                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Latitude */}
          <div className="p-4 rounded-2xl bg-white border border-[#102A43]/15 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Latitude (Kusini)</span>
              <Compass className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-[#102A43]">
              -3.25685° S
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Marangu, Moshi</div>
          </div>

          {/* Longitude */}
          <div className="p-4 rounded-2xl bg-white border border-[#102A43]/15 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Longitude (Mashariki)</span>
              <Compass className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-[#102A43]">
              37.48725° E
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Kilimanjaro, TZ</div>
          </div>

          {/* Altitude */}
          <div className="p-4 rounded-2xl bg-white border border-[#102A43]/15 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Kimo Juu ya Bahari</span>
              <Mountain className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-sans text-base sm:text-lg font-bold text-[#102A43]">
              1,450 m
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Mteremko wa Mlima</div>
          </div>

          {/* NECTA Center Code */}
          <div className="p-4 rounded-2xl bg-white border border-[#102A43]/15 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Kituo cha NECTA</span>
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-emerald-700">
              S0486
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Centre Rasmi ya Mitihani</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. GOOGLE MAPS EMBED & NAVIGATION DIRECTIONS PANEL                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Ramani ya Google Maps (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#102A43]/20 shadow-lg flex flex-col justify-between">
            {/* Map Top Bar */}
            <div className="p-4 sm:p-5 bg-[#102A43] text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-400/30">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold tracking-wide text-white">
                    Uomboni Secondary School
                  </h3>
                  <p className="text-[11px] text-amber-300/90 font-mono">
                    GPS: -3.25685, 37.48725 • Marangu, Moshi
                  </p>
                </div>
              </div>

              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-yellow-300 hover:text-yellow-200 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                title="Tazama ramani kamili kwenye Google Maps"
              >
                <span>Fungua Ramani Kubwa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Google Maps Frame with Lazy Loading */}
            <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-[420px] bg-slate-100">
              <iframe
                title="Google Maps - Eneo Rasmi la Shule ya Sekondari Uomboni"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Action Bar (Directions & Copy GPS) */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-slate-800">
                  GPS: <strong className="font-mono text-[#102A43]">-3.25685, 37.48725</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Nakili GPS Coordinates Button */}
                <button
                  onClick={handleCopyCoords}
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                  title="Nakili namba za GPS kwenye clipboard"
                >
                  {copiedCoords ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>{copiedCoords ? 'Imenakiliwa!' : 'Nakili GPS'}</span>
                </button>

                {/* Primary Directions Button (Required) */}
                <a
                  href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95 text-xs sm:text-sm"
                  title="Pata Maelekezo ya Kufika Shuleni kwenye Google Maps"
                >
                  <Navigation className="w-4 h-4 text-yellow-300" />
                  <span>Pata Maelekezo ya Kufika Shuleni</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mwongozo wa Kufika Shuleni & Maelezo ya Usafiri (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#102A43]/20 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-[#102A43] flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-700" />
                  <span>Mwongozo wa Kufika Shuleni</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Miongozo ya barabara kutoka Moshi Mjini na maeneo jirani
                </p>
              </div>

              {/* Wayfinding: Gari Binafsi */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Car className="w-4 h-4" />
                  </span>
                  <span>Kutoka Moshi Mjini (Kwa Gari Binafsi):</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Chukua barabara kuu ya Moshi kuelekea Himo (km 28), kisha geuka kaskazini kuelekea barabara ya Marangu Mtoni / Kilema. Fuata barabara kuelekea Kata ya Marangu Magharibi hadi Kijiji cha Uomboni.
                </p>
              </div>

              {/* Wayfinding: Usafiri wa Umma */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <span className="p-1.5 rounded-lg bg-sky-100 text-sky-800">
                    <Bus className="w-4 h-4" />
                  </span>
                  <span>Kwa Usafiri wa Umma (Daladala / Mabasi):</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Panda daladala au mabasi ya Moshi - Marangu kutoka Stendi Kuu ya Moshi Mjini. Shuka kituo cha Marangu Mtoni au Marangu Magharibi, kisha chukua usafiri wa moja kwa moja kuelekea Shule ya Sekondari Uomboni.
                </p>
              </div>

              {/* Taarifa Muhimu za Shule */}
              <div className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mahali:</span>
                  <span className="font-semibold text-slate-900">Marangu West, Moshi Vijijini</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Umbali kutoka Moshi:</span>
                  <span className="font-bold text-slate-900">Takriban kilomita 38</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Masaa ya Ofisi:</span>
                  <span className="font-medium text-slate-900">Jumatatu - Ijumaa (Saa 1:30 - 11:00)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mawasiliano:</span>
                  <a
                    href="tel:+255782558127"
                    className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    +255 782 558 127
                  </a>
                </div>
              </div>
            </div>

            {/* Prominent Call to Action Direction Link Button */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md hover:shadow-lg active:scale-98"
                title="Pata Maelekezo ya Kufika Shuleni kwenye Google Maps"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Pata Maelekezo ya Kufika Shuleni</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </a>

              <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="hover:text-slate-800 underline transition-colors cursor-pointer"
                >
                  {copiedAddress ? 'Anwani imenakiliwa!' : 'Nakili anwani ya posta'}
                </button>
                {onOpenAdmissions && (
                  <button
                    type="button"
                    onClick={onOpenAdmissions}
                    className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer"
                  >
                    Nyaraka za Udahili &rarr;
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
