import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { JoiningDocument } from '../types';
import { OfficialInvitationLetterViewer } from './OfficialInvitationLetterViewer';
import { StudentEnrollmentProgressBar } from './StudentEnrollmentProgressBar';
import { downloadJoiningInstructionsPdf } from '../utils/pdfService';
import {
  FileDown,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  Printer,
  X,
  ScrollText,
  Compass,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  School,
  BookOpen
} from 'lucide-react';

interface JoiningInstructionsSectionProps {
  onOpenApply?: () => void;
}

export const JoiningInstructionsSection: React.FC<JoiningInstructionsSectionProps> = ({
  onOpenApply,
}) => {
  const { language, t } = useLanguage();
  const { joiningDocs, incrementDocDownload } = useData();

  const [activeAdmissionsTab, setActiveAdmissionsTab] = useState<'flyer' | 'letter' | 'documents'>('flyer');
  const [previewDoc, setPreviewDoc] = useState<JoiningDocument | null>(null);
  const [isFlyerZoomed, setIsFlyerZoomed] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [flyerRotation, setFlyerRotation] = useState<number>(0);
  const [flyerZoomScale, setFlyerZoomScale] = useState<number>(1);

  const handleRotateFlyerCw = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlyerRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateFlyerCcw = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlyerRotation((prev) => (prev - 90 + 360) % 360);
  };

  const handleZoomInFlyer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlyerZoomScale((prev) => Math.min(Number((prev + 0.25).toFixed(2)), 3.0));
  };

  const handleZoomOutFlyer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlyerZoomScale((prev) => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  };

  const handleResetFlyerTransform = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlyerRotation(0);
    setFlyerZoomScale(1);
  };

  const handleDownload = (doc: JoiningDocument) => {
    incrementDocDownload(doc.id);
    downloadJoiningInstructionsPdf(doc);
    setDownloadSuccessMsg(
      language === 'sw'
        ? `Fomu ya "${doc.titleSw}" inapakuliwa moja kwa moja!`
        : `"${doc.titleEn}" is downloading successfully!`
    );
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 4000);
  };

  return (
    <section id="admissions" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0b2545] text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-800" />
            <span>{language === 'sw' ? 'Udahili & Fomu za Kujiunga 2026/2027' : 'Admissions & Joining Instructions 2026/2027'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {language === 'sw' ? 'Fomu & Barua Rasmi ya Mwaliko wa Kujiunga' : 'Application Forms & Official Invitation Letter'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {language === 'sw'
              ? 'Nafasi za Pre-Form One (21/09/2026), Kidato cha 1 na 3 (2026–2027) ziko wazi. Pakua fomu na maelekezo ya kujiunga.'
              : 'Pre-Form One starts 21/09/2026. Form 1 & 3 intake for 2026–2027 academic year is open. View and download official materials.'}
          </p>
        </div>

        {/* Visual Student Onboarding Progress Bar */}
        <StudentEnrollmentProgressBar
          onOpenApply={onOpenApply}
          onSelectLetterTab={() => setActiveAdmissionsTab('letter')}
          onSelectDocsTab={() => setActiveAdmissionsTab('documents')}
        />

        {/* Download Feedback Alert */}
        {downloadSuccessMsg && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-[#0b2545] flex items-center justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
              <span>{downloadSuccessMsg}</span>
            </div>
            <button
              onClick={() => setDownloadSuccessMsg(null)}
              className="text-blue-700 hover:text-blue-950 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Switcher for Deep-Dive Views */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {language === 'sw' ? 'Nyaraka & Fomu za Shule' : 'School Official Prospectus & Forms'}
              </h3>
              <p className="text-xs text-slate-600">
                {language === 'sw'
                  ? 'Chagua barua rasmi ya mwaliko au orodha kamili ya fomu za kupakua.'
                  : 'Choose between the authenticated invitation letter or download individual form documents.'}
              </p>
            </div>

            <div className="inline-flex flex-wrap justify-center items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner gap-1">
              <button
                id="btn-tab-flyer-2026"
                onClick={() => setActiveAdmissionsTab('flyer')}
                className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeAdmissionsTab === 'flyer'
                    ? 'bg-[#0b2545] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>{language === 'sw' ? 'Tangazo Rasmi (Flyer 2026)' : 'Official Admissions Flyer'}</span>
              </button>
              <button
                id="btn-tab-letter-viewer"
                onClick={() => setActiveAdmissionsTab('letter')}
                className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeAdmissionsTab === 'letter'
                    ? 'bg-[#0b2545] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <ScrollText className="w-4 h-4" />
                <span>{language === 'sw' ? 'Barua Rasmi ya Mwaliko (PDF)' : 'Official Invitation Letter'}</span>
              </button>
              <button
                id="btn-tab-documents-pack"
                onClick={() => setActiveAdmissionsTab('documents')}
                className={`px-4 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeAdmissionsTab === 'documents'
                    ? 'bg-[#0b2545] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'sw' ? 'Fomu Zote za Kujiunga' : 'Joining Forms Pack'}</span>
              </button>
            </div>
          </div>

          {/* Tab 0: Admissions Flyer 2026 Showcase */}
          {activeAdmissionsTab === 'flyer' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-[#0b2545] text-white rounded-xl p-6 sm:p-10 border border-blue-900 shadow-xs overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Visual Flyer Card */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div 
                      onClick={() => setIsFlyerZoomed(true)}
                      className="group relative cursor-pointer rounded-xl overflow-hidden border border-blue-400/40 shadow-md hover:border-amber-400 transition-all max-w-sm bg-black min-h-[300px] flex items-center justify-center p-2"
                    >
                      <img
                        src="/uomboni_flyer_2026.jpg"
                        alt="Tangazo Rasmi la Udahili Shule ya Sekondari Uomboni 2026/2027"
                        style={{
                          transform: `rotate(${flyerRotation}deg)`,
                          transition: 'transform 0.3s ease-in-out',
                        }}
                        className="w-full max-h-[460px] object-contain group-hover:scale-103 transition-transform duration-300 origin-center"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-4 text-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white text-[#0b2545] flex items-center justify-center shadow-lg">
                          <ZoomIn className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-[#0b2545]/90 px-3 py-1 rounded-full border border-blue-300">
                          {language === 'sw' ? 'Bonyeza Kukuza Picha (Zoom)' : 'Click to View Full Image'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      {/* Rotate Buttons */}
                      <div className="inline-flex items-center rounded-lg bg-blue-950/90 border border-blue-700/80 p-0.5">
                        <button
                          type="button"
                          onClick={handleRotateFlyerCcw}
                          title={language === 'sw' ? 'Zungusha Kushoto (-90°)' : 'Rotate Counter-Clockwise (-90°)'}
                          className="p-1.5 rounded-md hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-400" />
                        </button>
                        <span className="px-1.5 text-[11px] font-mono font-bold text-amber-300 select-none">
                          {flyerRotation}°
                        </span>
                        <button
                          type="button"
                          onClick={handleRotateFlyerCw}
                          title={language === 'sw' ? 'Zungusha Kulia (+90°)' : 'Rotate Clockwise (+90°)'}
                          className="p-1.5 rounded-md hover:bg-blue-800 text-blue-200 hover:text-white transition-colors"
                        >
                          <RotateCw className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>

                      {flyerRotation !== 0 && (
                        <button
                          type="button"
                          onClick={handleResetFlyerTransform}
                          title={language === 'sw' ? 'Rudisha mkao wa kawaida (0°)' : 'Reset rotation (0°)'}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-slate-600 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>0°</span>
                        </button>
                      )}

                      <a
                        href="/uomboni_flyer_2026.jpg"
                        download="Tangazo_Udahili_Uomboni_Secondary_2026.jpg"
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#0b2545] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Pakua' : 'Download'}</span>
                      </a>
                      <button
                        onClick={() => setIsFlyerZoomed(true)}
                        className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Kuza' : 'Enlarge'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Key Flyer Highlights */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800 text-blue-100 text-xs font-bold border border-blue-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'sw' ? 'TANGAZO RASMI LA UDAHILI 2026/2027' : 'OFFICIAL ADMISSIONS CALL 2026/2027'}</span>
                      </div>
                      <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight">
                        {language === 'sw'
                          ? 'Udahili wa Pre-Form One na Kidato cha 1 & 3 Uko Wazi!'
                          : 'Admissions for Pre-Form One and Form 1 & 3 Are Now Open!'}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {language === 'sw'
                          ? 'Shule ya Sekondari Uomboni (Marangu, Moshi Vijijini) inakaribisha maombi kwa wanafunzi wa bweni na kutwa. Mazingira safi ya Marangu chini ya Mlima Kilimanjaro na maadili thabiti ya Kikatoliki.'
                          : 'Uomboni Secondary School (Marangu, Moshi Rural) invites applications for boarding and day students. Serene Kilimanjaro foothills setting with strong Catholic foundational discipline.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                          {language === 'sw' ? '🗓️ TAREHE YA PRE-FORM ONE' : '🗓️ PRE-FORM ONE START'}
                        </span>
                        <p className="text-base font-bold text-white">21 / 09 / 2026</p>
                        <p className="text-[11px] text-slate-300">
                          {language === 'sw' ? 'Maandalizi maalum ya lugha ya Kiingereza na misingi ya sayansi.' : 'Intensive English immersion and core science foundation.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-blue-200 uppercase tracking-wider block">
                          {language === 'sw' ? '🏫 MADARASA YANAYOPOKEA' : '🏫 INTAKE LEVELS'}
                        </span>
                        <p className="text-base font-bold text-white">Pre-Form 1, Kidato 1 & 3</p>
                        <p className="text-[11px] text-slate-300">
                          {language === 'sw' ? 'Wavulana na Wasichana (Bweni na Kutwa)' : 'Boys & Girls (Boarding & Day)'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                          {language === 'sw' ? '📍 UPATIKANAJI WA FOMU' : '📍 FORM DISTRIBUTION'}
                        </span>
                        <p className="text-sm font-bold text-white">
                          Ofisi ya Shule Marangu, Moshi Bookshop & Ngarenaro
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {language === 'sw' ? 'Pia fomu zinapatikana mtandaoni hapa chini.' : 'Also available for digital download below.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/80 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-blue-200 uppercase tracking-wider block">
                          {language === 'sw' ? '💰 ADA NAFUU' : '💰 AFFORDABLE TUITION'}
                        </span>
                        <p className="text-sm font-bold text-white">
                          Inalipwa kwa Awamu
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {language === 'sw' ? 'Gharama zote ziko wazi na hakuna ada zilizofichika.' : 'Transparent fees payable in comfortable installments.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-900/60 border border-blue-700/60 space-y-2">
                      <span className="text-[11px] font-mono font-bold text-blue-100 block uppercase">
                        {language === 'sw' ? '📞 Mawasiliano ya Haraka ya Udahili' : '📞 Direct Admission Hotlines'}
                      </span>
                      <div className="flex flex-wrap items-center gap-3">
                        {['0752 000 939', '0782 558 127', '0745 548 225', '0754 532 949'].map((ph, idx) => (
                          <a
                            key={idx}
                            href={`tel:${ph.replace(/\s+/g, '')}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b2545] hover:bg-blue-950 text-white text-xs font-mono font-bold border border-blue-600 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                            <span>{ph}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {onOpenApply && (
                        <button
                          onClick={onOpenApply}
                          className="px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-[#0b2545] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                        >
                          <BookOpen className="w-4 h-4 text-[#0b2545]" />
                          <span>{language === 'sw' ? 'Omba Udahili Mtandaoni Sasa' : 'Apply Online Now'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveAdmissionsTab('documents')}
                        className="px-5 py-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm border border-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>{language === 'sw' ? 'Tazama Fomu za Kupakua' : 'View Downloadable Forms'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: Official Invitation Letter */}
          {activeAdmissionsTab === 'letter' && (
            <div className="animate-in fade-in duration-300">
              <OfficialInvitationLetterViewer />
            </div>
          )}

          {/* Tab 2: Documents Grid */}
          {activeAdmissionsTab === 'documents' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {joiningDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl p-6 sm:p-7 border border-slate-200 hover:border-blue-500/40 transition-colors shadow-xs flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0b2545] flex items-center justify-center shadow-xs shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0b2545] border border-blue-200">
                          {doc.targetGroup}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {language === 'sw' ? doc.titleSw : doc.titleEn}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                          {language === 'sw' ? doc.descriptionSw : doc.descriptionEn}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons & Metadata */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500 font-mono">
                        <span>{doc.fileSize}</span> • <span>{doc.downloadCount} {language === 'sw' ? 'Wamepakua' : 'Downloads'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0b2545]" />
                          <span>{t('joining.btnPreview')}</span>
                        </button>

                        <button
                          onClick={() => handleDownload(doc)}
                          className="px-4 py-2 rounded-lg bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t('joining.btnDownload')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Admission Guidelines Callout */}
              <div className="bg-[#0b2545] text-white p-6 sm:p-8 rounded-xl border border-blue-900 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    <span>{language === 'sw' ? 'Ratiba Muhimu ya Kujiunga' : 'Important Admission Deadlines'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {language === 'sw'
                      ? 'Tarehe ya Kuripoti Kidato cha Kwanza ni Tarehe 11 Januari 2026'
                      : 'Form One Reporting Date is January 11, 2026'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {language === 'sw'
                      ? 'Wanafunzi wote wanaoripoti wanatakiwa kuwasilisha fomu ya matibabu iliyopimwa hospitalini, fomu ya usajili iliyosainiwa na risiti ya malipo ya benki ya nusu au ada yote.'
                      : 'All incoming students must present an authenticated medical report, signed prospectus forms, and verified bank deposit slips.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <button
                    onClick={() => {
                      if (joiningDocs[0]) handleDownload(joiningDocs[0]);
                    }}
                    className="w-full py-3 px-4 rounded-lg bg-white hover:bg-slate-100 text-[#0b2545] font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#0b2545]" />
                    <span>{language === 'sw' ? 'Pakua Fomu Kuu ya 2026' : 'Download Main 2026 Pack'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Online Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Top Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#0b2545] uppercase tracking-wide">
                  {language === 'sw' ? 'Mwonekano wa Fomu Mtandaoni' : 'Online Document Preview'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {language === 'sw' ? previewDoc.titleSw : previewDoc.titleEn}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-xs space-y-4 text-slate-800 whitespace-pre-line leading-relaxed">
              <div className="text-center font-bold text-slate-900 border-b border-slate-200 pb-3">
                {previewDoc.pdfContentPreview.header}
              </div>

              <div className="space-y-2">
                <div className="font-bold text-[#0b2545] uppercase">
                  {language === 'sw' ? '1. MAHITAJI MUHIMU YA KITAALUMA NA BWENI:' : '1. KEY ACADEMIC & BOARDING REQUIREMENTS:'}
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 font-sans">
                  {previewDoc.pdfContentPreview.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 font-sans">
                <div className="font-bold text-[#0b2545] uppercase">
                  {language === 'sw' ? '2. MWONGOZO WA ADA NA MALIPO:' : '2. FEES & PAYMENT SCHEDULE:'}
                </div>
                <p className="text-slate-700">{previewDoc.pdfContentPreview.feesSummary}</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 font-sans">
                <div className="font-bold text-[#0b2545] uppercase">
                  {language === 'sw' ? '3. TAREHE NA MUDA WA KURIPOTI:' : '3. REPORTING SCHEDULE:'}
                </div>
                <p className="text-slate-700">{previewDoc.pdfContentPreview.reportingDate}</p>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
              >
                {language === 'sw' ? 'Funga' : 'Close'}
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{language === 'sw' ? 'Chapisha' : 'Print'}</span>
              </button>

              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-5 py-2 rounded-lg bg-[#0b2545] hover:bg-blue-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'sw' ? 'Pakua Fomu Sasa (PDF)' : 'Download PDF Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flyer High-Res Zoom Modal */}
      {isFlyerZoomed && (
        <div 
          onClick={() => setIsFlyerZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[96vh] flex flex-col items-center bg-slate-950 rounded-3xl overflow-hidden border border-amber-400/50 shadow-2xl p-4 sm:p-6 space-y-3"
          >
            {/* Header with Title & Action Controls */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-sm sm:text-base">
                  {language === 'sw' ? 'Tangazo Rasmi la Udahili - Shule ya Sekondari Uomboni (2026/2027)' : 'Official Admissions Announcement - Uomboni Secondary School'}
                </span>
              </div>

              {/* Toolbar: Rotate & Zoom Controls */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Rotate Controls */}
                <div className="inline-flex items-center rounded-lg bg-slate-900 border border-slate-700 p-0.5">
                  <button
                    type="button"
                    onClick={handleRotateFlyerCcw}
                    title={language === 'sw' ? 'Zungusha Kushoto (-90°)' : 'Rotate Counter-Clockwise (-90°)'}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-amber-400 select-none">
                    {flyerRotation}°
                  </span>
                  <button
                    type="button"
                    onClick={handleRotateFlyerCw}
                    title={language === 'sw' ? 'Zungusha Kulia (+90°)' : 'Rotate Clockwise (+90°)'}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="inline-flex items-center rounded-lg bg-slate-900 border border-slate-700 p-0.5">
                  <button
                    type="button"
                    onClick={handleZoomOutFlyer}
                    title={language === 'sw' ? 'Punguza Ukubwa' : 'Zoom Out'}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-slate-200 select-none">
                    {Math.round(flyerZoomScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomInFlyer}
                    title={language === 'sw' ? 'Ongeza Ukubwa' : 'Zoom In'}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-200 hover:text-white transition-colors"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {(flyerRotation !== 0 || flyerZoomScale !== 1) && (
                  <button
                    type="button"
                    onClick={handleResetFlyerTransform}
                    title={language === 'sw' ? 'Rudisha Mwanzo (0°)' : 'Reset View (0°)'}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-slate-600 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{language === 'sw' ? 'Rudisha' : 'Reset'}</span>
                  </button>
                )}

                <a
                  href="/uomboni_flyer_2026.jpg"
                  download="Tangazo_Udahili_Uomboni_2026.jpg"
                  className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'sw' ? 'Pakua' : 'Download'}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsFlyerZoomed(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stage Container */}
            <div className="overflow-auto max-h-[78vh] flex items-center justify-center rounded-2xl bg-black w-full p-4 sm:p-8 min-h-[380px]">
              <img
                src="/uomboni_flyer_2026.jpg"
                alt="Tangazo Kamili la Udahili Uomboni 2026"
                style={{
                  transform: `rotate(${flyerRotation}deg) scale(${flyerZoomScale})`,
                  transition: 'transform 0.3s ease-in-out',
                }}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl origin-center"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
