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
} from 'lucide-react';
import { SchoolLogo } from './SchoolLogo';
import {
  downloadOfficialMedicalExaminationFormPdf,
  printOfficialMedicalExaminationFormDirectly,
} from '../utils/pdfService';

interface MedicalExaminationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  applicationNumber?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | string;
  parentName?: string;
  parentPhone?: string;
  premNumber?: string;
}

export const MedicalExaminationFormModal: React.FC<MedicalExaminationFormModalProps> = ({
  isOpen,
  onClose,
  studentName = '',
  applicationNumber = '',
  dateOfBirth = '',
  gender = 'M',
  parentName = '',
  parentPhone = '',
  premNumber = '',
}) => {
  const [formData, setFormData] = useState({
    studentName,
    applicationNumber,
    dateOfBirth,
    gender,
    parentName,
    parentPhone,
    premNumber,
  });

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadOfficialMedicalExaminationFormPdf(formData);
  };

  const handlePrint = () => {
    printOfficialMedicalExaminationFormDirectly(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#102A43] text-white p-5 sm:p-6 rounded-t-3xl border-b border-[#C9A227]/30 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-bold shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C9A227] text-[#102A43]">
                  NECTA S0486
                </span>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  Official Medical Form
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                Fomu Rasmi ya Upimaji wa Afya (Medical Examination Form)
              </h3>
              <p className="text-xs text-[#FFFFF0]/80">
                Shule ya Sekondari Uomboni • Marangu, Moshi Vijijini
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Chapisha Fomu (Print)"
            >
              <Printer className="w-4 h-4 text-[#C9A227]" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-[#C9A227] hover:bg-[#B38F1F] text-[#102A43] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Pakua Fomu ya PDF"
            >
              <Download className="w-4 h-4" />
              <span>Pakua PDF</span>
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

        {/* Modal Body / Printable Template Preview */}
        <div className="p-5 sm:p-8 space-y-6 text-[#102A43]">
          
          {/* Privacy & Medical Responsibility Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-amber-950 flex items-start gap-3 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">
                Mwongozo wa Kisheria na Usiri wa Taarifa za Afya:
              </p>
              <p className="mt-0.5 text-amber-800">
                1. Fomu hii inapaswa kujazwa na kuthibitishwa na <strong>Daktari au Afisa wa Afya aliyesajiliwa</strong> kutoka Hospitali au Kituo cha Afya kinachotambulika na Serikali.<br />
                2. Taarifa za afya zinatunzwa kwa usiri mkubwa kwa ajili ya usalama wa mwanafunzi na maandalizi ya dharura shuleni. Mfumo hautoi utambuzi (diagnosis) binafsi wa kidijitali.
              </p>
            </div>
          </div>

          {/* Prefill Form Input bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFF0] border border-[#102A43]/15 space-y-3">
            <span className="text-xs font-bold text-[#102A43] uppercase tracking-wider block">
              Binafsisha Taarifa za Fomu Kabla ya Kuchapisha / Kupakua:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Jina la Mwanafunzi:
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Jina Kamili"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Namba ya Maombi (App No):
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
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  PREM / Namba ya La Saba:
                </label>
                <input
                  type="text"
                  value={formData.premNumber}
                  onChange={(e) => setFormData({ ...formData, premNumber: e.target.value })}
                  placeholder="PREM au Namba ya Mtihani"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Official Document Visual Sheet */}
          <div className="p-6 sm:p-8 bg-white border-2 border-slate-300 rounded-2xl shadow-inner space-y-6 text-slate-800 font-serif">
            {/* Sheet Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-[#102A43]">
              <div className="w-12 h-12 mx-auto mb-2">
                <SchoolLogo className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xs font-bold text-[#C9A227] uppercase tracking-widest">
                JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI
              </h2>
              <h1 className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
                SHULE YA SEKONDARI UOMBONI
              </h1>
              <p className="text-xs text-slate-600 font-sans">
                S.L.P 361 Marangu, Moshi Vijijini • Kituo cha NECTA Na: <strong>S0486</strong> • Simu: +255 782 558 127
              </p>
              <div className="inline-block mt-2 px-4 py-1 rounded bg-[#102A43] text-white text-xs font-bold font-sans uppercase tracking-wider">
                FOMU YA KUPIMA AFYA YA MWANAFUNZI (MEDICAL EXAMINATION FORM)
              </div>
            </div>

            {/* Section A */}
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-slate-100 p-2 font-bold text-[#102A43] uppercase text-[11px] tracking-wider rounded">
                SEHEMU A: TAARIFA ZA UTAMBULISHO WA MWANAFUNZI
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-slate-700">
                <div>
                  <strong>Jina Kamili:</strong>{' '}
                  <span className="font-bold text-slate-900 uppercase">
                    {formData.studentName || '______________________________________'}
                  </span>
                </div>
                <div>
                  <strong>Namba ya Udahili:</strong>{' '}
                  <span className="font-mono text-emerald-800 font-bold">
                    {formData.applicationNumber || 'APP-2026-________'}
                  </span>
                </div>
                <div>
                  <strong>PREM / Namba ya Mtihani La Saba:</strong>{' '}
                  <span className="font-mono">{formData.premNumber || '____________________'}</span>
                </div>
                <div>
                  <strong>Jinsia &amp; Tarehe ya Kuzaliwa:</strong>{' '}
                  <span>
                    {formData.gender === 'F' ? 'Kike (Female)' : 'Kiume (Male)'} •{' '}
                    {formData.dateOfBirth || '____ / ____ / ________'}
                  </span>
                </div>
                <div>
                  <strong>Jina la Mzazi / Mlezi:</strong>{' '}
                  <span>{formData.parentName || '______________________________________'}</span>
                </div>
                <div>
                  <strong>Simu ya Mzazi:</strong>{' '}
                  <span className="font-mono">{formData.parentPhone || '+255 ________________'}</span>
                </div>
              </div>
            </div>

            {/* Section B */}
            <div className="space-y-2 font-sans text-xs">
              <div className="bg-slate-100 p-2 font-bold text-[#102A43] uppercase text-[11px] tracking-wider rounded">
                SEHEMU B: HISTORIA YA AFYA KUTOKA KWA MZAZI / MLEZI
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p>1. Mwanafunzi amewahi kuugua magonjwa sugu (Pumu, Kifafa, Kisukari, Sickle Cell n.k)? Ndiyo [  ] Hapana [  ]</p>
                <p>2. Mzio (Allergies) wowote wa chakula au dawa za hospitali: ____________________________________________________</p>
                <p>3. Upasuaji wowote aliowahi kufanyiwa: __________________________________________________________________________</p>
                <p>4. Dawa anazotumia mara kwa mara: _______________________________________________________________________________</p>
                <p className="pt-2 italic">
                  Sahihi ya Mzazi/Mlezi: _________________________________  Tarehe: _____ / _____ / 2026
                </p>
              </div>
            </div>

            {/* Section C */}
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-[#102A43] text-white p-2 font-bold uppercase text-[11px] tracking-wider rounded">
                SEHEMU C: VIPIMO VYA DAKTARI ALIYUSAJILIWA (FOR REGISTERED CLINICIAN ONLY)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-700">
                <div className="p-2 border border-slate-200 rounded">
                  <strong>1. Kimo (Height):</strong> _____ cm<br />
                  <strong>2. Uzito (Weight):</strong> _____ kg<br />
                  <strong>3. Kundi la Damu:</strong> _____
                </div>
                <div className="p-2 border border-slate-200 rounded">
                  <strong>4. BP:</strong> _____ / _____<br />
                  <strong>5. Mapigo ya Moyo:</strong> _____ bpm<br />
                  <strong>6. Joto la Mwili:</strong> _____ °C
                </div>
                <div className="p-2 border border-slate-200 rounded">
                  <strong>7. Visual Acuity:</strong> R____ L____<br />
                  <strong>8. Hearing:</strong> ____________<br />
                  <strong>9. CVS &amp; Lungs:</strong> ____________
                </div>
              </div>
            </div>

            {/* Section D */}
            <div className="space-y-3 font-sans text-xs">
              <div className="bg-slate-100 p-2 font-bold text-[#102A43] uppercase text-[11px] tracking-wider rounded">
                SEHEMU D: MAPENDEKEZO YA DAKTARI NA MUHURI RASMI
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8 space-y-2 text-slate-700">
                  <p className="font-bold">Uamuzi wa Kimatibabu wa Afisa wa Afya:</p>
                  <p>[  ] ANAFAA KUJIUNGA NA SHULE YA BWENI NA MICHEZO (Fit for Boarding &amp; Sports)</p>
                  <p>[  ] ANAFAA KWA MASHARTI MAALUM YA KUTIBIWA (Fit with Restrictions)</p>
                  <p>[  ] ANAHITAJI UCHUNGUZI ZAIDI WA HOSPITALI YA RUFAA</p>

                  <div className="pt-2 space-y-1">
                    <p>Jina la Daktari: ___________________________________ Kada (MD/AMO/CO): _________</p>
                    <p>Kituo cha Afya / Hospitali: _________________________________________________</p>
                    <p>Sahihi ya Daktari: _________________________________ Tarehe: _____/_____/2026</p>
                  </div>
                </div>

                <div className="sm:col-span-4 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center p-4 text-center text-slate-400">
                  <Building className="w-8 h-8 mb-1 text-slate-400" />
                  <span className="text-[11px] font-bold uppercase text-slate-600">MUHURI WA HOSPITALI</span>
                  <span className="text-[9px] text-slate-500">(Official Hospital Stamp)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Sera ya Shule: Taarifa zote za afya zinalindwa kwa mujibu wa miongozo ya Wizara.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Chapisha (Print)</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-5 py-2.5 rounded-xl bg-[#102A43] hover:bg-[#0A1C2E] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4 text-[#C9A227]" />
                <span>Pakua Fomu ya PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
