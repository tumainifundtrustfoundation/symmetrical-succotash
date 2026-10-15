import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { SchoolLogo } from './SchoolLogo';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Bell,
  Search,
  Download,
  Printer,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  X,
  User,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileCheck,
  Phone,
  Bookmark,
} from 'lucide-react';
import { downloadStudentResultSlipPdf } from '../utils/pdfService';
import { StudentResult } from '../types';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'results',
}) => {
  const { language } = useLanguage();
  const { studentResults, timetable, studentNotices, academicCalendar } = useData();

  const [activeTab, setActiveTab] = useState<'results' | 'timetable' | 'notices' | 'admission' | 'resources'>(
    (initialTab as any) || 'results'
  );
  const [searchExamNo, setSearchExamNo] = useState('S0486/0014/2026');
  const [selectedForm, setSelectedForm] = useState<string>('Form 4');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Active student result
  const activeResult: StudentResult | null = useMemo(() => {
    if (!studentResults || studentResults.length === 0) return null;
    const cleanSearch = searchExamNo.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!cleanSearch) return studentResults[0] || null;

    const found = studentResults.find((r) => {
      const cleanExam = r.examNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = r.studentName.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanExam.includes(cleanSearch) || cleanName.includes(cleanSearch);
    });

    return found || studentResults[0];
  }, [studentResults, searchExamNo]);

  // Handle PDF download
  const handleDownloadSlip = async () => {
    if (!activeResult) return;
    setIsGeneratingPdf(true);
    try {
      downloadStudentResultSlipPdf(activeResult);
    } catch (err) {
      console.error('Error generating student result slip:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#102A43]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFF0] rounded-2xl sm:rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col shadow-2xl border-2 border-[#102A43]/20 overflow-hidden font-sans">
        {/* Top Header */}
        <div className="bg-[#102A43] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#C9A227]/30 shrink-0">
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[#102A43] text-[10px] font-black uppercase tracking-wider">
                  STUDENT PORTAL 2026
                </span>
                <span className="text-[11px] text-amber-200 font-mono hidden sm:inline-block">
                  NECTA CENTRE S0486
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-white mt-0.5 leading-tight">
                {language === 'sw' ? 'Jopo Rasmi la Mwanafunzi (Student Portal)' : 'Official Student Academic Portal'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Funga"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#0A1C2E] text-white px-4 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none shrink-0 border-b border-white/10">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-3 sm:px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'results'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{language === 'sw' ? 'Matokeo Yangu' : 'My Results'}</span>
          </button>

          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-3 sm:px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timetable'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'sw' ? 'Ratiba ya Masomo' : 'Class Timetable'}</span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 sm:px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'notices'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{language === 'sw' ? 'Matangazo ya Shule' : 'Notices & News'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admission')}
            className={`px-3 sm:px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admission'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>{language === 'sw' ? 'Mwongozo wa Udahili 2026' : 'Admission Guide'}</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 sm:px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'resources'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'sw' ? 'Maktaba & Masomo' : 'Library & Subjects'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: RESULTS */}
          {activeTab === 'results' && (
            <div className="space-y-6">
              {/* Search Strip */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchExamNo}
                    onChange={(e) => setSearchExamNo(e.target.value)}
                    placeholder="Weka Namba ya Mtihani (e.g. S0486/0014/2026)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-[#102A43] focus:outline-none focus:border-[#102A43]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleDownloadSlip}
                    disabled={isGeneratingPdf || !activeResult}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#102A43] font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isGeneratingPdf ? 'Inatengeneza PDF...' : 'Pakua Ripoti Rasmi (PDF)'}</span>
                  </button>
                </div>
              </div>

              {/* Result Showcase Card */}
              {activeResult ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-[#102A43] text-white p-5 sm:p-6 border-b border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-300 font-mono font-semibold">
                        <span>{activeResult.examNumber}</span>
                        <span>&bull;</span>
                        <span>{activeResult.examType || 'CSSC Joint Examination 2026'}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                        {activeResult.studentName}
                      </h3>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {activeResult.form || 'Form 4'} &bull; Kituo cha Mitihani S0486 &bull; Mwaka 2026
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center px-4 py-2 rounded-2xl bg-white/10 border border-white/20">
                        <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Division</div>
                        <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                          {activeResult.division}
                        </div>
                      </div>

                      <div className="text-center px-4 py-2 rounded-2xl bg-white/10 border border-white/20">
                        <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">Points</div>
                        <div className="text-xl sm:text-2xl font-black text-white font-mono">
                          {activeResult.points}
                        </div>
                      </div>

                      <div className="text-center px-4 py-2 rounded-2xl bg-white/10 border border-white/20">
                        <div className="text-[10px] uppercase tracking-wider text-slate-300 font-bold">GPA</div>
                        <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
                          {activeResult.gpa || '2.8'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subject Scores Table */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'sw' ? 'Mchanganuo wa Alama kwa Kila Somo' : 'Subject Grade Breakdown'}</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {activeResult.subjects.map((sub, idx) => {
                        const gradeColor =
                          sub.grade === 'A'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : sub.grade === 'B'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : sub.grade === 'C'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : sub.grade === 'D'
                            ? 'bg-orange-50 text-orange-800 border-orange-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300';

                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl border ${gradeColor} flex items-center justify-between`}
                          >
                            <div>
                              <div className="text-xs font-bold text-slate-900 leading-tight">{sub.subject}</div>
                              <div className="text-[10px] opacity-75 mt-0.5">
                                {sub.score ? `${sub.score} alama` : 'Imerekodiwa'}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center font-mono font-black text-sm border border-slate-200">
                              {sub.grade}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Remarks Banner */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-amber-900">
                          {language === 'sw' ? 'Maoni ya Kitaaluma na Ushauri (Academic Remarks)' : 'Academic Assessment'}
                        </div>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                          {activeResult.remarks ||
                            'Ufaulu mzuri sana! Mwanafunzi anashauriwa kuendelea kujisomea kwa bidii kwenye masomo ya sayansi na hesabu ili kudumisha kiwango hiki katika mitihani ya NECTA.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
                  <User className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800">Hakuna matokeo yaliyopatikana</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Tafadhali hakikisha namba ya mtihani uliyoandika ni sahihi (mfano: S0486/0014/2026).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIMETABLE */}
          {activeTab === 'timetable' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#102A43]">
                    {language === 'sw' ? 'Ratiba ya Masomo ya Kila Siku (2026)' : 'Official Daily Class Timetable'}
                  </h3>
                  <p className="text-xs text-slate-500">Kuanzia saa 2:00 asubuhi hadi 10:00 jioni</p>
                </div>

                <div className="flex gap-1.5">
                  {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedForm(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedForm === f ? 'bg-[#102A43] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timetable Slots Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#102A43] text-white">
                      <tr>
                        <th className="p-3">Siku (Day)</th>
                        <th className="p-3">Muda (Time)</th>
                        <th className="p-3">Somo (Subject)</th>
                        <th className="p-3">Mwalimu (Teacher)</th>
                        <th className="p-3">Chumba (Room)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { day: 'Jumatatu', time: '08:00 - 09:20', subject: 'Basic Mathematics', teacher: 'Mwl. Yohana Bahati', room: 'Room 4A' },
                        { day: 'Jumatatu', time: '09:20 - 10:40', subject: 'Chemistry', teacher: 'Mwl. Endrew Benson', room: 'Science Lab' },
                        { day: 'Jumatatu', time: '11:00 - 12:20', subject: 'English Language', teacher: 'Mwl. Peter Kimaro', room: 'Room 4A' },
                        { day: 'Jumanne', time: '08:00 - 09:20', subject: 'Physics', teacher: 'Mwl. Yohana Bahati', room: 'Physics Lab' },
                        { day: 'Jumanne', time: '09:20 - 10:40', subject: 'Biology', teacher: 'Madam Adela Manyanga', room: 'Room 4A' },
                        { day: 'Jumanne', time: '11:00 - 12:20', subject: 'Kiswahili', teacher: 'Mwl. Wolter Temu', room: 'Room 4A' },
                        { day: 'Jumatano', time: '08:00 - 09:20', subject: 'Geography', teacher: 'Madam Witness', room: 'Room 4A' },
                        { day: 'Jumatano', time: '09:20 - 10:40', subject: 'Civics', teacher: 'Br. Adolph Massawe', room: 'Room 4A' },
                        { day: 'Alhamisi', time: '08:00 - 09:20', subject: 'History', teacher: 'Madam Witness', room: 'Room 4A' },
                        { day: 'Ijumaa', time: '08:00 - 10:00', subject: 'Practical Science Experiments', teacher: 'Mwl. Endrew Benson', room: 'Science Lab' },
                      ].map((slot, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                          <td className="p-3 font-bold text-slate-800">{slot.day}</td>
                          <td className="p-3 font-mono text-slate-600">{slot.time}</td>
                          <td className="p-3 font-bold text-[#102A43]">{slot.subject}</td>
                          <td className="p-3 text-slate-600">{slot.teacher}</td>
                          <td className="p-3 text-slate-500 font-mono">{slot.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTICES */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-[#102A43]">
                  {language === 'sw' ? 'Matangazo Rasmi ya Shule & Bweni (2026)' : 'Official Student Notices'}
                </h3>
                <p className="text-xs text-slate-500">Miongozo ya malezi, mitihani, na shughuli za kikanisa</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Maandalizi ya Mitihani ya CSSC Joint Mock 2026',
                    date: '14 Oktoba 2026',
                    category: 'Taaluma',
                    body: 'Wanafunzi wote wa Kidato cha Nne wanatakiwa kukamilisha maandalizi ya majaribio ya masomo ya sayansi na sanaa.',
                  },
                  {
                    title: 'Ibada Maalum na Mazoezi ya Kwaya ya Mtakatifu Dominiko',
                    date: '12 Oktoba 2026',
                    category: 'Maadili & Dini',
                    body: 'Mazoezi ya kwaya na ibada ya kila wiki yataendelea siku ya Jumatano na Ijumaa saa 10:30 jioni chini ya uongozi wa watawa.',
                  },
                  {
                    title: 'Mashindano ya Michezo na UMITASHUMTA / UMISETA',
                    date: '08 Oktoba 2026',
                    category: 'Michezo',
                    body: 'Timu ya mpira wa miguu na pete ya shule imeanza mazoezi kujiandaa na mechi za kirafiki wilayani Moshi Vijijini.',
                  },
                  {
                    title: 'Sera ya Matumizi Salama ya Maabara ya Sayansi & TEHAMA',
                    date: '01 Oktoba 2026',
                    category: 'Maabara',
                    body: 'Mwanafunzi yeyote anayeingia maabara ya kemia na kompyuta lazima awe na koti jeupe la maabara (Lab Coat) na azingatie miongozo ya usalama.',
                  },
                ].map((notice, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {notice.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{notice.date}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#102A43] leading-snug">{notice.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{notice.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADMISSION GUIDE */}
          {activeTab === 'admission' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#102A43] to-[#0A1C2E] text-white p-6 rounded-3xl shadow-md border border-amber-400/30">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-[#102A43] text-xs font-black uppercase mb-3">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>MWONGOZO RASMI WA KUJIUNGA 2026</span>
                </div>
                <h3 className="text-xl font-bold font-serif text-white">
                  Fomu Rasmi ya Kujiunga na Maelekezo ya Bweni (Joining Instructions 2026)
                </h3>
                <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
                  Ada ya Bweni kwa Mwaka 2026 ni TZS 1,600,000/= (Muhula I: TZS 800,000/= | Muhula II: TZS 800,000/=). Sare na vifaa vya shuleni ni TZS 224,000/=. Malipo yote hufanyika kupitia CRDB Bank (01J1079051400) au NMB Bank (40302507439).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#102A43]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Nyaraka Zinazohitajika Wakati wa Kuripoti</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                    <li>Fomu Halisi ya Kujiunga iliyojazwa (Joining Instructions)</li>
                    <li>Fomu ya Uchunguzi wa Afya (Medical Examination Form) iliyosainiwa na Daktari</li>
                    <li>Stakabadhi halisi ya benki ya malipo ya ada (Bank Pay-in Slip)</li>
                    <li>Cheti cha Kuzaliwa (Nakala na Halisi kwa Uhakiki)</li>
                    <li>Picha nne (4) ndogo za pasipoti za rangi</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#102A43]">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Mawasiliano ya Uongozi wa Udahili</span>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <p><strong>Mkuu wa Shule:</strong> +255 782 558 127</p>
                    <p><strong>Makamu Mkuu wa Shule:</strong> +255 754 532 949 / +255 752 717 191</p>
                    <p><strong>Mhasibu wa Shule (Bursar):</strong> +255 752 000 939</p>
                    <p><strong>Mkuu wa Taaluma:</strong> +255 745 548 225</p>
                    <p><strong>Anwani:</strong> S.L.P 361 Marangu - Kilimanjaro</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-[#102A43]">
                  {language === 'sw' ? 'Masomo na Vitabu vya Marejeo (O-Level 2026)' : 'Curriculum & Study Materials'}
                </h3>
                <p className="text-xs text-slate-500">Mitaala iliyoidhinishwa na Taasisi ya Elimu Tanzania (TIE)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Basic Mathematics', dept: 'Sayansi', teacher: 'Mwl. Yohana Bahati', desc: 'Algebra, Geometry, Trigonometry na Statistics.' },
                  { name: 'Physics', dept: 'Sayansi', teacher: 'Mwl. Yohana Bahati', desc: 'Mechanics, Heat, Light, Waves na Current Electricity.' },
                  { name: 'Chemistry', dept: 'Sayansi', teacher: 'Mwl. Endrew Benson', desc: 'Matter, Acids/Bases, Organic Chemistry na Volumetric Analysis.' },
                  { name: 'Biology', dept: 'Sayansi', teacher: 'Madam Adela Manyanga', desc: 'Cytology, Genetics, Ecology na Human Physiology.' },
                  { name: 'English Language', dept: 'Lugha', teacher: 'Mwl. Peter Kimaro', desc: 'Grammar, Essay Writing, Oral Literature na Comprehension.' },
                  { name: 'Kiswahili', dept: 'Lugha', teacher: 'Mwl. Wolter Temu', desc: 'Ufahamu, Sarufi, Ushairi na Riwaya teule za NECTA.' },
                  { name: 'Geography', dept: 'Sanaa', teacher: 'Madam Witness', desc: 'Physical Geography, Human Geography na Map Reading.' },
                  { name: 'Civics', dept: 'Sanaa', teacher: 'Br. Adolph Massawe', desc: 'Good Governance, Human Rights na Constitution.' },
                  { name: 'Commerce & Bookkeeping', dept: 'Biashara', teacher: 'Mwl. Sigbert Minja', desc: 'Financial Accounting, Ledger, and Trade.' },
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {s.dept}
                    </span>
                    <h4 className="font-bold text-sm text-[#102A43]">{s.name}</h4>
                    <p className="text-xs text-slate-600">{s.desc}</p>
                    <div className="text-[11px] text-slate-500 pt-1 font-medium">Mwalimu: {s.teacher}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-4 px-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div>
            &copy; 2026 Shule ya Sekondari Uomboni (NECTA S0486) &bull; Marangu, Moshi Vijijini
          </div>
          <div className="font-medium text-[#102A43]">
            Motto: &ldquo;TUJIENDELEZE SISI WENYEWE&rdquo; &bull; Sala, Elimu na Kazi
          </div>
        </div>
      </div>
    </div>
  );
};
