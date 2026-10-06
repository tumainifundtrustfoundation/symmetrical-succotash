import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StudentProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Printer,
  Download,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  GraduationCap,
  Award,
  Phone,
  Edit2,
  Trash2,
  Eye,
  X,
  UserCheck,
  Building2,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface AcademicStudentRosterTabProps {
  onSelectStudentForMarks?: (student: StudentProfile) => void;
  onViewStudentResults?: (studentIdOrExamNo: string) => void;
}

export const AcademicStudentRosterTab: React.FC<AcademicStudentRosterTabProps> = ({
  onSelectStudentForMarks,
  onViewStudentResults,
}) => {
  const { language } = useLanguage();
  const { students, studentResults, addStudent, updateStudent, deleteStudent } = useData();

  // Filter & Search state
  const [selectedForm, setSelectedForm] = useState<string>('ALL');
  const [selectedStream, setSelectedStream] = useState<string>('ALL');
  const [selectedGender, setSelectedGender] = useState<string>('ALL');
  const [selectedResidency, setSelectedResidency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Editing
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfile | null>(null);
  const [detailModalStudent, setDetailModalStudent] = useState<StudentProfile | null>(null);
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<StudentProfile | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Student Form State
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    fullName: '',
    examNumber: '',
    studentId: '',
    premNumber: '',
    form: 'Form 4',
    stream: 'Science',
    gender: 'F',
    studentType: 'Bweni (Boarding)',
    parentName: '',
    parentPhone: '',
    conductRating: 'Bora Sana',
    attendanceRate: 98,
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Roster Statistics
  const stats = useMemo(() => {
    const total = students.length;
    const form1 = students.filter((s) => s.form === 'Form 1').length;
    const form2 = students.filter((s) => s.form === 'Form 2').length;
    const form3 = students.filter((s) => s.form === 'Form 3').length;
    const form4 = students.filter((s) => s.form === 'Form 4').length;
    const boys = students.filter((s) => s.gender === 'M').length;
    const girls = students.filter((s) => s.gender === 'F').length;
    const boarding = students.filter((s) => (s.studentType || s.boardingStatus || '').toLowerCase().includes('bweni')).length;
    const day = total - boarding;

    return { total, form1, form2, form3, form4, boys, girls, boarding, day };
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Form filter
      if (selectedForm !== 'ALL' && s.form !== selectedForm) return false;

      // Stream filter
      if (selectedStream !== 'ALL' && s.stream !== selectedStream) return false;

      // Gender filter
      if (selectedGender !== 'ALL' && s.gender !== selectedGender) return false;

      // Residency filter
      if (selectedResidency !== 'ALL') {
        const isBweni = (s.studentType || s.boardingStatus || '').toLowerCase().includes('bweni');
        if (selectedResidency === 'Bweni' && !isBweni) return false;
        if (selectedResidency === 'Kutwa' && isBweni) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.fullName.toLowerCase().includes(q);
        const matchesExam = s.examNumber.toLowerCase().includes(q);
        const matchesId = s.studentId.toLowerCase().includes(q);
        const matchesPrem = s.premNumber ? s.premNumber.toLowerCase().includes(q) : false;
        const matchesParent = s.parentName ? s.parentName.toLowerCase().includes(q) : false;
        const matchesPhone = s.parentPhone ? s.parentPhone.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesExam && !matchesId && !matchesPrem && !matchesParent && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [students, selectedForm, selectedStream, selectedGender, selectedResidency, searchQuery]);

  // Check latest result for student
  const getStudentLatestResult = (examNo: string) => {
    const results = studentResults.filter(
      (r) => r.examNumber.toLowerCase() === examNo.toLowerCase()
    );
    if (results.length === 0) return null;
    return results[results.length - 1];
  };

  // Handle Save New Student
  const handleSaveNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) return;

    const newExamNumber = formData.examNumber?.trim() || `S0486/${String(students.length + 1).padStart(4, '0')}/2026`;
    const newStudentId = formData.studentId?.trim() || `USS-2026-${String(students.length + 1).padStart(4, '0')}`;

    const newStudent: StudentProfile = {
      id: `std-custom-${Date.now()}`,
      studentId: newStudentId,
      examNumber: newExamNumber,
      premNumber: formData.premNumber || `PREM-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: formData.fullName.trim(),
      gender: (formData.gender as 'M' | 'F') || 'F',
      form: formData.form || 'Form 4',
      stream: formData.stream || 'Science',
      admissionYear: 2026,
      studentType: formData.studentType || 'Bweni (Boarding)',
      boardingStatus: formData.studentType?.includes('Bweni') ? 'Bweni' : 'Kutwa',
      parentName: formData.parentName || '',
      parentPhone: formData.parentPhone || '',
      conductRating: formData.conductRating || 'Bora Sana',
      attendanceRate: formData.attendanceRate || 98,
    };

    addStudent(newStudent);
    setIsAddModalOpen(false);
    setFormData({
      fullName: '',
      examNumber: '',
      studentId: '',
      premNumber: '',
      form: 'Form 4',
      stream: 'Science',
      gender: 'F',
      studentType: 'Bweni (Boarding)',
      parentName: '',
      parentPhone: '',
      conductRating: 'Bora Sana',
      attendanceRate: 98,
    });
    showToast(`Mwanafunzi ${newStudent.fullName} amesajiliwa kikamilifu kwenye Daftari la Taaluma!`);
  };

  // Handle Update Existing Student
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    updateStudent(editingStudent);
    setEditingStudent(null);
    showToast(`Taarifa za ${editingStudent.fullName} zimesasishwa kikamilifu!`);
  };

  // Handle Delete Student
  const handleDeleteStudent = (id: string) => {
    deleteStudent(id);
    setDeleteConfirmStudent(null);
    showToast('Mwanafunzi ameondolewa kwenye orodha!');
  };

  // Export Roster to CSV
  const handleExportCSV = () => {
    const headers = [
      'Na.',
      'Jina Kamili',
      'Namba ya Mtihani (CNO)',
      'Namba ya Usajili (ID)',
      'Namba ya PREM',
      'Kidato',
      'Mkondo',
      'Jinsia',
      'Aina (Bweni/Kutwa)',
      'Mzazi/Mlezi',
      'Simu ya Mzazi',
      'Nidhamu',
    ];

    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.examNumber}"`,
      `"${s.studentId}"`,
      `"${s.premNumber || ''}"`,
      `"${s.form}"`,
      `"${s.stream}"`,
      s.gender === 'M' ? 'Mvulana' : 'Msichana',
      `"${s.studentType || s.boardingStatus || ''}"`,
      `"${(s.parentName || '').replace(/"/g, '""')}"`,
      `"${s.parentPhone || ''}"`,
      `"${s.conductRating || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ORODHA_YA_WANAFUNZI_UOMBONI_${selectedForm}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Daftari la wanafunzi limepakuliwa (CSV/Excel)!');
  };

  // Print Roster
  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Quick Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-5 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>{language === 'sw' ? 'Daftari Kamili la Wanafunzi (Nominal Roll ya Mtaaluma)' : 'Official Student Register (Nominal Roll)'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 text-xs font-mono font-bold">
                  {students.length} {language === 'sw' ? 'Wanafunzi' : 'Students'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'sw'
                  ? 'Orodha rasmi ya wanafunzi waliosajiliwa Kidato cha 1 hadi cha 4, namba za NECTA/CSEE, PREM, na viunganishi vya matokeo.'
                  : 'Official registered students roster across Form 1 to 4 with NECTA CSEE candidate indices, PREM numbers, and results.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>{language === 'sw' ? 'Sajili Mwanafunzi Mpya' : 'Add New Student'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
            title="Pakua Orodha katika Muundo wa Excel au CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Pakua Excel/CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handlePrintRoster}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer transition-all"
            title="Chapisha Orodha Rasmi ya Darasa"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'sw' ? 'Chapisha Orodha' : 'Print Roll'}</span>
          </button>
        </div>
      </div>

      {/* Class Statistics Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          onClick={() => setSelectedForm('ALL')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedForm === 'ALL'
              ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Wote (Shule Nzima)</span>
          <span className="text-xl font-black text-amber-300 mt-0.5 block">{stats.total}</span>
          <span className="text-[10px] text-slate-400">{stats.boys} ME &bull; {stats.girls} KE</span>
        </button>

        <button
          onClick={() => setSelectedForm('Form 1')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedForm === 'Form 1'
              ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kidato cha 1 (Form 1)</span>
          <span className="text-xl font-black text-white mt-0.5 block">{stats.form1}</span>
          <span className="text-[10px] text-emerald-400">Waliosajiliwa 2025/26</span>
        </button>

        <button
          onClick={() => setSelectedForm('Form 2')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedForm === 'Form 2'
              ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kidato cha 2 (Form 2)</span>
          <span className="text-xl font-black text-white mt-0.5 block">{stats.form2}</span>
          <span className="text-[10px] text-emerald-400">FTNA NECTA / CSSC</span>
        </button>

        <button
          onClick={() => setSelectedForm('Form 3')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedForm === 'Form 3'
              ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kidato cha 3 (Form 3)</span>
          <span className="text-xl font-black text-white mt-0.5 block">{stats.form3}</span>
          <span className="text-[10px] text-emerald-400">Science & Arts</span>
        </button>

        <button
          onClick={() => setSelectedForm('Form 4')}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedForm === 'Form 4'
              ? 'bg-emerald-900/50 border-emerald-500 text-white shadow-md'
              : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Kidato cha 4 (Form 4)</span>
          <span className="text-xl font-black text-amber-400 mt-0.5 block">{stats.form4}</span>
          <span className="text-[10px] text-amber-300">Watahiniwa CSEE S0486</span>
        </button>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-300">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Ukaazi (Boarding/Day)</span>
          <span className="text-sm font-black text-white mt-1 block">
            <span className="text-emerald-400">{stats.boarding}</span> Bweni / <span className="text-blue-400">{stats.day}</span> Kutwa
          </span>
          <span className="text-[10px] text-slate-400">Hosteli 100% Salama</span>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === 'sw'
                ? 'Tafuta mwanafunzi kwa Jina, Namba ya CNO (S0486/...), PREM, au Simu ya Mzazi...'
                : 'Search student by Name, Exam Number, PREM, or Parent Phone...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Form Select */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-bold">Kidato:</span>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Madarasa Yote</option>
              <option value="Form 1" className="bg-slate-900 text-white">Kidato cha 1</option>
              <option value="Form 2" className="bg-slate-900 text-white">Kidato cha 2</option>
              <option value="Form 3" className="bg-slate-900 text-white">Kidato cha 3</option>
              <option value="Form 4" className="bg-slate-900 text-white">Kidato cha 4</option>
            </select>
          </div>

          {/* Gender Select */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-bold">Jinsia:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Wote (ME & KE)</option>
              <option value="M" className="bg-slate-900 text-white">Wavulana (ME)</option>
              <option value="F" className="bg-slate-900 text-white">Wasichana (KE)</option>
            </select>
          </div>

          {/* Residency Select */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-slate-400 font-bold">Ukaazi:</span>
            <select
              value={selectedResidency}
              onChange={(e) => setSelectedResidency(e.target.value)}
              className="bg-transparent text-xs text-white font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Wote</option>
              <option value="Bweni" className="bg-slate-900 text-white">Bweni</option>
              <option value="Kutwa" className="bg-slate-900 text-white">Kutwa</option>
            </select>
          </div>

          {(selectedForm !== 'ALL' || selectedGender !== 'ALL' || selectedResidency !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedForm('ALL');
                setSelectedGender('ALL');
                setSelectedResidency('ALL');
                setSearchQuery('');
              }}
              className="px-2 py-1 text-[11px] text-amber-400 hover:text-amber-300 font-bold cursor-pointer underline"
            >
              Weka Upya
            </button>
          )}
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'sw' ? 'Orodha ya Wanafunzi Waliochujwa' : 'Filtered Students Roster'}
            </h4>
            <span className="text-xs text-slate-400">({filteredStudents.length} / {students.length})</span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Kituo: <strong className="text-amber-300">S.0486</strong> &bull; Marangu, Moshi
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">Hakuna mwanafunzi aliyepatikana kwa vigezo hivi.</p>
            <p className="text-xs text-slate-500">Jaribu kubadilisha darasa au maneno ya utafutaji.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-4">Jina Kamili la Mwanafunzi</th>
                  <th className="py-3 px-3">Namba ya Mtihani (CNO)</th>
                  <th className="py-3 px-3">Namba ya PREM / ID</th>
                  <th className="py-3 px-2 text-center">Jinsia</th>
                  <th className="py-3 px-3">Kidato & Mkondo</th>
                  <th className="py-3 px-3">Aina / Hosteli</th>
                  <th className="py-3 px-3">Mzazi / Mlezi & Simu</th>
                  <th className="py-3 px-3">Matokeo ya Karibuni</th>
                  <th className="py-3 px-4 text-right">Vitendo vya Taaluma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredStudents.map((s, idx) => {
                  const latestRes = getStudentLatestResult(s.examNumber);

                  return (
                    <tr
                      key={s.id || s.studentId || idx}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Roll Index */}
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px] font-bold">
                        {idx + 1}
                      </td>

                      {/* Full Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            s.gender === 'M' ? 'bg-blue-900/60 text-blue-300 border border-blue-700/50' : 'bg-rose-900/60 text-rose-300 border border-rose-700/50'
                          }`}>
                            {s.gender === 'M' ? 'ME' : 'KE'}
                          </span>
                          <div>
                            <span className="text-white font-black text-xs block group-hover:text-amber-300 transition-colors">
                              {s.fullName}
                            </span>
                            {s.leadershipRole && (
                              <span className="text-[10px] text-amber-400 font-semibold block">
                                👑 {s.leadershipRole}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Exam Number */}
                      <td className="py-3 px-3 font-mono font-bold text-amber-300 text-[11px]">
                        {s.examNumber}
                      </td>

                      {/* PREM Number */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                        {s.premNumber || s.studentId}
                      </td>

                      {/* Gender */}
                      <td className="py-3 px-2 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          s.gender === 'M' ? 'bg-blue-950 text-blue-300' : 'bg-rose-950 text-rose-300'
                        }`}>
                          {s.gender === 'M' ? 'ME' : 'KE'}
                        </span>
                      </td>

                      {/* Form & Stream */}
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{s.form}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.stream}</span>
                      </td>

                      {/* Residency / Boarding */}
                      <td className="py-3 px-3">
                        <span className="text-slate-300 text-xs block">
                          {(s.studentType || s.boardingStatus || '').includes('Bweni') ? '🏠 Bweni' : '🚶 Kutwa'}
                        </span>
                        {s.dormitoryRoom && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                            {s.dormitoryRoom}
                          </span>
                        )}
                      </td>

                      {/* Parent / Guardian & Phone */}
                      <td className="py-3 px-3">
                        <span className="text-slate-300 text-xs block truncate max-w-[130px]">
                          {s.parentName || s.parentGuardianName || '-'}
                        </span>
                        {s.parentPhone && (
                          <a
                            href={`tel:${s.parentPhone}`}
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-2.5 h-2.5" />
                            <span>{s.parentPhone}</span>
                          </a>
                        )}
                      </td>

                      {/* Latest Result */}
                      <td className="py-3 px-3">
                        {latestRes ? (
                          <div className="space-y-0.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                              latestRes.division === 'Division I'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                : latestRes.division === 'Division II'
                                ? 'bg-blue-950 text-blue-300 border border-blue-700/50'
                                : latestRes.division === 'Division III'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                                : 'bg-slate-800 text-slate-300'
                            }`}>
                              {latestRes.division} (Pts {latestRes.points})
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[110px]">
                              {latestRes.examType}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Haijarekodiwa</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Enter marks for this student */}
                          {onSelectStudentForMarks && (
                            <button
                              onClick={() => onSelectStudentForMarks(s)}
                              className="px-2 py-1 rounded-lg bg-emerald-800/70 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                              title="Weka Alama za Somo kwa mwanafunzi huyu"
                            >
                              <Edit2 className="w-3 h-3 text-emerald-300" />
                              <span className="hidden xl:inline">Alama</span>
                            </button>
                          )}

                          {/* View Result Slip */}
                          {onViewStudentResults && (
                            <button
                              onClick={() => onViewStudentResults(s.examNumber || s.studentId)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                              title="Tazama Matokeo Kamili / Result Slip"
                            >
                              <Eye className="w-3 h-3" />
                              <span className="hidden xl:inline">Matokeo</span>
                            </button>
                          )}

                          {/* Quick Edit */}
                          <button
                            onClick={() => setEditingStudent(s)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            title="Hariri Taarifa za Mwanafunzi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Delete */}
                          <button
                            onClick={() => setDeleteConfirmStudent(s)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                            title="Futa Mwanafunzi"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: Add New Student */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black">
                  <Plus className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-white">Sajili Mwanafunzi Mpya (Daftari la Taaluma)</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Jina Kamili la Mwanafunzi *</label>
                  <input
                    type="text"
                    required
                    placeholder="mf. Adella Silvano Massawe"
                    value={formData.fullName}
                    onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Namba ya Mtihani CNO (NECTA) *</label>
                  <input
                    type="text"
                    placeholder="S.0486.0020 au S0486/0020/2026"
                    value={formData.examNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, examNumber: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Kidato (Form) *</label>
                  <select
                    value={formData.form}
                    onChange={(e) => setFormData((p) => ({ ...p, form: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Form 1">Kidato cha 1 (Form 1)</option>
                    <option value="Form 2">Kidato cha 2 (Form 2)</option>
                    <option value="Form 3">Kidato cha 3 (Form 3)</option>
                    <option value="Form 4">Kidato cha 4 (Form 4)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Mkondo / Combination</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData((p) => ({ ...p, stream: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="A">Stream A</option>
                    <option value="B">Stream B</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Jinsia *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="M">Mvulana (Male - ME)</option>
                    <option value="F">Msichana (Female - KE)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Namba ya PREM / Primary Roll</label>
                  <input
                    type="text"
                    placeholder="PREM-2025-XXXXX"
                    value={formData.premNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, premNumber: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Aina ya Mwanafunzi</label>
                  <select
                    value={formData.studentType}
                    onChange={(e) => setFormData((p) => ({ ...p, studentType: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Bweni (Boarding)">Bweni (Boarding)</option>
                    <option value="Kutwa (Day Scholar)">Kutwa (Day Scholar)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Simu ya Mzazi / Mlezi</label>
                  <input
                    type="tel"
                    placeholder="+255 7XX XXX XXX"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData((p) => ({ ...p, parentPhone: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sajili Mwanafunzi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  <Edit2 className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-black text-white">Hariri Taarifa za Mwanafunzi: {editingStudent.fullName}</h4>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Jina Kamili</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fullName}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, fullName: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Namba ya Mtihani (CNO)</label>
                  <input
                    type="text"
                    value={editingStudent.examNumber}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, examNumber: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 font-mono focus:outline-hidden focus:border-amber-400 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Kidato</label>
                  <select
                    value={editingStudent.form}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, form: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Mkondo</label>
                  <input
                    type="text"
                    value={editingStudent.stream}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, stream: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Namba ya PREM</label>
                  <input
                    type="text"
                    value={editingStudent.premNumber || ''}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, premNumber: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Simu ya Mzazi</label>
                  <input
                    type="tel"
                    value={editingStudent.parentPhone || ''}
                    onChange={(e) => setEditingStudent((p) => p ? { ...p, parentPhone: e.target.value } : null)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Hifadhi Mabadiliko</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete Confirmation */}
      {deleteConfirmStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h4 className="text-sm font-black text-white">Thibitisha Kuondoa Mwanafunzi</h4>
            </div>
            <p className="text-xs text-slate-300">
              Una uhakika unataka kumwondoa <strong>{deleteConfirmStudent.fullName}</strong> ({deleteConfirmStudent.examNumber}) kwenye Daftari la Wanafunzi?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Ghairi
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirmStudent.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Ndio, Ondoa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
