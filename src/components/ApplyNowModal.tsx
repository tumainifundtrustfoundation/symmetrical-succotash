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
  Download,
  CheckSquare,
  BookOpen,
  Shirt,
  BedDouble,
  FileCheck,
  CreditCard,
  Building,
  Copy,
  Lock,
  MessageCircle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import {
  downloadJoiningInstructionsPdf,
  downloadAdmissionVerificationLetterPdf,
  downloadOfficialMedicalExaminationFormPdf,
  downloadVituMuhimuPdf,
  downloadOfficialJoiningInstructions2027Pdf,
  downloadFeePaymentReceiptPdf,
} from '../utils/pdfService';
import { VITU_MUHIMU_CATEGORIES, VITU_MUHIMU_LIST } from '../data/vituMuhimuData';
import { OnlineApplication } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { MedicalExaminationFormModal } from './MedicalExaminationFormModal';

export type AdmissionModalTab = 'overview' | 'apply' | 'checklist' | 'forms' | 'fees';

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AdmissionModalTab;
}

const DRAFT_STORAGE_KEY = 'uomboni_admission_application_draft';

export const ApplyNowModal: React.FC<ApplyNowModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'overview',
}) => {
  const { language, t } = useLanguage();
  const { joiningDocs, submitOnlineApplication, bankAccounts, submitPaymentRecord } = useData();

  const [activeTab, setActiveTab] = useState<AdmissionModalTab>(initialTab);

  // Sync initialTab when modal opens or initialTab prop changes
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Vitu Muhimu State
  const [activeVituCategory, setActiveVituCategory] = useState<'academic' | 'uniform' | 'boarding' | 'documents'>('academic');

  // Fee Payment States
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [feeStudentName, setFeeStudentName] = useState('');
  const [feeExamNumber, setFeeExamNumber] = useState('');
  const [feeSelectedForm, setFeeSelectedForm] = useState('Form 1');
  const [feeAmount, setFeeAmount] = useState('650000');
  const [feePaymentMethod, setFeePaymentMethod] = useState('CRDB Bank - 01J1079051400');
  const [feeTransactionRef, setFeeTransactionRef] = useState('');
  const [feeParentPhone, setFeeParentPhone] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState<any | null>(null);

  // Online Application Form States
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

  // Supporting Document names
  const [birthCertDoc, setBirthCertDoc] = useState('');
  const [psleResultDoc, setPsleResultDoc] = useState('');
  const [transferDoc, setTransferDoc] = useState('');
  const [medicalFormDoc, setMedicalFormDoc] = useState('');

  // Medical Information
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [regularMedication, setRegularMedication] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Declaration
  const [parentConsentDeclared, setParentConsentDeclared] = useState(false);

  // Submission state
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [latestApp, setLatestApp] = useState<OnlineApplication | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [draftSavedAlert, setDraftSavedAlert] = useState(false);
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2500);
  };

  const getBursarWhatsAppUrl = (customData?: { studentName?: string; form?: string; amount?: string; ref?: string; receiptNo?: string }) => {
    const sName = customData?.studentName ?? feeStudentName;
    const sForm = customData?.form ?? feeSelectedForm;
    const sAmount = customData?.amount ?? feeAmount;
    const sRef = customData?.ref ?? feeTransactionRef;
    const sReceipt = customData?.receiptNo;

    const formattedAmount = sAmount && !isNaN(Number(sAmount)) ? Number(sAmount).toLocaleString() : sAmount;

    let messageSw = `Habari Mhasibu (Bursar Desk) - UOMBONI SECONDARY SCHOOL,\n\nNina swali / ufafanuzi kuhusu malipo ya ada ya shule:\n`;
    if (sReceipt) messageSw += `• Namba ya Risiti: ${sReceipt}\n`;
    if (sName) messageSw += `• Jina la Mwanafunzi: ${sName}\n`;
    if (sForm) messageSw += `• Kidato / Darasa: ${sForm}\n`;
    if (formattedAmount) messageSw += `• Kiasi cha Ada (TZS): ${formattedAmount} /=\n`;
    if (sRef) messageSw += `• Kumbukumbu ya Muamala: ${sRef}\n`;
    messageSw += `• Ufafanuzi / Ombi: Ninaomba msaada wa uthibitisho wa malipo ya ada na maelekezo ya muamala.\n\nAsante sana!`;

    return `https://wa.me/255752000939?text=${encodeURIComponent(messageSw)}`;
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudentName || !feeAmount || !feeTransactionRef || !feeParentPhone) {
      alert(language === 'sw' ? 'Tafadhali jaza taarifa zote zinazohitajika' : 'Please fill all required fields');
      return;
    }

    const newRecord = submitPaymentRecord({
      studentName: feeStudentName,
      examNumber: feeExamNumber || 'S0486/UNREGISTERED',
      form: feeSelectedForm,
      amount: Number(feeAmount),
      paymentMethod: feePaymentMethod,
      transactionReference: feeTransactionRef,
      paymentDate: new Date().toISOString().split('T')[0],
      parentPhone: feeParentPhone,
    });

    setSubmittedReceipt(newRecord);
  };

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

  const admissionRequirements = [
    'Primary School Leaving Examination (PSLE) Result Slip or Certificate',
    'Certified Copy of Official Birth Certificate (RITA)',
    'Official Transfer Letter & Academic Progress Report (for transfer applicants)',
    'Medical Examination Form signed and stamped by an authorized medical officer',
    'Four (4) recent passport-sized photographs (sky blue background)',
    'Signed School Rules and Discipline Acceptance Agreement by Parent/Guardian',
  ];

  const admissionDates = [
    { event: 'Form One Admissions & Registration (2026/2027)', date: 'Inaendelea (Open Now)' },
    { event: 'Form 2 & 3 Transfer Applications Window', date: 'Inaendelea (Open Now)' },
    { event: 'Kuripoti Shuleni & Maandalizi ya Muhula Mpya', date: 'Januari 2026' },
  ];

  const categoryItems = VITU_MUHIMU_LIST.filter(item => item.category === activeVituCategory);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[96vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">

          {/* Sticky Modal Header with School Identity & Tab Navigation */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-emerald-950 via-[#102A43] to-emerald-950 text-white p-4 sm:p-6 rounded-t-3xl border-b border-[#C9A227]/30 shadow-md">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-xl bg-white/10 border border-[#C9A227]/40 shadow-xs shrink-0">
                  <SchoolLogo size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C9A227] text-[#102A43]">
                      Mwaka 2026/2027
                    </span>
                    <span className="text-[11px] text-emerald-300 font-semibold hidden xs:inline">
                      NECTA S0486
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white leading-tight">
                    {language === 'sw' ? 'Lango Kamili la Udahili & Ada za Shule' : 'Student Admissions & School Fees Portal'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-amber-300">
                    Shule ya Sekondari Uomboni • Marangu, Moshi Vijijini, Kilimanjaro
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === 'apply' && (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Hifadhi rasimu na urudi baadaye"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">Hifadhi Rasimu</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  aria-label="Funga"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Interactive Tabs Bar */}
            <div className="pt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tangazo &amp; Vigezo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('apply')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'apply'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Omba Mtandaoni</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Vitu Muhimu (Checklist)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('forms')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'forms'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Fomu za Kujiunga (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('fees')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'fees'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-102'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Malipo ya Ada &amp; Benki</span>
              </button>
            </div>
          </div>

          {/* Modal Content Sections */}
          <div className="p-4 sm:p-6 md:p-8 space-y-6">

            {/* TAB 1: OVERVIEW & CRITERIA (TANGAZO & VIGEZO) */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Announcement Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-300/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black tracking-wider uppercase border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>UDAHILI 2026/2027 • NAFASI ZIPO WAZI</span>
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#102A43]">
                      Nafasi za Kujiunga Kidato cha 1 &amp; Uhamisho wa Kidato cha 2 na 3
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Shule ya Sekondari Uomboni (NECTA S0486) ni shule ya Kikatoliki iliyo chini ya Jimbo Katoliki la Moshi, inayopokea wavulana na wasichana (Bweni na Kutwa) katika mazingira bora ya kielimu na kimaadili Marangu, Kilimanjaro.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('apply')}
                      className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span>Jaza Fomu Mtandaoni Sasa</span>
                      <ArrowRight className="w-4 h-4 text-amber-300" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('fees')}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#102A43] border border-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-[#C9A227]" />
                      <span>Angalia Ada &amp; Akaunti za Benki</span>
                    </button>
                  </div>
                </div>

                {/* Direct Entry vs Transfer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#102A43] shadow-xs space-y-3">
                    <span className="text-xs font-semibold text-[#C9A227] tracking-wider uppercase">Direct Entry (Wahitimu La 7)</span>
                    <h5 className="text-lg font-bold text-[#102A43]">Kidato cha Kwanza (Form One)</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Wanafunzi waliofaulu Mtihani wa Kumaliza Elimu ya Msingi (PSLE) wanakaribishwa kujiunga. Fomu zinapatikana mtandaoni au ofisi ya shule.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <span>Bweni na Kutwa kwa wavulana na wasichana</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <span>Ada nafuu inayolipwa kwa awamu benki</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#102A43]/15 border-t-4 border-t-[#C9A227] shadow-xs space-y-3">
                    <span className="text-xs font-semibold text-[#102A43] tracking-wider uppercase">Continuing Students (Uhamisho)</span>
                    <h5 className="text-lg font-bold text-[#102A43]">Kidato cha 2 &amp; 3 (Transfers)</h5>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Wanafunzi wenye maendeleo mazuri ya kitaaluma na tabia njema kutoka shule zilizosajiliwa wanakaribishwa kujiunga.
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <span>Kipimo cha alama za mitihani ya awali</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0" />
                        <span>Barua rasmi ya uhamisho na maendeleo</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Criteria & Dates Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h5 className="text-sm sm:text-base font-bold text-[#102A43] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#C9A227]" />
                      <span>Sifa &amp; Vigezo vya Udahili (Admission Criteria)</span>
                    </h5>
                    <div className="space-y-2.5">
                      {admissionRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <span className="w-5 h-5 rounded-full bg-[#FFFFF0] border border-[#102A43]/20 flex items-center justify-center text-[11px] font-bold text-[#102A43] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div>
                      <h5 className="text-sm sm:text-base font-bold text-[#102A43] flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-[#C9A227]" />
                        <span>Tarehe Muhimu (Key Dates)</span>
                      </h5>
                      <div className="space-y-2.5 text-xs sm:text-sm">
                        {admissionDates.map((d) => (
                          <div key={d.event} className="pb-2 border-b border-slate-100 last:border-b-0">
                            <span className="font-semibold text-[#102A43] block">{d.event}</span>
                            <span className="text-slate-500 text-xs">{d.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                      <strong className="text-[#102A43] block">Upatikanaji wa Fomu za Karatasi:</strong>
                      <span>Ofisi ya Shule Marangu, Moshi Bookshop, na Ngarenaro. Mawasiliano: 0752 000 939 / 0782 558 127.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPLY ONLINE (OMBA MTANDAONI) */}
            {activeTab === 'apply' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {draftSavedAlert && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 flex items-center gap-2 text-xs font-bold animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Rasimu ya fomu yako imehifadhiwa salama kwenye kifaa hiki. Unaweza kurudi kuendelea wakati wowote!</span>
                  </div>
                )}

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
                        Namba ya Maombi: <span className="text-emerald-700 font-mono">#{submittedRef}</span>
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
                          <span>{language === 'sw' ? 'Pakua Barua ya Uhakiki (PDF)' : 'Download Verification Slip (PDF)'}</span>
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
                        onClick={handleReset}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                      >
                        Wasilisha Ombi Lingine
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-red-800">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Section 1: Taarifa za Mwanafunzi */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <User className="w-4 h-4 text-[#102A43]" />
                        <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider">
                          1. Taarifa Binafsi za Mwanafunzi (Student Biodata)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">
                            Jina Kamili la Mwanafunzi (Kama lilivyo Cheti cha Kuzaliwa / La Saba) *
                          </label>
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Mfano: KELVIN ALOYCE MARO"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#102A43] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Jinsia (Gender) *</label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="M">Mvulana (Male)</option>
                            <option value="F">Msichana (Female)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Tarehe ya Kuzaliwa (DOB)</label>
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Darasa Analoomba Kujiunga *</label>
                          <select
                            value={applyingFor}
                            onChange={(e) => setApplyingFor(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-[#102A43]"
                          >
                            <option value="Form 1">Kidato cha Kwanza (Form 1)</option>
                            <option value="Form 2 Transfer">Kidato cha Pili (Form 2 Transfer)</option>
                            <option value="Form 3 Transfer">Kidato cha Tatu (Form 3 Transfer)</option>
                            <option value="Pre-Form 1">Pre-Form 1 (Kiingereza &amp; Sayansi)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Aina ya Udahili (Entry Type) *</label>
                          <select
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value as any)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-semibold text-[#102A43]"
                          >
                            <option value="Bweni (Boarding)">Bweni (Boarding Student)</option>
                            <option value="Kutwa (Day)">Kutwa (Day Scholar)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">Shule Aliyotoka (Previous School)</label>
                          <input
                            type="text"
                            value={previousSchool}
                            onChange={(e) => setPreviousSchool(e.target.value)}
                            placeholder="Shule ya Msingi au Sekondari alikotoka..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Namba ya PREM / Namba ya Mtihani La Saba</label>
                          <input
                            type="text"
                            value={premNumber}
                            onChange={(e) => setPremNumber(e.target.value)}
                            placeholder="PS0401089-012"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Taarifa za Mzazi / Mlezi */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Phone className="w-4 h-4 text-[#102A43]" />
                        <h4 className="text-sm font-bold text-[#102A43] uppercase tracking-wider">
                          2. Taarifa za Mzazi au Mlezi (Parent / Guardian)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">Jina Kamili la Mzazi / Mlezi *</label>
                          <input
                            type="text"
                            required
                            value={parentName}
                            onChange={(e) => setParentName(e.target.value)}
                            placeholder="Jina kamili la mzazi..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Uhusiano (Relationship) *</label>
                          <select
                            value={parentRelationship}
                            onChange={(e) => setParentRelationship(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="Mzazi (Parent)">Mzazi (Parent)</option>
                            <option value="Mlezi (Guardian)">Mlezi (Guardian)</option>
                            <option value="Mfadhili (Sponsor)">Mfadhili (Sponsor)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Namba ya Simu ya Mzazi (WhatsApp / Call) *</label>
                          <input
                            type="tel"
                            required
                            value={parentPhone}
                            onChange={(e) => setParentPhone(e.target.value)}
                            placeholder="+255 782 ..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Barua Pepe (Email ya Mzazi)</label>
                          <input
                            type="email"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                            placeholder="mzazi@gmail.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Makazi ya Mzazi (Mji / Wilaya / Kijiji)</label>
                          <input
                            type="text"
                            value={parentAddress}
                            onChange={(e) => setParentAddress(e.target.value)}
                            placeholder="Moshi, Kilimanjaro / Dar es Salaam..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Afya & Tamko la Mzazi */}
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                        <HeartPulse className="w-4 h-4 text-emerald-700" />
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          3. Taarifa za Kiafya &amp; Tamko Rasmi
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Mzio au Magonjwa Maalum (Kama yapo)</label>
                          <input
                            type="text"
                            value={allergies}
                            onChange={(e) => setAllergies(e.target.value)}
                            placeholder="Mfano: Mzio wa dawa fulani, Pumu, n.k."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Simu ya Dharura (Emergency Contact)</label>
                          <input
                            type="tel"
                            value={emergencyContact}
                            onChange={(e) => setEmergencyContact(e.target.value)}
                            placeholder="+255 754 ..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200">
                        <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700">
                          <input
                            type="checkbox"
                            checked={parentConsentDeclared}
                            onChange={(e) => setParentConsentDeclared(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-[#102A43] focus:ring-[#102A43]"
                          />
                          <span>
                            <strong>Tamko la Mzazi/Mlezi:</strong> Nathibitisha kwamba taarifa zote zilizotolewa hapa ni sahihi na niko tayari kufuata sheria na kanuni zote za Shule ya Sekondari Uomboni zilizotolewa kwenye maelekezo ya kujiunga.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handleClearDraft}
                        className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Safisha Fomu (Futa Kila Kitu)
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleSaveDraft}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Hifadhi Rasimu</span>
                        </button>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-300" />
                          <span>Wasilisha Maombi Mtandaoni</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: ESSENTIAL ITEMS CHECKLIST (VITU MUHIMU) */}
            {activeTab === 'checklist' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#102A43] text-white shadow-sm">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Mwongozo Rasmi wa Maandalizi</span>
                    <h4 className="font-serif text-lg sm:text-xl font-bold">Orodha ya Vitu Muhimu vya Kujiunga (Checklist)</h4>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Kila mzazi na mwanafunzi anapaswa kuzingatia maelekezo haya ya vifaa vya masomo, sare, bweni na nyaraka.
                    </p>
                  </div>

                  <button
                    onClick={() => downloadVituMuhimuPdf()}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Pakua Orodha (PDF)</span>
                  </button>
                </div>

                {/* Categories Switcher */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveVituCategory('academic')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeVituCategory === 'academic'
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Taaluma &amp; Daftari</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveVituCategory('uniform')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeVituCategory === 'uniform'
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Sare za Shule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveVituCategory('boarding')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeVituCategory === 'boarding'
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BedDouble className="w-4 h-4" />
                    <span>Bweni &amp; Sanduku</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveVituCategory('documents')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeVituCategory === 'documents'
                        ? 'bg-[#102A43] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Nyaraka &amp; Vyeti</span>
                  </button>
                </div>

                {/* Items List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#102A43]/40 shadow-xs flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {item.quantity || 'Inahitajika'}
                          </span>
                          {item.mandatory && (
                            <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                              Lazima
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-[#102A43] mt-1.5 leading-snug">
                          {item.nameSw}
                        </h5>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.specSw}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Uomboni Checklist</span>
                        <span className="text-emerald-700 font-bold">✓ Muhimu</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prohibited Items Warning */}
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-red-950 mb-0.5">
                      Vitu Vilivyopigwa Marufuku Kabisa Shuleni:
                    </strong>
                    <span>
                      Simu zote za mkononi, hita za umeme, pasi, redio, vifaa vya kielektroniki, nguo za nyumbani zisizoruhusiwa, mapambo ya dhahabu, na vito vya thamani vimepigwa marufuku. Mwanafunzi atakayepatikana navyo atachukuliwa hatua kali za kinidhamu.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OFFICIAL FORMS & JOINING INSTRUCTIONS (FOMU RASMI) */}
            {activeTab === 'forms' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-serif text-lg font-bold text-[#102A43]">
                    Fomu Rasmi za Kujiunga na Shule ya Sekondari Uomboni (2026/2027)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Pakua fomu rasmi zilizoidhinishwa na uongozi wa shule. Fomu hizi zinatakiwa kujazwa, kugongwa mihuri inayotakiwa (hospitali na serikali za mitaa/RITA), na kuwasilishwa shuleni siku ya kuripoti.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Joining Instructions 2027 */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-600" />
                        <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Fomu Kuu Rasmi
                        </span>
                      </div>
                      <h5 className="font-bold text-base text-[#102A43]">
                        Fomu Rasmi ya Maelekezo ya Kujiunga (Joining Instructions 2027)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Inajumuisha kanuni na sheria za shule, ratiba ya masomo, ada za shule, akaunti za benki na maelekezo yote ya safari kuelekea Marangu.
                      </p>
                    </div>

                    <button
                      onClick={() => downloadOfficialJoiningInstructions2027Pdf()}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      <span>Pakua Fomu Rasmi ya Kujiunga (PDF)</span>
                    </button>
                  </div>

                  {/* Medical Form */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                        <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Upimaji Afya
                        </span>
                      </div>
                      <h5 className="font-bold text-base text-[#102A43]">
                        Fomu ya Upimaji Afya ya Daktari (Medical Examination Form)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Inapaswa kujazwa na kupimwa na daktari aliyesajiliwa katika hospitali ya serikali au hospitali inayotambuliwa kabla ya mwanafunzi kuripoti shuleni.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsMedicalModalOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-200" />
                      <span>Fungua &amp; Pakua Fomu ya Afya (PDF)</span>
                    </button>
                  </div>

                  {/* Vitu Muhimu Checklist PDF */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <span className="text-[10px] font-bold uppercase text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Orodha ya Vitu
                        </span>
                      </div>
                      <h5 className="font-bold text-base text-[#102A43]">
                        Orodha Kamili ya Mahitaji (Vitu Muhimu Checklist PDF)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Orodha inayoelezea kila kifaa, vipimo, idadi, na aina ya masanduku ya chuma na madaftari yanayotakiwa.
                      </p>
                    </div>

                    <button
                      onClick={() => downloadVituMuhimuPdf()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#102A43] border border-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-[#C9A227]" />
                      <span>Pakua Orodha ya Vitu Muhimu (PDF)</span>
                    </button>
                  </div>

                  {/* Online Verification Letter */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Printer className="w-5 h-5 text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Uthibitisho wa Maombi
                        </span>
                      </div>
                      <h5 className="font-bold text-base text-[#102A43]">
                        Barua ya Uhakiki wa Udahili (Admission Verification)
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ukikamilisha kujaza fomu mtandaoni, mfumo unazalisha barua rasmi ya uthibitisho yenye QR Code na namba ya kumbukumbu.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('apply')}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Nenda kwenye Fomu ya Maombi</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: FEES & BANKING (MALIPO YA ADA & BENKI) */}
            {activeTab === 'fees' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Bank Accounts Grid */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#102A43] flex items-center gap-2">
                        <Building className="w-5 h-5 text-[#C9A227]" />
                        <span>Akaunti Rasmi za Benki kwa Malipo ya Ada</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Malipo yote ya ada yafanyike kwenye akaunti za shule zifuatazo pekee:
                      </p>
                    </div>

                    <a
                      href={getBursarWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat na Mhasibu WhatsApp</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bankAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-[#102A43]/40 transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase text-[#102A43] bg-[#FFFFF0] px-2.5 py-1 rounded-md border border-[#102A43]/20">
                            {acc.bankName}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">{acc.type}</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase text-slate-400 font-semibold block">Jina la Akaunti:</span>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{acc.accountName}</div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 font-mono block">Namba ya Akaunti:</span>
                            <span className="text-sm sm:text-base font-bold font-mono text-[#102A43] tracking-wider">
                              {acc.accountNumber}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopy(acc.accountNumber, acc.id)}
                            className="px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            {copiedBankId === acc.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-amber-300" />
                                <span>Imenakiliwa</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Nakili</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>Tawi: {acc.branch}</span>
                          <span className="font-mono">SWIFT: {acc.swiftCode}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee Structure Summary Table */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h5 className="font-bold text-sm text-[#102A43] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C9A227]" />
                    <span>Muhtasari wa Ada za Shule kwa Mwaka (Fee Structure)</span>
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <thead className="bg-[#102A43] text-white">
                        <tr>
                          <th className="p-3">Kidato (Form)</th>
                          <th className="p-3">Aina ya Mwanafunzi</th>
                          <th className="p-3">Awamu ya 1 (Muhula wa I)</th>
                          <th className="p-3">Awamu ya 2 (Muhula wa II)</th>
                          <th className="p-3">Jumla kwa Mwaka</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-bold text-[#102A43]">Kidato cha 1 - 4</td>
                          <td className="p-3 font-medium">Bweni (Boarding)</td>
                          <td className="p-3 font-mono">TZS 800,000</td>
                          <td className="p-3 font-mono">TZS 800,000</td>
                          <td className="p-3 font-bold font-mono text-emerald-800">TZS 1,600,000</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-3 font-bold text-[#102A43]">Kidato cha 1 - 4</td>
                          <td className="p-3 font-medium">Kutwa (Day)</td>
                          <td className="p-3 font-mono">TZS 300,000</td>
                          <td className="p-3 font-mono">TZS 300,000</td>
                          <td className="p-3 font-bold font-mono text-emerald-800">TZS 600,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    * Ada inaweza kulipwa kwa awamu mbili au nne kulingana na makubaliano na uongozi wa shule / Bursar.
                  </p>
                </div>

                {/* Submit Payment Proof & Generate Receipt */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <FileCheck className="w-5 h-5 text-[#102A43]" />
                    <h5 className="font-bold text-sm sm:text-base text-[#102A43]">
                      Wasilisha Taarifa za Muamala &amp; Pata Risiti ya Kielektroniki
                    </h5>
                  </div>

                  {submittedReceipt ? (
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-in zoom-in-95">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-800">Taarifa ya Malipo Imewasilishwa</span>
                        <h4 className="text-lg font-black text-slate-900">
                          Risiti Namba: <span className="font-mono text-emerald-700">{submittedReceipt.receiptNumber}</span>
                        </h4>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs text-left max-w-md mx-auto space-y-1.5">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Mwanafunzi:</span>
                          <span className="font-bold text-slate-900">{submittedReceipt.studentName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Kidato:</span>
                          <span className="font-mono">{submittedReceipt.form}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Kiasi Kilicholipwa:</span>
                          <span className="font-bold text-emerald-800 font-mono">TZS {Number(submittedReceipt.amount).toLocaleString()} /=</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-500">Kumbukumbu ya Muamala:</span>
                          <span className="font-mono">{submittedReceipt.transactionReference}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-500">Hali:</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">{submittedReceipt.status}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <a
                          href={getBursarWhatsAppUrl({
                            studentName: submittedReceipt.studentName,
                            form: submittedReceipt.form,
                            amount: String(submittedReceipt.amount),
                            ref: submittedReceipt.transactionReference,
                            receiptNo: submittedReceipt.receiptNumber,
                          })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Tuma Risiti kwa Bursar WhatsApp</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setSubmittedReceipt(null)}
                          className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                        >
                          Wasilisha Malipo Mengine
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="font-bold text-slate-700 block mb-1">Jina Kamili la Mwanafunzi *</label>
                          <input
                            type="text"
                            required
                            value={feeStudentName}
                            onChange={(e) => setFeeStudentName(e.target.value)}
                            placeholder="Jina la mwanafunzi..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Kidato *</label>
                          <select
                            value={feeSelectedForm}
                            onChange={(e) => setFeeSelectedForm(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-medium"
                          >
                            <option value="Form 1">Kidato cha 1 (Form 1)</option>
                            <option value="Form 2">Kidato cha 2 (Form 2)</option>
                            <option value="Form 3">Kidato cha 3 (Form 3)</option>
                            <option value="Form 4">Kidato cha 4 (Form 4)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Kiasi Kilicholipwa (TZS) *</label>
                          <input
                            type="number"
                            required
                            value={feeAmount}
                            onChange={(e) => setFeeAmount(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-mono font-bold text-[#102A43]"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Njia / Benki Uliyolipia *</label>
                          <select
                            value={feePaymentMethod}
                            onChange={(e) => setFeePaymentMethod(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                          >
                            <option value="CRDB Bank - 01J1079051400">CRDB Bank (01J1079051400)</option>
                            <option value="NMB Bank - 40302507439">NMB Bank (40302507439)</option>
                            <option value="Mkombozi Bank - 0051150397901">Mkombozi Bank (0051150397901)</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Namba ya Simu ya Mzazi *</label>
                          <input
                            type="tel"
                            required
                            value={feeParentPhone}
                            onChange={(e) => setFeeParentPhone(e.target.value)}
                            placeholder="+255 754 ..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="font-bold text-slate-700 block mb-1">
                            Kumbukumbu ya Muamala / Slip No / Reference *
                          </label>
                          <input
                            type="text"
                            required
                            value={feeTransactionRef}
                            onChange={(e) => setFeeTransactionRef(e.target.value)}
                            placeholder="Mfano: TXN-98214 au Kumbukumbu ya slip ya benki..."
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 text-amber-300" />
                        <span>Wasilisha Malipo &amp; Tengeneza Risiti</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Standalone Medical Examination Modal if triggered */}
      {isMedicalModalOpen && (
        <MedicalExaminationFormModal
          isOpen={isMedicalModalOpen}
          onClose={() => setIsMedicalModalOpen(false)}
        />
      )}
    </>
  );
};

export default ApplyNowModal;
