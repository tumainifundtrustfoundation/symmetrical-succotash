import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Film,
  Sparkles,
  Save,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import { SchoolVideo } from '../../types';
import {
  getSchoolVideos,
  saveSchoolVideo,
  deleteSchoolVideo,
  extractYouTubeVideoId,
  buildYouTubeEmbedUrl,
  buildYouTubeThumbnailUrl,
  INITIAL_SCHOOL_VIDEOS,
} from '../../services/videoFirestoreService';

export const AdminVideosTab: React.FC = () => {
  const [videos, setVideos] = useState<SchoolVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<SchoolVideo | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    youtubeUrl: string;
    category: string;
    published: boolean;
    featured: boolean;
  }>({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'Campus Life',
    published: true,
    featured: false,
  });

  const [urlPreviewId, setUrlPreviewId] = useState<string | null>(null);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const list = await getSchoolVideos();
      setVideos(list);
    } catch (err: any) {
      console.error('Failed to load videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingVideo(null);
    setFormData({
      title: '',
      description: '',
      youtubeUrl: '',
      category: 'Campus Life',
      published: true,
      featured: false,
    });
    setUrlPreviewId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (video: SchoolVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      youtubeUrl: video.youtubeUrl,
      category: video.category || 'Campus Life',
      published: video.published,
      featured: !!video.featured,
    });
    setUrlPreviewId(video.videoId);
    setIsModalOpen(true);
  };

  const handleUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, youtubeUrl: url }));
    const extracted = extractYouTubeVideoId(url);
    setUrlPreviewId(extracted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Tafadhali weka kichwa cha video (Title is required).' });
      return;
    }

    const videoId = extractYouTubeVideoId(formData.youtubeUrl);
    if (!videoId) {
      setStatusMessage({
        type: 'error',
        text: 'Kiunganishi cha YouTube si sahihi. Weka link halali ya YouTube watch, youtu.be, au Shorts.',
      });
      return;
    }

    const now = new Date().toISOString();
    const dateFormatted = new Date().toISOString().split('T')[0];

    const videoToSave: SchoolVideo = {
      id: editingVideo ? editingVideo.id : `vid_${videoId}_${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      youtubeUrl: formData.youtubeUrl.trim(),
      videoId,
      embedUrl: buildYouTubeEmbedUrl(videoId),
      thumbnailUrl: buildYouTubeThumbnailUrl(videoId),
      published: formData.published,
      featured: formData.featured,
      category: formData.category,
      publishedDate: editingVideo ? editingVideo.publishedDate : dateFormatted,
      createdAt: editingVideo ? editingVideo.createdAt : now,
      updatedAt: now,
      createdBy: 'Admin / IT Coordinator',
    };

    const success = await saveSchoolVideo(videoToSave);
    if (success) {
      setStatusMessage({
        type: 'success',
        text: editingVideo ? 'Video imesasishwa kikamilifu!' : 'Video mpya imeongezwa na kuchapishwa kikamilifu!',
      });
      setIsModalOpen(false);
      loadVideos();
    } else {
      setStatusMessage({ type: 'error', text: 'Hitilafu ilitokea wakati wa kuhifadhi video kwenye mfumo.' });
    }

    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleDelete = async (videoId: string, title: string) => {
    if (!window.confirm(`Una uhakika unataka kufuta video hii: "${title}"?`)) return;
    const ok = await deleteSchoolVideo(videoId);
    if (ok) {
      setStatusMessage({ type: 'success', text: 'Video imefutwa kikamilifu.' });
      loadVideos();
    } else {
      setStatusMessage({ type: 'error', text: 'Hitilafu ya kufuta video.' });
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleTogglePublish = async (video: SchoolVideo) => {
    const updated = { ...video, published: !video.published, updatedAt: new Date().toISOString() };
    await saveSchoolVideo(updated);
    setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Mfumo wa Usimamizi wa Video za Shule (School Video Management)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ongeza, hariri, chapisha, au futa video za YouTube. Video zilizoidhinishwa tu ndizo zinazoonekana hadharani.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Weka Video Mpya</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/70 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/70 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Videos List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-black">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/0.jpg`;
                }}
              />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    video.published ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700' : 'bg-amber-950/90 text-amber-300 border border-amber-700'
                  }`}
                >
                  {video.published ? '● Published' : '○ Draft (Unpublished)'}
                </span>
                {video.featured && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Featured</span>
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                {video.category || 'General'}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {video.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {video.description || 'Hakuna maelezo ya ziada yaliyowekwa.'}
                </p>
                <div className="text-[10px] text-slate-500 font-mono pt-1">
                  Tarehe: {video.publishedDate} • ID: {video.videoId}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePublish(video)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      video.published
                        ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    }`}
                    title={video.published ? 'Ficha video' : 'Chapisha hadharani'}
                  >
                    {video.published ? 'Unpublish' : 'Publish'}
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(video)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Hariri video"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Fungua YouTube"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <button
                  onClick={() => handleDelete(video.id, video.title)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                  title="Futa video"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Film className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">
                  {editingVideo ? 'Hariri Video ya Shule' : 'Weka Video Mpya ya YouTube'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kiunganishi cha YouTube (YouTube URL) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... au https://youtu.be/..."
                  value={formData.youtubeUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Inakubali viungo vya kawaida, youtu.be, na YouTube Shorts.
                </p>
              </div>

              {/* Embed Preview if valid */}
              {urlPreviewId && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>YouTube Video ID Imethibitishwa: {urlPreviewId}</span>
                  </div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={buildYouTubeEmbedUrl(urlPreviewId)}
                      title="Preview"
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Kichwa cha Video (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="mf. Ziara ya Maabara za Sayansi Uomboni"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Kategoria (Category)
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="Campus Life">Campus Life (Mazingira ya Shule)</option>
                    <option value="Academic">Academic (Taaluma na Maabara)</option>
                    <option value="Events & Graduation">Events &amp; Graduation (Mahafali)</option>
                    <option value="Sports">Sports (Michezo)</option>
                    <option value="Mass & Spiritual">Mass &amp; Spiritual (Ibada na Misa)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded border-slate-700 text-red-600 focus:ring-0"
                    />
                    <span>Chapisha Hadharani (Publicly Visible)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-slate-700 text-amber-500 focus:ring-0"
                    />
                    <span>Weka kama Featured Video (Spotlight)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Maelezo (Description)
                </label>
                <textarea
                  rows={3}
                  placeholder="Maelezo mafupi kuhusu maudhui ya video hii..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Ghairi (Cancel)
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingVideo ? 'Hifadhi Mabadiliko' : 'Hifadhi na Chapisha Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
