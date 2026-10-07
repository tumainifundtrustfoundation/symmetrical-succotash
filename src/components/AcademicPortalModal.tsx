import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { WorldClassLoginView, PortalLoginRole } from './WorldClassLoginView';
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Printer,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  BarChart3,
  Calendar,
  Lock,
  LogOut,
  X,
  Plus,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  Check,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Clock,
  ArrowRight,
  Eye,
  EyeOff,
  Sliders,
  Filter,
  Upload,
  Send,
  Share2,
  Table,
  CheckCheck,
  FileDown,
  Mail,
  KeyRound,
  BellRing,
  Megaphone,
} from 'lucide-react';
import { signInWithGoogle, getUserProfile } from '../lib/firebase';
import { checkStaffAuthorization, logStaffAuthAttempt } from '../services/staffSecurityService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { SchoolLogo } from './SchoolLogo';
import { AcademicStudentRosterTab } from './academic/AcademicStudentRosterTab';
import { AcademicDirectivesManagerTab } from './academic/AcademicDirectivesManagerTab';
import { StudentResult, Teacher, StudentProfile, SubjectResult, ResultsPdfDocument } from '../types';
import {
  downloadStudentResultSlipPdf,
  downloadClassBroadsheetPdf,
  printStudentResultSlipDirectly,
} from '../utils/pdfService';
import {
  exportResultsToExcel,
  parseExcelResultsFile,
  downloadExcelTemplate,
} from '../utils/excelService';
import { InlineReportCardPdfViewer } from './InlineReportCardPdfViewer';
import { NectaResultsOfficialView } from './NectaResultsOfficialView';
import { AcademicSubjectEntryModule } from './AcademicSubjectEntryModule';

export type AcademicRole = 'parent' | 'teacher' | 'academic_master' | 'student';

interface AcademicPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: AcademicRole;
  initialStudentId?: string;
  onOpenInstallApp?: () => void;
}

// Standard subjects for Uomboni Secondary School
const STANDARD_SUBJECTS = [
  { code: '011', name: 'Civics', nameEn: 'Civics' },
  { code: '012', name: 'History', nameEn: 'History' },
  { code: '013', name: 'Geography', nameEn: 'Geography' },
  { code: '021', name: 'Kiswahili', nameEn: 'Kiswahili' },
  { code: '022', name: 'English Language', nameEn: 'English Language' },
  { code: '031', name: 'Physics', nameEn: 'Physics' },
  { code: '032', name: 'Chemistry', nameEn: 'Chemistry' },
  { code: '033', name: 'Biology', nameEn: 'Biology' },
  { code: '041', name: 'Basic Mathematics', nameEn: 'Basic Mathematics' },
  { code: '071', name: 'Religious Education', nameEn: 'Religious Education' },
];

export const AcademicPortalModal: React.FC<AcademicPortalModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'parent',
  initialStudentId,
  onOpenInstallApp,
}) => {
  const { language } = useLanguage();
  const {
    studentResults,
    students,
    teachers,
    resultsPdfDocuments,
    timetable,
    addStudentResult,
    bulkAddStudentResults,
    updateStudentResult,
    deleteStudentResult,
    bulkReplaceStudentResults,
    addResultsPdfDoc,
    deleteResultsPdfDoc,
  } = useData();

  // Active role state
  const [activeRole, setActiveRole] = useState<AcademicRole>(initialRole);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Parent State
  const [parentSearchQuery, setParentSearchQuery] = useState(initialStudentId || '');
  const [selectedParentStudent, setSelectedParentStudent] = useState<StudentResult | null>(() => {
    return studentResults[0] || null;
  });
  const [parentActiveTab, setParentActiveTab] = useState<'marks' | 'progress' | 'conduct' | 'teachers'>('marks');
  const [parentViewPdfMode, setParentViewPdfMode] = useState<boolean>(false);
  const [parentViewMode, setParentViewMode] = useState<'official_necta' | 'report_card'>('official_necta');
  const [parentFeedbackSent, setParentFeedbackSent] = useState<boolean>(false);

  // Teacher State & Instant Auto-Publishing Engine
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(() => {
    return teachers.find(t => t.roleSw.includes('Taaluma') || t.subjects.includes('Chemistry')) || teachers[0] || null;
  });
  const [teacherEmailInput, setTeacherEmailInput] = useState('walimu@uomboni.sc.tz');
  const [isTeacherGoogleSigningIn, setIsTeacherGoogleSigningIn] = useState(false);
  const [teacherGoogleUser, setTeacherGoogleUser] = useState<any>(null);
  const [teacherAuthError, setTeacherAuthError] = useState(false);
  const [teacherEmailError, setTeacherEmailError] = useState('');
  const [teacherSelectedSubject, setTeacherSelectedSubject] = useState<string>('Chemistry');
  const [teacherSelectedForm, setTeacherSelectedForm] = useState<string>('Form 4');
  const [teacherSelectedExam, setTeacherSelectedExam] = useState<string>('NECTA Mock 2025');
  const [teacherMarksDraft, setTeacherMarksDraft] = useState<{ [examNumber: string]: { score: number; remarks: string } }>({});
  const [teacherSaveSuccess, setTeacherSaveSuccess] = useState(false);
  const [teacherActiveTab, setTeacherActiveTab] = useState<'excel_upload' | 'subject_entry' | 'master_grid' | 'single_add' | 'broadcast'>('subject_entry');

  // Excel / CSV File Upload State for Teachers
  const [isParsingExcel, setIsParsingExcel] = useState(false);
  const [parsedExcelStudents, setParsedExcelStudents] = useState<StudentResult[]>([]);
  const [excelParseError, setExcelParseError] = useState<string | null>(null);
  const [excelParseSuccess, setExcelParseSuccess] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [lastPublishedAudit, setLastPublishedAudit] = useState<{
    timestamp: string;
    count: number;
    examType: string;
    form: string;
    teacherName: string;
    divisionStats: Record<string, number>;
  } | null>(null);
  const [copiedBroadcastText, setCopiedBroadcastText] = useState(false);

  // Teacher Single Student Quick Add Draft
  const [teacherSingleStudentDraft, setTeacherSingleStudentDraft] = useState({
    studentName: '',
    examNumber: '',
    gender: 'M' as 'M' | 'F',
    form: 'Form 4' as 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4',
    stream: 'Science' as 'A' | 'B' | 'Science' | 'Arts' | 'Commercial',
    examType: 'NECTA Mock 2025',
    conduct: 'Bora Sana (Excellent)' as 'Bora Sana (Excellent)' | 'Nzuri Sana (Very Good)' | 'Nzuri (Good)' | 'Inaridhisha (Fair)',
    headmasterRemarks: 'Mwanafunzi hodari mwenye bidii na nidhamu ya kikanisa.',
    subjectScores: STANDARD_SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.code]: 72 }), {} as { [code: string]: number }),
  });

  // Academic Master State
  const [academicEmailInput, setAcademicEmailInput] = useState('academic@uomboni.sc.tz');
  const [isAcademicGoogleSigningIn, setIsAcademicGoogleSigningIn] = useState(false);
  const [academicGoogleUser, setAcademicGoogleUser] = useState<any>(null);
  const [academicAuthError, setAcademicAuthError] = useState(false);
  const [academicEmailError, setAcademicEmailError] = useState('');
  const [academicActiveTab, setAcademicActiveTab] = useState<'teachers_admin' | 'directives' | 'necta_sheet' | 'students_roster' | 'overview' | 'broadsheet' | 'manage' | 'pdfBooks' | 'recompute'>('teachers_admin');
  const [broadsheetForm, setBroadsheetForm] = useState<string>('Form 4');
  const [broadsheetExam, setBroadsheetExam] = useState<string>('NECTA Mock 2025');
  const [recomputeSuccess, setRecomputeSuccess] = useState(false);

  // New Student Result Form State (for Academic Master)
  const [isAddResultModalOpen, setIsAddResultModalOpen] = useState(false);
  const [newResultData, setNewResultData] = useState({
    studentName: '',
    examNumber: '',
    gender: 'M' as 'M' | 'F',
    form: 'Form 4' as 'Form 1' | 'Form 2' | 'Form 3' | 'Form 4',
    stream: 'Science' as 'A' | 'B' | 'Science' | 'Arts' | 'Commercial',
    examType: 'NECTA Mock 2025' as 'NECTA Mock 2025' | 'Annual Examination 2025' | 'Mid-Term Exam 2025' | 'Pre-NECTA 2025',
    conduct: 'Bora Sana (Excellent)' as 'Bora Sana (Excellent)' | 'Nzuri Sana (Very Good)' | 'Nzuri (Good)' | 'Inaridhisha (Fair)',
    headmasterRemarks: 'Matokeo mazuri sana kitaaluma. Ana nidhamu thabiti na bidii ya kuigwa.',
    subjectScores: STANDARD_SUBJECTS.reduce((acc, sub) => ({ ...acc, [sub.code]: 65 }), {} as { [code: string]: number }),
  });

  // Student State
  const [studentInputIdentifier, setStudentInputIdentifier] = useState('');
  const [studentAuthError, setStudentAuthError] = useState(false);
  const [activeStudentResult, setActiveStudentResult] = useState<StudentResult | null>(() => studentResults[0] || null);

  // Filtered students for teacher mark entry, incorporating all registered school students
  const teacherClassStudents = useMemo(() => {
    const fromResults = studentResults.filter(
      (r) => r.form === teacherSelectedForm && r.examType === teacherSelectedExam
    );
    const existingExamNos = new Set(fromResults.map((r) => r.examNumber.toLowerCase()));

    const registered = (students || []).filter(
      (s) => s.form === teacherSelectedForm && !existingExamNos.has(s.examNumber.toLowerCase())
    );

    const synthesized: StudentResult[] = registered.map((s) => ({
      id: `syn-${s.id}-${teacherSelectedExam}`,
      studentId: s.studentId,
      examNumber: s.examNumber,
      studentName: s.fullName,
      gender: (s.gender as 'M' | 'F') || 'F',
      form: (s.form as any) || teacherSelectedForm,
      stream: (s.stream as any) || 'Science',
      examType: teacherSelectedExam as any,
      year: 2026,
      subjects: [],
      totalMarks: 0,
      averageMarks: 0,
      division: 'Division 0',
      points: 35,
      classPosition: 0,
      totalStudentsInClass: 0,
      conduct: 'Bora Sana (Excellent)',
      headmasterRemarks: 'Mwanafunzi mwenye bidii kitaaluma.',
      publishDate: '2026-03-15',
      detailedSubjectsString: '',
      approvalStatus: 'draft_teacher',
    }));

    return [...fromResults, ...synthesized].sort((a, b) => a.examNumber.localeCompare(b.examNumber));
  }, [studentResults, students, teacherSelectedForm, teacherSelectedExam]);

  // Broadsheet filtered results
  const broadsheetResults = useMemo(() => {
    return studentResults.filter(
      (r) => (broadsheetForm === 'ALL' || r.form === broadsheetForm) && (broadsheetExam === 'ALL' || r.examType === broadsheetExam)
    );
  }, [studentResults, broadsheetForm, broadsheetExam]);

  if (!isOpen) return null;

  // Grade and Point calculation helper
  const calculateGradeAndPoints = (score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F'; points: number; remarks: string } => {
    if (score >= 75) return { grade: 'A', points: 1, remarks: 'Bora Sana / Excellent' };
    if (score >= 65) return { grade: 'B', points: 2, remarks: 'Nzuri Sana / Very Good' };
    if (score >= 45) return { grade: 'C', points: 3, remarks: 'Nzuri / Good' };
    if (score >= 30) return { grade: 'D', points: 4, remarks: 'Inaridhisha / Pass' };
    return { grade: 'F', points: 5, remarks: 'Feli / Fail' };
  };

  // Division calculation based on best 7 subjects for NECTA O-Level
  const calculateDivision = (subjects: SubjectResult[]): { division: StudentResult['division']; totalPoints: number } => {
    if (!subjects || subjects.length === 0) return { division: 'Division 0', totalPoints: 35 };
    const pointsList = subjects.map((s) => s.points).sort((a, b) => a - b);
    const best7Points = pointsList.slice(0, 7);
    const totalPoints = best7Points.reduce((sum, p) => sum + p, 0);

    let division: StudentResult['division'] = 'Division 0';
    if (totalPoints >= 7 && totalPoints <= 17) {
      division = 'Division I';
    } else if (totalPoints >= 18 && totalPoints <= 21) {
      division = 'Division II';
    } else if (totalPoints >= 22 && totalPoints <= 25) {
      division = 'Division III';
    } else if (totalPoints >= 26 && totalPoints <= 33) {
      division = 'Division IV';
    } else {
      division = 'Division 0';
    }
    return { division, totalPoints };
  };

  // Handle Parent Search
  const handleParentSearch = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    const foundResult = studentResults.find((r) => {
      return (
        r.examNumber.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.id.toLowerCase() === q
      );
    });

    if (foundResult) {
      setSelectedParentStudent(foundResult);
      setIsAuthenticated(true);
      return;
    }

    // Try matching from students list (e.g. parent phone or studentId)
    const foundProfile = students.find((s) => {
      const cleanPhone = (s.parentPhone || '').replace(/\D/g, '');
      const qDigits = q.replace(/\D/g, '');
      return (
        s.studentId.toLowerCase() === q ||
        s.fullName.toLowerCase().includes(q) ||
        s.examNumber.toLowerCase().includes(q) ||
        (qDigits.length >= 6 && cleanPhone.includes(qDigits))
      );
    });

    if (foundProfile) {
      const matchResult = studentResults.find(
        (r) => r.examNumber.toLowerCase() === foundProfile.examNumber.toLowerCase() || r.studentName.toLowerCase() === foundProfile.fullName.toLowerCase()
      );
      if (matchResult) {
        setSelectedParentStudent(matchResult);
        setIsAuthenticated(true);
      } else if (studentResults[0]) {
        setSelectedParentStudent(studentResults[0]);
        setIsAuthenticated(true);
      }
    }
  };

  // Handle Teacher Google Sign-In
  const handleTeacherGoogleSignIn = async () => {
    setIsTeacherGoogleSigningIn(true);
    setTeacherAuthError(false);
    setTeacherEmailError('');
    try {
      const res = await signInWithGoogle('teacher');
      if (res.success && res.user) {
        const email = res.user.email || '';
        let firestoreRole: string | null = res.profile?.role || null;
        if (!firestoreRole && res.user.uid) {
          try {
            const profile = await getUserProfile(res.user.uid);
            firestoreRole = profile?.role || null;
          } catch {
            firestoreRole = null;
          }
        }

        const authCheck = checkStaffAuthorization(email, 'teacher', firestoreRole);

        await logStaffAuthAttempt({
          email,
          roleRequested: 'teacher',
          success: authCheck.authorized,
          reason: authCheck.authorized ? 'Teacher access authorized' : 'Unauthorized teacher desk attempt',
          uid: res.user.uid,
        });

        if (!authCheck.authorized) {
          setTeacherAuthError(true);
          setTeacherEmailError(language === 'sw' ? authCheck.reasonSw : authCheck.reasonEn);
          return;
        }

        setTeacherGoogleUser(res.user);
        if (res.user.email) setTeacherEmailInput(res.user.email);
        setIsAuthenticated(true);
      } else {
        setTeacherAuthError(true);
        setTeacherEmailError(
          res.error ||
            (language === 'sw'
              ? 'Imeshindwa kuingia na akaunti ya Google.'
              : 'Failed to sign in with Google account.')
        );
      }
    } catch (err: any) {
      setTeacherAuthError(true);
      setTeacherEmailError(err?.message || 'Hitilafu ya uthibitishaji.');
    } finally {
      setIsTeacherGoogleSigningIn(false);
    }
  };

  // Handle Academic Master Google Sign-In
  const handleAcademicGoogleSignIn = async () => {
    setIsAcademicGoogleSigningIn(true);
    setAcademicAuthError(false);
    setAcademicEmailError('');
    try {
      const res = await signInWithGoogle('academic_master');
      if (res.success && res.user) {
        const email = res.user.email || '';
        let firestoreRole: string | null = res.profile?.role || null;
        if (!firestoreRole && res.user.uid) {
          try {
            const profile = await getUserProfile(res.user.uid);
            firestoreRole = profile?.role || null;
          } catch {
            firestoreRole = null;
          }
        }

        const authCheck = checkStaffAuthorization(email, 'academic_master', firestoreRole);

        await logStaffAuthAttempt({
          email,
          roleRequested: 'academic_master',
          success: authCheck.authorized,
          reason: authCheck.authorized ? 'Academic Master access authorized' : 'Unauthorized Academic Master access attempt',
          uid: res.user.uid,
        });

        if (!authCheck.authorized) {
          setAcademicAuthError(true);
          setAcademicEmailError(language === 'sw' ? authCheck.reasonSw : authCheck.reasonEn);
          return;
        }

        setAcademicGoogleUser(res.user);
        if (res.user.email) setAcademicEmailInput(res.user.email);
        setIsAuthenticated(true);
      } else {
        setAcademicAuthError(true);
        setAcademicEmailError(
          res.error ||
            (language === 'sw'
              ? 'Imeshindwa kuingia na akaunti ya Google.'
              : 'Failed to sign in with Google account.')
        );
      }
    } catch (err: any) {
      setAcademicAuthError(true);
      setAcademicEmailError(err?.message || 'Hitilafu ya uthibitishaji.');
    } finally {
      setIsAcademicGoogleSigningIn(false);
    }
  };

  // Handle Teacher Direct / PIN / Faculty Selection Sign-In
  const handleTeacherDirectLogin = (teacher: { id?: string; name: string; email: string; role?: string; subjects?: string[] }) => {
    const found =
      teachers.find(
        (t) =>
          (teacher.id && t.id === teacher.id) ||
          (teacher.email && t.email?.toLowerCase() === teacher.email.toLowerCase()) ||
          t.name.toLowerCase().includes(teacher.name.toLowerCase())
      ) || teachers[0];

    const teacherAssignedSubjects = teacher.subjects || found.subjects || ['Chemistry'];
    setSelectedTeacher({
      ...found,
      subjects: teacherAssignedSubjects,
    });
    setTeacherEmailInput(found.email || teacher.email || 'walimu@uombonisec.ac.tz');
    if (teacherAssignedSubjects && teacherAssignedSubjects.length > 0) {
      setTeacherSelectedSubject(teacherAssignedSubjects[0]);
    }
    setTeacherGoogleUser({
      email: found.email || teacher.email,
      displayName: found.name,
      photoURL: found.imageUrl,
    });
    setTeacherActiveTab('subject_entry');
    setTeacherAuthError(false);
    setTeacherEmailError('');
    setIsAuthenticated(true);
  };

  // Handle Academic Master Direct / PIN Sign-In
  const handleAcademicDirectLogin = (master?: { name?: string; email?: string }) => {
    const defaultEmail = master?.email || 'yohana.bahati@uombonisec.ac.tz';
    const defaultName = master?.name || 'Mwl. Yohana Bahati (Mtaaluma Mkuu)';
    setAcademicEmailInput(defaultEmail);
    setAcademicGoogleUser({
      email: defaultEmail,
      displayName: defaultName,
      photoURL: '/media/media_3.webp',
    });
    setAcademicAuthError(false);
    setAcademicEmailError('');
    setIsAuthenticated(true);
  };

  // Handle Student Login
  const handleStudentLogin = () => {
    const q = studentInputIdentifier.trim().toLowerCase();
    if (!q) return;

    const found = studentResults.find(
      (r) => r.examNumber.toLowerCase() === q || r.studentName.toLowerCase().includes(q) || r.id.toLowerCase() === q
    );

    if (found) {
      setActiveStudentResult(found);
      setIsAuthenticated(true);
      setStudentAuthError(false);
    } else {
      setStudentAuthError(true);
    }
  };

  // Handle Excel File Upload & Parse for Teachers
  const handleExcelFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    setIsParsingExcel(true);
    setExcelParseError(null);
    setExcelParseSuccess(null);
    try {
      const parsed = await parseExcelResultsFile(file);
      if (!parsed || parsed.length === 0) {
        throw new Error(language === 'sw' ? 'Faili halina rekodi zozote za wanafunzi.' : 'Spreadsheet contains no valid student records.');
      }
      setParsedExcelStudents(parsed);
      setExcelParseSuccess(
        language === 'sw'
          ? `Faili limekaguliwa kikamilifu! Wanafunzi ${parsed.length} wametambuliwa na madaraja (A-F, Division I-0) yamehesabiwa kiotomatiki kwa vigezo vya NECTA.`
          : `File parsed successfully! ${parsed.length} students detected with automated NECTA grading.`
      );
    } catch (err: any) {
      setExcelParseError(err?.message || (language === 'sw' ? 'Hitilafu ya kusoma faili la Excel/CSV.' : 'Error reading spreadsheet.'));
    } finally {
      setIsParsingExcel(false);
    }
  };

  // Handle Instant Self-Publishing from Uploaded Excel
  const handleInstantPublishExcel = (mode: 'merge' | 'replace' = 'merge') => {
    if (parsedExcelStudents.length === 0) return;

    // Calculate division breakdown statistics
    const stats: Record<string, number> = {
      'Division I': 0,
      'Division II': 0,
      'Division III': 0,
      'Division IV': 0,
      'Division 0': 0,
    };
    parsedExcelStudents.forEach((s) => {
      stats[s.division] = (stats[s.division] || 0) + 1;
    });

    if (mode === 'replace') {
      bulkReplaceStudentResults(parsedExcelStudents);
    } else {
      bulkAddStudentResults(parsedExcelStudents);
    }

    const nowStr = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('sw-TZ');

    setLastPublishedAudit({
      timestamp: nowStr,
      count: parsedExcelStudents.length,
      examType: parsedExcelStudents[0]?.examType || 'Mitihani ya Uomboni',
      form: parsedExcelStudents[0]?.form || 'Form 4',
      teacherName: selectedTeacher?.name || 'Mwalimu wa Uomboni',
      divisionStats: stats,
    });

    setTeacherSaveSuccess(true);
    setTimeout(() => setTeacherSaveSuccess(false), 6000);
  };

  // Handle Loading Demo Test Batch for Instant Testing
  const handleLoadDemoBatch = () => {
    const demoNames = [
      'AMANI ELIAKIM MUSHI',
      'DEVOTHA GODFREY SHAYO',
      'KELVIN JOSEPHAT MTUI',
      'NEEMA CHRISTOPHER KIMARO',
      'BARAKA EMMANUEL TEMBA',
      'MARIAM JOACHIM LYIMO',
      'COLLINS FRANCIS MASSAWE',
      'GLORIA ALFRED TARIMO',
      'INNOCENT PETER MARIKI',
      'HAPPINESS FAUSTINE URASSA',
    ];

    const demoBatch: StudentResult[] = demoNames.map((name, idx) => {
      const isFemale = name.includes('DEVOTHA') || name.includes('NEEMA') || name.includes('MARIAM') || name.includes('GLORIA') || name.includes('HAPPINESS');
      const baseScores: Record<string, number> = {
        '011': 82 + (idx % 8) - 3,
        '012': 78 + (idx % 7) - 2,
        '013': 85 + (idx % 9) - 4,
        '021': 88 + (idx % 6) - 2,
        '022': 84 + (idx % 8) - 3,
        '031': 75 + (idx % 11) - 5,
        '032': 80 + (idx % 9) - 4,
        '033': 86 + (idx % 7) - 3,
        '041': 79 + (idx % 12) - 6,
        '071': 92 + (idx % 5) - 2,
      };

      const subjects: SubjectResult[] = STANDARD_SUBJECTS.map((sub) => {
        const rawScore = Math.min(100, Math.max(35, baseScores[sub.code] || 70));
        const { grade, points, remarks } = calculateGradeAndPoints(rawScore);
        return {
          code: sub.code,
          name: sub.name,
          nameEn: sub.nameEn,
          score: rawScore,
          grade,
          points,
          remarks,
        };
      });

      const totalMarks = subjects.reduce((sum, s) => sum + s.score, 0);
      const averageMarks = parseFloat((totalMarks / subjects.length).toFixed(1));
      const { division, totalPoints } = calculateDivision(subjects);

      return {
        id: `demo-res-${Date.now()}-${idx}`,
        examNumber: `S0486/${String(idx + 101).padStart(4, '0')}/2025`,
        studentName: name,
        gender: isFemale ? 'F' : 'M',
        form: 'Form 4',
        stream: idx % 2 === 0 ? 'Science' : 'Arts',
        examType: 'NECTA Mock 2025',
        year: 2025,
        subjects,
        totalMarks,
        averageMarks,
        division,
        points: totalPoints,
        classPosition: idx + 1,
        totalStudentsInClass: demoNames.length,
        conduct: 'Bora Sana (Excellent)',
        headmasterRemarks: 'Ufaulu mzuri sana na nidhamu ya kielelezo cha shule.',
        publishDate: new Date().toISOString().split('T')[0],
      };
    });

    demoBatch.sort((a, b) => b.averageMarks - a.averageMarks);
    demoBatch.forEach((s, i) => {
      s.classPosition = i + 1;
    });

    setParsedExcelStudents(demoBatch);
    setUploadFileName('Mfano_Matokeo_Form4_Mock2025.xlsx');
    setExcelParseSuccess(`Wanafunzi ${demoBatch.length} wa mfano wameandaliwa tayari kusakinishwa!`);
  };

  // Handle Teacher Saving Marks for Selected Subject & Instant Live Auto-Publishing
  const handleTeacherSaveMarks = () => {
    let affectedCount = 0;
    const updatedStudents = teacherClassStudents.map((student) => {
      const draft = teacherMarksDraft[student.examNumber];
      if (draft !== undefined) {
        affectedCount++;
        const score = draft.score;
        const remarks = draft.remarks;
        const { grade, points } = calculateGradeAndPoints(score);

        // Update or add subject in student subjects list
        let updatedSubjects = [...student.subjects];
        const existingSubIndex = updatedSubjects.findIndex(
          (s) =>
            s.name.toLowerCase() === teacherSelectedSubject.toLowerCase() ||
            s.nameEn.toLowerCase() === teacherSelectedSubject.toLowerCase()
        );

        if (existingSubIndex >= 0) {
          updatedSubjects[existingSubIndex] = {
            ...updatedSubjects[existingSubIndex],
            score,
            grade,
            points,
            remarks: remarks || updatedSubjects[existingSubIndex].remarks,
          };
        } else {
          updatedSubjects.push({
            code: '099',
            name: teacherSelectedSubject,
            nameEn: teacherSelectedSubject,
            score,
            grade,
            points,
            remarks: remarks || 'Nzuri',
          });
        }

        const totalMarks = updatedSubjects.reduce((sum, s) => sum + s.score, 0);
        const averageMarks = parseFloat((totalMarks / updatedSubjects.length).toFixed(1));
        const { division, totalPoints } = calculateDivision(updatedSubjects);

        const updatedStudentResult: StudentResult = {
          ...student,
          subjects: updatedSubjects,
          totalMarks,
          averageMarks,
          division,
          points: totalPoints,
        };

        updateStudentResult(updatedStudentResult);
        return updatedStudentResult;
      }
      return student;
    });

    const nowStr = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('sw-TZ');
    setLastPublishedAudit({
      timestamp: nowStr,
      count: affectedCount || teacherClassStudents.length,
      examType: teacherSelectedExam,
      form: teacherSelectedForm,
      teacherName: selectedTeacher?.name || 'Mwalimu wa Somo',
      divisionStats: {
        'Division I': updatedStudents.filter((s) => s.division === 'Division I').length,
        'Division II': updatedStudents.filter((s) => s.division === 'Division II').length,
        'Division III': updatedStudents.filter((s) => s.division === 'Division III').length,
        'Division IV': updatedStudents.filter((s) => s.division === 'Division IV').length,
        'Division 0': updatedStudents.filter((s) => s.division === 'Division 0').length,
      },
    });

    setTeacherSaveSuccess(true);
    setTimeout(() => setTeacherSaveSuccess(false), 5000);
  };

  // Handle Teacher Single Student Quick Add & Instant Live Auto-Publishing
  const handleTeacherSingleStudentPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherSingleStudentDraft.studentName.trim()) {
      alert(language === 'sw' ? 'Tafadhali weka jina la mwanafunzi.' : 'Please provide student name.');
      return;
    }

    const subjectsList: SubjectResult[] = STANDARD_SUBJECTS.map((sub) => {
      const score = teacherSingleStudentDraft.subjectScores[sub.code] || 65;
      const { grade, points, remarks } = calculateGradeAndPoints(score);
      return {
        code: sub.code,
        name: sub.name,
        nameEn: sub.nameEn,
        score,
        grade,
        points,
        remarks,
      };
    });

    const totalMarks = subjectsList.reduce((sum, s) => sum + s.score, 0);
    const averageMarks = parseFloat((totalMarks / subjectsList.length).toFixed(1));
    const { division, totalPoints } = calculateDivision(subjectsList);

    const generatedExamNo =
      teacherSingleStudentDraft.examNumber.trim() ||
      `S0486/${String(studentResults.length + 1).padStart(4, '0')}/2025`;

    const newResult: StudentResult = {
      id: `tch-res-${Date.now()}`,
      examNumber: generatedExamNo.toUpperCase(),
      studentName: teacherSingleStudentDraft.studentName.toUpperCase().trim(),
      gender: teacherSingleStudentDraft.gender,
      form: teacherSingleStudentDraft.form,
      stream: teacherSingleStudentDraft.stream,
      examType: teacherSingleStudentDraft.examType as any,
      year: 2025,
      subjects: subjectsList,
      totalMarks,
      averageMarks,
      division,
      points: totalPoints,
      classPosition: studentResults.filter((s) => s.form === teacherSingleStudentDraft.form).length + 1,
      totalStudentsInClass: studentResults.filter((s) => s.form === teacherSingleStudentDraft.form).length + 1,
      conduct: teacherSingleStudentDraft.conduct as any,
      headmasterRemarks: teacherSingleStudentDraft.headmasterRemarks,
      publishDate: new Date().toISOString().split('T')[0],
    };

    addStudentResult(newResult);

    const nowStr = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('sw-TZ');
    setLastPublishedAudit({
      timestamp: nowStr,
      count: 1,
      examType: teacherSingleStudentDraft.examType,
      form: teacherSingleStudentDraft.form,
      teacherName: selectedTeacher?.name || 'Mwalimu wa Uomboni',
      divisionStats: {
        [division]: 1,
      },
    });

    setTeacherSaveSuccess(true);
    setTeacherSingleStudentDraft((prev) => ({
      ...prev,
      studentName: '',
      examNumber: '',
    }));
    setTimeout(() => setTeacherSaveSuccess(false), 5000);
  };

  // Handle Recalculating All Divisions & Class Ranks
  const handleRecomputeAllDivisions = () => {
    const updated = studentResults.map((student) => {
      const { division, totalPoints } = calculateDivision(student.subjects);
      const totalMarks = student.subjects.reduce((sum, s) => sum + s.score, 0);
      const averageMarks = parseFloat((totalMarks / (student.subjects.length || 1)).toFixed(1));
      return {
        ...student,
        division,
        points: totalPoints,
        totalMarks,
        averageMarks,
      };
    });

    // Re-rank by form and exam
    const forms = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];
    const exams = Array.from(new Set(studentResults.map((s) => s.examType)));

    forms.forEach((f) => {
      exams.forEach((ex) => {
        const cohort = updated.filter((s) => s.form === f && s.examType === ex);
        cohort.sort((a, b) => b.averageMarks - a.averageMarks);
        cohort.forEach((s, idx) => {
          s.classPosition = idx + 1;
          s.totalStudentsInClass = cohort.length;
        });
      });
    });

    bulkReplaceStudentResults(updated);
    setRecomputeSuccess(true);
    setTimeout(() => setRecomputeSuccess(false), 4000);
  };

  // Add new student result
  const handleCreateStudentResult = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsList: SubjectResult[] = STANDARD_SUBJECTS.map((sub) => {
      const score = newResultData.subjectScores[sub.code] || 60;
      const { grade, points, remarks } = calculateGradeAndPoints(score);
      return {
        code: sub.code,
        name: sub.name,
        nameEn: sub.nameEn,
        score,
        grade,
        points,
        remarks,
      };
    });

    const totalMarks = subjectsList.reduce((sum, s) => sum + s.score, 0);
    const averageMarks = parseFloat((totalMarks / subjectsList.length).toFixed(1));
    const { division, totalPoints } = calculateDivision(subjectsList);

    const newResult: StudentResult = {
      id: `res-${Date.now()}`,
      examNumber: newResultData.examNumber || `S0486/${String(studentResults.length + 1).padStart(4, '0')}/2025`,
      studentName: newResultData.studentName.toUpperCase(),
      gender: newResultData.gender,
      form: newResultData.form,
      stream: newResultData.stream,
      examType: newResultData.examType,
      year: 2025,
      subjects: subjectsList,
      totalMarks,
      averageMarks,
      division,
      points: totalPoints,
      classPosition: studentResults.filter(s => s.form === newResultData.form).length + 1,
      totalStudentsInClass: studentResults.filter(s => s.form === newResultData.form).length + 1,
      conduct: newResultData.conduct,
      headmasterRemarks: newResultData.headmasterRemarks,
      publishDate: new Date().toISOString().split('T')[0],
    };

    addStudentResult(newResult);
    setIsAddResultModalOpen(false);
    alert(language === 'sw' ? 'Matokeo ya mwanafunzi yamehifadhiwa kikamilifu!' : 'Student result added successfully!');
  };

  // Division Badge Helper
  const getDivisionBadge = (div: string) => {
    switch (div) {
      case 'Division I':
        return 'bg-emerald-700 text-white font-black shadow-xs';
      case 'Division II':
        return 'bg-blue-700 text-white font-bold shadow-xs';
      case 'Division III':
        return 'bg-amber-600 text-slate-950 font-bold shadow-xs';
      case 'Division IV':
        return 'bg-orange-600 text-white font-bold';
      default:
        return 'bg-rose-700 text-white font-bold';
    }
  };

  // Grade Badge Helper
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black';
      case 'B':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'C':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
      case 'D':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-800/60 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* ================= MODAL TOP BANNER & ROLE SWITCHER ================= */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-800/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-2xl bg-white/10 border border-[#C9A227]/40 shadow-sm shrink-0">
              <SchoolLogo size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {language === 'sw' ? 'Mfumo wa Ndani wa Kiutawala na Taaluma' : 'Internal Academic & Faculty Gate'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  🔒 {language === 'sw' ? 'Lango la Ndani' : 'Restricted'}
                </span>
              </div>
              <p className="text-xs text-emerald-300/90 font-medium">
                {language === 'sw'
                  ? 'Mfumo Rasmi wa Ndani wa Shule ya Sekondari Uomboni (Kituo cha NECTA S0486) • Marangu, Moshi'
                  : 'Official Uomboni Secondary School Staff Intranet (NECTA S0486) • Marangu, Moshi'}
              </p>
            </div>
          </div>

          {/* Role Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-emerald-700/50 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => {
                setActiveRole('parent');
                setIsAuthenticated(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeRole === 'parent'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Mzazi / Mlezi' : 'Parent'}</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('teacher');
                setIsAuthenticated(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeRole === 'teacher'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Mwalimu (Teacher)' : 'Teacher'}</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('academic_master');
                setIsAuthenticated(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeRole === 'academic_master'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Mkuu wa Taaluma' : 'Academic Master'}</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('student');
                setIsAuthenticated(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === 'sw' ? 'Mwanafunzi' : 'Student'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all cursor-pointer self-end md:self-center"
            title="Funga (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= MODAL MAIN BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/50">

          {/* ========================================================================= */}
          {/* ============================= 1. PARENT ROLE ============================= */}
          {/* ========================================================================= */}
          {activeRole === 'parent' && (
            <div className="space-y-6">
              {/* Parent Sub-View Toggle */}
              <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 shadow-md">
                <button
                  onClick={() => setParentViewMode('official_necta')}
                  className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    parentViewMode === 'official_necta'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Table className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Jedwali Rasmi la NECTA / CSSC (Majina & Namba za Watahiniwa)' : 'Official NECTA / CSSC Results (Candidate Names & Numbers)'}</span>
                </button>
                <button
                  onClick={() => setParentViewMode('report_card')}
                  className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    parentViewMode === 'report_card'
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{language === 'sw' ? 'Ripoti ya Mwanafunzi Binafsi & SMS kwa Walimu' : 'Personal Student Report Card & Teacher SMS'}</span>
                </button>
              </div>

              {parentViewMode === 'official_necta' ? (
                <NectaResultsOfficialView
                  initialExamNumber={selectedParentStudent?.examNumber || parentSearchQuery}
                  onOpenReportCard={(st) => {
                    setSelectedParentStudent(st);
                    setParentViewMode('report_card');
                  }}
                  isAcademicMasterView={false}
                />
              ) : (
                <div className="space-y-6">
                  {/* Parent Student Search & Quick Select Banner */}
                  <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-emerald-800/50 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Users className="w-5 h-5 text-amber-400" />
                          <span>{language === 'sw' ? 'Portal ya Mzazi / Mlezi (Ripoti Binafsi)' : 'Parent Academic Desk & Progress'}</span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          {language === 'sw'
                            ? 'Tazama ripoti ya maendeleo ya kitaaluma, madaraja ya masomo, nafasi darasani, na pakua Hati ya Matokeo (PDF).'
                            : 'Review your child’s academic performance, subject breakdown, class rank, and download official PDF Report Cards.'}
                        </p>
                      </div>

                      {/* Student Switcher / Search Input */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={parentSearchQuery}
                            onChange={(e) => {
                              setParentSearchQuery(e.target.value);
                              handleParentSearch(e.target.value);
                            }}
                            placeholder={language === 'sw' ? 'Namba ya Mtihani au Jina...' : 'Exam No or Name...'}
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Select Student Chips */}
                    {studentResults.length > 0 && (
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
                        <span className="text-slate-400 text-[11px] font-semibold shrink-0">
                          {language === 'sw' ? 'Wanafunzi:' : 'Students:'}
                        </span>
                        {studentResults.slice(0, 5).map((stu) => (
                          <button
                            key={stu.id}
                            onClick={() => setSelectedParentStudent(stu)}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              selectedParentStudent?.id === stu.id
                                ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-xs'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {stu.studentName.split(' ')[0]} ({stu.form}) - {stu.division}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

              {selectedParentStudent ? (
                <div className="space-y-6">
                  {/* Top Student Overview Card */}
                  <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 p-5 rounded-2xl border border-emerald-700/60 shadow-lg flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md shrink-0">
                        {selectedParentStudent.studentName.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-lg font-black text-white">{selectedParentStudent.studentName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${getDivisionBadge(selectedParentStudent.division)}`}>
                            {selectedParentStudent.division}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="font-mono bg-slate-950/70 px-2 py-0.5 rounded-md border border-slate-700 text-amber-300">
                            {selectedParentStudent.examNumber}
                          </span>
                          <span>• {selectedParentStudent.form} ({selectedParentStudent.stream})</span>
                          <span>• {selectedParentStudent.examType}</span>
                        </div>
                      </div>
                    </div>

                    {/* KPI Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'sw' ? 'Wastani' : 'Average'}</span>
                        <span className="text-base font-black text-amber-300">{selectedParentStudent.averageMarks}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'sw' ? 'Pointi' : 'Points'}</span>
                        <span className="text-base font-black text-white">{selectedParentStudent.points} pts</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'sw' ? 'Nafasi' : 'Rank'}</span>
                        <span className="text-base font-black text-emerald-400">{selectedParentStudent.classPosition} / {selectedParentStudent.totalStudentsInClass}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{language === 'sw' ? 'Jumla' : 'Total'}</span>
                        <span className="text-base font-black text-white">{selectedParentStudent.totalMarks}</span>
                      </div>
                    </div>
                  </div>

                  {/* Parent Subtabs */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                    <button
                      onClick={() => setParentActiveTab('marks')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        parentActiveTab === 'marks'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Ripoti ya Masomo (Subject Grades)' : 'Subject Grades'}</span>
                    </button>

                    <button
                      onClick={() => setParentActiveTab('conduct')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        parentActiveTab === 'conduct'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Nidhamu & Maoni ya Walimu' : 'Conduct & Remarks'}</span>
                    </button>

                    <button
                      onClick={() => setParentActiveTab('teachers')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        parentActiveTab === 'teachers'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Wasiliana na Walimu wa Somo' : 'Contact Teachers'}</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => downloadStudentResultSlipPdf(selectedParentStudent)}
                        className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Pakua PDF' : 'Download PDF'}</span>
                      </button>

                      <button
                        onClick={() => printStudentResultSlipDirectly(selectedParentStudent)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Chapisha' : 'Print'}</span>
                      </button>

                      <button
                        onClick={() => setParentViewPdfMode(!parentViewPdfMode)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{parentViewPdfMode ? 'Orodha ya Kawaida' : 'Onyesha Hati Kamili (PDF)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* TAB 1: SUBJECT GRADES OR INLINE PDF VIEWER */}
                  {parentActiveTab === 'marks' && (
                    <div>
                      {parentViewPdfMode ? (
                        <InlineReportCardPdfViewer student={selectedParentStudent} />
                      ) : (
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-emerald-400" />
                              <span>{language === 'sw' ? 'Mchanganuo wa Alama na Madaraja kwa Kila Somo' : 'Subject Breakdown & Grade Allocation'}</span>
                            </h5>
                            <span className="text-xs text-slate-400">
                              {selectedParentStudent.subjects.length} {language === 'sw' ? 'Masomo Yaliyotahiniwa' : 'Assessed Subjects'}
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                                <tr>
                                  <th className="py-3 px-4">Kodi / Somo</th>
                                  <th className="py-3 px-3 text-center">Alama (/100)</th>
                                  <th className="py-3 px-3 text-center">Daraja</th>
                                  <th className="py-3 px-3 text-center">Pointi</th>
                                  <th className="py-3 px-4">Maoni ya Mwalimu wa Somo</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 font-medium">
                                {selectedParentStudent.subjects.map((sub, idx) => (
                                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4">
                                      <div className="font-bold text-white">{sub.name}</div>
                                      <div className="text-[10px] text-slate-400 font-mono">Code: {sub.code} • {sub.nameEn}</div>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      <span className="font-black text-amber-300 text-sm">{sub.score}</span>
                                    </td>
                                    <td className="py-3 px-3 text-center">
                                      <span className={`px-2.5 py-0.5 rounded-md border text-xs font-black ${getGradeBadge(sub.grade)}`}>
                                        {sub.grade}
                                      </span>
                                    </td>
                                    <td className="py-3 px-3 text-center font-mono font-bold text-white">
                                      {sub.points}
                                    </td>
                                    <td className="py-3 px-4 text-slate-300">
                                      {sub.remarks}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: CONDUCT & HEADMASTER REMARKS */}
                  {parentActiveTab === 'conduct' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <ShieldCheck className="w-5 h-5" />
                          <span>{language === 'sw' ? 'Tathmini ya Maadili na Nidhamu' : 'Character & Moral Evaluation'}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[11px] text-slate-400 block uppercase font-bold">{language === 'sw' ? 'Kiwango cha Tabia' : 'Conduct Rating'}</span>
                          <span className="text-base font-black text-amber-400">{selectedParentStudent.conduct}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Mwanafunzi anazingatia kanuni za shule ya Kikatoliki, amani, usafi, na ushirikiano mzuri na wanafunzi wenzake na walimu.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <Award className="w-5 h-5" />
                          <span>{language === 'sw' ? 'Maoni ya Mkuu wa Shule & Taaluma' : 'Headmaster & Academic Remarks'}</span>
                        </div>
                        <blockquote className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40 text-xs text-slate-200 italic leading-relaxed">
                          "{selectedParentStudent.headmasterRemarks}"
                        </blockquote>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Br. Adolph Massawe (Mkuu wa Shule)</span>
                          <span>Tarehe: {selectedParentStudent.publishDate}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTACT TEACHERS VIA SMS */}
                  {parentActiveTab === 'teachers' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                        <h5 className="text-sm font-bold text-white mb-1">
                          {language === 'sw' ? 'Wasiliana na Walimu wa Mwanafunzi Wako' : 'Direct SMS to Subject Teachers'}
                        </h5>
                        <p className="text-xs text-slate-400">
                          {language === 'sw'
                            ? 'Bonyeza kitufe cha "Tuma SMS Moja kwa Moja" kufungua programu yako ya ujumbe na kutuma swali kwa mwalimu.'
                            : 'Click the direct SMS button to immediately compose an SMS to the teacher on your mobile device.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {teachers.map((tch) => (
                          <div key={tch.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={tch.imageUrl}
                                alt={tch.name}
                                className="w-12 h-12 rounded-xl object-cover border border-emerald-600/40"
                              />
                              <div>
                                <h6 className="text-xs font-bold text-white">{tch.name}</h6>
                                <p className="text-[10px] text-amber-300 font-medium">{tch.roleSw}</p>
                                <p className="text-[10px] text-slate-400">{tch.subjects.join(', ')}</p>
                              </div>
                            </div>

                            <a
                              href={`sms:${tch.phone.replace(/\s+/g, '')}?body=${encodeURIComponent(
                                `Habari ${tch.name}, mimi ni mzazi wa ${selectedParentStudent.studentName} (${selectedParentStudent.form}). Ningependa kufahamu maendeleo yake katika somo la ${tch.subjects[0] || 'Taaluma'}.`
                              )}`}
                              className="w-full py-2 px-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700/60 text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                              <span>{language === 'sw' ? 'Tuma SMS kwa Mwalimu' : 'Send SMS to Teacher'}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
                  <p>{language === 'sw' ? 'Mwanafunzi hakupatikana. Tafadhali andika namba ya mtihani au jina hapo juu.' : 'No student found. Please type exam number or name above.'}</p>
                </div>
              )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ============================= 2. TEACHER ROLE ============================ */}
          {/* ========================================================================= */}
          {activeRole === 'teacher' && (
            <div className="space-y-6">
              {!isAuthenticated ? (
                /* Teacher World-Class Authentication View */
                <div className="py-2">
                  <WorldClassLoginView
                    activeRole="teacher"
                    onRoleChange={(role) => {
                      if (role === 'academic_master') {
                        setActiveRole('academic_master');
                      }
                    }}
                    availableTeachers={teachers}
                    onDirectTeacherLogin={handleTeacherDirectLogin}
                    onDirectAcademicLogin={handleAcademicDirectLogin}
                    onGoogleSignIn={handleTeacherGoogleSignIn}
                    isSigningIn={isTeacherGoogleSigningIn}
                    authError={teacherAuthError ? teacherEmailError : undefined}
                    currentUser={teacherGoogleUser}
                    onContinueToPortal={() => setIsAuthenticated(true)}
                    isModal={false}
                  />
                </div>
              ) : (
                /* Teacher Authenticated Workspace */
                <div className="space-y-6">
                  {/* Teacher Header Bar */}
                  <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-emerald-800/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {selectedTeacher && (
                        <img
                          src={selectedTeacher.imageUrl}
                          alt={selectedTeacher.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/70 shadow-md"
                        />
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-black text-white">{selectedTeacher?.name}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono border border-slate-700">
                            {teacherEmailInput || 'walimu@uomboni.sc.tz'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 text-[10px] font-black uppercase tracking-wider">
                            {selectedTeacher?.department}
                          </span>
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {language === 'sw' ? 'Mfumo wa Usakinishaji Upo Tayari' : 'Auto-Publish Active'}
                          </span>
                        </div>
                        <p className="text-xs text-amber-300 font-semibold mt-0.5">
                          {selectedTeacher?.roleSw} • Masomo: {selectedTeacher?.subjects.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onOpenInstallApp && (
                        <button
                          onClick={onOpenInstallApp}
                          className="px-3.5 py-2 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-black flex items-center gap-1.5 border border-emerald-600/60 transition-all cursor-pointer shadow-sm"
                          title={language === 'sw' ? 'Sakinisha App kwenye simu/kompyuta yako kwa upakiaji wa haraka' : 'Install app on phone/PC for instant access'}
                        >
                          <Download className="w-3.5 h-3.5 text-amber-300" />
                          <span>{language === 'sw' ? '📲 Sakinisha App' : '📲 Install App'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer shadow-sm"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Toka (Logout)' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Teacher Publishing Hub Navigation Tabs */}
                  <div className="flex flex-wrap items-center justify-start sm:justify-center gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
                    <button
                      onClick={() => setTeacherActiveTab('excel_upload')}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        teacherActiveTab === 'excel_upload'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-102 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                      <span>{language === 'sw' ? '📁 Pakia Excel & Sakinisha' : '📁 Upload Excel & Publish'}</span>
                    </button>

                    <button
                      onClick={() => setTeacherActiveTab('subject_entry')}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        teacherActiveTab === 'subject_entry'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-102 font-black ring-2 ring-amber-400/50'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>{language === 'sw' ? '✍️ Ingiza Alama za Somo Lako Pekee' : '✍️ My Assigned Subject Marks'}</span>
                    </button>

                    <button
                      onClick={() => setTeacherActiveTab('master_grid')}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        teacherActiveTab === 'master_grid'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-102 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Table className="w-4 h-4 text-amber-400" />
                      <span>{language === 'sw' ? '📑 Daftari la Masomo Yote' : '📑 All-Subjects Matrix'}</span>
                    </button>

                    <button
                      onClick={() => setTeacherActiveTab('single_add')}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        teacherActiveTab === 'single_add'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-102 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>{language === 'sw' ? '➕ Ongeza Mwanafunzi' : '➕ Add Single Student'}</span>
                    </button>

                    <button
                      onClick={() => setTeacherActiveTab('broadcast')}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        teacherActiveTab === 'broadcast'
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md scale-102 font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>{language === 'sw' ? '📢 Tangaza kwa Wazazi' : '📢 Parent Broadcast'}</span>
                    </button>
                  </div>

                  {/* SUCCESS RECEIPT / AUDIT BADGE */}
                  {lastPublishedAudit && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-2 border-emerald-500/80 shadow-2xl space-y-3 animate-in fade-in zoom-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/60">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                            <CheckCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-white flex items-center gap-2">
                              <span>{language === 'sw' ? 'Matokeo Yamejisakinisha & Yamechapishwa Kikamilifu!' : 'Results Successfully Published Live!'}</span>
                              <span className="px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-300 border border-emerald-500 text-[10px] font-bold">
                                Live on Portal
                              </span>
                            </h5>
                            <p className="text-xs text-slate-300">
                              {language === 'sw'
                                ? `Wanafunzi ${lastPublishedAudit.count} wamesakinishwa kwenye mfumo kwa ${lastPublishedAudit.examType} (${lastPublishedAudit.form}).`
                                : `${lastPublishedAudit.count} students live published for ${lastPublishedAudit.examType} (${lastPublishedAudit.form}).`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-slate-400 block font-mono">Muda wa Usakinishaji:</span>
                          <span className="text-xs font-black text-amber-300 font-mono">{lastPublishedAudit.timestamp}</span>
                        </div>
                      </div>

                      {/* Division Statistics Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-center">
                          <span className="text-[10px] text-slate-400 block font-bold">Division I</span>
                          <span className="text-base font-black text-emerald-400">{lastPublishedAudit.divisionStats['Division I'] || 0}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-center">
                          <span className="text-[10px] text-slate-400 block font-bold">Division II</span>
                          <span className="text-base font-black text-blue-400">{lastPublishedAudit.divisionStats['Division II'] || 0}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-center">
                          <span className="text-[10px] text-slate-400 block font-bold">Division III</span>
                          <span className="text-base font-black text-amber-400">{lastPublishedAudit.divisionStats['Division III'] || 0}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-center">
                          <span className="text-[10px] text-slate-400 block font-bold">Division IV</span>
                          <span className="text-base font-black text-orange-400">{lastPublishedAudit.divisionStats['Division IV'] || 0}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-800/40 text-center">
                          <span className="text-[10px] text-slate-400 block font-bold">Division 0</span>
                          <span className="text-base font-black text-rose-400">{lastPublishedAudit.divisionStats['Division 0'] || 0}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-300">
                        <span className="flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Wazazi na wanafunzi wanaweza kutafuta matokeo haya na kupakua Hati za PDF mara moja.</span>
                        </span>
                        <button
                          onClick={() => setTeacherActiveTab('broadcast')}
                          className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Tuma Taarifa kwa Wazazi sasa →</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* TAB 1: EXCEL / CSV UPLOAD & 1-CLICK INSTANT SELF-INSTALLATION */}
                  {/* ========================================================================= */}
                  {teacherActiveTab === 'excel_upload' && (
                    <div className="space-y-5">
                      {/* Guidance and Template Download Bar */}
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h5 className="text-sm font-black text-white flex items-center gap-2">
                            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                            <span>{language === 'sw' ? 'Pakia Faili la Matokeo ya Excel / CSV' : 'Bulk Results Spreadsheet Uploader'}</span>
                          </h5>
                          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                            {language === 'sw'
                              ? 'Pakia faili lolote la Excel (.xlsx, .xls) au CSV lenye namba za mitihani na alama za masomo. Mfumo utakokotoa Madaraja, Division I-0, Pointi 7 Bora, na Wastani kiotomatiki kisha kujisakinisha mtandaoni.'
                              : 'Upload an Excel or CSV file. The system will automatically compute grades, divisions, best 7 points, and publish live to the portal.'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={downloadExcelTemplate}
                            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                          >
                            <FileDown className="w-4 h-4 text-amber-400" />
                            <span>{language === 'sw' ? 'Pakua Kiolezo cha Excel' : 'Download Template (.xlsx)'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleLoadDemoBatch}
                            className="px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                          >
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'sw' ? 'Weka Data ya Mfano (Demo)' : 'Load Demo Batch (10 Students)'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Drag and Drop / File Input Box */}
                      <div className="relative p-8 rounded-3xl bg-slate-950/90 border-2 border-dashed border-emerald-700/60 hover:border-amber-400 transition-all text-center space-y-4">
                        <input
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleExcelFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="teacher-excel-upload-input"
                        />
                        <div className="w-16 h-16 rounded-2xl bg-emerald-900/60 text-amber-300 border border-emerald-600/50 flex items-center justify-center mx-auto shadow-lg">
                          <Upload className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                          <h6 className="text-sm font-bold text-white">
                            {uploadFileName ? (
                              <span className="text-amber-300 font-mono font-black">{uploadFileName}</span>
                            ) : language === 'sw' ? (
                              'Buruta na uachie faili la Excel/CSV hapa, au Bonyeza Kuteua'
                            ) : (
                              'Drag & drop your Excel/CSV spreadsheet here, or Click to Browse'
                            )}
                          </h6>
                          <p className="text-xs text-slate-400 mt-1">
                            {language === 'sw'
                              ? 'Inasaidia safu za: EXAM_NO, STUDENT_NAME, GENDER, FORM, CIV, HIST, GEO, KISW, ENG, PHY, CHEM, BIO, BAM, RE'
                              : 'Supports columns: EXAM_NO, STUDENT_NAME, GENDER, FORM, CIV, HIST, GEO, KISW, ENG, PHY, CHEM, BIO, BAM, RE'}
                          </p>
                        </div>

                        {isParsingExcel && (
                          <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-bold">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{language === 'sw' ? 'Inakagua na kuhesabu madaraja...' : 'Parsing spreadsheet and computing grades...'}</span>
                          </div>
                        )}

                        {excelParseError && (
                          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{excelParseError}</span>
                          </div>
                        )}

                        {excelParseSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 max-w-xl mx-auto">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>{excelParseSuccess}</span>
                          </div>
                        )}
                      </div>

                      {/* Live Preview & Instant Installation Action Button */}
                      {parsedExcelStudents.length > 0 && (
                        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-5">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                            <div>
                              <h5 className="text-sm font-black text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span>{language === 'sw' ? 'Muhtasari wa Matokeo Yaliyohakikiwa (Tayari Kusakinishwa)' : 'Validated Results Preview (Ready for Live Install)'}</span>
                              </h5>
                              <p className="text-xs text-slate-400">
                                Wanafunzi {parsedExcelStudents.length} • {parsedExcelStudents[0]?.examType} • {parsedExcelStudents[0]?.form}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                              <button
                                onClick={() => handleInstantPublishExcel('merge')}
                                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-102 flex items-center gap-2.5 cursor-pointer border border-emerald-400/50"
                              >
                                <CheckCheck className="w-5 h-5 text-slate-950" />
                                <span>{language === 'sw' ? '🚀 SAKINISHA & CHAPISHA MATOKEO MOJA KWA MOJA' : '🚀 INSTANT 1-CLICK PUBLISH TO SYSTEM'}</span>
                              </button>

                              <button
                                onClick={() => handleInstantPublishExcel('replace')}
                                className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                title="Futa ya zamani na uweke haya mapya"
                              >
                                <span>{language === 'sw' ? 'Badilisha Yote' : 'Replace All'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Preview Data Table */}
                          <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-950/90 text-slate-400 uppercase text-[10px] font-bold sticky top-0 border-b border-slate-800">
                                <tr>
                                  <th className="py-2.5 px-3">#</th>
                                  <th className="py-2.5 px-3">Namba ya Mtihani</th>
                                  <th className="py-2.5 px-4">Jina la Mwanafunzi</th>
                                  <th className="py-2.5 px-2 text-center">Jinsia</th>
                                  <th className="py-2.5 px-3 text-center">Wastani</th>
                                  <th className="py-2.5 px-3 text-center">Daraja (Div)</th>
                                  <th className="py-2.5 px-3 text-center">Pointi</th>
                                  <th className="py-2.5 px-4">Masomo na Alama</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800/60 font-medium">
                                {parsedExcelStudents.map((st, idx) => (
                                  <tr key={st.id || idx} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                                    <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">{st.examNumber}</td>
                                    <td className="py-2.5 px-4 font-bold text-white">{st.studentName}</td>
                                    <td className="py-2.5 px-2 text-center text-slate-400">{st.gender}</td>
                                    <td className="py-2.5 px-3 text-center font-black text-emerald-400">{st.averageMarks}%</td>
                                    <td className="py-2.5 px-3 text-center">
                                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-black ${getDivisionBadge(st.division)}`}>
                                        {st.division}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white">{st.points}</td>
                                    <td className="py-2.5 px-4 text-[11px] text-slate-300">
                                      {st.subjects.map(s => `${s.name.substring(0, 4)}:${s.score}(${s.grade})`).join(' | ')}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* TAB 2: SINGLE SUBJECT MARK ENTRY GRADEBOOK (NECTA / CSSC WORKFLOW) */}
                  {/* ========================================================================= */}
                  {teacherActiveTab === 'subject_entry' && (
                    <AcademicSubjectEntryModule
                      mode="teacher"
                      currentTeacherName={selectedTeacher?.name || 'Mwl. Yohana Bahati (Mtaaluma)'}
                      assignedSubjects={selectedTeacher?.subjects || ['Chemistry', 'Biology', 'Physics']}
                      onOpenResultsPreview={() => {
                        setActiveRole('parent');
                        setParentViewMode('official_necta');
                      }}
                    />
                  )}

                  {/* ========================================================================= */}
                  {/* TAB 3: ALL-SUBJECTS MASTER MATRIX (DAFTARI LA MASOMO YOTE) */}
                  {/* ========================================================================= */}
                  {teacherActiveTab === 'master_grid' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <h5 className="text-sm font-black text-white flex items-center gap-2">
                            <Table className="w-4 h-4 text-emerald-400" />
                            <span>{language === 'sw' ? 'Daftari Kamili la Masomo Yote (Master Marksheet Matrix)' : 'All-Subjects Master Matrix'}</span>
                          </h5>
                          <p className="text-xs text-slate-400">
                            {language === 'sw'
                              ? `Mwalimu ${selectedTeacher?.name}: Masomo yako pekee ya kuingiza maksi ni: ${selectedTeacher?.subjects?.join(', ') || 'Somo Lako'}. Masomo mengine yanalindwa kwa usalama.`
                              : `Teacher ${selectedTeacher?.name}: Your assigned subjects are: ${selectedTeacher?.subjects?.join(', ')}. Other subjects are securely locked.`}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportResultsToExcel(broadsheetResults, `UOMBONI_MASTER_MARKSHEET_${broadsheetForm}.xlsx`)}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Pakua Excel' : 'Export Excel'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Teacher assigned subject reminder badge */}
                      <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-600/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>
                            {language === 'sw'
                              ? `Uthibitisho wa Ulinzi: Umeidhinishwa kuingiza alama kwa somo la ${selectedTeacher?.subjects?.join(', ') || 'Somo Lako'} pekee.`
                              : `Access Controlled: You may only input scores for your assigned subjects (${selectedTeacher?.subjects?.join(', ')}).`}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider self-start sm:self-center">
                          ★ Somo Lako Pekee
                        </span>
                      </div>

                      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950/95 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                              <tr>
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Namba</th>
                                <th className="py-2.5 px-4 min-w-44">Jina la Mwanafunzi</th>
                                {STANDARD_SUBJECTS.map((sub) => (
                                  <th key={sub.code} className="py-2.5 px-2 text-center font-mono">
                                    {sub.name.substring(0, 4).toUpperCase()}
                                  </th>
                                ))}
                                <th className="py-2.5 px-3 text-center">Jumla</th>
                                <th className="py-2.5 px-3 text-center">Wastani</th>
                                <th className="py-2.5 px-3 text-center">Pointi</th>
                                <th className="py-2.5 px-3 text-center">Division</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {broadsheetResults.map((student, idx) => (
                                <tr key={`${student.id}-${student.examNumber || idx}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                                  <td className="py-2.5 px-3 text-slate-500 font-mono">{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">{student.examNumber}</td>
                                  <td className="py-2.5 px-4 font-bold text-white">{student.studentName}</td>
                                  {STANDARD_SUBJECTS.map((sub) => {
                                    const match = student.subjects.find(
                                      (s) => s.code === sub.code || s.name.toLowerCase() === sub.name.toLowerCase()
                                    );
                                    return (
                                      <td key={sub.code} className="py-2.5 px-2 text-center font-mono text-slate-200">
                                        {match ? (
                                          <span className="font-bold">
                                            {match.score}
                                            <span className="text-[10px] text-amber-400 ml-0.5">{match.grade}</span>
                                          </span>
                                        ) : (
                                          <span className="text-slate-600">-</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                  <td className="py-2.5 px-3 text-center font-mono text-slate-300">{student.totalMarks}</td>
                                  <td className="py-2.5 px-3 text-center font-black text-emerald-400 font-mono">{student.averageMarks}%</td>
                                  <td className="py-2.5 px-3 text-center font-bold text-white font-mono">{student.points}</td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${getDivisionBadge(student.division)}`}>
                                      {student.division}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* TAB 4: SINGLE STUDENT QUICK POST FORM */}
                  {/* ========================================================================= */}
                  {teacherActiveTab === 'single_add' && (
                    <form onSubmit={handleTeacherSingleStudentPublish} className="space-y-5">
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="pb-3 border-b border-slate-800">
                          <h5 className="text-sm font-black text-white flex items-center gap-2">
                            <Plus className="w-5 h-5 text-amber-400" />
                            <span>{language === 'sw' ? 'Ongeza Matokeo ya Mwanafunzi Mmoja & Sakinisha Moja kwa Moja' : 'Quick Single Student Result Posting'}</span>
                          </h5>
                          <p className="text-xs text-slate-400">
                            {language === 'sw'
                              ? 'Jaza taarifa za mwanafunzi na alama zake za masomo kisha bonyeza Sakinisha ili yatokee mtandaoni mara moja.'
                              : 'Fill student info and subject marks to instantly publish live to the portal.'}
                          </p>
                        </div>

                        {/* Quick Registered Student Selector */}
                        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                            <Users className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{language === 'sw' ? 'Chagua Mwanafunzi Aliyesajiliwa (Orodha ya Shule):' : 'Pick Registered Student:'}</span>
                          </div>
                          <select
                            onChange={(e) => {
                              const found = students.find((s) => s.id === e.target.value || s.examNumber === e.target.value);
                              if (found) {
                                setTeacherSingleStudentDraft((p) => ({
                                  ...p,
                                  studentName: found.fullName,
                                  examNumber: found.examNumber,
                                  gender: (found.gender as any) || 'M',
                                  form: (found.form as any) || p.form,
                                  stream: (found.stream as any) || 'Science',
                                }));
                              }
                            }}
                            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-hidden focus:border-amber-400 cursor-pointer"
                          >
                            <option value="">-- {language === 'sw' ? 'Chagua Mwanafunzi...' : 'Choose Student...'} --</option>
                            {students
                              .filter((s) => s.form === teacherSingleStudentDraft.form)
                              .map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.fullName} ({s.examNumber}) - {s.stream}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">Jina Kamili la Mwanafunzi *</label>
                            <input
                              type="text"
                              required
                              placeholder="Jina kamili la mwanafunzi..."
                              value={teacherSingleStudentDraft.studentName}
                              onChange={(e) => setTeacherSingleStudentDraft((p) => ({ ...p, studentName: e.target.value }))}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white uppercase focus:outline-hidden focus:border-amber-400 font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">Namba ya Mtihani (Hiari)</label>
                            <input
                              type="text"
                              placeholder="S0486/0125/2025"
                              value={teacherSingleStudentDraft.examNumber}
                              onChange={(e) => setTeacherSingleStudentDraft((p) => ({ ...p, examNumber: e.target.value }))}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-amber-300 uppercase focus:outline-hidden focus:border-amber-400 font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">Kidato (Form)</label>
                            <select
                              value={teacherSingleStudentDraft.form}
                              onChange={(e) => setTeacherSingleStudentDraft((p) => ({ ...p, form: e.target.value as any }))}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                            >
                              <option value="Form 1">Form 1</option>
                              <option value="Form 2">Form 2</option>
                              <option value="Form 3">Form 3</option>
                              <option value="Form 4">Form 4</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-300 block mb-1">Jinsia</label>
                            <select
                              value={teacherSingleStudentDraft.gender}
                              onChange={(e) => setTeacherSingleStudentDraft((p) => ({ ...p, gender: e.target.value as any }))}
                              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold focus:outline-hidden focus:border-amber-400"
                            >
                              <option value="M">Mvulana (Male - M)</option>
                              <option value="F">Msichana (Female - F)</option>
                            </select>
                          </div>
                        </div>

                        {/* Subject Marks Entry Grid - Filtered Strictly to Teacher's Assigned Subject(s) */}
                        <div className="pt-3">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-amber-300 block">
                              {language === 'sw'
                                ? `Alama za Somo Lako Pekee (${selectedTeacher?.subjects.join(', ')}):`
                                : `Assigned Subject Mark Entry (${selectedTeacher?.subjects.join(', ')}):`}
                            </label>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                              🔒 Somo Lako Pekee
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {STANDARD_SUBJECTS.filter((sub) => {
                              const assigned = selectedTeacher?.subjects || [];
                              return assigned.some(
                                (a) =>
                                  a.toLowerCase() === sub.name.toLowerCase() ||
                                  sub.name.toLowerCase().includes(a.toLowerCase()) ||
                                  a.toLowerCase().includes(sub.name.toLowerCase())
                              );
                            }).map((sub) => {
                              const score = teacherSingleStudentDraft.subjectScores[sub.code] ?? 70;
                              const { grade } = calculateGradeAndPoints(score);
                              return (
                                <div key={sub.code} className="p-3.5 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 space-y-2 shadow-md">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="font-black text-white">{sub.name} ({sub.code})</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black">
                                      ★ Somo Lako
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={score}
                                      onChange={(e) => {
                                        const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                        setTeacherSingleStudentDraft((prev) => ({
                                          ...prev,
                                          subjectScores: {
                                            ...prev.subjectScores,
                                            [sub.code]: val,
                                          },
                                        }));
                                      }}
                                      className="flex-1 p-2 text-center font-black text-lg rounded-xl bg-slate-900 border border-slate-700 text-amber-300 focus:outline-hidden focus:border-amber-400"
                                    />
                                    <span className={`px-2.5 py-1.5 rounded-xl text-xs font-black border ${getGradeBadge(grade)}`}>
                                      {grade}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-emerald-400 font-medium">
                                    ✓ Umeidhinishwa kuingiza alama za somo hili
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-3 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all hover:scale-102 flex items-center gap-2 cursor-pointer border border-emerald-400/40"
                          >
                            <CheckCheck className="w-5 h-5" />
                            <span>{language === 'sw' ? '🚀 SAKINISHA MWANAFUNZI HUYU MOJA KWA MOJA' : '🚀 PUBLISH STUDENT RESULTS LIVE'}</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* ========================================================================= */}
                  {/* TAB 5: PARENT SMS / WHATSAPP BROADCAST ANNOUNCEMENT DESK */}
                  {/* ========================================================================= */}
                  {teacherActiveTab === 'broadcast' && (
                    <div className="space-y-5">
                      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                            <Send className="w-6 h-6" />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-white">
                              {language === 'sw' ? 'Kitovu cha Kutangaza Matokeo kwa Wazazi (SMS / WhatsApp)' : 'Parent Notification & Broadcast Desk'}
                            </h5>
                            <p className="text-xs text-slate-400">
                              {language === 'sw'
                                ? 'Wajulishe wazazi wote mara moja kuwa matokeo ya mitihani yamechapishwa mtandaoni.'
                                : 'Send instant WhatsApp or SMS announcements to notify parents that exam results are published.'}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-800/40 space-y-3">
                          <span className="text-[11px] font-bold text-emerald-400 block uppercase">
                            Ujumbe Rasmi wa Shule (Tayari Kutumwa):
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                            "Shule ya Sekondari Uomboni (NECTA S0486) inapenda kuwataarifu wazazi wote kuwa matokeo ya {teacherSelectedExam} ({teacherSelectedForm}) yamechapishwa mtandaoni. Unaweza kuangalia matokeo na kupakua Hati Rasmi ya PDF ya mwanao kupitia tovuti yetu: https://uombonisec.ac.tz/results. Karibuni sana."
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                              onClick={() => {
                                const text = `Shule ya Sekondari Uomboni (NECTA S0486) inapenda kuwataarifu wazazi wote kuwa matokeo ya ${teacherSelectedExam} (${teacherSelectedForm}) yamechapishwa mtandaoni. Unaweza kuangalia matokeo na kupakua Hati Rasmi ya PDF ya mwanao kupitia tovuti yetu: https://uombonisec.ac.tz/results. Karibuni sana.`;
                                navigator.clipboard?.writeText(text);
                                setCopiedBroadcastText(true);
                                setTimeout(() => setCopiedBroadcastText(false), 3000);
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-pointer border border-slate-700"
                            >
                              <Share2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>{copiedBroadcastText ? '✅ Ujumbe Umenakiliwa!' : 'Nakili Ujumbe (Copy Text)'}</span>
                            </button>

                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `Shule ya Sekondari Uomboni (NECTA S0486) inapenda kuwataarifu wazazi wote kuwa matokeo ya ${teacherSelectedExam} (${teacherSelectedForm}) yamechapishwa mtandaoni. Unaweza kuangalia matokeo na kupakua Hati Rasmi ya PDF ya mwanao kupitia tovuti yetu: https://uombonisec.ac.tz/results. Karibuni sana.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Tuma kwenye WhatsApp Groups za Wazazi</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ======================= 3. ACADEMIC MASTER ROLE ========================= */}
          {/* ========================================================================= */}
          {activeRole === 'academic_master' && (
            <div className="space-y-6">
              {!isAuthenticated ? (
                /* Academic Master World-Class Authentication View */
                <div className="py-2">
                  <WorldClassLoginView
                    activeRole="academic_master"
                    onRoleChange={(role) => {
                      if (role === 'teacher') {
                        setActiveRole('teacher');
                      }
                    }}
                    availableTeachers={teachers}
                    onDirectTeacherLogin={handleTeacherDirectLogin}
                    onDirectAcademicLogin={handleAcademicDirectLogin}
                    onGoogleSignIn={handleAcademicGoogleSignIn}
                    isSigningIn={isAcademicGoogleSigningIn}
                    authError={academicAuthError ? academicEmailError : undefined}
                    currentUser={academicGoogleUser}
                    onContinueToPortal={() => setIsAuthenticated(true)}
                    isModal={false}
                  />
                </div>
              ) : (
                /* Academic Master Authenticated Workspace */
                <div className="space-y-6">
                  {/* Academic Master Controls Header */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-800/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-white">
                          {language === 'sw' ? 'Ofisi ya Mkuu wa Taaluma (Mwl. Yohana Bahati / Madam Adela Manyanga)' : 'Office of the Academic Masters (Mwl. Yohana Bahati & Madam Adela Manyanga)'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 text-[10px] font-mono border border-slate-700">
                          {academicEmailInput || 'academic@uomboni.sc.tz'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                          Exams Dean
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {language === 'sw'
                          ? 'Usimamizi wa Mitihani ya NECTA, Mock, Midterms, na Ufunguzi wa Ripoti za Wanafunzi.'
                          : 'Comprehensive examination management, broadsheet exports, division engine, and published books.'}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {recomputeSuccess && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Division zimehesabiwa upya!</span>
                        </span>
                      )}

                      <button
                        onClick={handleRecomputeAllDivisions}
                        className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                        title="Kokotoa Upya Division & Nafasi za Darasa kulingana na masomo 7 bora ya NECTA"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Kokotoa Upya Division (Best 7)' : 'Auto-Compute Divisions'}</span>
                      </button>

                      <button
                        onClick={() => setIsAddResultModalOpen(true)}
                        className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Ongeza Matokeo' : 'Add Result'}</span>
                      </button>

                      <button
                        onClick={() => setIsAuthenticated(false)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Toka' : 'Logout'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Academic Master Subtabs */}
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
                    <button
                      onClick={() => setAcademicActiveTab('teachers_admin')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'teachers_admin'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? '👨‍🏫 Usimamizi wa Walimu & Masomo' : 'Teacher Marks Admin'}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('necta_sheet')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'necta_sheet'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? '🏛️ Matokeo Rasmi NECTA / CSSC & Uchapishaji' : 'Official NECTA Results Sheet'}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('students_roster')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'students_roster'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? `📋 Daftari la Wanafunzi (${students.length})` : `📋 Student Register (${students.length})`}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('directives')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'directives'
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? '📢 Maelekezo & Ruhusa za Walimu' : '📢 Directives & Entry Permissions'}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('overview')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'overview'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Muhtasari wa Ufaulu' : 'Performance Overview'}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('broadsheet')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'broadsheet'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Broadsheet ya Darasa' : 'Class Broadsheet'}</span>
                    </button>

                    <button
                      onClick={() => setAcademicActiveTab('pdfBooks')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                        academicActiveTab === 'pdfBooks'
                          ? 'bg-emerald-700 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'sw' ? 'Vitabu vya Matokeo PDF' : 'Published Results Library'}</span>
                    </button>
                  </div>

                  {/* TAB 0: TEACHER MARKS ADMIN & WORKFLOW (ACADEMIC MASTER AS ADMIN) */}
                  {academicActiveTab === 'teachers_admin' && (
                    <AcademicSubjectEntryModule
                      mode="academic_master"
                      currentTeacherName={academicEmailInput || 'Mwl. Yohana Bahati / Madam Adela Manyanga (Taaluma)'}
                      onOpenResultsPreview={() => {
                        setAcademicActiveTab('necta_sheet');
                      }}
                    />
                  )}

                  {/* TAB 0B: NECTA / CSSC OFFICIAL BROADSHEET & PARENT ACCESS PUBLISHER */}
                  {academicActiveTab === 'necta_sheet' && (
                    <NectaResultsOfficialView isAcademicMasterView={true} />
                  )}

                  {/* TAB 0C: STUDENT ROSTER & NOMINAL ROLL FOR ACADEMIC MASTER */}
                  {academicActiveTab === 'students_roster' && (
                    <AcademicStudentRosterTab
                      onSelectStudentForMarks={(student) => {
                        setTeacherSelectedForm(student.form as any);
                        setAcademicActiveTab('teachers_admin');
                      }}
                      onViewStudentResults={(identifier) => {
                        const res = studentResults.find(
                          (r) =>
                            r.examNumber.toLowerCase() === identifier.toLowerCase() ||
                            (r.studentId && r.studentId.toLowerCase() === identifier.toLowerCase())
                        );
                        if (res) {
                          setActiveStudentResult(res);
                          setActiveRole('student');
                        }
                      }}
                    />
                  )}

                  {/* TAB 0D: DIRECTIVES & PERMISSION CONTROL FOR TEACHERS */}
                  {academicActiveTab === 'directives' && (
                    <AcademicDirectivesManagerTab language={language} />
                  )}

                  {/* TAB 1: ACADEMIC PERFORMANCE OVERVIEW */}
                  {academicActiveTab === 'overview' && (
                    <div className="space-y-4">
                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                          <span className="text-xs text-slate-400 uppercase font-bold block">{language === 'sw' ? 'Watahiniwa Wote' : 'Total Candidates'}</span>
                          <span className="text-2xl font-black text-white mt-1 block">{studentResults.length}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-800/60">
                          <span className="text-xs text-emerald-400 uppercase font-bold block">Division I</span>
                          <span className="text-2xl font-black text-emerald-300 mt-1 block">
                            {studentResults.filter(s => s.division === 'Division I').length}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-800/60">
                          <span className="text-xs text-blue-400 uppercase font-bold block">Division II & III</span>
                          <span className="text-2xl font-black text-blue-300 mt-1 block">
                            {studentResults.filter(s => s.division === 'Division II' || s.division === 'Division III').length}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-900 border border-amber-800/60">
                          <span className="text-xs text-amber-400 uppercase font-bold block">{language === 'sw' ? 'Wastani wa Shule' : 'School Average'}</span>
                          <span className="text-2xl font-black text-amber-300 mt-1 block">
                            {(studentResults.reduce((acc, s) => acc + s.averageMarks, 0) / (studentResults.length || 1)).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Top Ranked Students Table */}
                      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span>{language === 'sw' ? 'Wanafunzi Wanaoongoza Kitaaluma (Top Performers)' : 'Top Academic Performers'}</span>
                        </h5>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                              <tr>
                                <th className="py-2 px-3">Nafasi</th>
                                <th className="py-2 px-4">Jina</th>
                                <th className="py-2 px-3">Kidato</th>
                                <th className="py-2 px-3">Wastani</th>
                                <th className="py-2 px-3">Division</th>
                                <th className="py-2 px-3">Pointi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {[...studentResults]
                                .sort((a, b) => b.averageMarks - a.averageMarks)
                                .slice(0, 5)
                                .map((s, idx) => (
                                  <tr key={s.id} className="hover:bg-slate-800/40">
                                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">#{idx + 1}</td>
                                    <td className="py-2.5 px-4 font-bold text-white">{s.studentName}</td>
                                    <td className="py-2.5 px-3 text-slate-300">{s.form}</td>
                                    <td className="py-2.5 px-3 font-bold text-emerald-400">{s.averageMarks}%</td>
                                    <td className="py-2.5 px-3">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getDivisionBadge(s.division)}`}>
                                        {s.division}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-white">{s.points}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CLASS BROADSHEET TABLE */}
                  {academicActiveTab === 'broadsheet' && (
                    <div className="space-y-4">
                      {/* Broadsheet Filter & Export Bar */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={broadsheetForm}
                            onChange={(e) => setBroadsheetForm(e.target.value)}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                          >
                            <option value="ALL">Madarasa Yote (All Forms)</option>
                            <option value="Form 1">Kidato cha 1 (Form 1)</option>
                            <option value="Form 2">Kidato cha 2 (Form 2)</option>
                            <option value="Form 3">Kidato cha 3 (Form 3)</option>
                            <option value="Form 4">Kidato cha 4 (Form 4)</option>
                          </select>

                          <select
                            value={broadsheetExam}
                            onChange={(e) => setBroadsheetExam(e.target.value)}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
                          >
                            <option value="ALL">Mitihani Yote</option>
                            <option value="NECTA Mock 2025">NECTA Mock 2025</option>
                            <option value="Mid-Term Exam 2025">Mid-Term Exam 2025</option>
                            <option value="Annual Examination 2025">Annual Exam 2025</option>
                            <option value="Pre-NECTA 2025">Pre-NECTA 2025</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => downloadClassBroadsheetPdf(broadsheetResults, `BROADSHEET YA MATOKEO - ${broadsheetForm}`)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'sw' ? 'Pakua Broadsheet (PDF)' : 'Download PDF Broadsheet'}</span>
                          </button>

                          <button
                            onClick={() => exportResultsToExcel(broadsheetResults, `BROADSHEET_${broadsheetForm}_${Date.now()}.xlsx`)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                            <span>{language === 'sw' ? 'Hamisha Excel (.xlsx)' : 'Export Excel'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Broadsheet Grid */}
                      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                              <tr>
                                <th className="py-2.5 px-3">#</th>
                                <th className="py-2.5 px-3">Namba</th>
                                <th className="py-2.5 px-4">Jina</th>
                                <th className="py-2.5 px-2 text-center">CIV</th>
                                <th className="py-2.5 px-2 text-center">HIST</th>
                                <th className="py-2.5 px-2 text-center">GEO</th>
                                <th className="py-2.5 px-2 text-center">KISW</th>
                                <th className="py-2.5 px-2 text-center">ENG</th>
                                <th className="py-2.5 px-2 text-center">PHY</th>
                                <th className="py-2.5 px-2 text-center">CHEM</th>
                                <th className="py-2.5 px-2 text-center">BIO</th>
                                <th className="py-2.5 px-2 text-center">MATH</th>
                                <th className="py-2.5 px-2 text-center">REL</th>
                                <th className="py-2.5 px-2 text-center">Wastani</th>
                                <th className="py-2.5 px-2 text-center">Points</th>
                                <th className="py-2.5 px-3 text-center">Division</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 font-medium">
                              {broadsheetResults.map((student, idx) => {
                                const getSubGrade = (code: string) => {
                                  const s = student.subjects.find(sub => sub.code === code || sub.name.toLowerCase().includes(code.toLowerCase()));
                                  return s ? s.grade : '-';
                                };

                                return (
                                  <tr key={`${student.id}-${student.examNumber || idx}-${idx}`} className="hover:bg-slate-800/40">
                                    <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                                    <td className="py-2 px-3 font-mono text-amber-300 text-[11px]">{student.examNumber}</td>
                                    <td className="py-2 px-4 font-bold text-white whitespace-nowrap">{student.studentName}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('011')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('012')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('013')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('021')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('022')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('031')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('032')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('033')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('041')}</td>
                                    <td className="py-2 px-2 text-center font-bold text-slate-300">{getSubGrade('071')}</td>
                                    <td className="py-2 px-2 text-center font-black text-amber-300">{student.averageMarks}%</td>
                                    <td className="py-2 px-2 text-center font-mono font-bold text-white">{student.points}</td>
                                    <td className="py-2 px-3 text-center">
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${getDivisionBadge(student.division)}`}>
                                        {student.division}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PUBLISHED PDF RESULTS BOOKS */}
                  {academicActiveTab === 'pdfBooks' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-white">
                          {language === 'sw' ? 'Maktaba ya Vitabu Rasmi vya Matokeo (NECTA & Mock PDF Documents)' : 'Published Results Documents'}
                        </h5>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resultsPdfDocuments.map((doc) => (
                          <div key={doc.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                  <h6 className="text-xs font-bold text-white">{doc.titleSw}</h6>
                                  <p className="text-[10px] text-slate-400">{doc.form} • {doc.year} • {doc.fileSize}</p>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-slate-300">{doc.descriptionSw}</p>
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
                              {doc.divisionSummary}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* ============================ 4. STUDENT ROLE ============================= */}
          {/* ========================================================================= */}
          {activeRole === 'student' && (
            <div className="space-y-6">
              {!isAuthenticated ? (
                /* Student Login Screen */
                <div className="max-w-md mx-auto p-6 rounded-3xl bg-slate-900 border border-emerald-800/60 shadow-2xl space-y-5">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto font-black shadow-lg">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {language === 'sw' ? 'Portal ya Mwanafunzi' : 'Student Academic Login'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {language === 'sw'
                        ? 'Weka Namba yako ya Mtihani au Namba ya Usajili kuangalia matokeo yako na kupakua Report Card.'
                        : 'Enter your Exam Number or Student ID to view your academic dashboard.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        {language === 'sw' ? 'Namba ya Mtihani / Student ID:' : 'Exam Number / Student ID:'}
                      </label>
                      <input
                        type="text"
                        value={studentInputIdentifier}
                        onChange={(e) => {
                          setStudentInputIdentifier(e.target.value);
                          setStudentAuthError(false);
                        }}
                        placeholder="Mf. S0486/0001/2025 au Anna"
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400 font-mono"
                      />
                      {studentAuthError && (
                        <p className="text-xs text-rose-400 mt-1 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{language === 'sw' ? 'Namba haijapatikana. Jaribu "S0486/0001/2025" au "Anna"' : 'Student not found. Try "S0486/0001/2025" or "Anna"'}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleStudentLogin}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{language === 'sw' ? 'Ingia Kwenye Portal' : 'Login to Portal'}</span>
                    </button>

                    <div className="pt-2 text-center">
                      <p className="text-[11px] text-slate-500">
                        {language === 'sw' ? 'Mfano wa Namba:' : 'Sample Exam No:'}{' '}
                        <span
                          className="font-mono text-amber-400 font-bold cursor-pointer underline"
                          onClick={() => {
                            setStudentInputIdentifier('S0486/0001/2025');
                          }}
                        >
                          S0486/0001/2025
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Student Authenticated View */
                activeStudentResult && (
                  <div className="space-y-6">
                    <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-white">{activeStudentResult.studentName}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${getDivisionBadge(activeStudentResult.division)}`}>
                            {activeStudentResult.division}
                          </span>
                        </div>
                        <p className="text-xs text-amber-300 font-mono mt-1">
                          {activeStudentResult.examNumber} • {activeStudentResult.form} ({activeStudentResult.stream})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadStudentResultSlipPdf(activeStudentResult)}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'sw' ? 'Pakua Hati ya Matokeo (PDF)' : 'Download PDF Report'}</span>
                        </button>

                        <button
                          onClick={() => setIsAuthenticated(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{language === 'sw' ? 'Toka' : 'Logout'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                      <div className="p-4 bg-slate-950/60 border-b border-slate-800">
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                          {language === 'sw' ? 'Matokeo Yako ya Hivi Karibuni' : 'Your Academic Results'}
                        </h5>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                            <tr>
                              <th className="py-2.5 px-4">Somo</th>
                              <th className="py-2.5 px-3 text-center">Alama</th>
                              <th className="py-2.5 px-3 text-center">Daraja</th>
                              <th className="py-2.5 px-3 text-center">Pointi</th>
                              <th className="py-2.5 px-4">Maoni</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-medium">
                            {activeStudentResult.subjects.map((sub, idx) => (
                              <tr key={idx} className="hover:bg-slate-800/40">
                                <td className="py-3 px-4 font-bold text-white">{sub.name}</td>
                                <td className="py-3 px-3 text-center font-black text-amber-300">{sub.score}</td>
                                <td className="py-3 px-3 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-md border text-xs font-black ${getGradeBadge(sub.grade)}`}>
                                    {sub.grade}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center font-mono font-bold text-white">{sub.points}</td>
                                <td className="py-3 px-4 text-slate-300">{sub.remarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

        </div>

        {/* ================= MODAL FOOTER ================= */}
        <div className="bg-slate-950 border-t border-emerald-900/40 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {language === 'sw'
                ? 'Mfumo Salama wa Kitaaluma • Uomboni Secondary School (S0486)'
                : 'Secure Role-Based Academic Engine • Uomboni Secondary School (S0486)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              {language === 'sw' ? 'Funga Portal' : 'Close Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* ================= ADD STUDENT RESULT MODAL (FOR ACADEMIC MASTER) ================= */}
      {isAddResultModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{language === 'sw' ? 'Ongeza Matokeo ya Mwanafunzi Mpya' : 'Add New Student Result'}</span>
              </h3>
              <button
                onClick={() => setIsAddResultModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentResult} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Jina Kamili la Mwanafunzi *</label>
                  <input
                    type="text"
                    required
                    value={newResultData.studentName}
                    onChange={(e) => setNewResultData({ ...newResultData, studentName: e.target.value })}
                    placeholder="Mf. JOHN PETER SWAI"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Namba ya Mtihani *</label>
                  <input
                    type="text"
                    required
                    value={newResultData.examNumber}
                    onChange={(e) => setNewResultData({ ...newResultData, examNumber: e.target.value })}
                    placeholder="Mf. S0486/0029/2025"
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kidato</label>
                  <select
                    value={newResultData.form}
                    onChange={(e) => setNewResultData({ ...newResultData, form: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Aina ya Mtihani</label>
                  <select
                    value={newResultData.examType}
                    onChange={(e) => setNewResultData({ ...newResultData, examType: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="NECTA Mock 2025">NECTA Mock 2025</option>
                    <option value="Mid-Term Exam 2025">Mid-Term Exam 2025</option>
                    <option value="Annual Examination 2025">Annual Examination 2025</option>
                    <option value="Pre-NECTA 2025">Pre-NECTA 2025</option>
                  </select>
                </div>
              </div>

              {/* Subject Marks Grid */}
              <div className="pt-2">
                <label className="font-bold text-amber-400 block mb-2">Alama za Masomo (0 - 100):</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {STANDARD_SUBJECTS.map((sub) => (
                    <div key={sub.code} className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block truncate">{sub.name}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newResultData.subjectScores[sub.code] || 60}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setNewResultData({
                            ...newResultData,
                            subjectScores: {
                              ...newResultData.subjectScores,
                              [sub.code]: val,
                            },
                          });
                        }}
                        className="w-full p-1 text-center font-bold text-amber-300 rounded bg-slate-900 border border-slate-700 mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddResultModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer shadow-md"
                >
                  Hifadhi Matokeo Sasa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
