import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  Calendar,
  Layers,
  BookOpen,
  Megaphone,
  FileBarChart,
  User,
  X,
  Search,
  CheckCircle2,
  Plus,
  Save,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  Printer,
  LogOut,
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { downloadClassBroadsheetPdf } from '../../utils/pdfService';
import { SchoolLogo } from '../SchoolLogo';

interface TeacherStaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminPortal?: () => void;
  onOpenBursarPortal?: () => void;
  onOpenStaffGate?: () => void;
}

export const TeacherStaffPortalModal: React.FC<TeacherStaffPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminPortal,
  onOpenBursarPortal,
  onOpenStaffGate,
}) => {
  const { language } = useLanguage();
  const { students, teachers, timetable, studentNotices, studentResults } = useData();
  const { userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'records'
    | 'attendance'
    | 'results'
    | 'timetable'
    | 'classes'
    | 'assignments'
    | 'announcements'
    | 'reports'
    | 'profile'
  >('dashboard');

  // Teacher Identity State
  const defaultTeacher = teachers && teachers.length > 0 ? teachers[0] : {
    id: 'tch-001',
    name: 'Mwl. Yohana Bahati',
    role: 'Mwalimu wa Taaluma / Physics & Mathematics',
    department: 'Sayansi (Science)',
    email: 'yohana.bahati@uombonisec.ac.tz',
    phone: '+255 745 548 225',
  };

  // Student Attendance State
  const [selectedClass, setSelectedClass] = useState('Form 4A');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [attendanceList, setAttendanceList] = useState([
    { id: 'USS/0486', name: 'Baraka J. Kimaro', status: 'Present' },
    { id: 'USS/0487', name: 'Amina S. Mushi', status: 'Present' },
    { id: 'USS/0488', name: 'Frank K. Tarimo', status: 'Present' },
    { id: 'USS/0489', name: 'Neema P. Massawe', status: 'Absent' },
    { id: 'USS/0490', name: 'Godfrey E. Temu', status: 'Late' },
    { id: 'USS/0491', name: 'Zawadi D. Lyimo', status: 'Present' },
    { id: 'USS/0492', name: 'Kelvin R. Moshi', status: 'Present' },
    { id: 'USS/0493', name: 'Agatha M. Shayo', status: 'Present' },
  ]);

  // Academic Results Entry State
  const [selectedSubject, setSelectedSubject] = useState('Basic Mathematics');
  const [scoreList, setScoreList] = useState([
    { id: 'USS/0486', name: 'Baraka J. Kimaro', score: 88, grade: 'A' },
    { id: 'USS/0487', name: 'Amina S. Mushi', score: 92, grade: 'A' },
    { id: 'USS/0488', name: 'Frank K. Tarimo', score: 68, grade: 'C' },
    { id: 'USS/0489', name: 'Neema P. Massawe', score: 79, grade: 'B' },
    { id: 'USS/0490', name: 'Godfrey E. Temu', score: 84, grade: 'A' },
    { id: 'USS/0491', name: 'Zawadi D. Lyimo', score: 95, grade: 'A' },
    { id: 'USS/0492', name: 'Kelvin R. Moshi', score: 71, grade: 'B' },
  ]);
  const [scoresSaved, setScoresSaved] = useState(false);

  // Assignment Creator State
  const [assignments, setAssignments] = useState([
    {
      id: 'asg-1',
      title: 'Quadratic Equations & Graphing',
      subject: 'Basic Mathematics',
      form: 'Form Four',
      dueDate: '2026-03-25',
      submissions: '42 / 45',
    },
    {
      id: 'asg-2',
      title: 'Newton\'s Laws of Motion Practicals',
      subject: 'Physics',
      form: 'Form Three',
      dueDate: '2026-03-28',
      submissions: '38 / 40',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Basic Mathematics');
  const [newForm, setNewForm] = useState('Form Four');
  const [newDueDate, setNewDueDate] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [asgCreated, setAsgCreated] = useState(false);

  // Student filter for records
  const [recordSearch, setRecordSearch] = useState('');
  const [recordFormFilter, setRecordFormFilter] = useState('ALL');

  if (!isOpen) return null;

  const toggleAttendanceStatus = (id: string, newStatus: string) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handleScoreChange = (id: string, newScore: number) => {
    let grade = 'F';
    if (newScore >= 75) grade = 'A';
    else if (newScore >= 65) grade = 'B';
    else if (newScore >= 50) grade = 'C';
    else if (newScore >= 30) grade = 'D';

    setScoreList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, score: newScore, grade } : item))
    );
  };

  const handleSaveScores = () => {
    setScoresSaved(true);
    setTimeout(() => setScoresSaved(false), 3000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAssignments((prev) => [
      {
        id: `asg-${Date.now()}`,
        title: newTitle,
        subject: newSubject,
        form: newForm,
        dueDate: newDueDate || '2026-04-05',
        submissions: '0 / 45',
      },
      ...prev,
    ]);

    setNewTitle('');
    setNewInstructions('');
    setAsgCreated(true);
    setTimeout(() => setAsgCreated(false), 3000);
  };

  const filteredStudents = students.filter((s) => {
    const matchesForm = recordFormFilter === 'ALL' || s.form === recordFormFilter;
    const matchesSearch =
      !recordSearch ||
      s.fullName.toLowerCase().includes(recordSearch.toLowerCase()) ||
      s.studentId.toLowerCase().includes(recordSearch.toLowerCase()) ||
      (s.examNumber && s.examNumber.toLowerCase().includes(recordSearch.toLowerCase()));
    return matchesForm && matchesSearch;
  });

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Student Records', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'results', label: 'Academic Results', icon: Award },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'classes', label: 'Classes', icon: Layers },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#704214]/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FFFFF0] rounded-xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col border border-[#704214]/30 overflow-hidden text-[#704214]">
        {/* Top Header Bar - Sepia Identity */}
        <div className="bg-[#704214] text-[#FFFFF0] px-5 py-4 flex items-center justify-between border-b border-[#C9A227]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-white/10 border border-[#C9A227]/40 shadow-xs">
              <SchoolLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-xl font-bold tracking-tight text-[#FFFFF0]">
                  Uomboni Secondary School — Teachers &amp; Staff Portal
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5EBD7] text-[#704214]">
                  Portal ya Walimu &amp; Watumishi
                </span>
              </div>
              <p className="text-xs text-[#F5EBD7]/90 mt-0.5">
                NECTA S0486 · Academic Records, Attendance &amp; Classroom Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#58330F] rounded-md text-xs text-[#F5EBD7] border border-[#C9A227]/30">
              <span className="text-[#C9A227] font-semibold">Teacher:</span>
              <span className="font-bold text-[#FFFFF0]">{defaultTeacher.name}</span>
            </div>

            <button
              onClick={async () => {
                onClose();
                await logout();
              }}
              className="px-2.5 py-1 text-xs font-semibold text-[#F5EBD7] hover:text-white bg-[#58330F] hover:bg-[#46280B] rounded border border-[#C9A227]/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Ondoka kwenye mfumo (Logout)"
            >
              <LogOut className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#F5EBD7] hover:text-[#FFFFF0] rounded-md hover:bg-[#58330F] transition-colors cursor-pointer"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workspace: Left Sepia Navigation + Main Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FFFFF0]">
          {/* Left Navigation Sidebar */}
          <aside className="w-full md:w-64 bg-[#F5EBD7] border-r border-[#704214]/15 p-3 sm:p-4 overflow-y-auto shrink-0 flex flex-row md:flex-col gap-1">
            <div className="hidden md:block mb-3 px-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#704214]/70">
                Menu ya Mwalimu
              </span>
            </div>

            <nav className="flex md:flex-col gap-1 w-full overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-all text-left whitespace-nowrap cursor-pointer shrink-0 md:shrink ${
                      isActive
                        ? 'bg-[#704214] text-[#FFFFF0] shadow-xs'
                        : 'text-[#704214] hover:bg-[#FFFFF0] hover:text-[#58330F]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A227]' : 'text-[#704214]/80'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick privileged links */}
            {(onOpenAdminPortal || onOpenBursarPortal || onOpenStaffGate) && (
              <div className="hidden md:block mt-auto pt-4 border-t border-[#704214]/15 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#704214]/60 px-2 block">
                  Usimamizi Mkuu
                </span>
                {onOpenAdminPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminPortal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#704214] hover:bg-white rounded font-medium flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>Admin Database</span>
                    <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                  </button>
                )}
                {onOpenBursarPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBursarPortal();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#704214] hover:bg-white rounded font-medium flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>Bursar Desk</span>
                    <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                  </button>
                )}
                {onOpenStaffGate && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenStaffGate();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-[#704214] hover:bg-white rounded font-medium flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span>Lango Kuu la Ulinzi</span>
                    <ShieldCheck className="w-3 h-3 text-[#C9A227]" />
                  </button>
                )}
              </div>
            )}
          </aside>

          {/* Main Display Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FFFFF0]">
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-[#704214]/20 border-l-4 border-l-[#704214] shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider block">
                        Karibu Kwenye Dawati la Mwalimu
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#704214] mt-1">
                        {defaultTeacher.name}
                      </h3>
                      <p className="text-xs text-[#704214]/80 mt-1">
                        {defaultTeacher.role} · Idara: {defaultTeacher.department}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded bg-[#F5EBD7] text-[#704214] text-xs font-bold border border-[#704214]/20">
                        Muhula wa 1 · 2026
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#704214]/10 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 bg-[#FFFFF0] rounded-md border border-[#704214]/10">
                      <span className="text-[11px] text-[#704214]/70 block">Vipindi vya Leo</span>
                      <span className="text-lg font-bold text-[#704214] block mt-0.5">3 Vipindi (F4, F3)</span>
                    </div>

                    <div className="p-3.5 bg-[#FFFFF0] rounded-md border border-[#704214]/10">
                      <span className="text-[11px] text-[#704214]/70 block">Wanafunzi Wanaofundishwa</span>
                      <span className="text-lg font-bold text-[#704214] block mt-0.5">{students.length || 185} Wanafunzi</span>
                    </div>

                    <div className="p-3.5 bg-[#FFFFF0] rounded-md border border-[#704214]/10">
                      <span className="text-[11px] text-[#704214]/70 block">Mahudhurio Yaliyopigwa</span>
                      <span className="text-lg font-bold text-[#704214] block mt-0.5">Form 4A (Tayari)</span>
                    </div>

                    <div className="p-3.5 bg-[#FFFFF0] rounded-md border border-[#704214]/10">
                      <span className="text-[11px] text-[#704214]/70 block">Kazi Zinazosubiri Usahihishaji</span>
                      <span className="text-lg font-bold text-[#704214] block mt-0.5">2 Madarasa</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div
                    onClick={() => setActiveTab('attendance')}
                    className="p-5 bg-white rounded-lg border border-[#704214]/15 hover:border-[#704214] transition-colors cursor-pointer shadow-xs"
                  >
                    <CalendarCheck className="w-5 h-5 text-[#C9A227] mb-2" />
                    <h4 className="font-bold text-sm text-[#704214]">Piga Mahudhurio ya Darasa</h4>
                    <p className="text-xs text-[#704214]/70 mt-1">Rekodi uwepo wa wanafunzi kwa kipindi cha sasa.</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('results')}
                    className="p-5 bg-white rounded-lg border border-[#704214]/15 hover:border-[#704214] transition-colors cursor-pointer shadow-xs"
                  >
                    <Award className="w-5 h-5 text-[#C9A227] mb-2" />
                    <h4 className="font-bold text-sm text-[#704214]">Weka Alama za Mitihani</h4>
                    <p className="text-xs text-[#704214]/70 mt-1">Ingiza alama za majaribio ya kila wiki na mtihani wa robo muhula.</p>
                  </div>

                  <div
                    onClick={() => setActiveTab('assignments')}
                    className="p-5 bg-white rounded-lg border border-[#704214]/15 hover:border-[#704214] transition-colors cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-5 h-5 text-[#C9A227] mb-2" />
                    <h4 className="font-bold text-sm text-[#704214]">Tengeneza Zoezi / Assignment</h4>
                    <p className="text-xs text-[#704214]/70 mt-1">Tuma maelekezo ya kazi ya nyumbani na tarehe ya mwisho.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. STUDENT RECORDS */}
            {activeTab === 'records' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#704214]">Daftari la Wanafunzi (Student Records)</h3>
                    <p className="text-xs text-[#704214]/70 mt-1">
                      Kagua taarifa za wanafunzi, namba za mtihani, na namba za wazazi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Tafuta jina au namba..."
                      value={recordSearch}
                      onChange={(e) => setRecordSearch(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-[#704214]/20 rounded-md bg-white text-[#704214] focus:outline-none focus:border-[#704214]"
                    />
                    <select
                      value={recordFormFilter}
                      onChange={(e) => setRecordFormFilter(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-[#704214]/20 rounded-md bg-white text-[#704214] focus:outline-none focus:border-[#704214]"
                    >
                      <option value="ALL">Madarasa Yote</option>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#704214]/20 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F5EBD7] border-b border-[#704214]/15 text-[#704214]">
                        <tr>
                          <th className="px-4 py-3 font-bold">Jina Kamili</th>
                          <th className="px-4 py-3 font-bold">Namba ya Usajili</th>
                          <th className="px-4 py-3 font-bold">Namba ya Mtihani</th>
                          <th className="px-4 py-3 font-bold">Darasa</th>
                          <th className="px-4 py-3 font-bold">Aina</th>
                          <th className="px-4 py-3 font-bold">Mzazi / Mlezi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#704214]/10">
                        {filteredStudents.slice(0, 15).map((student) => (
                          <tr key={student.id} className="hover:bg-[#FFFFF0]/80">
                            <td className="px-4 py-2.5 font-bold text-[#704214]">{student.fullName}</td>
                            <td className="px-4 py-2.5 font-mono text-[#704214]/80">{student.studentId}</td>
                            <td className="px-4 py-2.5 font-mono text-[#704214]/80">{student.examNumber}</td>
                            <td className="px-4 py-2.5">{student.form} {student.stream}</td>
                            <td className="px-4 py-2.5">{student.studentType || 'Bweni'}</td>
                            <td className="px-4 py-2.5 text-[#704214]/80">{student.parentPhone || '+255 782 558 127'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ATTENDANCE */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#704214]">Kurekodi Mahudhurio ya Darasa (Attendance)</h3>
                    <p className="text-xs text-[#704214]/70 mt-1">
                      Piga mahudhurio ya wanafunzi kwa kubofya hali ya kila mwanafunzi.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-[#704214]/20 rounded-md bg-white text-[#704214]"
                    />
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-[#704214]/20 rounded-md bg-white text-[#704214]"
                    >
                      <option value="Form 4A">Form 4A (Physics &amp; Maths)</option>
                      <option value="Form 3B">Form 3B (Science)</option>
                      <option value="Form 2A">Form 2A (General)</option>
                    </select>

                    <button
                      onClick={handleSaveAttendance}
                      className="px-4 py-1.5 bg-[#704214] hover:bg-[#58330F] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{attendanceSaved ? 'Imehifadhiwa!' : 'Hifadhi'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#704214]/20 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EBD7] border-b border-[#704214]/15 text-[#704214]">
                      <tr>
                        <th className="px-4 py-3 font-bold">Namba ya Mtihani</th>
                        <th className="px-4 py-3 font-bold">Jina la Mwanafunzi</th>
                        <th className="px-4 py-3 font-bold text-center">Hali ya Mahudhurio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#704214]/10">
                      {attendanceList.map((st) => (
                        <tr key={st.id} className="hover:bg-[#FFFFF0]/80">
                          <td className="px-4 py-2.5 font-mono text-[#704214]/80">{st.id}</td>
                          <td className="px-4 py-2.5 font-bold text-[#704214]">{st.name}</td>
                          <td className="px-4 py-2.5 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              {['Present', 'Late', 'Absent'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => toggleAttendanceStatus(st.id, status)}
                                  className={`px-3 py-1 text-[11px] font-bold rounded cursor-pointer transition-colors ${
                                    st.status === status
                                      ? 'bg-[#704214] text-white shadow-xs'
                                      : 'bg-[#FFFFF0] border border-[#704214]/20 text-[#704214] hover:bg-[#F5EBD7]'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. ACADEMIC RESULTS */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#704214]">Kuingiza Alama za Mitihani (Academic Results)</h3>
                    <p className="text-xs text-[#704214]/70 mt-1">
                      Weka alama za majaribio, mtihani wa robo muhula, na mitihani ya majaribio (Mock).
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="px-3 py-1.5 text-xs border border-[#704214]/20 rounded-md bg-white text-[#704214]"
                    >
                      <option value="Basic Mathematics">Basic Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                    </select>

                    <button
                      onClick={handleSaveScores}
                      className="px-4 py-1.5 bg-[#704214] hover:bg-[#58330F] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{scoresSaved ? 'Zimehifadhiwa!' : 'Hifadhi Alama'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-[#704214]/20 overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5EBD7] border-b border-[#704214]/15 text-[#704214]">
                      <tr>
                        <th className="px-4 py-3 font-bold">Namba ya Mtihani</th>
                        <th className="px-4 py-3 font-bold">Jina la Mwanafunzi</th>
                        <th className="px-4 py-3 font-bold text-center">Alama (%)</th>
                        <th className="px-4 py-3 font-bold text-center">Daraja (Grade)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#704214]/10">
                      {scoreList.map((st) => (
                        <tr key={st.id} className="hover:bg-[#FFFFF0]/80">
                          <td className="px-4 py-2.5 font-mono text-[#704214]/80">{st.id}</td>
                          <td className="px-4 py-2.5 font-bold text-[#704214]">{st.name}</td>
                          <td className="px-4 py-2.5 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={st.score}
                              onChange={(e) => handleScoreChange(st.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center font-bold px-2 py-1 border border-[#704214]/25 rounded bg-[#FFFFF0] text-[#704214]"
                            />
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-[#F5EBD7] text-[#704214] border border-[#704214]/20">
                              {st.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. TIMETABLE */}
            {activeTab === 'timetable' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Ratiba ya Kufundisha (Teaching Timetable)</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Vipindi vya kila wiki vya somo la {defaultTeacher.role}.
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-[#704214]/15 overflow-hidden shadow-xs">
                  <div className="divide-y divide-[#704214]/10 text-xs">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#704214] text-sm block">Jumatatu · Kipindi cha 2 &amp; 3 (8:40 - 10:00 Asubuhi)</span>
                        <span className="text-[#704214]/70">Form 4A · Basic Mathematics · Chumba B-12</span>
                      </div>
                      <span className="px-2.5 py-1 bg-[#F5EBD7] text-[#704214] font-semibold rounded">Double Period</span>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#704214] text-sm block">Jumanne · Kipindi cha 4 (10:40 - 11:20 Asubuhi)</span>
                        <span className="text-[#704214]/70">Form 3B · Physics · Maabara ya Sayansi</span>
                      </div>
                      <span className="px-2.5 py-1 bg-[#F5EBD7] text-[#704214] font-semibold rounded">Single Period</span>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#704214] text-sm block">Jumatano · Kipindi cha 6 (1:30 - 2:10 Mchana)</span>
                        <span className="text-[#704214]/70">Form 4A · Basic Mathematics · Chumba B-12</span>
                      </div>
                      <span className="px-2.5 py-1 bg-[#F5EBD7] text-[#704214] font-semibold rounded">Single Period</span>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#704214] text-sm block">Ijumaa · Kipindi cha 1 &amp; 2 (8:00 - 9:20 Asubuhi)</span>
                        <span className="text-[#704214]/70">Form 3B · Physics Practicals · Maabara ya Fizikia</span>
                      </div>
                      <span className="px-2.5 py-1 bg-[#F5EBD7] text-[#704214] font-semibold rounded">Double Practical</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. CLASSES */}
            {activeTab === 'classes' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Madarasa Ninayofundisha (Assigned Classes)</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Mikondo na madarasa yaliyopangiwa somo lako chini ya idara ya kitaaluma.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">Kidato cha Nne</span>
                    <h4 className="text-base font-bold text-[#704214] mt-1">Form 4A — Basic Mathematics</h4>
                    <p className="text-xs text-[#704214]/70 mt-1">Wanafunzi 45 · Mwalimu wa Darasa: Mwl. Wolter Temu</p>
                    <div className="mt-4 pt-3 border-t border-[#704214]/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#704214]">Wastani wa Darasa: 78.4%</span>
                      <button onClick={() => setActiveTab('records')} className="text-[#704214] underline font-bold cursor-pointer">
                        Orodha ya Wanafunzi
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">Kidato cha Tatu</span>
                    <h4 className="text-base font-bold text-[#704214] mt-1">Form 3B — Physics</h4>
                    <p className="text-xs text-[#704214]/70 mt-1">Wanafunzi 40 · Mwalimu wa Darasa: Mwl. Herman</p>
                    <div className="mt-4 pt-3 border-t border-[#704214]/10 flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#704214]">Wastani wa Darasa: 72.1%</span>
                      <button onClick={() => setActiveTab('records')} className="text-[#704214] underline font-bold cursor-pointer">
                        Orodha ya Wanafunzi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. ASSIGNMENTS */}
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Kazi za Nyumbani &amp; Mazoezi (Assignments)</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Tengeneza na fuatilia mazoezi ya wanafunzi ya mtandaoni au vitabuni.
                  </p>
                </div>

                {/* Create Form */}
                <div className="bg-white p-6 rounded-lg border border-[#704214]/20 shadow-xs">
                  <h4 className="text-sm font-bold text-[#704214] mb-4">Tengeneza Zoezi Jipya</h4>
                  {asgCreated && (
                    <div className="mb-4 p-3 bg-[#FFFFF0] text-[#704214] border border-[#C9A227] rounded text-xs font-semibold">
                      Zoezi limetengenezwa kikamilifu na kuingizwa kwenye kalenda ya wanafunzi!
                    </div>
                  )}
                  <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-semibold text-[#704214] mb-1">Kichwa cha Zoezi *</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="mfano: Trigonometry Review Exercise 3"
                          className="w-full px-3 py-2 border border-[#704214]/25 rounded bg-white text-[#704214]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-[#704214] mb-1">Somo *</label>
                        <select
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-[#704214]/25 rounded bg-white text-[#704214]"
                        >
                          <option value="Basic Mathematics">Basic Mathematics</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-semibold text-[#704214] mb-1">Darasa *</label>
                        <select
                          value={newForm}
                          onChange={(e) => setNewForm(e.target.value)}
                          className="w-full px-3 py-2 border border-[#704214]/25 rounded bg-white text-[#704214]"
                        >
                          <option value="Form Four">Form Four</option>
                          <option value="Form Three">Form Three</option>
                          <option value="Form Two">Form Two</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#704214] mb-1">Tarehe ya Mwisho ya Kuwasilisha</label>
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full sm:w-64 px-3 py-2 border border-[#704214]/25 rounded bg-white text-[#704214]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#704214] mb-1">Maelekezo kwa Wanafunzi</label>
                      <textarea
                        rows={3}
                        value={newInstructions}
                        onChange={(e) => setNewInstructions(e.target.value)}
                        placeholder="Fungua kitabu ukurasa wa 142 maswali ya 1 hadi 10..."
                        className="w-full px-3 py-2 border border-[#704214]/25 rounded bg-white text-[#704214]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#704214] hover:bg-[#58330F] text-white font-semibold rounded text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Chapisha Zoezi</span>
                    </button>
                  </form>
                </div>

                {/* List of existing */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#704214]">Mazoezi Yaliyochapishwa</h4>
                  {assignments.map((asg) => (
                    <div key={asg.id} className="p-4 bg-white rounded-lg border border-[#704214]/15 flex items-center justify-between text-xs shadow-xs">
                      <div>
                        <span className="font-bold text-sm text-[#704214] block">{asg.title}</span>
                        <span className="text-[#704214]/70 mt-0.5 block">{asg.subject} · {asg.form} · Mwisho: {asg.dueDate}</span>
                      </div>
                      <span className="font-semibold text-[#704214] bg-[#F5EBD7] px-3 py-1 rounded">
                        Zilizopokelewa: {asg.submissions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. ANNOUNCEMENTS */}
            {activeTab === 'announcements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Matangazo ya Staffroom (Staff Announcements)</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Waraka na maelekezo ya ndani ya walimu kutoka ofisi ya Mkuu wa Shule na Makamu.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">Taaluma &amp; Mitihani</span>
                    <h4 className="text-sm font-bold text-[#704214] mt-1">Uwasilishaji wa Mitihani ya Majaribio (Mock Submissions)</h4>
                    <p className="text-xs text-[#704214]/80 mt-2 leading-relaxed">
                      Walimu wote wa masomo ya Kidato cha Nne wanatakiwa kuwasilisha maswali ya mitihani ya majaribio kwa Mwalimu wa Taaluma kabla ya tarehe 28 ya mwezi huu kwa ajili ya uchapaji na ukaguzi.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider block">Utawala &amp; Vikao</span>
                    <h4 className="text-sm font-bold text-[#704214] mt-1">Kikao cha Idara ya Sayansi na Maabara</h4>
                    <p className="text-xs text-[#704214]/80 mt-2 leading-relaxed">
                      Kikao cha idara ya sayansi kitafanyika Ijumaa hii saa 9:30 alasiri katika chumba cha maabara ya Biolojia kujadili mahitaji ya kemikali na vifaa vya mitihani ya vitendo ya NECTA.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 9. REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Ripoti za Kitaaluma &amp; Broadsheet</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Tathmini ya matokeo ya madarasa, viwango vya ufaulu, na takwimu za NECTA.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-xs text-[#704214]/70 block">Wastani wa Somo (Mathematics)</span>
                    <span className="text-2xl font-bold text-[#704214] mt-1 block">78.9%</span>
                    <span className="text-[11px] text-[#704214]/70 mt-1 block">Form 4 CSEE Mock Series</span>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-xs text-[#704214]/70 block">Wanafunzi Waliopata Alama A</span>
                    <span className="text-2xl font-bold text-[#704214] mt-1 block">18 Wanafunzi</span>
                    <span className="text-[11px] text-[#704214]/70 mt-1 block">40% ya watahiniwa</span>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-[#704214]/15 shadow-xs">
                    <span className="text-xs text-[#704214]/70 block">Wanafunzi Wanaohitaji Remedial</span>
                    <span className="text-2xl font-bold text-[#704214] mt-1 block">4 Wanafunzi</span>
                    <span className="text-[11px] text-[#704214]/70 mt-1 block">Kambi ya jioni imeandaliwa</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#704214]/15 shadow-xs">
                  <h4 className="text-sm font-bold text-[#704214] mb-3">Utoaji wa Ripoti za Madarasa</h4>
                  <p className="text-xs text-[#704214]/80 leading-relaxed mb-4">
                    Ripoti kamili za madarasa zinaweza kuchapishwa au kupakuliwa katika muundo wa Excel na PDF kwa ajili ya uchambuzi wa kitaaluma.
                  </p>
                  <button
                    onClick={() => {
                      if (studentResults && studentResults.length > 0) {
                        downloadClassBroadsheetPdf(studentResults, 'MATOKEO YA DARASA (BROADSHEET) - UOMBONI SECONDARY SCHOOL');
                      }
                    }}
                    className="px-4 py-2 bg-[#704214] text-white text-xs font-semibold rounded hover:bg-[#58330F] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Pakua Broadsheet ya Darasa (PDF)</span>
                  </button>
                </div>
              </div>
            )}

            {/* 10. PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#704214]">Profaili ya Mwalimu (Teacher Profile)</h3>
                  <p className="text-xs text-[#704214]/70 mt-1">
                    Taarifa zako za kiutumishi katika Shule ya Sekondari Uomboni.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-[#704214]/20 shadow-xs space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#FFFFF0] rounded border border-[#704214]/15">
                      <span className="text-[#704214]/70 block">Jina Kamili:</span>
                      <span className="font-bold text-sm text-[#704214] block mt-0.5">{defaultTeacher.name}</span>
                    </div>

                    <div className="p-4 bg-[#FFFFF0] rounded border border-[#704214]/15">
                      <span className="text-[#704214]/70 block">Nafasi / Wadhifa:</span>
                      <span className="font-bold text-sm text-[#704214] block mt-0.5">{defaultTeacher.role}</span>
                    </div>

                    <div className="p-4 bg-[#FFFFF0] rounded border border-[#704214]/15">
                      <span className="text-[#704214]/70 block">Idara:</span>
                      <span className="font-bold text-sm text-[#704214] block mt-0.5">{defaultTeacher.department}</span>
                    </div>

                    <div className="p-4 bg-[#FFFFF0] rounded border border-[#704214]/15">
                      <span className="text-[#704214]/70 block">Namba ya Simu:</span>
                      <span className="font-bold text-sm text-[#704214] block mt-0.5">{defaultTeacher.phone}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#704214]/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#704214]/70">
                      Uomboni Staff System · NECTA Centre S0486
                    </span>
                    <button
                      onClick={async () => {
                        onClose();
                        await logout();
                      }}
                      className="px-4 py-2 bg-[#F5EBD7] text-[#704214] font-semibold rounded hover:bg-white border border-[#704214]/20 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>Ondoka kwenye Mfumo (Logout)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modal footer info */}
        <div className="bg-[#F5EBD7] px-6 py-3 border-t border-[#704214]/15 flex items-center justify-between text-xs text-[#704214]/80 shrink-0">
          <div>
            &copy; 2026 Uomboni Secondary School · Teachers &amp; Staff Portal
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#704214] text-white font-semibold rounded text-xs hover:bg-[#58330F] transition-colors cursor-pointer"
          >
            Funga Portal
          </button>
        </div>
      </div>
    </div>
  );
};
