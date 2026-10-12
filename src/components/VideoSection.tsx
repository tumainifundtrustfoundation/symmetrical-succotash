import React, { useState, useEffect } from 'react';
import {
  Video,
  Play,
  ExternalLink,
  Sparkles,
  Film,
  Calendar,
  AlertCircle,
  Eye,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { SchoolVideo } from '../types';
import { getPublishedSchoolVideos } from '../services/videoFirestoreService';

interface VideoSectionProps {
  onOpenAdmin?: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onOpenAdmin }) => {
  const [videos, setVideos] = useState<SchoolVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoModal, setActiveVideoModal] = useState<SchoolVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const publishedVideos = await getPublishedSchoolVideos();
        if (isMounted) {
          setVideos(publishedVideos);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load school videos:', err);
        if (isMounted) setLoading(false);
      }
    };
    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['ALL', 'Campus Life', 'Academic', 'Events & Graduation', 'Sports'];

  const filteredVideos =
    selectedCategory === 'ALL'
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  const featuredVideo = videos.find((v) => v.featured) || videos[0];

  return (
    <section id="videos" className="py-16 sm:py-20 bg-white border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-200">
              <Film className="w-3.5 h-3.5 text-emerald-700" />
              <span>Maktaba ya Video za Shule</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
              Uomboni Video Gallery
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Tazama matukio ya kitaaluma, maabara, maadhimisho ya Misa, mazingira ya shule kwenye mteremko wa Mlima Kilimanjaro na maisha ya wanafunzi shuleni.
            </p>
          </div>

          {/* Categories Pill Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#102A43] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Video Zote' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Video Spotlight */}
        {featuredVideo && (
          <div className="bg-[#102A43] rounded-3xl overflow-hidden shadow-xl border border-[#C9A227]/30 text-white grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative bg-black aspect-video flex items-center justify-center group overflow-hidden">
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback to high quality YouTube placeholder if needed
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${featuredVideo.videoId}/0.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={() => setActiveVideoModal(featuredVideo)}
                className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer border-2 border-white/80"
                aria-label={`Play video: ${featuredVideo.title}`}
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </button>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured Video</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{featuredVideo.publishedDate}</span>
                  {featuredVideo.category && (
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">
                      {featuredVideo.category}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-white leading-snug">
                  {featuredVideo.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {featuredVideo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveVideoModal(featuredVideo)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Play className="w-4 h-4 fill-[#102A43]" />
                  <span>Tazama Hapa (Watch Now)</span>
                </button>

                <a
                  href={featuredVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-[#FFFFF0] rounded-2xl border border-[#102A43]/15 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <button
                  onClick={() => setActiveVideoModal(video)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg cursor-pointer"
                  aria-label={`Play ${video.title}`}
                >
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </button>

                {video.category && (
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] font-semibold text-white">
                    {video.category}
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 font-mono">
                    {video.publishedDate}
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-[#102A43] line-clamp-2 leading-snug group-hover:text-emerald-800 transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="font-bold text-[#102A43] hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Play Video</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-700 animate-in zoom-in-95 flex flex-col">
              <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Film className="w-5 h-5 text-red-500" />
                  <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-lg">
                    {activeVideoModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Funga video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={activeVideoModal.embedUrl}
                  title={activeVideoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="p-4 sm:p-5 bg-slate-900 text-slate-200 space-y-2">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeVideoModal.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Kituo: Shule ya Sekondari Uomboni (NECTA S0486)</span>
                  <a
                    href={activeVideoModal.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Fungua moja kwa moja YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
