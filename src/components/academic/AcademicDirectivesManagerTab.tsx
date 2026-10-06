import React, { useState } from 'react';
import {
  BellRing,
  Send,
  Lock,
  Unlock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Info,
  ShieldCheck,
  Megaphone,
  User,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AcademicDirective } from '../../types';

interface AcademicDirectivesManagerTabProps {
  language: 'sw' | 'en';
}

export const AcademicDirectivesManagerTab: React.FC<AcademicDirectivesManagerTabProps> = ({
  language,
}) => {
  const {
    academicDirectives,
    sendAcademicDirective,
    updateAcademicDirective,
    deleteAcademicDirective,
    toggleMarkEntryAuthorization,
  } = useData();

  // Form state
  const [title, setTitle] = useState('');
  const [targetForm, setTargetForm] = useState<'ALL' | 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4'>('Form 4');
  const [examType, setExamType] = useState('NECTA Mock 2025');
  const [isOpenForEntry, setIsOpenForEntry] = useState(true);
  const [deadlineDate, setDeadlineDate] = useState('2026-03-30');
  const [allowLateSubmissions, setAllowLateSubmissions] = useState(false);
  const [priority, setPriority] = useState<'urgent' | 'high' | 'normal'>('high');
  const [senderName, setSenderName] = useState('Mwl. Yohana Bahati');
  const [senderRole, setSenderRole] = useState('Mkuu wa Taaluma (Academic Master)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Quick preset messages
  const loadPreset = (type: 'open' | 'reminder' | 'guideline' | 'close') => {
    if (type === 'open') {
      setTitle(
        language === 'sw'
          ? `Ufunguzi Rasmi wa Dirisha la Kuingiza Alama (${targetForm} - ${examType})`
          : `Official Opening of Mark Entry Window (${targetForm} - ${examType})`
      );
      setIsOpenForEntry(true);
      setPriority('high');
      setMessage(
        language === 'sw'
          ? `Walimu wote wanaofundisha masomo ya ${targetForm}, dirisha la kuingiza alama za mtihani wa ${examType} limefunguliwa rasmi. Tafadhali hakikisheni mnaingiza alama za wanafunzi wote waliosajiliwa kabla ya tarehe ya mwisho.`
          : `All teachers of ${targetForm}, the mark entry window for ${examType} is now officially open. Please ensure all student scores are recorded before the deadline.`
      );
    } else if (type === 'reminder') {
      setTitle(
        language === 'sw'
          ? `Kumbusho: Tarehe ya Mwisho ya Kuingiza Matokeo (${targetForm} - ${examType})`
          : `Reminder: Mark Submission Deadline (${targetForm} - ${examType})`
      );
      setIsOpenForEntry(true);
      setPriority('urgent');
      setMessage(
        language === 'sw'
          ? `Kumbusho muhimu kwa walimu ambao bado hawajawasilisha alama za ${targetForm} (${examType}). Mfumo utafungwa ifikapo tarehe ${deadlineDate}. Hakuna ucheleweshaji utakubaliwa.`
          : `Urgent reminder for teachers who have not submitted marks for ${targetForm} (${examType}). The system will lock on ${deadlineDate}. No late submissions allowed.`
      );
    } else if (type === 'guideline') {
      setTitle(
        language === 'sw'
          ? `Miongozo ya Upangaji Madaraja ya NECTA kwa Walimu`
          : `NECTA Grading & Assessment Guidelines for Teachers`
      );
      setPriority('normal');
      setMessage(
        language === 'sw'
          ? `Tafadhali zingatieni viwango rasmi vya NECTA: A (75-100), B (65-74), C (45-64), D (30-44), F (0-29). Kila mwalimu aweke maoni sahihi ya kitaaluma kwenye kila somo analofundisha.`
          : `Please adhere to official NECTA criteria: A (75-100), B (65-74), C (45-64), D (30-44), F (0-29). Teachers must provide meaningful academic remarks for each subject.`
      );
    } else if (type === 'close') {
      setTitle(
        language === 'sw'
          ? `Kufungwa kwa Dirisha la Kuingiza Alama (${targetForm} - ${examType})`
          : `Mark Entry Window Closed (${targetForm} - ${examType})`
      );
      setIsOpenForEntry(false);
      setPriority('urgent');
      setMessage(
        language === 'sw'
          ? `Dirisha la kuingiza alama za ${targetForm} (${examType}) sasa limefungwa rasmi kwa ukaguzi na uchakataji wa matokeo ya mwisho na Mkuu wa Taaluma. Hakuna mabadiliko zaidi bila idhini.`
          : `The mark entry window for ${targetForm} (${examType}) is now officially closed for audit and broadsheet certification. Contact Academic Master for inquiries.`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setFeedbackMessage({
        text: language === 'sw' ? 'Tafadhali jaza kichwa cha habari na maelezo ya taarifa.' : 'Please provide both a title and message.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      sendAcademicDirective({
        title: title.trim(),
        message: message.trim(),
        senderName: senderName.trim() || 'Mwl. Yohana Bahati',
        senderRole: senderRole.trim() || 'Mkuu wa Taaluma',
        targetForm,
        examType,
        deadlineDate,
        isOpenForEntry,
        allowLateSubmissions,
        priority,
        dateIssued: new Date().toISOString().split('T')[0],
        status: isOpenForEntry ? 'active' : 'closed',
      });

      setFeedbackMessage({
        text:
          language === 'sw'
            ? `✅ Taarifa na ruhusa ya ${targetForm} vimetumwa na kusasishwa kikamilifu!`
            : `✅ Directive and permissions for ${targetForm} dispatched successfully!`,
        type: 'success',
      });

      // Clear form
      setTitle('');
      setMessage('');
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch {
      setFeedbackMessage({
        text: language === 'sw' ? 'Hitilafu wakati wa kutuma taarifa.' : 'Error sending directive.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick classes overview matrix
  const classesList = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

  return (
    <div className="space-y-6" id="academic-directives-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Megaphone className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                  {language === 'sw' ? 'Idara ya Taaluma' : 'Academic Office'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  {language === 'sw' ? 'Udhibiti wa Walimu' : 'Teacher Authority'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white mt-1">
                {language === 'sw'
                  ? '📢 Maelekezo & Ruhusa za Kuingiza Matokeo kwa Walimu'
                  : '📢 Teacher Directives & Mark Entry Permissions'}
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl mt-1">
                {language === 'sw'
                  ? 'Mkuu wa Taaluma ndiye mamlaka ya mwisho inayoidhinisha ufunguzi au kufungwa kwa dirisha la kuingiza alama za masomo, kutoa tarehe ya mwisho (deadline), na kutuma waraka rasmi kwa walimu wote.'
                  : 'The Academic Master has sole authority to open or lock score entry windows, set deadlines, and dispatch official circulars to all subject teachers.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">Mwl. Yohana Bahati / Madam Adela</div>
              <div className="text-slate-400 text-[11px]">Mamlaka ya Usimamizi wa Mitihani</div>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX: Current Class Entry Status Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            {language === 'sw' ? 'Hadhi ya Sasa ya Uingizaji Alama kwa Kila Kidato' : 'Current Mark Entry Authorization by Form'}
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'sw' ? 'Bofya kitufe cha kufuli kugeuza hadhi papo hapo' : 'Click lock button to toggle status instantly'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classesList.map((formName) => {
            // Find active directive for this form
            const activeDir =
              academicDirectives.find((d) => d.targetForm === formName && d.status === 'active') ||
              academicDirectives.find((d) => d.targetForm === formName) ||
              academicDirectives.find((d) => d.targetForm === 'ALL');

            const isOpen = activeDir ? activeDir.isOpenForEntry : true;
            const deadline = activeDir?.deadlineDate || '2026-03-30';
            const exam = activeDir?.examType || (formName === 'Form 4' ? 'NECTA Mock 2025' : 'Mid-Term Exam 2025');

            return (
              <div
                key={formName}
                className={`p-4 rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-gradient-to-b from-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-emerald-950/20'
                    : 'bg-gradient-to-b from-rose-950/30 to-slate-900 border-rose-500/40 shadow-rose-950/20'
                } shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{exam}</span>
                    <h4 className="text-lg font-black text-white">{formName}</h4>
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      isOpen
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {isOpen ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{language === 'sw' ? 'Ruhusa ya Walimu:' : 'Teacher Status:'}</span>
                    <span
                      className={`font-black px-2 py-0.5 rounded-md ${
                        isOpen
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isOpen
                        ? language === 'sw' ? 'DIRISHA LIKO WAZI' : 'WINDOW OPEN'
                        : language === 'sw' ? 'LIMEFUNGWA' : 'LOCKED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {language === 'sw' ? 'Mwisho:' : 'Deadline:'}
                    </span>
                    <span className="font-semibold text-slate-200">{deadline}</span>
                  </div>
                </div>

                {/* Quick Toggle Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMarkEntryAuthorization(
                        formName,
                        exam,
                        !isOpen,
                        !isOpen
                          ? `Mkuu wa Taaluma amefungua rasmi dirisha la kuingiza alama kwa ajili ya ${formName} (${exam}).`
                          : `Dirisha la kuingiza alama za ${formName} limefungwa na Mkuu wa Taaluma kwa ajili ya ukaguzi wa matokeo.`
                      )
                    }
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isOpen
                        ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50'
                        : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md'
                    }`}
                  >
                    {isOpen ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        {language === 'sw' ? 'Funga Dirisha la Alama' : 'Lock Mark Entry'}
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        {language === 'sw' ? 'Fungua Dirisha (Ruhusu)' : 'Open / Authorize Entry'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Action Grid: Form to Send Directive + Feed of Sent Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Create and Dispatch New Directive */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-400/20 text-amber-400 rounded-lg">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'sw' ? 'Tuma Taarifa Rasmi & Weka Ruhusa kwa Walimu' : 'Dispatch Directive & Set Permissions'}
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'sw' ? 'Waraka huu utaonekana kwenye paneli ya kila mwalimu anapoingiza alama' : 'This circular appears on every teacher mark entry screen'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-4">
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              {language === 'sw' ? '⚡ Miongozo ya Haraka (Quick Templates):' : '⚡ Quick Templates:'}
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset('open')}
                className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Unlock className="w-3 h-3" />
                {language === 'sw' ? 'Ufunguzi wa Dirisha' : 'Open Window'}
              </button>
              <button
                type="button"
                onClick={() => loadPreset('reminder')}
                className="px-2.5 py-1 bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Clock className="w-3 h-3" />
                {language === 'sw' ? 'Kumbusho la Mwisho (Deadline)' : 'Deadline Reminder'}
              </button>
              <button
                type="button"
                onClick={() => loadPreset('guideline')}
                className="px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900 text-blue-300 border border-blue-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Info className="w-3 h-3" />
                {language === 'sw' ? 'Mwongozo wa NECTA' : 'Grading Guide'}
              </button>
              <button
                type="button"
                onClick={() => loadPreset('close')}
                className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/50 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Lock className="w-3 h-3" />
                {language === 'sw' ? 'Kufunga Dirisha' : 'Lock Window'}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {feedbackMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-950 text-emerald-200 border border-emerald-700'
                    : 'bg-rose-950 text-rose-200 border border-rose-700'
                }`}
              >
                {feedbackMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{feedbackMessage.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'sw' ? 'Kichwa cha Taarifa au Waraka *' : 'Directive / Circular Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'k.m. Ufunguzi wa Dirisha la Kuingiza Alama za NECTA Mock 2025'
                    : 'e.g. Opening of Form 4 NECTA Mock 2025 Score Entry Window'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'sw' ? 'Kidato Walengwa (Target Form) *' : 'Target Form *'}
                </label>
                <select
                  value={targetForm}
                  onChange={(e) => setTargetForm(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="ALL">{language === 'sw' ? 'Madarasa Yote (Form 1 - Form 4)' : 'All Forms (Form 1 - 4)'}</option>
                  <option value="Form 1">Kidato cha Kwanza (Form 1)</option>
                  <option value="Form 2">Kidato cha Pili (Form 2)</option>
                  <option value="Form 3">Kidato cha Tatu (Form 3)</option>
                  <option value="Form 4">Kidato cha Nne (Form 4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'sw' ? 'Aina ya Mtihani (Exam Type) *' : 'Exam Sitting *'}
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="NECTA Mock 2025">NECTA Mock 2025</option>
                  <option value="Mid-Term Exam 2025">Mid-Term Exam 2025</option>
                  <option value="CSSC Joint Examination 2026">CSSC Joint Examination 2026</option>
                  <option value="Annual Examination 2025">Annual Examination 2025</option>
                  <option value="Terminal Examination 2025">Terminal Examination 2025</option>
                  <option value="Monthly Test">Monthly Test</option>
                  <option value="ALL">{language === 'sw' ? 'Mitihani Yote' : 'All Exams'}</option>
                </select>
              </div>
            </div>

            {/* Permission Switch + Deadline Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {language === 'sw' ? 'Ruhusa ya Kuingiza Alama:' : 'Permission State:'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpenForEntry(true)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      isOpenForEntry
                        ? 'bg-emerald-600 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    {language === 'sw' ? 'Ruhusu (Wazi)' : 'Allow (Open)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpenForEntry(false)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      !isOpenForEntry
                        ? 'bg-rose-700 text-white shadow'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {language === 'sw' ? 'Funga (Zuia)' : 'Disallow (Lock)'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'sw' ? 'Tarehe ya Mwisho (Deadline) *' : 'Submission Deadline *'}
                </label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'sw' ? 'Kiwango cha Umuhimu (Priority)' : 'Priority Level'}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="urgent">{language === 'sw' ? '🔥 Haraka Sana (Urgent)' : '🔥 Urgent'}</option>
                  <option value="high">{language === 'sw' ? '⚡ Muhimu (High Priority)' : '⚡ High Priority'}</option>
                  <option value="normal">{language === 'sw' ? '📌 Ya Kawaida (Normal)' : '📌 Normal'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'sw' ? 'Jina la Mtoa Taarifa (Sender)' : 'Official Sender'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {language === 'sw' ? 'Maelezo / Waraka Kamili kwa Walimu *' : 'Directive Message / Instructions *'}
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  language === 'sw'
                    ? 'Andika maelekezo ya kitaaluma, viwango vya ufaulu, maelezo ya masomo, na tarehe za uwasilishaji...'
                    : 'Detail instructions on marking, grading, subject coverage, and submission expectations...'
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? language === 'sw' ? 'Inatuma...' : 'Dispatching...'
                  : language === 'sw' ? '📢 Tuma Taarifa & Weka Ruhusa kwa Walimu' : '📢 Dispatch Directive & Update Permissions'}
              </span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: History of Sent Directives */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-indigo-400" />
              {language === 'sw' ? `Taarifa Zilizotumwa (${academicDirectives.length})` : `Directives History (${academicDirectives.length})`}
            </h3>
            <span className="text-[11px] text-slate-400">
              {language === 'sw' ? 'Zinahifadhiwa kwenye wingu la shule' : 'Stored in School Cloud'}
            </span>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {academicDirectives.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                {language === 'sw' ? 'Bado hakuna taarifa iliyotumwa kwa walimu.' : 'No directives have been sent yet.'}
              </div>
            ) : (
              academicDirectives.map((directive) => {
                const isOpen = directive.isOpenForEntry;
                return (
                  <div
                    key={directive.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isOpen
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {isOpen ? (language === 'sw' ? 'Wazi' : 'Open') : (language === 'sw' ? 'Imefungwa' : 'Locked')}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                            {directive.targetForm}
                          </span>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {directive.examType}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white leading-snug">{directive.title}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteAcademicDirective(directive.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-all cursor-pointer shrink-0"
                        title={language === 'sw' ? 'Futa taarifa' : 'Delete directive'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                      {directive.message}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mwisho: <strong>{directive.deadlineDate}</strong></span>
                      </div>
                      <div className="text-slate-400 truncate max-w-[150px]">
                        {directive.senderName}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">
                        {new Date(directive.timestamp).toLocaleDateString()} {new Date(directive.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateAcademicDirective(directive.id, {
                            isOpenForEntry: !isOpen,
                            status: !isOpen ? 'active' : 'closed',
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                          isOpen
                            ? 'bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800/50'
                            : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/50'
                        }`}
                      >
                        {isOpen ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{isOpen ? (language === 'sw' ? 'Funga Ruhusa' : 'Lock') : (language === 'sw' ? 'Fungua Ruhusa' : 'Unlock')}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
