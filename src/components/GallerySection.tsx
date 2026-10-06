import React, { useState } from 'react';
import { Camera, Eye, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Buildings' | 'Classrooms' | 'Laboratories' | 'Sports' | 'Events' | 'Environment';
  imageUrl: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'School Campus & Slopes of Mt. Kilimanjaro',
      category: 'Environment',
      imageUrl: '/media/media_14.webp',
      description: 'Serene, cool, and green study environment in Marangu West, providing optimal conditions for academic concentration.',
    },
    {
      id: 'gal-2',
      title: 'Administration & Classroom Blocks',
      category: 'Buildings',
      imageUrl: '/media/media_6.webp',
      description: 'Main school administrative offices, staff rooms, and spacious Ordinary Level classrooms.',
    },
    {
      id: 'gal-3',
      title: 'Science Laboratories (Physics, Chemistry & Biology)',
      category: 'Laboratories',
      imageUrl: '/media/media_13.jpg',
      description: 'Hands-on laboratory practical experiments conducted under teacher supervision for NECTA assessment preparedness.',
    },
    {
      id: 'gal-4',
      title: 'Classroom Instruction & Academic Study',
      category: 'Classrooms',
      imageUrl: '/media/media_15.jpg',
      description: 'Interactive classroom discussions, teacher demonstrations, and disciplined academic coursework.',
    },
    {
      id: 'gal-5',
      title: 'Inter-School Athletics & Football Competition',
      category: 'Sports',
      imageUrl: '/media/media_16.jpg',
      description: 'School sports teams training and competing in regional UMISETA athletic meets.',
    },
    {
      id: 'gal-6',
      title: 'Eucharistic Liturgy & Community Worship',
      category: 'Events',
      imageUrl: '/media/media_12.jpg',
      description: 'Thanksgiving Mass and spiritual formation with the Catholic Diocese of Moshi chaplaincy.',
    },
    {
      id: 'gal-7',
      title: 'Modern ICT & Computer Laboratory',
      category: 'Laboratories',
      imageUrl: '/media/media_8.jpg',
      description: 'Practical workstation computers used for digital literacy and academic syllabus research.',
    },
    {
      id: 'gal-8',
      title: 'Track & Field Sports Tournament',
      category: 'Sports',
      imageUrl: '/media/media_10.jpg',
      description: 'Annual school sports bonanza encouraging sportsmanship, physical endurance, and teamwork.',
    },
    {
      id: 'gal-9',
      title: 'Academic Prep & Supervised Study Groups',
      category: 'Classrooms',
      imageUrl: '/media/media_7.webp',
      description: 'Evening prep study and peer revision sessions organized for upcoming examinations.',
    },
  ];

  const categories = ['All', 'Buildings', 'Classrooms', 'Laboratories', 'Sports', 'Events', 'Environment'];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 sm:py-24 bg-white border-t border-b border-[#102A43]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-[#C9A227] tracking-wider block mb-2 uppercase">
              Campus Life in Pictures
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102A43] tracking-tight leading-[1.2]">
              School Gallery
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-700 leading-[1.75] font-normal">
              Explore authentic photography showing our campus facilities, science laboratories, classroom learning, sports competitions, and student community life in Marangu.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FFFFF0] rounded-md border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#102A43] text-white font-semibold'
                    : 'text-slate-600 hover:text-[#102A43] hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="bg-[#FFFFF0] rounded-lg border border-[#102A43]/10 overflow-hidden group cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-4/3 overflow-hidden bg-slate-100 relative">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#102A43]/0 group-hover:bg-[#102A43]/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/90 text-[#102A43]">
                    <Eye className="w-5 h-5" />
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">
                  {photo.category}
                </span>
                <h3 className="text-sm font-bold text-[#102A43] mt-1 leading-snug">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {photo.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Modal Preview */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 bg-[#102A43]/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="p-6 bg-white">
                <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-lg font-bold text-[#102A43] mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2">
                  {selectedPhoto.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
