import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import {
  FileText,
  FileDown,
  CheckCircle2,
  X,
  Phone,
  Mail,
  User,
  School,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  Printer,
  HeartPulse,
  Upload,
  Save,
  Check,
  Stethoscope,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Shirt,
  BedDouble,
  FileCheck,
  CheckSquare,
  Square,
  Search,
  Building,
  CreditCard,
  Copy,
  Download,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  Layers,
  Users,
} from 'lucide-react';
import {
  downloadJoiningInstructionsPdf,
  downloadAdmissionVerificationLetterPdf,
  downloadOfficialMedicalExaminationFormPdf,
  downloadVituMuhimuPdf,
  printVituMuhimuDirectly,
  downloadOfficialJoiningInstructions2027Pdf,
} from '../utils/pdfService';
import { OnlineApplication } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { MedicalExaminationFormModal } from './MedicalExaminationFormModal';
import {
  VITU_MUHIMU_CATEGORIES,
  VITU_MUHIMU_LIST,
  VITU_MUHIMU_IMPORTANT_NOTES,
} from '../data/vituMuhimuData';

export type AdmissionModalTab = 'form' | 'vitu-muhimu' | 'criteria' | 'fees';

export interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AdmissionModalTab;
}

const DRAFT_STORAGE_KEY = 'uomboni_admission_application_draft';

export const ApplyNowModal: React.FC<ApplyNowModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'form',
}) => {
  const { language } = useLanguage();
  const { submitOnlineApplication } = useData();

  // Active top-level Tab inside Student Admission
  const [activeTab, setActiveTab] = useState<AdmissionModalTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Basic Student Details
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('Tanzanian');
  const [applyingFor, setApplyingFor] = useState<'Form 1' | 'Form 2 Transfer' | 'Form 3 Transfer' | 'Pre-Form 1'>('Form 1');
  const [academicYear, setAcademicYear] = useState('2026/2027');
  const [entryType, setEntryType] = useState<'Bweni (Boarding)' | 'Kutwa (Day)'>('Bweni (Boarding)');
  const [previousSchool, setPreviousSchool] = useState('');
  const [premNumber, setPremNumber] = useState('');
  const [primaryResults, setPrimaryResults] = useState('');

  // Parent / Guardian Details
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentAddress, setParentAddress] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Mzazi (Parent)');

  // Supporting Document names (for online declaration)
  const [birthCertDoc, setBirthCertDoc] = useState('');
  const [psleResultDoc, setPsleResultDoc] = useState('');
  const [transferDoc, setTransferDoc] = useState('');
  const [medicalFormDoc, setMedicalFormDoc] = useState('');

  // Medical Information (privacy protected)
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [regularMedication, setRegularMedication] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Declaration
  const [parentConsentDeclared, setParentConsentDeclared] = useState(false);

  // Modal / submission state
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [latestApp, setLatestApp] = useState<OnlineApplication | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [draftSavedAlert, setDraftSavedAlert] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);

  // Vitu Muhimu state inside Admission Modal
  const [selectedVituCategory, setSelectedVituCategory] = useState<string>('all');
  const [vituSearchQuery, setVituSearchQuery] = useState<string>('');
  const [checkedVituIds, setCheckedVituIds] = useState<Record<string, boolean>>({});

  const toggleCheckVitu = (id: string) => {
    setCheckedVituIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredVituItems = VITU_MUHIMU_LIST.filter((item) => {
    const matchesCategory = selectedVituCategory === 'all' || item.category === selectedVituCategory;
    const q = vituSearchQuery.toLowerCase();
    const matchesSearch =
      !vituSearchQuery ||
      item.nameSw.toLowerCase().includes(q) ||
      item.nameEn.toLowerCase().includes(q) ||
      (item.specSw && item.specSw.toLowerCase().includes(q)) ||
      (item.specEn && item.specEn.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const checkedVituCount = Object.values(checkedVituIds).filter(Boolean).length;
  const totalVituCount = VITU_MUHIMU_LIST.length;
  const vituProgressPercent = Math.round((checkedVituCount / totalVituCount) * 100);

  // Fees bank account copying
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  // Admission Requirements Data
  const admissionRequirements = [
    {
      titleSw: 'Alama za Kufaulu Darasa la Saba (PSLE Result Slip/Certificate)',
      titleEn: 'Primary School Leaving Examination (PSLE) Result Slip or Certificate',
      descSw: 'Cheti halisi au nakala iliyothibitishwa ya matokeo ya mtihani wa kumaliza elimu ya msingi.',
    },
    {
      titleSw: 'Cheti Halisi cha Kuzaliwa (RITA Birth Certificate)',
      titleEn: 'Certified Copy of Official Birth Certificate (RITA)',
      descSw: 'Nakala iliyothibitishwa ya cheti cha kuzaliwa kutoka Wakala wa Usajili, Ufilisi na Udhamini (RITA).',
    },
    {
      titleSw: 'Barua ya Uhamisho & Ripoti ya Maendeleo (Transfers Form 2 & 3)',
      titleEn: 'Official Transfer Letter & Academic Progress Report (for transfer applicants)',
      descSw: 'Barua rasmi kutoka shule ya awali iliyosajiliwa pamoja na daftari la maendeleo ya taaluma (progress report).',
    },
    {
      titleSw: 'Fomu Rasmi ya Upimaji Afya ya Hospitali (Medical Examination Form)',
      titleEn: 'Medical Examination Form signed and stamped by an authorized medical officer',
      descSw: 'Imejazwa, kusainiwa na kupigwa muhuri na daktari wa kituo cha afya au hospitali inayotambuliwa na serikali.',
    },
    {
      titleSw: 'Picha Nne (4) za Pasipoti Zenye Mandhari ya Bluu ya Angani',
      titleEn: 'Four (4) recent passport-sized photographs (sky blue background)',
      descSw: 'Picha safi za hivi karibuni zikiwa na sare rasmi au shati jeupe.',
    },
    {
      titleSw: 'Fomu ya Maagano ya Malezi na Nidhamu Iliyosainiwa na Mzazi',
      titleEn: 'Signed School Rules and Discipline Acceptance Agreement by Parent/Guardian',
      descSw: 'Kukubali kufuata maadili na sheria zote za shule ya Kikatoliki ya Sekondari Uomboni.',
    },
  ];

  const importantDates = [
    {
      eventSw: 'Udahili wa Kidato cha Kwanza (Form One 2026/2027)',
      eventEn: 'Form One Admissions & Registration (2026/2027)',
      dateSw: 'Nafasi Ziko Wazi (Open Now)',
      badge: 'OPEN',
    },
    {
      eventSw: 'Maombi ya Uhamisho Kidato cha 2 & 3',
      eventEn: 'Form 2 & 3 Transfer Applications Window',
      dateSw: 'Nafasi Ziko Wazi (Open Now)',
      badge: 'OPEN',
    },
    {
      eventSw: 'Kuripoti Shuleni & Maandalizi ya Muhula Mpya',
      eventEn: 'School Reporting & Term Orientation',
      dateSw: 'Januari (Kulingana na Kalenda ya Wizara ya Elimu)',
      badge: 'SCHEDULED',
    },
  ];

  const officialBankAccounts = [
    {
      id: 'crdb',
      bankName: 'CRDB Bank Plc',
      accountName: 'UOMBONI SECONDARY SCHOOL',
      accountNumber: '0150248900100',
      branch: 'Tawi la Marangu / Moshi',
      color: 'border-emerald-600 bg-emerald-50/50',
      tag: 'Akaunti Kuu ya Ada',
    },
    {
      id: 'nmb',
      bankName: 'NMB Bank Plc',
      accountName: 'UOMBONI SECONDARY SCHOOL',
      accountNumber: '22110023456',
      branch: 'Tawi la Moshi',
      color: 'border-blue-600 bg-blue-50/50',
      tag: 'Akaunti ya Ada',
    },
    {
      id: 'mkombozi',
      bankName: 'Mkombozi Commercial Bank',
      accountName: 'UOMBONI SECONDARY SCHOOL',
      accountNumber: '00110024982001',
      branch: 'Tawi la Moshi (Benki ya Kikanisa)',
      color: 'border-amber-600 bg-amber-50/50',
      tag: 'Akaunti ya Kikatoliki',
    },
    {
      id: 'lipa-namba',
      bankName: 'Lipa Namba ya Simu (M-Pesa / Tigo / Airtel)',
      accountName: 'UOMBONI SECONDARY SCHOOL',
      accountNumber: '5882194',
      branch: 'Lipa kwa Simu / Till Number',
      color: 'border-rose-600 bg-rose-50/50',
      tag: 'Malipo ya Papo kwa Hapo',
    },
  ];

  // Restore draft on mount if exists
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (draft) {
        const d = JSON.parse(draft);
        if (d.studentName) setStudentName(d.studentName);
        if (d.gender) setGender(d.gender);
        if (d.dob) setDob(d.dob);
        if (d.nationality) setNationality(d.nationality);
        if (d.applyingFor) setApplyingFor(d.applyingFor);
        if (d.academicYear) setAcademicYear(d.academicYear);
        if (d.entryType) setEntryType(d.entryType);
        if (d.previousSchool) setPreviousSchool(d.previousSchool);
        if (d.premNumber) setPremNumber(d.premNumber);
        if (d.primaryResults) setPrimaryResults(d.primaryResults);
        if (d.parentName) setParentName(d.parentName);
        if (d.parentPhone) setParentPhone(d.parentPhone);
        if (d.parentEmail) setParentEmail(d.parentEmail);
        if (d.parentAddress) setParentAddress(d.parentAddress);
        if (d.parentRelationship) setParentRelationship(d.parentRelationship);
        if (d.allergies) setAllergies(d.allergies);
        if (d.chronicConditions) setChronicConditions(d.chronicConditions);
        if (d.regularMedication) setRegularMedication(d.regularMedication);
        if (d.bloodGroup) setBloodGroup(d.bloodGroup);
        if (d.emergencyContact) setEmergencyContact(d.emergencyContact);
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleSaveDraft = () => {
    try {
      const draftData = {
        studentName,
        gender,
        dob,
        nationality,
        applyingFor,
        academicYear,
        entryType,
        previousSchool,
        premNumber,
        primaryResults,
        parentName,
        parentPhone,
        parentEmail,
        parentAddress,
        parentRelationship,
        allergies,
        chronicConditions,
        regularMedication,
        bloodGroup,
        emergencyContact,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      setDraftSavedAlert(true);
      setTimeout(() => setDraftSavedAlert(false), 3000);
    } catch (e) {
      console.warn('Could not save draft to local storage:', e);
    }
  };

  const handleClearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setStudentName('');
    setDob('');
    setPreviousSchool('');
    setPremNumber('');
    setPrimaryResults('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    setParentAddress('');
    setAllergies('');
    setChronicConditions('');
    setRegularMedication('');
    setBloodGroup('');
    setEmergencyContact('');
    setBirthCertDoc('');
    setPsleResultDoc('');
    setTransferDoc('');
    setMedicalFormDoc('');
    setParentConsentDeclared(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!studentName.trim() || !parentName.trim() || !parentPhone.trim()) {
      setFormError(
        language === 'sw'
          ? 'Tafadhali jaza taarifa zote muhimu zenye alama ya (*).'
          : 'Please fill all required fields marked with (*).'
      );
      return;
    }

    if (!parentConsentDeclared) {
      setFormError(
        language === 'sw'
          ? 'Tafadhali weka alama ya tiki kukubali tamko la Mzazi/Mlezi na kufuata kanuni za shule.'
          : 'Please check the parent declaration to accept school regulations.'
      );
      return;
    }

    const createdApp = submitOnlineApplication({
      studentName: studentName.trim().toUpperCase(),
      gender,
      dob: dob || undefined,
      nationality: nationality || 'Tanzanian',
      applyingFor,
      academicYear,
      entryType,
      previousSchool: previousSchool.trim() || undefined,
      premNumber: premNumber.trim() || undefined,
      primaryResults: primaryResults.trim() || undefined,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim() || undefined,
      parentAddress: parentAddress.trim() || undefined,
      parentRelationship,
      documents: {
        birthCertificateName: birthCertDoc || undefined,
        psleResultSlipName: psleResultDoc || undefined,
        previousSchoolReportName: transferDoc || undefined,
        medicalReportName: medicalFormDoc || undefined,
      },
      medicalInfo: {
        allergies: allergies.trim() || undefined,
        chronicConditions: chronicConditions.trim() || undefined,
        regularMedication: regularMedication.trim() || undefined,
        bloodGroup: bloodGroup.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
      },
      parentConsentDeclared: true,
      adminNotes:
        language === 'sw'
          ? `Maombi ya ${applyingFor} (${entryType}) yamewasilishwa mtandaoni tarehe ${new Date().toLocaleDateString(
              'sw-TZ'
            )}.${premNumber.trim() ? ` PREM/Namba ya Mtihani La Saba: ${premNumber.trim()}.` : ''}`
          : `Online application for ${applyingFor} (${entryType}) submitted on ${new Date().toLocaleDateString(
              'en-GB'
            )}.${premNumber.trim() ? ` PREM/Std 7 Exam No: ${premNumber.trim()}.` : ''}`,
    });

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setSubmittedRef(createdApp.applicationNumber);
    setLatestApp(createdApp);
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setLatestApp(null);
    handleClearDraft();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[96vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
          
          {/* Modal Header */}
          <div className="sticky top-0 z-30 bg-gradient-to-r from-emerald-950 via-[#102A43] to-emerald-950 text-white p-4 sm:p-6 rounded-t-3xl border-b border-[#C9A227]/30 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white/10 border border-[#C9A227]/40 shadow-xs shrink-0">
                  <SchoolLogo size="sm" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C9A227] text-[#102A43]">
                      Mwaka 2026/2027
                    </span>
                    <span className="text-[11px] text-emerald-300 font-semibold">
                      NECTA CENTRE S0486
                    </span>
                    <span className="hidden sm:inline-block text-[10px] text-amber-200/80 font-mono">
                      &bull; Jimbo Katoliki Moshi
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black text-white leading-tight">
                    {language === 'sw' ? 'Udahili wa Wanafunzi (Student Admission)' : 'Official Student Admission Portal'}
                  </h3>
                  <p className="text-xs text-amber-300 flex items-center gap-1.5 flex-wrap">
                    <span>Shule ya Sekondari Uomboni</span>
                    <span>&bull;</span>
                    <span className="italic">&ldquo;Tujiendeleze Sisi Wenyewe&rdquo;</span>
                    <span>&bull;</span>
                    <span>Marangu, Moshi</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeTab === 'form' && (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Hifadhi rasimu na urudi baadaye"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden md:inline">Hifadhi Rasimu</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Funga"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sub-Navigation Tabs inside Student Admission */}
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'form'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Fomu ya Udahili (Application)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vitu-muhimu')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'vitu-muhimu'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>2. Vitu Muhimu (Checklist)</span>
                {checkedVituCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-950 text-amber-300 font-bold">
                    {checkedVituCount}/{totalVituCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('criteria')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'criteria'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>3. Sifa &amp; Vigezo vya Udahili</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fees')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'fees'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>4. Ada &amp; Malipo ya Benki</span>
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {draftSavedAlert && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2 text-xs font-bold animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rasimu ya fomu yako imehifadhiwa salama kwenye kifaa hiki. Unaweza kurudi kuendelea wakati wowote!</span>
              </div>
            )}

            {/* TAB 1: APPLICATION FORM */}
            {activeTab === 'form' && (
              <>
                {/* 3 Quick-Reference Summary Cards to other admission sections */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-gradient-to-r from-amber-50/70 via-slate-50 to-emerald-50/70 rounded-2xl border border-slate-200 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('vitu-muhimu')}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                        <CheckSquare className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Tazama &rarr;
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-[#102A43] block">Vitu Muhimu &amp; Sare</span>
                      <span className="text-[11px] text-slate-500 block leading-tight">Godoro, sanduku la bati, madaftari...</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('criteria')}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-xs text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900">
                        <FileCheck className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Vigezo &rarr;
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-[#102A43] block">Sifa 6 za Udahili</span>
                      <span className="text-[11px] text-slate-500 block leading-tight">PSLE, cheti cha kuzaliwa RITA, afya...</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('fees')}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-xs text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900">
                        <CreditCard className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        Ada & Benki &rarr;
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-bold text-[#102A43] block">Ada &amp; Malipo ya Benki</span>
                      <span className="text-[11px] text-slate-500 block leading-tight">Bweni TZS 1.6M | Kutwa TZS 850K</span>
                    </div>
                  </button>
                </div>

                {submittedRef ? (
                  <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                        {language === 'sw' ? 'Ombi Limewasilishwa Kikamilifu!' : 'Application Successfully Submitted!'}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                        Namba ya Maombi:{' '}
                        <span className="text-emerald-700 font-mono">#{submittedRef}</span>
                      </h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                      {language === 'sw'
                        ? `Asante sana kwa kuomba kujiunga na Shule ya Sekondari Uomboni kwa niaba ya ${studentName}. Maombi yako yameingizwa kwenye mfumo wa udahili kwa hadhi ya "Inasubiri Uhakiki". Uongozi utawasiliana nawe kupitia ${parentPhone}.`
                        : `Thank you for applying to Uomboni Secondary on behalf of ${studentName}. Application status is now Pending Review. We will reach you at ${parentPhone}.`}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      {latestApp && (
                        <button
                          onClick={() => downloadAdmissionVerificationLetterPdf(latestApp)}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                          <span>{language === 'sw' ? 'Barua ya Uhakiki (PDF)' : 'Verification Slip (PDF)'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setIsMedicalModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <Stethoscope className="w-4 h-4 text-emerald-400" />
                        <span>Fomu ya Afya ya Hospitali (Medical Form)</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('vitu-muhimu')}
                        className="px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                        <span>Kagua Vitu Muhimu</span>
                      </button>

                      <button
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {language === 'sw' ? 'Wasilisha Ombi Lingine' : 'Submit Another'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-800">
                    {formError && (
                      <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
                        <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5 cursor-pointer" onClick={() => setFormError(null)} />
                        <div className="flex-1 font-semibold text-xs leading-relaxed">
                          {formError}
                        </div>
                      </div>
                    )}

                    {/* SECTION 1: STUDENT IDENTIFICATION */}
                    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/15">
                      <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <User className="w-4 h-4 text-emerald-700" />
                        <span>1. Taarifa za Utambulisho wa Mwanafunzi (Student Identification)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Jina Kamili la Mwanafunzi *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mfano: Juma Ally Mushi"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#102A43] text-xs font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Jinsia *
                            </label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                            >
                              <option value="M">Mvulana (Male)</option>
                              <option value="F">Msichana (Female)</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-bold text-slate-700 block mb-1">
                              Tarehe ya Kuzaliwa
                            </label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-[11px]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Uraia (Nationality)
                          </label>
                          <input
                            type="text"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            placeholder="Tanzanian"
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Darasa Analoomba *
                          </label>
                          <select
                            value={applyingFor}
                            onChange={(e) => setApplyingFor(e.target.value as any)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                          >
                            <option value="Form 1">Kidato cha 1 (Form One)</option>
                            <option value="Form 2 Transfer">Uhamisho Kidato cha 2 (Form 2)</option>
                            <option value="Form 3 Transfer">Uhamisho Kidato cha 3 (Form 3)</option>
                            <option value="Pre-Form 1">Pre-Form One Course</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Mfumo wa Masomo (Entry Type) *
                          </label>
                          <select
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value as any)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                          >
                            <option value="Bweni (Boarding)">Bweni (Boarding) - TZS 1,600,000/=</option>
                            <option value="Kutwa (Day)">Kutwa (Day) - TZS 850,000/=</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Shule Aliyotoka (Previous School)
                          </label>
                          <input
                            type="text"
                            placeholder="Shule ya Msingi au Sekondari"
                            value={previousSchool}
                            onChange={(e) => setPreviousSchool(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Namba ya Mtihani La 7 / PREM No.
                          </label>
                          <input
                            type="text"
                            placeholder="PSLE Exam No / PREM"
                            value={premNumber}
                            onChange={(e) => setPremNumber(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Matokeo ya Awali (Daraja / Alama)
                          </label>
                          <input
                            type="text"
                            placeholder="Mfano: Daraja B (Wastani 185)"
                            value={primaryResults}
                            onChange={(e) => setPrimaryResults(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PARENT / GUARDIAN DETAILS */}
                    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200">
                      <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <Users className="w-4 h-4 text-amber-600" />
                        <span>2. Taarifa za Mzazi au Mlezi (Parent / Guardian)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Jina Kamili la Mzazi / Mlezi *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Mfano: Aloyce Maro"
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#102A43] text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Namba ya Simu ya Mzazi (WhatsApp/Piga) *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Mfano: 0754 123 456"
                            value={parentPhone}
                            onChange={(e) => setParentPhone(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#102A43] text-xs font-mono font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Barua Pepe (Email)
                          </label>
                          <input
                            type="email"
                            placeholder="mzazi@gmail.com"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Mahali Mnapoishi / Makazi
                          </label>
                          <input
                            type="text"
                            placeholder="Mji, Wilaya, Mtaa"
                            value={parentAddress}
                            onChange={(e) => setParentAddress(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Uhusiano na Mwanafunzi
                          </label>
                          <select
                            value={parentRelationship}
                            onChange={(e) => setParentRelationship(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          >
                            <option value="Baba (Father)">Baba (Father)</option>
                            <option value="Mama (Mother)">Mama (Mother)</option>
                            <option value="Mlezi (Guardian)">Mlezi (Guardian)</option>
                            <option value="Ndugu wa Karibu">Ndugu wa Karibu</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 3: ATTACHED DOCUMENTS DECLARATION */}
                    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-emerald-700" />
                          <span>3. Nyaraka Zinazoambatishwa (Supporting Documents)</span>
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          (Unaweza kuwasilisha siku ya kuripoti shuleni)
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block">
                            1. Cheti cha Kuzaliwa (RITA)
                          </span>
                          <input
                            type="text"
                            placeholder="Namba ya cheti au jina la faili"
                            value={birthCertDoc}
                            onChange={(e) => setBirthCertDoc(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block">
                            2. Result Slip ya La 7 (PSLE)
                          </span>
                          <input
                            type="text"
                            placeholder="Namba ya mtihani / namba ya cheti"
                            value={psleResultDoc}
                            onChange={(e) => setPsleResultDoc(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-800 block">
                            3. Barua ya Uhamisho (Kama anahama)
                          </span>
                          <input
                            type="text"
                            placeholder="Shule iliyotoa uhamisho"
                            value={transferDoc}
                            onChange={(e) => setTransferDoc(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                          />
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">
                              4. Fomu ya Afya ya Daktari
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsMedicalModalOpen(true)}
                              className="text-[10px] font-bold text-emerald-700 hover:underline"
                            >
                              Jaza / Pakua &rarr;
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Jina la kituo cha afya / daktari"
                            value={medicalFormDoc}
                            onChange={(e) => setMedicalFormDoc(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-[11px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 4: MEDICAL INFORMATION */}
                    <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200">
                      <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                        <HeartPulse className="w-4 h-4 text-rose-600" />
                        <span>4. Taarifa za Afya ya Mwanafunzi (Medical Information)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Mzio (Allergies)
                          </label>
                          <input
                            type="text"
                            placeholder="Mfano: Mzio wa chakula, dawa n.k"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Magonjwa Sugu (Kama yapo)
                          </label>
                          <input
                            type="text"
                            placeholder="Mfano: Pumu (Asthma), Shinikizo n.k"
                            value={chronicConditions}
                            onChange={(e) => setChronicConditions(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">
                            Kundi la Damu (Blood Group)
                          </label>
                          <input
                            type="text"
                            placeholder="Mfano: O+, A+, B+, AB+"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Namba ya Simu ya Dharura (Emergency Contact)
                        </label>
                        <input
                          type="text"
                          placeholder="Jina na namba ya simu ya dharura"
                          value={emergencyContact}
                          onChange={(e) => setEmergencyContact(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* SECTION 5: DECLARATION */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-2">
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>5. Tamko Rasmi la Mzazi au Mlezi (Parent Declaration)</span>
                      </h4>

                      <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-slate-800">
                        <input
                          type="checkbox"
                          required
                          checked={parentConsentDeclared}
                          onChange={(e) => setParentConsentDeclared(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700"
                        />
                        <span>
                          Mimi niliyetia jina hapo juu ninathibitisha kuwa taarifa zote zilizojazwa katika fomu hii ni za kweli na sahihi. Ninakubali mwanangu kujiunga na Shule ya Sekondari Uomboni na kufuata kanuni, taratibu na malezi yote ya shule ya Kikatoliki ya Jimbo Katoliki Moshi.
                        </span>
                      </label>
                    </div>

                    {/* Submit and Draft CTAs */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5 text-amber-600" />
                          <span>Hifadhi Rasimu</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleClearDraft}
                          className="px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs transition-colors cursor-pointer"
                          title="Safisha Fomu"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                        >
                          Ghairi
                        </button>

                        <button
                          type="submit"
                          id="btn-submit-admission-complete"
                          className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-[#102A43] hover:from-emerald-700 hover:to-[#0A1C2E] text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
                        >
                          <Send className="w-4 h-4 text-amber-300" />
                          <span>Wasilisha Maombi Kamili</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </>
            )}

            {/* TAB 2: VITU MUHIMU (ESSENTIAL CHECKLIST) */}
            {activeTab === 'vitu-muhimu' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-[#102A43] text-white rounded-3xl p-6 sm:p-8 border border-[#C9A227]/30 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="space-y-2 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wider uppercase">
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>ORODHA RASMI YA MAANDALIZI</span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
                        Vitu Muhimu vya Kujiunga na Shule (Essential Checklist)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        Mwongozo kamilifu wa vifaa vya masomo, sare rasmi, mahitaji ya bweni, nyaraka za usajili, na vitu vilivyopigwa marufuku ili mzazi na mwanafunzi wajiandae vyema kabla ya kuripoti Marangu.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => downloadVituMuhimuPdf()}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-[#C9A227]" />
                        <span>Pakua Orodha (PDF)</span>
                      </button>

                      <button
                        onClick={() => printVituMuhimuDirectly()}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Chapisha</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('form')}
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Nenda Kwenye Fomu &rarr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Progress Tracker */}
                  <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300">Maandalizi ya Vifaa:</span>
                      <div className="w-40 sm:w-56 h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                          style={{ width: `${vituProgressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        {checkedVituCount} / {totalVituCount} ({vituProgressPercent}%)
                      </span>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tafuta kifaa / sare / kitabu..."
                        value={vituSearchQuery}
                        onChange={(e) => setVituSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  {/* Categories Pills */}
                  <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setSelectedVituCategory('all')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'all'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Vitu Vyote ({VITU_MUHIMU_LIST.length})</span>
                    </button>

                    <button
                      onClick={() => setSelectedVituCategory('academic')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'academic'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Taaluma &amp; Daftari</span>
                    </button>

                    <button
                      onClick={() => setSelectedVituCategory('uniform')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'uniform'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <Shirt className="w-3.5 h-3.5" />
                      <span>Sare za Shule</span>
                    </button>

                    <button
                      onClick={() => setSelectedVituCategory('boarding')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'boarding'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      <span>Bweni &amp; Sanduku</span>
                    </button>

                    <button
                      onClick={() => setSelectedVituCategory('documents')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'documents'
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Nyaraka &amp; Vyeti</span>
                    </button>

                    <button
                      onClick={() => setSelectedVituCategory('prohibited')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        selectedVituCategory === 'prohibited'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-rose-900/40 text-rose-200 hover:bg-rose-900/60'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
                      <span>Vilivyopigwa Marufuku</span>
                    </button>
                  </div>
                </div>

                {/* Vitu Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredVituItems.map((item) => {
                    const isChecked = !!checkedVituIds[item.id];
                    const isProhibited = item.category === 'prohibited';

                    return (
                      <div
                        key={item.id}
                        onClick={() => !isProhibited && toggleCheckVitu(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                          isProhibited
                            ? 'bg-rose-50/70 border-rose-300 cursor-default'
                            : isChecked
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-xs'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                isProhibited
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {item.quantity || (isProhibited ? 'Marufuku Kabisa' : 'Inahitajika')}
                            </span>

                            {!isProhibited && (
                              <button
                                type="button"
                                className="text-slate-400 hover:text-emerald-700 transition-colors"
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {item.mandatory && !isProhibited && (
                              <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                Lazima
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-sm text-[#102A43] leading-snug">
                            {item.nameSw}
                          </h5>

                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {item.specSw}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="capitalize">{item.category}</span>
                          <span className={isProhibited ? 'text-rose-600 font-bold' : isChecked ? 'text-emerald-700 font-bold' : 'text-amber-600'}>
                            {isProhibited ? '✕ Hairuhusiwi' : isChecked ? '✓ Tayari' : 'Inahitajika'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Prohibited Alert Banner */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>
                      <strong>Sera ya Shule:</strong> Simu za mkononi, hita za umeme na vifaa vyote vya kielektroniki vimepigwa marufuku kabisa. Mwanafunzi atakayepatikana navyo atachukuliwa hatua kali za kinidhamu.
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    Rudi Kujaza Fomu &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ADMISSION CRITERIA & DATES */}
            {activeTab === 'criteria' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Header Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#102A43] via-[#0A1C2E] to-[#102A43] text-white border border-[#C9A227]/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>VIGEZO RASMI VYA UDAHILI 2026/2027</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      Sifa &amp; Vigezo vya Kujiunga na Shule ya Sekondari Uomboni
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                      Nafasi za kujiunga na Kidato cha Kwanza na cha Tatu zipo wazi kwa wavulana na wasichana (Bweni na Kutwa). Mazingira tulivu ya masomo mteremko wa Mlima Kilimanjaro, Marangu.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('form')}
                    className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <span>Anza Kujaza Fomu Sasa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 6 Official Requirements Grid */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C9A227]" />
                      <span>Vigezo 6 vya Msingi vya Udahili (Admission Criteria)</span>
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-bold">Lazima zote zizingatiwe</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {admissionRequirements.map((req, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FFFFF0] border border-slate-200 hover:border-amber-400 transition-colors flex items-start gap-3.5"
                      >
                        <span className="w-7 h-7 rounded-xl bg-[#102A43] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <h5 className="text-xs sm:text-sm font-bold text-[#102A43] leading-snug">
                            {req.titleSw}
                          </h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {req.descSw}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dates & Collection Centers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Important Dates */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span>Tarehe Muhimu za Udahili (Important Dates)</span>
                    </h4>

                    <div className="space-y-3">
                      {importantDates.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-[#102A43] block">
                              {item.eventSw}
                            </span>
                            <span className="text-[11px] text-slate-600 block">
                              {item.dateSw}
                            </span>
                          </div>
                          <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form Centers & Contacts */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                        <MapPin className="w-4 h-4 text-emerald-700" />
                        <span>Vituo vya Upatikanaji wa Fomu (Hardcopy)</span>
                      </h4>

                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Ofisi ya Mkuu wa Shule:</strong> Uomboni, Marangu Magharibi, Moshi</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Moshi Bookshop:</strong> Mjini Moshi</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Kituo cha Ngarenaro:</strong> Arusha</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span><strong>Tovuti Rasmi:</strong> Pakua mtandaoni au jaza fomu hii sasa</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Mawasiliano ya Uongozi wa Udahili
                      </span>
                      <div className="text-xs font-mono font-bold text-[#102A43] space-y-1">
                        <div>📞 Mkuu wa Shule: +255 782 558 127</div>
                        <div>📞 Makamu Mkuu: +255 754 532 949</div>
                        <div>📞 Mkuu wa Taaluma: +255 745 548 225</div>
                        <div>📞 Mhasibu wa Shule: +255 752 000 939</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FEES & BANK ACCOUNTS */}
            {activeTab === 'fees' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Fee Header */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#102A43] to-emerald-950 text-white border border-[#C9A227]/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>ADA NA MFUMO WA MALIPO 2026/2027</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      Mchanganuo wa Ada &amp; Akaunti Rasmi za Benki
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                      Ada ya Shule ya Sekondari Uomboni inalipwa moja kwa moja kupitia benki au Lipa Namba ya shule. Mzazi anaweza kulipa ada yote au kwa awamu (Installments) kabla ya muhula kuanza.
                    </p>
                  </div>

                  <a
                    href="https://wa.me/255752000939?text=Habari%20Mhasibu,%20ninaomba%20msaada%20wa%20malipo%20ya%20ada%20ya%20Uomboni%20Secondary."
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shrink-0 flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-102"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-200" />
                    <span>Wasiliana na Mhasibu (WhatsApp)</span>
                  </a>
                </div>

                {/* 2 Fee Plans: Boarding vs Day */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Boarding */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-600 shadow-md space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider rounded-bl-2xl">
                      Wavulana &amp; Wasichana
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Bweni (Boarding)
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                        TZS 1,600,000<span className="text-xs font-normal text-slate-500"> / mwaka</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Inajumuisha malazi ya bweni, chakula bora mara tatu kwa siku, huduma za afya ya awali, masomo, maabara za sayansi na TEHAMA.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        Awamu za Malipo (Installment Schedule):
                      </span>
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-950">Awamu ya 1 (Muhula wa Kwanza):</span>
                        <span className="font-mono font-bold text-emerald-900">TZS 850,000/=</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">Awamu ya 2 (Muhula wa Pili):</span>
                        <span className="font-mono font-bold text-slate-900">TZS 750,000/=</span>
                      </div>
                    </div>
                  </div>

                  {/* Day */}
                  <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-300 shadow-xs space-y-4 relative overflow-hidden">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                        Kutwa (Day Scholars)
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                        TZS 850,000<span className="text-xs font-normal text-slate-500"> / mwaka</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Inajumuisha chakula cha mchana shuleni, masomo yote, maabara, maktaba na huduma zote za kitaaluma na michezo.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        Awamu za Malipo (Installment Schedule):
                      </span>
                      <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-blue-950">Awamu ya 1 (Muhula wa Kwanza):</span>
                        <span className="font-mono font-bold text-blue-900">TZS 450,000/=</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">Awamu ya 2 (Muhula wa Pili):</span>
                        <span className="font-mono font-bold text-slate-900">TZS 400,000/=</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Accounts Grid */}
                <div className="space-y-4">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-700" />
                      <span>Akaunti Rasmi za Benki za Shule (Malipo Yote Hufanyika Hapa)</span>
                    </h4>
                    <span className="text-[11px] text-slate-500">Bofya namba kunakili</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {officialBankAccounts.map((b) => (
                      <div
                        key={b.id}
                        className={`p-4 rounded-2xl border-2 ${b.color} flex flex-col justify-between space-y-3 shadow-xs`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-[#102A43]">
                              {b.bankName}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                              {b.tag}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600">
                            Jina la Akaunti: <strong>{b.accountName}</strong>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {b.branch}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                          <span className="font-mono font-black text-sm sm:text-base text-[#102A43] tracking-wider">
                            {b.accountNumber}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleCopyText(b.accountNumber, b.id)}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#102A43] text-xs font-bold border border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            {copiedBankId === b.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Imenakiliwa!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-600" />
                                <span>Nakili</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Bank Pay Instructions */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
                  <span className="font-black flex items-center gap-2 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Mwongozo wa Malipo ya Benki &amp; Uthibitisho</span>
                  </span>
                  <ul className="space-y-1 list-disc pl-5 text-slate-700">
                    <li>Kwenye hati ya benki (bank slip), mzazi lazima aandike <strong>Jina Kamili la Mwanafunzi</strong> na <strong>Kidato/Darasa</strong>.</li>
                    <li>Hati halisi ya benki (bank slip) iwasilishwe kwa Mhasibu wa shule siku ya kuripoti shuleni ili kupewa stakabadhi rasmi ya shule.</li>
                    <li>Unaweza pia kutuma picha safi ya bank slip kupitia WhatsApp ya Mhasibu: <strong>0752 000 939</strong>.</li>
                  </ul>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setActiveTab('form')}
                      className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Jaza Fomu ya Udahili Mtandaoni &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hospital Medical Form Modal */}
      {isMedicalModalOpen && (
        <MedicalExaminationFormModal
          isOpen={isMedicalModalOpen}
          onClose={() => setIsMedicalModalOpen(false)}
          studentName={studentName}
          applicationNumber={submittedRef || 'APP-2026-DRAFT'}
          dateOfBirth={dob}
          gender={gender}
          parentName={parentName}
          parentPhone={parentPhone}
          premNumber={premNumber}
        />
      )}
    </>
  );
};

export default ApplyNowModal;
