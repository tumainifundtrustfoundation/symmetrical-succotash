import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { SchoolProfile } from '../../types';
import { SchoolLogo } from '../SchoolLogo';
import { processImageFile } from '../../utils/imageUploadHelper';
import {
  Building2,
  Save,
  Check,
  Sparkles,
  Award,
  Compass,
  Target,
  FileText,
  Mail,
  Phone,
  MapPin,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  AlertCircle,
  Link2
} from 'lucide-react';

export const AdminSchoolProfileTab: React.FC = () => {
  const { language } = useLanguage();
  const {
    schoolProfile,
    updateSchoolProfile,
    customLogoUrl,
    setCustomLogoUrl,
    resetLogoToDefault,
  } = useData();

  const [formData, setFormData] = useState<SchoolProfile>(schoolProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Logo upload state
  const [logoInputUrl, setLogoInputUrl] = useState('');
  const [logoFeedback, setLogoFeedback] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);

  useEffect(() => {
    if (schoolProfile) {
      setFormData(schoolProfile);
    }
  }, [schoolProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Direct File Upload Handler (Applies logo immediately across the whole website)
  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingLogo(true);
    setLogoError(null);
    setLogoFeedback(null);

    try {
      const dataUrl = await processImageFile(file, {
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.85,
        maxSizeBytes: 200 * 1024,
      });

      if (dataUrl) {
        setCustomLogoUrl(dataUrl);
        setLogoFeedback(
          language === 'sw'
            ? 'Nembo mpya imewekwa moja kwa moja kwenye tovuti nzima na kuhifadhiwa kwenye seva!'
            : 'New school logo applied instantly across all pages and saved to server!'
        );
        setTimeout(() => setLogoFeedback(null), 4000);
      }
    } catch (err: any) {
      setLogoError(
        err?.message ||
          (language === 'sw'
            ? 'Hitilafu imetokea wakati wa kusoma picha ya nembo.'
            : 'Error processing logo image file.')
      );
    } finally {
      setIsProcessingLogo(false);
      e.target.value = '';
    }
  };

  // URL / Blob Link Handler
  const handleLogoUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    setLogoError(null);
    setLogoFeedback(null);

    const trimmed = logoInputUrl.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
      setCustomLogoUrl(trimmed);
      setLogoFeedback(
        language === 'sw'
          ? 'Nembo mpya kutoka kiungo (URL/Blob) imewekwa moja kwa moja!'
          : 'New school logo from URL/Blob applied instantly across the site!'
      );
      setLogoInputUrl('');
      setTimeout(() => setLogoFeedback(null), 4000);
    } catch {
      setLogoError(
        language === 'sw'
          ? 'Tafadhali weka kiungo (URL) sahihi cha picha ya nembo.'
          : 'Please enter a valid image URL.'
      );
    }
  };

  // Reset to original school logo
  const handleResetLogo = () => {
    resetLogoToDefault();
    setLogoFeedback(
      language === 'sw'
        ? 'Nembo imerejeshwa kuwa nembo asili ya Uomboni Secondary School.'
        : 'Logo has been reset to the original official school crest.'
    );
    setTimeout(() => setLogoFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">
              {language === 'sw' ? 'Wasifu, Nembo, Dira, Dhamira na Kaulimbiu ya Shule' : 'School Profile, Logo, Vision & Mission'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'sw'
              ? 'Badilisha nembo rasmi ya shule, kaulimbiu, wito wa shule, dira, dhamira na maelezo ya msingi yanayoonekana kwenye kurasa zote za tovuti.'
              : 'Update official school logo, motto, slogan, vision, mission, and foundational details displayed across the website.'}
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{language === 'sw' ? 'Mabadiliko Yamehifadhiwa!' : 'Saved Successfully!'}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 0: OFFICIAL SCHOOL LOGO CUSTOMIZATION (MOJA KWA MOJA)
         ========================================================================= */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>{language === 'sw' ? 'Nembo Rasmi ya Shule (Official School Logo)' : 'Official School Logo'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'sw'
                ? 'Ukiweka nembo hapa (kwa kupakia picha au kuweka kiungo), itawekwa moja kwa moja kwenye kurasa zote za tovuti, navbar, portal, ripoti za mitihani, na vyeti.'
                : 'Any logo uploaded or set here is updated immediately and automatically across all pages, navigation, portals, and student report cards.'}
            </p>
          </div>

          {customLogoUrl && (
            <button
              type="button"
              onClick={handleResetLogo}
              className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'sw' ? 'Rejesha Nembo Asili' : 'Reset to Default Crest'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Live Preview Box */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-950/80 rounded-xl border border-slate-800/90 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              {language === 'sw' ? 'Mwonekano wa Sasa (Live Preview)' : 'Live Logo Preview'}
            </span>
            <div className="w-24 h-24 p-2 rounded-2xl bg-white/5 border border-slate-700 flex items-center justify-center shadow-inner">
              <SchoolLogo size="lg" />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 font-mono">
              {customLogoUrl ? 'Nembo Iliyowekwa Sasa' : 'Nembo Asili ya Uomboni'}
            </span>
          </div>

          {/* Upload Controls */}
          <div className="md:col-span-8 space-y-4">
            {/* File Upload Option */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                {language === 'sw' ? '1. Pakia Faili la Nembo (Kutoka kwenye Simu au Kompyuta)' : '1. Upload Logo File (From Device)'}
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>
                    {isProcessingLogo
                      ? (language === 'sw' ? 'Inasindika nembo...' : 'Processing logo...')
                      : (language === 'sw' ? 'Chagua Faili la Nembo (PNG, JPG, WebP)' : 'Choose Logo File (PNG, JPG, WebP)')}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoFileSelect}
                    disabled={isProcessingLogo}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* URL / Blob Option */}
            <form onSubmit={handleLogoUrlApply} className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                {language === 'sw' ? '2. Au Weka Kiungo cha Picha (URL / Blob Link)' : '2. Or Paste Image URL / Blob Link'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="url"
                    value={logoInputUrl}
                    onChange={(e) => setLogoInputUrl(e.target.value)}
                    placeholder="https://example.com/logo.png au /api/blobs/logo.png"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-450 text-slate-950 font-black text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  {language === 'sw' ? 'Weka Nembo' : 'Apply Logo'}
                </button>
              </div>
            </form>

            {/* Feedback messages */}
            {logoFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{logoFeedback}</span>
              </div>
            )}

            {logoError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{logoError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        {/* Basic Identifiers */}
        <div>
          <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {language === 'sw' ? '1. Utambulisho Rasmi wa Shule' : '1. Official School Identifiers'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Jina Rasmi la Shule' : 'Official School Name'}
              </label>
              <input
                type="text"
                value={formData?.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Namba ya Usajili ya NECTA' : 'NECTA Registration Code'}
              </label>
              <input
                type="text"
                value={formData?.nectaCode || 'S0486'}
                onChange={(e) => setFormData({ ...formData, nectaCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Mwaka wa Kuanzishwa' : 'Year Established'}
              </label>
              <input
                type="text"
                value={formData?.establishedYear || 2004}
                onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value, 10) || 2004 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Mottos and Slogans */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            {language === 'sw' ? '2. Kaulimbiu na Wito wa Shule' : '2. School Motto & Slogan'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Kaulimbiu (Motto - Kiswahili)' : 'Motto (Swahili)'}
              </label>
              <input
                type="text"
                value={formData?.motto || formData?.mottoSw || ''}
                onChange={(e) => setFormData({ ...formData, motto: e.target.value, mottoSw: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Kaulimbiu (Motto - English)' : 'Motto (English)'}
              </label>
              <input
                type="text"
                value={formData?.mottoEn || ''}
                onChange={(e) => setFormData({ ...formData, mottoEn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Wito wa Shule (Slogan - Kiswahili)' : 'Slogan (Swahili)'}
              </label>
              <input
                type="text"
                value={formData?.slogan || formData?.sloganSw || ''}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value, sloganSw: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Wito wa Shule (Slogan - English)' : 'Slogan (English)'}
              </label>
              <input
                type="text"
                value={formData?.sloganEn || ''}
                onChange={(e) => setFormData({ ...formData, sloganEn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Vision and Mission */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {language === 'sw' ? '3. Dira na Dhamira ya Shule' : '3. Vision & Mission'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Dira ya Shule (Vision - English)' : 'Vision Statement (English)'}
              </label>
              <textarea
                rows={3}
                value={formData?.vision || formData?.visionEn || ''}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value, visionEn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Dira ya Shule (Vision - Kiswahili)' : 'Vision Statement (Swahili)'}
              </label>
              <textarea
                rows={3}
                value={formData?.visionSw || ''}
                onChange={(e) => setFormData({ ...formData, visionSw: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Dhamira ya Shule (Mission - English)' : 'Mission Statement (English)'}
              </label>
              <textarea
                rows={4}
                value={formData?.mission || formData?.missionEn || ''}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value, missionEn: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Dhamira ya Shule (Mission - Kiswahili)' : 'Mission Statement (Swahili)'}
              </label>
              <textarea
                rows={4}
                value={formData?.missionSw || ''}
                onChange={(e) => setFormData({ ...formData, missionSw: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {language === 'sw' ? '4. Mawasiliano na Eneo' : '4. Location & Contact Info'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Anwani ya Eneo' : 'Physical Location'}
              </label>
              <input
                type="text"
                value={formData?.location || 'Marangu, Kilimanjaro, Tanzania'}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Sanduku la Posta' : 'Postal Address'}
              </label>
              <input
                type="text"
                value={formData?.postalAddress || 'S.L.P. 293, Marangu - Moshi'}
                onChange={(e) => setFormData({ ...formData, postalAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {language === 'sw' ? 'Barua Pepe Rasmi' : 'Official Email'}
              </label>
              <input
                type="email"
                value={formData?.email || 'uomboniss@gmail.com'}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'sw' ? 'Hifadhi Mabadiliko Yote ya Wasifu' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
