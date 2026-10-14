import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Search,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Calendar,
  Sparkles,
  Filter,
  Eye,
  RefreshCw,
  FolderOpen,
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Stethoscope,
  Users,
  Scroll,
  CheckSquare,
  Lock,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { AdmissionDocument } from '../types';
import {
  getPublishedAdmissionDocuments,
  downloadAdmissionDocument,
} from '../services/admissionDocumentsService';
import {
  generateStudentAdmissionFormPdfDoc,
  generateParentGuardianFormPdfDoc,
  generateSchoolRulesAndRegulationsPdfDoc,
  generateOfficialMedicalExaminationFormPdfDoc,
  generateOfficialJoiningInstructions2027PdfDoc,
  generateVituMuhimuPdfDoc,
} from '../utils/pdfService';

interface AdmissionDocumentsPageProps {
  onBackToHome: () => void;
  onOpenAdminPortal?: () => void;
}

export const AdmissionDocumentsPage: React.FC<AdmissionDocumentsPageProps> = ({
  onBackToHome,
  onOpenAdminPortal,
}) => {
  const { language } = useLanguage();
  const { user, userProfile } = useAuth();
  const isAdmin = user && userProfile?.role === 'admin';

  const [documents, setDocuments] = useState<AdmissionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<AdmissionDocument | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);

  // Load published admission documents
  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await getPublishedAdmissionDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load admission documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Cleanup preview URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewBlobUrl) {
        URL.revokeObjectURL(previewBlobUrl);
      }
    };
  }, [previewBlobUrl]);

  // Categories definitions
  const categories = [
    { id: 'all', labelSw: 'Nyaraka Zote', labelEn: 'All Documents', icon: FolderOpen },
    { id: 'admission', labelSw: 'Udahili & Usajili', labelEn: 'Admission & Biodata', icon: FileText },
    { id: 'medical', labelSw: 'Upimaji Afya', labelEn: 'Medical Examination', icon: Stethoscope },
    { id: 'parent', labelSw: 'Taarifa za Mzazi', labelEn: 'Parent Undertaking', icon: Users },
    { id: 'joining', labelSw: 'Maelekezo Kujiunga', labelEn: 'Joining Instructions', icon: BookOpen },
    { id: 'rules', labelSw: 'Sheria & Kanuni', labelEn: 'Rules & Conduct', icon: Scroll },
    { id: 'checklist', labelSw: 'Vitu Muhimu', labelEn: 'Required Checklist', icon: CheckSquare },
  ];

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const titleSw = doc.titleSw?.toLowerCase() || '';
      const titleEn = doc.titleEn?.toLowerCase() || '';
      const descSw = doc.descriptionSw?.toLowerCase() || '';
      const descEn = doc.descriptionEn?.toLowerCase() || '';
      const code = doc.code?.toLowerCase() || '';

      const matchesQuery =
        titleSw.includes(query) ||
        titleEn.includes(query) ||
        descSw.includes(query) ||
        descEn.includes(query) ||
        code.includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [documents, selectedCategory, searchQuery]);

  // Handle real download
  const handleDownload = async (docItem: AdmissionDocument) => {
    try {
      setDownloadingId(docItem.id);
      await downloadAdmissionDocument(docItem);
      setToastMessage(
        language === 'sw'
          ? `Nyaraka ya "${docItem.titleSw}" imeanza kupakuliwa.`
          : `Document "${docItem.titleEn}" downloaded successfully.`
      );
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
      setToastMessage(language === 'sw' ? 'Hitilafu wakati wa kupakua nyaraka.' : 'Failed to download document.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setDownloadingId(null);
    }
  };

  // Handle preview in modal
  const handleOpenPreview = (docItem: AdmissionDocument) => {
    setPreviewDoc(docItem);

    if (docItem.downloadType === 'uploaded' && docItem.fileData) {
      setPreviewBlobUrl(docItem.fileData);
      return;
    }

    try {
      let pdfDoc;
      switch (docItem.generatorKey) {
        case 'admission_form':
          pdfDoc = generateStudentAdmissionFormPdfDoc();
          break;
        case 'medical_form':
          pdfDoc = generateOfficialMedicalExaminationFormPdfDoc();
          break;
        case 'parent_form':
          pdfDoc = generateParentGuardianFormPdfDoc();
          break;
        case 'joining_instructions':
          pdfDoc = generateOfficialJoiningInstructions2027PdfDoc();
          break;
        case 'school_rules':
          pdfDoc = generateSchoolRulesAndRegulationsPdfDoc();
          break;
        case 'checklist':
          pdfDoc = generateVituMuhimuPdfDoc();
          break;
        default:
          pdfDoc = generateStudentAdmissionFormPdfDoc();
          break;
      }
      const blob = pdfDoc.output('blob');
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
    } catch (err) {
      console.error('Error generating preview:', err);
    }
  };

  const closePreview = () => {
    setPreviewDoc(null);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'admission':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'medical':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'parent':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'joining':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'rules':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'checklist':
        return 'bg-teal-100 text-teal-900 border-teal-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#102A43] flex flex-col font-sans selection:bg-[#102A43] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#102A43] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-400/50 flex items-center gap-3 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Professional Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="liquid-btn liquid-btn-navy inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Rudi kwenye Ukurasa Mkuu (Return to Home Page)"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'sw' ? 'Rudi Nyumbani' : 'Back to Home'}</span>
          </button>

          {/* School Brand Badge */}
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" />
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-[#102A43] uppercase tracking-wider">
                Uomboni Secondary School
              </span>
              <span className="block text-[10px] text-amber-800 font-semibold font-mono">
                NECTA CENTRE S0486 • MARANGU
              </span>
            </div>
          </div>

          {/* Action / Admin Link if authorized */}
          <div className="flex items-center gap-2">
            {isAdmin && onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="liquid-btn liquid-btn-gold inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black text-amber-950 rounded-xl cursor-pointer shadow-xs"
                title="Lango la Utawala - Simamia Nyaraka (Admin Portal)"
              >
                <ShieldCheck className="w-4 h-4 text-amber-900" />
                <span className="hidden sm:inline">Admin Management</span>
              </button>
            )}
            <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-mono font-bold border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>2026/2027</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        {/* Hero Banner for Admission Documents */}
        <div className="bg-gradient-to-br from-[#102A43] via-[#0A1C2E] to-[#064e3b] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-400/30 relative overflow-hidden">
          {/* Subtle geometric background aura */}
          <div className="absolute -top-16 -right-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL STUDENT ADMISSION PORTAL</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              {language === 'sw'
                ? 'Nyaraka Rasmi za Udahili na Maelekezo ya Kujiunga'
                : 'Official Student Admission Documents & Joining Instructions'}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed font-normal">
              {language === 'sw'
                ? 'Pakua fomu zote zilizoidhinishwa na Uongozi wa Shule ya Sekondari Uomboni (NECTA S0486) kwa ajili ya usajili wa Kidato cha Kwanza na Uhamisho (Kidato cha 2 & 3). Nyaraka zote zipo katika muundo rasmi wa PDF unaofaa kuchapishwa moja kwa moja.'
                : 'Download and print all verified admission documents published by Uomboni Secondary School (NECTA S0486) for Form One intake and transfer admissions. All forms are formatted for clean, professional A4 printing.'}
            </p>

            {/* Institutional verification notice */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-amber-200/90">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Nyaraka Halisi Zilizoidhinishwa (Official &amp; Verified)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-amber-300" />
                <span>Format ya A4 Inayochapika (Print-Ready A4)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Hifadhi Salama ya Nyaraka (Securely Hosted)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Admin Quick Action Alert (If logged in as administrator) */}
        {isAdmin && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>Modi ya Usimamizi (Administrator Mode):</strong> Unaweza kuongeza nyaraka mpya, kubadilisha faili zilizopo, au kusitisha uchapishaji kupitia dashibodi ya utawala.
              </span>
            </div>
            {onOpenAdminPortal && (
              <button
                onClick={onOpenAdminPortal}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shrink-0 transition-colors cursor-pointer shadow-xs"
              >
                Simamia Nyaraka &gt;
              </button>
            )}
          </div>
        )}

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-grow max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Tafuta nyaraka kwa jina, namba ya nambari au maelezo...'
                    : 'Search admission documents by name, code, or description...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#102A43] focus:ring-1 focus:ring-[#102A43] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Document Count Badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 self-end md:self-auto">
              <span className="font-bold text-[#102A43]">{filteredDocs.length}</span>
              <span>{language === 'sw' ? 'Nyaraka Zinapatikana' : 'Available Documents'}</span>
              <button
                onClick={loadDocuments}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#102A43] transition-colors cursor-pointer ml-1"
                title="Refresh Documents"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#102A43] text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{language === 'sw' ? cat.labelSw : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
            <RefreshCw className="w-8 h-8 text-[#C9A227] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              {language === 'sw' ? 'Inapakia nyaraka za udahili...' : 'Loading admission documents...'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDocs.length === 0 && (
          <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-slate-200 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-bold text-[#102A43]">
                {language === 'sw'
                  ? 'Hakuna Nyaraka Zilizochapishwa kwa Kigezo Hiki'
                  : 'No Published Documents Found for This Criteria'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {language === 'sw'
                  ? 'Hakuna nyaraka inayolingana na utafutaji wako au uongozi haujachapisha nyaraka katika kundi hili. Tafadhali weka upya vigezo au chagua Nyaraka Zote.'
                  : 'No documents match your filter or the administration has not published documents in this category yet. Please reset search or select All Documents.'}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'sw' ? 'Onyesha Nyaraka Zote' : 'Show All Documents'}</span>
            </button>
          </div>
        )}

        {/* Documents Grid */}
        {!loading && filteredDocs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((docItem) => {
              const isDownloading = downloadingId === docItem.id;
              const title = language === 'sw' ? docItem.titleSw : docItem.titleEn;
              const description = language === 'sw' ? docItem.descriptionSw : docItem.descriptionEn;

              return (
                <div
                  key={docItem.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400/80 hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-4">
                    {/* Card Top: Code & FileType Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#102A43] text-amber-300 text-[10px] font-mono font-bold tracking-wider">
                          {docItem.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeColor(
                            docItem.category
                          )}`}
                        >
                          {docItem.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 font-semibold">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                          {docItem.fileType || 'PDF'}
                        </span>
                        <span>{docItem.fileSize}</span>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div>
                      <h3 className="text-base font-bold text-[#102A43] group-hover:text-amber-800 transition-colors leading-snug">
                        {title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                        {description}
                      </p>
                    </div>

                    {/* Document Meta Info */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{docItem.academicYear || '2026/2027'}</span>
                      </span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Imeidhinishwa' : 'Verified'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <button
                      onClick={() => handleDownload(docItem)}
                      disabled={isDownloading}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-[#102A43] hover:from-emerald-700 hover:to-[#0A1C2E] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.99] border border-emerald-600/30"
                      title={language === 'sw' ? 'Pakua nyaraka ya PDF' : 'Download PDF document'}
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                          <span>{language === 'sw' ? 'Inapakua...' : 'Downloading...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                          <span>{language === 'sw' ? 'Pakua Nyaraka (PDF)' : 'Download PDF Document'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleOpenPreview(docItem)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      title={language === 'sw' ? 'Tazama na uchapishe' : 'Preview and print'}
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>{language === 'sw' ? 'Tazama / Print (Preview)' : 'Preview / Print Document'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Instructions & Admissions Office Contacts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h4 className="text-base font-bold text-[#102A43] flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{language === 'sw' ? 'Msaada wa Kujaza Fomu na Udahili' : 'Need Help Completing Your Forms?'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'sw'
                ? 'Ikiwa unahitaji ufafanuzi wowote kuhusu kujaza fomu ya afya, mchanganuo wa ada, au ratiba ya kuanza masomo Marangu, tafadhali wasiliana moja kwa moja na Ofisi ya Mkuu wa Shule au Makamu wa Mkuu wa Shule.'
                : 'For inquiries regarding clinical medical verification, school fee payment schedules, or intake arrival logistics at Marangu, reach out directly to the Admissions Desk.'}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3 font-mono text-xs font-bold text-slate-800">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">📞 0782 558 127</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">📞 0752 000 939</span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg">✉️ uombonisec@gmail.com</span>
            </div>
          </div>

          <button
            onClick={onBackToHome}
            className="liquid-btn liquid-btn-navy px-6 py-3 text-xs sm:text-sm font-bold text-white rounded-xl shadow-xs cursor-pointer shrink-0 flex items-center gap-2 hover:scale-[1.02] transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>{language === 'sw' ? 'Rudi Ukurasa wa Kwanza' : 'Return to Home Page'}</span>
          </button>
        </div>
      </main>

      {/* Document Interactive Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-[#102A43] text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/10 text-amber-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold leading-tight">
                    {language === 'sw' ? previewDoc.titleSw : previewDoc.titleEn}
                  </h3>
                  <span className="text-[11px] text-amber-300/80 font-mono">
                    {previewDoc.code} • {previewDoc.academicYear || '2026/2027'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pakua (PDF)</span>
                </button>
                <button
                  onClick={closePreview}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Viewer */}
            <div className="flex-grow bg-slate-100 p-2 sm:p-4 overflow-hidden flex flex-col items-center justify-center">
              {previewBlobUrl ? (
                <iframe
                  src={previewBlobUrl}
                  title="PDF Document Preview"
                  className="w-full h-full rounded-2xl border border-slate-300 bg-white shadow-inner"
                />
              ) : (
                <div className="text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">
                    Inatengeneza mwonekano wa PDF...
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
              <span className="font-mono text-[11px]">
                {previewDoc.fileName} • {previewDoc.fileSize}
              </span>
              <button
                onClick={closePreview}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer transition-colors"
              >
                Funga (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
