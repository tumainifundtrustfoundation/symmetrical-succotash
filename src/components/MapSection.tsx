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
  CheckCircle2,
  Copy,
  Check,
  Mountain,
  Share2,
} from 'lucide-react';

interface MapSectionProps {
  onOpenAdmissions?: () => void;
}

// Official institutional GPS coordinates & verified location configuration
// Uomboni Secondary School, Marangu, Moshi Vijijini, Kilimanjaro, Tanzania
export const UOMBONI_LOCATION_CONFIG = {
  schoolName: 'UOMBONI SECONDARY SCHOOL',
  nectaCode: 'S0486',
  district: 'Moshi Vijijini (Moshi Rural District)',
  ward: 'Marangu Magharibi (Marangu West)',
  region: 'Kilimanjaro, Tanzania',
  physicalAddress: 'Kijiji cha Uomboni, Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania',
  coordinates: {
    lat: -3.25685,
    lng: 37.48725,
  },
  // Official Google Maps Directions URL with verified GPS destination
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-3.25685%2C37.48725',
  googleMapsPlaceUrl:
    'https://www.google.com/maps/search/?api=1&query=-3.25685%2C37.48725+(Uomboni+Secondary+School)',
  altitudeMeters: '1,450m kutoka usawa wa bahari',
  drivingDistance: 'Takriban km 38 kutoka Moshi Mjini kupitia barabara ya Moshi-Himo-Marangu',
};

export const MapSection: React.FC<MapSectionProps> = ({ onOpenAdmissions }) => {
  const [copiedCoords, setCopiedCoords] = useState(false);

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText(
      `${UOMBONI_LOCATION_CONFIG.coordinates.lat}, ${UOMBONI_LOCATION_CONFIG.coordinates.lng}`
    );
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  // Safe Google Maps Embed using query parameter with official coordinates and marker label (no secret API key required)
  const mapEmbedUrl = `https://maps.google.com/maps?q=${UOMBONI_LOCATION_CONFIG.coordinates.lat},${UOMBONI_LOCATION_CONFIG.coordinates.lng}&hl=sw&z=15&output=embed`;

  return (
    <section id="location" className="py-16 sm:py-20 bg-[#FFFFF0] border-t border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2.5 border border-emerald-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mahali Tulipo &bull; Our Location</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Mahali Tulipo | Our Location
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Tembelea <strong>Uomboni Secondary School</strong>, Marangu, Moshi, Kilimanjaro, Tanzania. Shule ipo kwenye mazingira tulivu, yenye hewa safi ya mteremko wa Mlima Kilimanjaro, yanayofaa sana kwa malezi bora, utulivu wa kitaaluma na mafanikio ya wanafunzi.
          </p>

          {/* GPS Coordinates Badge Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#102A43]/15 text-xs text-[#102A43] shadow-xs">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>
                Latitude: <strong className="font-mono text-emerald-800">{UOMBONI_LOCATION_CONFIG.coordinates.lat}</strong>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#102A43]/15 text-xs text-[#102A43] shadow-xs">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>
                Longitude: <strong className="font-mono text-emerald-800">{UOMBONI_LOCATION_CONFIG.coordinates.lng}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCoords}
              className="px-3 py-1.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Nakili majira ya GPS"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">GPS Imenakiliwa!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Nakili GPS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Map Frame (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#102A43]/15 shadow-md flex flex-col justify-between">
            {/* Map Top Bar */}
            <div className="p-4 bg-[#102A43] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-bold tracking-wide truncate">
                  Uomboni Secondary School &bull; Marangu, Moshi Vijijini
                </span>
              </div>

              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition-colors shrink-0 ml-2"
                title="Fungua ramani kubwa ya Google Maps"
              >
                <span>Fungua Ramani Kubwa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Google Map */}
            <div className="relative w-full aspect-video sm:aspect-auto sm:h-[400px] bg-slate-100">
              <iframe
                title="Ramani Rasmi ya Google Maps - Uomboni Secondary School"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            {/* Map Footer Bar with Action Button */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-slate-600">
                  Eneo: <strong>Kijiji cha Uomboni, Marangu Magharibi</strong>
                </span>
              </div>

              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-get-directions"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-[#102A43] hover:from-emerald-700 hover:to-[#0A1C2E] text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm text-xs"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Pata Maelekezo ya Kufika Shuleni</span>
              </a>
            </div>
          </div>

          {/* Location & Travel Guide (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#102A43]/15 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-[#102A43] flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span>Mwongozo wa Kufika Shuleni (Directions)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Njia rahisi na za uhakika za kufika Uomboni Secondary
                </p>
              </div>

              {/* Wayfinding 1: Private Car */}
              <div className="p-4 rounded-2xl bg-[#FFFFF0] border border-amber-300/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>Kutoka Moshi Mjini (Gari Binafsi):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chukua barabara ya lami ya <strong>Moshi &ndash; Himo</strong> kisha unganisha barabara ya kuelekea <strong>Marangu / Mkuu Rombo</strong>. Pita Marangu Mtoni kuelekea Marangu Magharibi hadi Kijiji cha Uomboni.
                </p>
              </div>

              {/* Wayfinding 2: Public Transport */}
              <div className="p-4 rounded-2xl bg-[#FFFFF0] border border-amber-300/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <Bus className="w-4 h-4 text-emerald-700" />
                  <span>Kwa Usafiri wa Umma (Daladala / Mabasi):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kutoka stendi kuu ya Moshi Mjini, panda daladala au basi la Marangu. Shuka kituo cha Marangu Mtoni au njia panda ya Uomboni, kisha pata usafiri wa moja kwa moja hadi lango kuu la Shule ya Sekondari Uomboni.
                </p>
              </div>

              {/* Key Geographic Facts */}
              <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kimo kutoka usawa wa bahari:</span>
                  <span className="font-bold text-slate-900">{UOMBONI_LOCATION_CONFIG.altitudeMeters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Umbali kutoka Moshi Mjini:</span>
                  <span className="font-bold text-slate-900">Takriban km 38</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Mkoa &amp; Wilaya:</span>
                  <span className="font-bold text-slate-900">Kilimanjaro, Moshi Vijijini</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kituo cha NECTA:</span>
                  <span className="font-bold text-emerald-700 font-mono">S0486</span>
                </div>
              </div>
            </div>

            {/* Direct Directions Primary Action */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Pata Maelekezo ya Kufika Shuleni</span>
              </a>

              <p className="text-[11px] text-center text-slate-500">
                Inafungua Google Maps na GPS ya moja kwa moja kwenye simu au kompyuta yako.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
