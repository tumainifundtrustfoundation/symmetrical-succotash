import React, { useState } from 'react';
import {
  HeartPulse,
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  Building,
  User,
  Calendar,
  Phone,
  FileText,
  Lock,
  Activity,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import {
  downloadOfficialMedicalExaminationFormPdf,
  printOfficialMedicalExaminationFormDirectly,
  MedicalExaminationPdfParams,
} from '../utils/pdfService';

interface MedicalExaminationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  applicationNumber?: string;
  dateOfBirth?: string;
  age?: string | number;
  gender?: 'M' | 'F' | string;
  form?: string;
  academicYear?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  premNumber?: string;
}

export const MedicalExaminationFormModal: React.FC<MedicalExaminationFormModalProps> = ({
  isOpen,
  onClose,
  studentName = '',
  applicationNumber = '',
  dateOfBirth = '',
  age = '',
  gender = 'M',
  form = 'Form 1 (Kidato cha I)',
  academicYear = '2026/2027',
  parentName = '',
  parentPhone = '',
  address = '',
  premNumber = '',
}) => {
  const [formData, setFormData] = useState<MedicalExaminationPdfParams>({
    studentName,
    applicationNumber,
    dateOfBirth,
    age,
    gender,
    form,
    academicYear,
    parentName,
    parentPhone,
    address,
    premNumber,
  });

  const [activePreviewPage, setActivePreviewPage] = useState<'all' | 'p1' | 'p2'>('all');

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadOfficialMedicalExaminationFormPdf(formData);
  };

  const handlePrint = () => {
    printOfficialMedicalExaminationFormDirectly(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#0B2545] text-white p-4 sm:p-6 rounded-t-3xl border-b border-[#047857]/40 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold shrink-0">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#047857] text-white">
                  NECTA S0486
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  A4 Print-Ready PDF
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 text-slate-200">
                  2 Pages (Kurasa 2)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Student Medical Examination Form • Fomu ya Uchunguzi wa Afya
              </h3>
              <p className="text-xs text-slate-300">
                Shule ya Sekondari Uomboni • Moshi – Marangu, Kilimanjaro, Tanzania
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Chapisha Fomu (Print)"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#047857] hover:bg-[#036045] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              title="Pakua Fomu ya PDF"
            >
              <Download className="w-4 h-4" />
              <span>Pakua PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Funga"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-7 space-y-6 text-slate-800">
          {/* Privacy & Medical Responsibility Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">
                Mwongozo Rasmi wa Fomu ya Uchunguzi wa Afya (Official Medical Form):
              </p>
              <p className="mt-0.5 text-emerald-800">
                1. <strong>Ujazaji wa Kitabibu:</strong> Fomu hii inapaswa kujazwa na kuthibitishwa na <strong>Daktari au Afisa wa Afya aliyesajiliwa (Registered Medical Practitioner)</strong> kutoka Hospitali au Kituo cha Afya kinachotambulika na Serikali.<br />
                2. <strong>Usiri na Usalama:</strong> Taarifa zote za afya zinalindwa kwa usiri mkubwa kwa ajili ya ustawi, lishe, na dharura za mwanafunzi shuleni. Hakuna matokeo ya uongo au utambuzi bandia utakaowekwa na mfumo.<br />
                3. <strong>Muundo wa A4:</strong> Fomu imepangwa katika kurasa mbili (Page 1 &amp; Page 2) zenye nafasi kubwa ya kuandika kwa mkono na kupiga muhuri rasmi wa hospitali.
              </p>
            </div>
          </div>

          {/* Prefill Form Input bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#0B2545] uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-emerald-700" />
                <span>Binafsisha Taarifa za Awali Kabla ya Kupakua / Kuchapisha:</span>
              </span>
              <span className="text-[11px] text-slate-500 italic">
                * Unaweza pia kuacha wazi ili mwanafunzi au mzazi ajaze kwa mkono baada ya kuchapisha.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jina Kamili la Mwanafunzi:
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Mf. Bahati Eliud Mushi"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Namba ya Udahili (Reg/App No):
                </label>
                <input
                  type="text"
                  value={formData.applicationNumber}
                  onChange={(e) => setFormData({ ...formData, applicationNumber: e.target.value })}
                  placeholder="APP-2026-XXXX"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tarehe ya Kuzaliwa &amp; Umri:
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    placeholder="DD/MM/YYYY"
                    className="w-2/3 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Umri"
                    className="w-1/3 px-2 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jinsia (Gender):
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="M">Kiume (Male)</option>
                  <option value="F">Kike (Female)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kidato / Darasa (Class):
                </label>
                <input
                  type="text"
                  value={formData.form}
                  onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                  placeholder="Mf. Form 1 au Form 5 (PCB)"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jina la Mzazi / Mlezi:
                </label>
                <input
                  type="text"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  placeholder="Jina la Mzazi"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Simu ya Mzazi:
                </label>
                <input
                  type="text"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="+255 7XX XXX XXX"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Anwani ya Makazi &amp; Posta:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Mf. S.L.P 361 Marangu, Moshi"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Preview Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Muonekano wa Fomu (Document Sheet Preview):
            </span>
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setActivePreviewPage('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activePreviewPage === 'all'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kurasa Zote (2)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewPage('p1')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activePreviewPage === 'p1'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ukurasa 1
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewPage('p2')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  activePreviewPage === 'p2'
                    ? 'bg-white text-[#0B2545] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ukurasa 2
              </button>
            </div>
          </div>

          {/* PAGE 1 PREVIEW */}
          {(activePreviewPage === 'all' || activePreviewPage === 'p1') && (
            <div className="p-6 sm:p-8 bg-white border-2 border-slate-300 rounded-2xl shadow-sm space-y-5 text-slate-800 font-sans text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  UKURASA 1 KATI YA 2 (PAGE 1 OF 2): TAARIFA &amp; HISTORIA YA AFYA
                </span>
                <span className="text-[10px] text-slate-500 font-mono">A4 Portrait • Print-Ready</span>
              </div>

              {/* Sheet Header */}
              <div className="bg-[#0B2545] text-white p-4 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Reserved Space for Logo */}
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 shrink-0 flex flex-col items-center justify-center border-2 border-[#047857] text-[#0B2545] shadow-inner">
                  <div className="w-8 h-8 rounded-full border border-emerald-600 flex items-center justify-center text-[8px] font-bold text-emerald-700">
                    LOGO
                  </div>
                  <span className="text-[7px] font-bold mt-1 text-slate-700">UOMBONI</span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-amber-300 tracking-wider">
                    JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI
                  </p>
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                    SHULE YA SEKONDARI UOMBONI • UOMBONI SECONDARY SCHOOL
                  </h1>
                  <p className="text-[11px] text-slate-200">
                    Moshi – Marangu, Kilimanjaro, Tanzania • S.L.P. 361 Marangu • Kituo cha NECTA: <strong>S0486</strong>
                  </p>
                  <p className="text-[10px] text-emerald-300">
                    Simu / Tel: +255 782 558 127 / +255 754 492 841 • Barua Pepe: info@uombonisecondary.sc.tz
                  </p>
                </div>
              </div>

              {/* Title Strip */}
              <div className="bg-[#047857] text-white text-center py-2 px-3 rounded-lg font-bold text-xs uppercase tracking-wider">
                STUDENT MEDICAL EXAMINATION FORM • FOMU YA UCHUNGUZI WA AFYA YA MWANAFUNZI
              </div>

              {/* Confidentiality Notice */}
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-[11px] text-emerald-950">
                <span className="font-bold text-emerald-900 block mb-0.5">
                  ILANI YA USIRI NA MAAGIZO (CONFIDENTIALITY NOTICE &amp; INSTRUCTIONS):
                </span>
                Taarifa za afya zinatunzwa kwa usiri mkubwa kwa ajili ya ustawi na ulinzi wa mwanafunzi. Fomu hii lazima ijazwe na kuthibitishwa na Daktari aliyesajiliwa kutoka Hospitali/Kituo cha Afya kinachotambulika kisheria.
              </div>

              {/* Section 1: Student Information */}
              <div className="space-y-2">
                <div className="bg-[#0B2545] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 1 / SEHEMU 1: STUDENT INFORMATION • TAARIFA ZA MWANAFUNZI
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold block text-[10px]">1. Full Name / Jina Kamili:</span>
                    <span className="font-bold text-slate-900 uppercase">
                      {formData.studentName || '________________________________________________'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Reg / App No:</span>
                    <span className="font-mono text-emerald-800 font-bold">
                      {formData.applicationNumber || 'APP-2026-________'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">2. Date of Birth / Tarehe ya Kuzaliwa:</span>
                    <span>{formData.dateOfBirth || '_____ / _____ / ________'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Age / Umri:</span>
                    <span>{formData.age ? `${formData.age} Yrs / Miaka` : '_____ Yrs / Miaka'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Sex / Jinsia:</span>
                    <span>
                      {formData.gender === 'F' ? '[X] Female / Kike   [ ] Male / Kiume' : '[X] Male / Kiume   [ ] Female / Kike'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">3. Class / Kidato:</span>
                    <span className="font-semibold">{formData.form || 'Form 1 (Kidato cha I)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Academic Year / Mwaka:</span>
                    <span>{formData.academicYear || '2026/2027'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">PREM / Exam No:</span>
                    <span className="font-mono">{formData.premNumber || '____________________'}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold block text-[10px]">4. Parent / Guardian Name (Mzazi / Mlezi):</span>
                    <span>{formData.parentName || '________________________________________________'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block text-[10px]">Parent Phone / Simu:</span>
                    <span className="font-mono">{formData.parentPhone || '+255 __________________'}</span>
                  </div>

                  <div className="sm:col-span-3">
                    <span className="text-slate-500 font-semibold block text-[10px]">5. Residential &amp; Postal Address (Anwani ya Makazi):</span>
                    <span>{formData.address || 'S.L.P. ____________, Mji / Kijiji: ________________________, Mkoa: ________________________'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Medical History */}
              <div className="space-y-2">
                <div className="bg-[#047857] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 2 / SEHEMU 2: MEDICAL HISTORY • HISTORIA YA AFYA NA MAGONJWA
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Ijazwe na Mzazi akishirikiana na Daktari. Weka alama [X] panapohusika (To be completed with Parent/Guardian):
                </p>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-100 text-[#0B2545] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2 w-8 text-center">Na.</th>
                        <th className="p-2">Condition / Ugonjwa au Hali ya Kiafya</th>
                        <th className="p-2 w-28 text-center">Hali (Status)</th>
                        <th className="p-2">Clinical Details / Ufafanuzi iwapo jibu ni NDIYO</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 text-center font-bold">1</td>
                        <td className="p-2">
                          <strong>Allergies:</strong> Penicillin, sulfa, antibiotics, specific foods, insect stings<br />
                          <span className="text-slate-500 text-[10px]">Mzio wa dawa au vyakula maalum</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">2</td>
                        <td className="p-2">
                          <strong>Asthma:</strong> Chronic chest tightness, wheezing or breathlessness<br />
                          <span className="text-slate-500 text-[10px]">Pumu au matatizo ya mara kwa mara ya kifua</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">3</td>
                        <td className="p-2">
                          <strong>Epilepsy / Convulsions:</strong> Fainting spells, fits, loss of consciousness<br />
                          <span className="text-slate-500 text-[10px]">Kifafa, degedege au kupoteza fahamu/kuzirai</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">4</td>
                        <td className="p-2">
                          <strong>Diabetes Mellitus:</strong> Sugar condition / insulin / medication<br />
                          <span className="text-slate-500 text-[10px]">Ugonjwa wa kisukari</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">5</td>
                        <td className="p-2">
                          <strong>Heart Conditions:</strong> Rheumatic fever, murmurs, hypertension<br />
                          <span className="text-slate-500 text-[10px]">Magonjwa ya moyo au shinikizo la damu</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">6</td>
                        <td className="p-2">
                          <strong>Sickle Cell:</strong> Sickle cell disease or trait<br />
                          <span className="text-slate-500 text-[10px]">Selimundu (Sickle Cell)</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">7</td>
                        <td className="p-2">
                          <strong>Long-term Medication:</strong> Regular prescription medication in use<br />
                          <span className="text-slate-500 text-[10px]">Dawa za kudumu anazotumia kila siku au mara kwa mara</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">8</td>
                        <td className="p-2">
                          <strong>Previous Surgery / Admissions:</strong> Major operations or fractures<br />
                          <span className="text-slate-500 text-[10px]">Upasuaji au kulazwa hospitalini huko nyuma</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-bold">9</td>
                        <td className="p-2">
                          <strong>Other Medical Conditions:</strong> Physical challenges or ongoing care<br />
                          <span className="text-slate-500 text-[10px]">Magonjwa au changamoto nyinginezo za kiafya</span>
                        </td>
                        <td className="p-2 text-center font-mono">[ ] Ndiyo  [ ] Hapana</td>
                        <td className="p-2 text-slate-400">...........................................................................</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7: Parent / Guardian Declaration */}
              <div className="space-y-2">
                <div className="bg-[#0B2545] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 7 / SEHEMU 7: PARENT / GUARDIAN DECLARATION • TAMKO LA MZAZI AU MLEZI
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-lg space-y-2">
                  <p className="text-[11px] text-amber-950 leading-relaxed">
                    Ninathibitisha kwamba taarifa zote za historia ya afya nilizozitoa hapo juu ni za kweli na sahihi kwa kadiri ya ufahamu wangu. Ikitokea dharura ya kiafya shuleni, ninaruhusu uongozi wa shule na wahudumu wa afya kutoa huduma ya kwanza na matibabu stahiki. (I certify that the above medical history is accurate and complete).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className="sm:col-span-2">
                      <span className="text-slate-500 font-semibold block text-[10px]">Jina la Mzazi:</span>
                      <span className="font-semibold">{formData.parentName || '________________________________________'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">Sahihi ya Mzazi:</span>
                      <span className="text-slate-400">________________________</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold block text-[10px]">Tarehe:</span>
                      <span>_____ / _____ / 20____</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2 PREVIEW */}
          {(activePreviewPage === 'all' || activePreviewPage === 'p2') && (
            <div className="p-6 sm:p-8 bg-white border-2 border-slate-300 rounded-2xl shadow-sm space-y-5 text-slate-800 font-sans text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  UKURASA 2 KATI YA 2 (PAGE 2 OF 2): UCHUNGUZI WA KIMWILI, VIPIMO NA TATHMINI
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Clinician Examination &amp; Stamp</span>
              </div>

              {/* Sub-header Reference */}
              <div className="bg-[#0B2545] text-white p-3 rounded-xl flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xs uppercase tracking-wider">
                    UOMBONI SECONDARY SCHOOL • CLINICAL EXAMINATION &amp; ASSESSMENT
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Mwanafunzi: <strong>{formData.studentName || '________________________'}</strong> • Kidato: {formData.form || 'Form 1'}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#047857] text-white rounded font-bold text-[10px]">
                  PAGE 2 OF 2
                </span>
              </div>

              {/* Section 3: Physical Examination */}
              <div className="space-y-2">
                <div className="bg-[#047857] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 3 / SEHEMU 3: PHYSICAL EXAMINATION • UCHUNGUZI WA KIMWILI (CLINICIAN ONLY)
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Ifanywe na kurekodiwa na Daktari aliyesajiliwa (Must be recorded by Registered Medical Practitioner):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">VIPIMO VYA MSINGI (VITALS):</span>
                    <p className="text-[11px] space-y-0.5">
                      • Kimo (Height): _____ cm<br />
                      • Uzito (Weight): _____ kg<br />
                      • Joto (Temp): _____ °C
                    </p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">SHINIKIZO &amp; UPUMUAJI:</span>
                    <p className="text-[11px] space-y-0.5">
                      • BP: _____ / _____ mmHg<br />
                      • Pulse Rate: _____ bpm<br />
                      • Respiratory Rate: _____ /min
                    </p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">MACHO NA USIKIVU:</span>
                    <p className="text-[11px] space-y-0.5">
                      • Vision: R 6/___  L 6/___<br />
                      • Color Vision: [ ] Normal [ ] Impaired<br />
                      • Hearing: R [ ] Ok  L [ ] Ok
                    </p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded sm:col-span-2">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">MFUMO WA UPUMUAJI &amp; MOYO (RESPIRATORY &amp; CVS):</span>
                    <p className="text-[11px]">
                      • Lungs/Chest: [ ] Normal  [ ] Abnormal: ___________________________________<br />
                      • CVS (Heart): [ ] Normal  [ ] Murmurs: _____________________________________
                    </p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">TUMBO &amp; NGOZI:</span>
                    <p className="text-[11px]">
                      • Abdomen: [ ] Normal [ ] Abnormal<br />
                      • Skin: [ ] Normal [ ] Rashes/Ulcers
                    </p>
                  </div>

                  <div className="p-2 bg-white border border-slate-200 rounded sm:col-span-3">
                    <span className="font-bold text-[#0B2545] block text-[10px] mb-1">HALI YA AFYA KWA UJUMLA (GENERAL HEALTH):</span>
                    <p className="text-[11px]">
                      Pallor: [ ] Nil [ ] Present &nbsp;&nbsp;|&nbsp;&nbsp; Jaundice: [ ] Nil [ ] Present &nbsp;&nbsp;|&nbsp;&nbsp; Lymph nodes: [ ] Normal [ ] Enlarged &nbsp;&nbsp;|&nbsp;&nbsp; Nutritional Status: [ ] Excellent [ ] Good [ ] Fair [ ] Poor
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Medical Investigations */}
              <div className="space-y-2">
                <div className="bg-[#0B2545] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 4 / SEHEMU 4: MEDICAL INVESTIGATIONS • VIPIMO VYA MAABARA (WHEN INDICATED)
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-[11px]">
                  <p className="text-slate-600">
                    <strong>1. Hemoglobin (Hb / FBP):</strong> Result: ____________ g/dL (Reference: 11.5 - 16.5 g/dL)
                  </p>
                  <p className="text-slate-600">
                    <strong>2. Urinalysis (Mkojo):</strong> Albumin: ____________ &nbsp;&nbsp; Sugar: ____________ &nbsp;&nbsp; Pus cells: ____________
                  </p>
                  <p className="text-slate-600">
                    <strong>3. Stool Analysis (Choo):</strong> Ova / Cysts / Parasites: ____________________________________________________
                  </p>
                  <p className="text-slate-600">
                    <strong>4. TB Screening:</strong> [ ] Negative &nbsp;&nbsp; [ ] Positive / Suspected (CXR: ______________________________)
                  </p>
                  <p className="text-slate-600">
                    <strong>5. Other Tests (Blood Group, Sickling, etc.):</strong> Blood Group: _______ &nbsp;&nbsp; Sickling: _______________________
                  </p>
                </div>
              </div>

              {/* Section 5: Medical Assessment */}
              <div className="space-y-2">
                <div className="bg-[#047857] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 5 / SEHEMU 5: MEDICAL ASSESSMENT &amp; ADVICE • TATHMINI YA DAKTARI
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-lg space-y-2 text-[11px]">
                  <p className="font-bold text-[#0B2545]">Uamuzi wa Kimatibabu kuhusu Uwezo wa Mwanafunzi (Fitness to Attend School):</p>
                  <div className="space-y-1.5 pl-1">
                    <p>
                      <strong>[  ] 1. FIT (ANAFAA):</strong> Medically fit for full boarding life, regular academic routine, and physical education/sports.
                    </p>
                    <p>
                      <strong>[  ] 2. FIT WITH RESTRICTIONS:</strong> Fit with specific medical conditions / dietary needs (masharti maalum): ________________________________
                    </p>
                    <p>
                      <strong>[  ] 3. TEMPORARILY UNFIT:</strong> Requires medical treatment / referral prior to reporting to school: ______________________________________
                    </p>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 text-slate-700 space-y-1">
                    <p><strong>Ushauri wa Kitabibu (Medical Advice):</strong> ____________________________________________________________________________________________</p>
                    <p><strong>Msaada Shuleni (Special Support Needed):</strong> ________________________________________________________________________________________</p>
                  </div>
                </div>
              </div>

              {/* Section 6: Medical Practitioner Details & Stamp */}
              <div className="space-y-2">
                <div className="bg-[#0B2545] text-white px-3 py-1.5 rounded font-bold text-[11px] uppercase tracking-wider">
                  SECTION 6 / SEHEMU 6: MEDICAL PRACTITIONER DETAILS &amp; OFFICIAL STAMP
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="sm:col-span-8 space-y-2 text-[11px]">
                    <p>
                      <strong>Jina Kamili la Daktari (Doctor's Name):</strong><br />
                      <span className="text-slate-400">________________________________________________________________________</span>
                    </p>
                    <p>
                      <strong>Kada / Sifa za Kitaaluma:</strong> MD / AMO / CO [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ] &nbsp;&nbsp;&nbsp; <strong>Reg No:</strong> ____________________
                    </p>
                    <p>
                      <strong>Kituo cha Afya / Hospitali (Health Facility):</strong><br />
                      <span className="text-slate-400">________________________________________________________________________</span>
                    </p>
                    <p>
                      <strong>Tarehe:</strong> _____ / _____ / 20____ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Sahihi ya Daktari:</strong> _________________________________
                    </p>
                  </div>

                  <div className="sm:col-span-4 border-2 border-dashed border-[#047857] rounded-xl flex flex-col items-center justify-center p-4 text-center bg-white min-h-[120px]">
                    <Building className="w-8 h-8 mb-1.5 text-emerald-700" />
                    <span className="text-[11px] font-bold uppercase text-[#0B2545]">MUHURI WA HOSPITALI</span>
                    <span className="text-[9px] text-slate-500 font-semibold">(Official Health Facility Stamp)</span>
                    <span className="text-[8px] text-slate-400 mt-1 italic">[ Weka Muhuri Hapa ]</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Sera ya Shule: Taarifa za afya zinalindwa kwa mujibu wa miongozo ya Wizara ya Afya na Wizara ya Elimu.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Chapisha (Print)</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-[#047857] hover:bg-[#036045] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Pakua Fomu ya PDF (A4)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
