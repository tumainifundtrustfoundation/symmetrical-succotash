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
} from 'lucide-react';

interface MapSectionProps {
  onOpenAdmissions?: () => void;
}

// Verified institutional location coordinates & details for Uomboni Secondary School
// Moshi–Marangu, Kilimanjaro, Tanzania
export const UOMBONI_LOCATION_CONFIG = {
  schoolName: 'UOMBONI SECONDARY SCHOOL',
  nectaCode: 'S0486',
  district: 'Moshi Rural District',
  ward: 'Marangu West',
  region: 'Kilimanjaro Region, Tanzania',
  physicalAddress: 'Marangu West, Mount Kilimanjaro Slopes, P.O. Box 361, Marangu - Moshi, Tanzania',
  coordinates: {
    lat: -3.2847, // Marangu slopes latitude
    lng: 37.5218, // Marangu slopes longitude
  },
  googleMapsQuery: 'Uomboni+Secondary+School+Marangu+Moshi+Kilimanjaro+Tanzania',
  googleMapsDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=-3.2847,37.5218&destination_place_id=Uomboni+Secondary+School+Marangu',
  googleMapsPlaceUrl:
    'https://www.google.com/maps/search/?api=1&query=Uomboni+Secondary+School+Marangu+Moshi+Kilimanjaro',
  altitudeMeters: '1,450m above sea level',
  drivingDistance: 'Approx. 38 km from Moshi Town via Himo-Marangu Road',
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

  // Safe Google Maps Embed using query parameter (no secret API key exposed in client)
  const mapEmbedUrl = `https://maps.google.com/maps?q=-3.2847,37.5218&hl=en&z=14&output=embed`;

  return (
    <section id="location" className="py-16 sm:py-20 bg-[#FFFFF0] border-t border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-300">
            <Mountain className="w-3.5 h-3.5 text-emerald-700" />
            <span>Mahali Tulipo • Geographical Location</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
            Uomboni Secondary School Map &amp; Directions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            Shule ya Sekondari Uomboni ipo <strong>Marangu West, Moshi Vijijini</strong> kwenye miteremko ya Mlima Kilimanjaro, Mkoa wa Kilimanjaro, Tanzania. Mazingira safi, tulivu na yenye hewa nzuri ya mlimani inayofaa kwa usomaji na malezi ya vijana.
          </p>
        </div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Map Frame (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-[#102A43]/15 shadow-md flex flex-col justify-between">
            {/* Map Top Bar */}
            <div className="p-4 bg-[#102A43] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold tracking-wide">
                  Marangu West, Moshi · Slopes of Mt. Kilimanjaro
                </span>
              </div>
              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Fungua Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embedded Map */}
            <div className="relative w-full aspect-video sm:aspect-auto sm:h-[380px] bg-slate-100">
              <iframe
                title="Ramani ya Shule ya Sekondari Uomboni"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Footer Bar with Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>
                  Majira: <strong>-3.2847° S, 37.5218° E</strong> (Marangu West)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCoords ? 'Imenakiliwa!' : 'Nakili GPS'}</span>
                </button>

                <a
                  href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Pata Maelekezo ya Njia (Directions)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Location & Travel Guide (5 cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#102A43]/15 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-[#102A43]">
                Mwongozo wa Kufika Shuleni (Getting Here)
              </h3>

              {/* Wayfinding 1 */}
              <div className="p-4 rounded-2xl bg-[#FFFFF0] border border-amber-300/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <Car className="w-4 h-4 text-emerald-700" />
                  <span>Kutoka Moshi Mjini (Kwa Gari Binafsi):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Chukua barabara ya Moshi - Himo kisha geuka kuelekea barabara ya Marangu / Mkuu Rombo. Pita Marangu Mtoni kuelekea Marangu West. Shule ipo kwenye mazingira tulivu ya kikanisa ya Jimbo Katoliki Moshi.
                </p>
              </div>

              {/* Wayfinding 2 */}
              <div className="p-4 rounded-2xl bg-[#FFFFF0] border border-amber-300/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#102A43]">
                  <Bus className="w-4 h-4 text-emerald-700" />
                  <span>Kwa Usafiri wa Umma (Daladala / Basi):</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Panda daladala za Moshi - Marangu kutoka kituo kikuu cha mabasi Moshi Mjini. Shuka kituo cha Marangu na chukua usafiri wa moja kwa moja kuelekea Uomboni Secondary School.
                </p>
              </div>

              {/* Quick Key Facts */}
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
                  <span className="text-slate-500">Kituo cha Mitihani NECTA:</span>
                  <span className="font-bold text-emerald-700 font-mono">S0486</span>
                </div>
              </div>
            </div>

            {/* Direct Directions Action */}
            <div className="pt-4 border-t border-slate-100">
              <a
                href={UOMBONI_LOCATION_CONFIG.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>Fungua Mwongozo wa Ramani (Open in Google Maps)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
