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
} from 'lucide-react';
import {
  downloadJoiningInstructionsPdf,
  downloadAdmissionVerificationLetterPdf,
  downloadOfficialMedicalExaminationFormPdf,
} from '../utils/pdfService';
import { OnlineApplication } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { MedicalExaminationFormModal } from './MedicalExaminationFormModal';

interface ApplyNowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DRAFT_STORAGE_KEY = 'uomboni_admission_application_draft';

export const ApplyNowModal: React.FC<ApplyNowModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { joiningDocs, submitOnlineApplication } = useData();

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

    // Clear saved draft upon successful submission
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
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
          
          {/* Modal Header */}
          <div className="sticky top-0 z-20 bg-gradient-to-r from-emerald-950 via-[#102A43] to-emerald-950 text-white p-5 sm:p-6 rounded-t-3xl border-b border-[#C9A227]/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-xl bg-white/10 border border-[#C9A227]/40 shadow-xs shrink-0">
                <SchoolLogo size="sm" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C9A227] text-[#102A43]">
                    Mwaka 2026/2027
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold">
                    NECTA S0486
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {language === 'sw' ? 'Maombi ya Kujiunga na Shule Mtandaoni' : 'Online Student Admission Application'}
                </h3>
                <p className="text-xs text-amber-300">
                  Shule ya Sekondari Uomboni • Marangu, Kilimanjaro
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="Hifadhi rasimu na urudi baadaye"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Hifadhi Rasimu</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Funga"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-8 space-y-6">
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
                    Namba ya Maombi:{' '}
                    <span className="text-emerald-700 font-mono">#{submittedRef}</span>
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  {language === 'sw'
                    ? `Asante sana kwa kuomba kujiunga na Shule ya Sekondari Uomboni kwa niaba ya ${studentName}. Maombi yako yameingizwa kwenye mfumo wa udahili kwa hadhi ya "Inasubiri Uhakiki". Uongozi utawasiliana nawe kupitia ${parentPhone}.`
                    : `Thank you for applying to Uomboni Secondary on behalf of ${studentName}. Application status is now Pending Review. We will reach you at ${parentPhone}.`}
                </p>

                {/* Post-submission action buttons */}
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
                        Aina ya Masomo
                      </label>
                      <select
                        value={entryType}
                        onChange={(e) => setEntryType(e.target.value as any)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="Bweni (Boarding)">Bweni (Boarding)</option>
                        <option value="Kutwa (Day)">Kutwa (Day Scholar)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PREVIOUS ACADEMIC RECORD & PREM NUMBER */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/15">
                  <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <School className="w-4 h-4 text-emerald-700" />
                    <span>2. Taarifa za Shule Aliyotoka &amp; Namba ya PREM / Mtihani</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Shule ya Msingi / Awali
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Marangu Primary School"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Namba ya PREM au Namba ya Mtihani (PSLE) *
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: 2018-0486-1021 au PS020486-012"
                        value={premNumber}
                        onChange={(e) => setPremNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Matokeo ya La Saba / Wastani
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Daraja A (Alama 245)"
                        value={primaryResults}
                        onChange={(e) => setPrimaryResults(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: PARENT / GUARDIAN DETAILS */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/15">
                  <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>3. Taarifa za Mzazi / Mlezi (Parent / Guardian)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Jina Kamili la Mzazi / Mlezi *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jina lako kamili"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Namba ya Simu *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+255 7XX XXX XXX"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs"
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
                        <option value="Mzazi (Baba)">Mzazi (Baba / Father)</option>
                        <option value="Mzazi (Mama)">Mzazi (Mama / Mother)</option>
                        <option value="Mlezi (Guardian)">Mlezi (Guardian)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Barua Pepe (Email)
                      </label>
                      <input
                        type="email"
                        placeholder="mzazi@example.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Anuani / Makazi (Mkoa, Wilaya, Kijiji)
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Marangu West, Moshi au Arusha"
                        value={parentAddress}
                        onChange={(e) => setParentAddress(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: MEDICAL INFORMATION (PRIVACY PROTECTED) */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-300/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                      <span>4. Taarifa za Afya na Usalama (Medical &amp; Privacy Protected)</span>
                    </h4>

                    <button
                      type="button"
                      onClick={() => setIsMedicalModalOpen(true)}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Tazama Fomu Rasmi ya Hospitali (Medical Form PDF)</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Taarifa hizi zinalindwa kwa usiri mkubwa na zinatumiwa na zahanati ya shule kwa ajili ya usalama wa mwanafunzi. Mwanafunzi pia atatakiwa kuleta Fomu ya Upimaji wa Hospitali iliyosainiwa na Daktari.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Mizio (Allergies) - Chakula au Dawa
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Mzio wa Penicillin, Karanga au Hakuna"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Magonjwa Sugu / Changamoto za Afya
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Pumu (Asthma), Kifafa au Hakuna"
                        value={chronicConditions}
                        onChange={(e) => setChronicConditions(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Kundi la Damu (Blood Group)
                      </label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option value="">Chagua au Haijulikani</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Dawa Anazotumia Mara kwa Mara
                      </label>
                      <input
                        type="text"
                        placeholder="Mfano: Inhaler ya pumu au Hakuna"
                        value={regularMedication}
                        onChange={(e) => setRegularMedication(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Namba ya Dharura ya Ziada
                      </label>
                      <input
                        type="tel"
                        placeholder="+255 7XX XXX XXX"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: SUPPORTING DOCUMENTS IDENTIFICATION */}
                <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/15">
                  <h4 className="text-xs font-black text-[#102A43] uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>5. Nyaraka Zinazoambatishwa (Supporting Documents Checklist)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        1. Cheti cha Kuzaliwa (RITA Birth Certificate)
                      </label>
                      <input
                        type="text"
                        placeholder="Namba ya Cheti au Jina la Faili"
                        value={birthCertDoc}
                        onChange={(e) => setBirthCertDoc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        2. Cheti / Result Slip ya Mtihani wa Darasa la 7
                      </label>
                      <input
                        type="text"
                        placeholder="Namba ya Result Slip au Faili"
                        value={psleResultDoc}
                        onChange={(e) => setPsleResultDoc(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 6: PARENT DECLARATION & CONSENT */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>6. Tamko na Idhini ya Mzazi / Mlezi (Declaration &amp; Consent)</span>
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
