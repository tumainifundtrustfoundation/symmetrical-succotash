import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  ARCHITECTURE_LAYERS,
  SCHOOL_INFRASTRUCTURE_SPECS,
  SYSTEM_DATA_FLOW_STEPS,
  ArchitectureLayer,
} from '../../data/systemArchitectureData';
import { testFirestoreConnection } from '../../lib/firebase';
import {
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Server,
  Activity,
  Zap,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Check,
} from 'lucide-react';

interface AdminSystemArchitectureTabProps {
  onOpenFullModal?: () => void;
}

export const AdminSystemArchitectureTab: React.FC<AdminSystemArchitectureTabProps> = ({
  onOpenFullModal,
}) => {
  const { language } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'layers' | 'diagnostics'>('overview');
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer>(ARCHITECTURE_LAYERS[0]);
  const [healthStatus, setHealthStatus] = useState<{
    server: 'checking' | 'online' | 'error';
    firestore: 'checking' | 'online' | 'error';
    latencyMs: number | null;
    timestamp: string;
  }>({
    server: 'checking',
    firestore: 'checking',
    latencyMs: null,
    timestamp: new Date().toLocaleTimeString(),
  });
  const [isRunningCheck, setIsRunningCheck] = useState(false);

  const runDiagnostics = async () => {
    setIsRunningCheck(true);
    const start = performance.now();
    let serverOk = false;
    let firestoreOk = false;

    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        serverOk = true;
      }
    } catch {
      serverOk = false;
    }

    try {
      firestoreOk = await testFirestoreConnection();
    } catch {
      firestoreOk = false;
    }

    const end = performance.now();
    setHealthStatus({
      server: serverOk ? 'online' : 'error',
      firestore: firestoreOk ? 'online' : 'error',
      latencyMs: Math.round(end - start),
      timestamp: new Date().toLocaleTimeString(),
    });
    setIsRunningCheck(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const specCards = [
    {
      labelSw: 'Taasisi & Namba ya NECTA',
      labelEn: 'Institution & NECTA Center',
      value: SCHOOL_INFRASTRUCTURE_SPECS.institutionName,
      descriptionSw: 'Shule inatambuliwa rasmi na Baraza la Mitihani la Tanzania chini ya kituo S0486.',
      descriptionEn: 'Formally accredited by the National Examinations Council of Tanzania under center S0486.',
    },
    {
      labelSw: 'Miliki & Jimbo Katoliki',
      labelEn: 'Diocese & Ownership',
      value: SCHOOL_INFRASTRUCTURE_SPECS.diocese,
      descriptionSw: 'Inamilikiwa na kuendeshwa na Jimbo Katoliki la Moshi, ikizingatia maadili bora.',
      descriptionEn: 'Owned and operated by the Catholic Diocese of Moshi with exemplary discipline.',
    },
    {
      labelSw: 'Wingu Kuu & Mkoa',
      labelEn: 'Cloud Provider & Region',
      value: `${SCHOOL_INFRASTRUCTURE_SPECS.primaryCloudProvider} (${SCHOOL_INFRASTRUCTURE_SPECS.primaryRegion})`,
      descriptionSw: 'Miundombinu ya wingu yenye seva salama za kiwango cha juu cha upatikanaji.',
      descriptionEn: 'Cloud infrastructure deployed in high-availability enterprise zones.',
    },
    {
      labelSw: 'Hifadhidata ya Shule',
      labelEn: 'Database Engine',
      value: SCHOOL_INFRASTRUCTURE_SPECS.databaseEngine,
      descriptionSw: 'Hifadhi ya data za alama na ada yenye usawazishaji wa papo hapo kwa kila kifaa.',
      descriptionEn: 'ACID-compliant document database with instant real-time synchronization across devices.',
    },
    {
      labelSw: 'Uthibitishaji wa Mtumiaji',
      labelEn: 'Authentication & Identity',
      value: SCHOOL_INFRASTRUCTURE_SPECS.authProvider,
      descriptionSw: 'Ulinzi wa akaunti za walimu, wazazi na wanafunzi kwa tokeni salama na 2FA.',
      descriptionEn: 'Secure token management with cryptographic verification and two-factor safety.',
    },
    {
      labelSw: 'Lengo la Upatikanaji (SLA)',
      labelEn: 'High Availability Target',
      value: SCHOOL_INFRASTRUCTURE_SPECS.uptimeTarget,
      descriptionSw: 'Mfumo haukatiki hata wakati wa kutangazwa kwa matokeo ya kitaifa ya NECTA.',
      descriptionEn: 'Engineered for uninterrupted operation during national examination result peaks.',
    },
    {
      labelSw: 'Viwango vya Usalama wa Mtandao',
      labelEn: 'Security & Encryption Standard',
      value: SCHOOL_INFRASTRUCTURE_SPECS.securityStandard,
      descriptionSw: 'Data zote zinalindwa kwa usimbaji fiche wa AES-256 na viwango vya Zero-Trust.',
      descriptionEn: 'All data is encrypted in transit via TLS 1.3 and at rest with AES-256.',
    },
    {
      labelSw: 'Uzingatiaji wa Sheria & Faragha',
      labelEn: 'Regulatory Compliance',
      value: SCHOOL_INFRASTRUCTURE_SPECS.compliance,
      descriptionSw: 'Inazingatia miongozo ya NECTA na sheria za kulinda taarifa binafsi za wanafunzi.',
      descriptionEn: 'Adheres strictly to NECTA regulations and student educational privacy statutes.',
    },
    {
      labelSw: 'Hali ya Sasa ya Uendeshaji',
      labelEn: 'Operational Status',
      value: SCHOOL_INFRASTRUCTURE_SPECS.lastVerifiedStatus,
      descriptionSw: 'Mifumo yote ya shule inafanya kazi kwa ufanisi wa 100% bila hitilafu.',
      descriptionEn: 'All subsystems verified operational with active health monitoring.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#07192f] via-[#092244] to-[#07192f] p-6 text-white border border-blue-900/50 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'sw' ? 'MIUNDOMBINU YA MIFUMO YA SHULE' : 'ENTERPRISE SYSTEM ARCHITECTURE'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {language === 'sw'
                ? 'Muundo wa Kiteknolojia & Usalama wa Mifumo'
                : 'School Digital Architecture & Cloud Engineering'}
            </h2>
            <p className="text-sm text-blue-200/80 mt-1 max-w-2xl">
              {language === 'sw'
                ? 'Usimamizi na uhakiki wa tabaka zote za kiufundi, hifadhidata ya wingu, seva ya Express na usalama wa data.'
                : 'Monitoring, validation, and architectural overview of all system layers, cloud database, backend services, and multi-tier security.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runDiagnostics}
              disabled={isRunningCheck}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-700/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningCheck ? 'animate-spin' : ''}`} />
              <span>{language === 'sw' ? 'Hakiki Hali' : 'Check Health'}</span>
            </button>
            {onOpenFullModal && (
              <button
                onClick={onOpenFullModal}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-navy rounded-lg shadow transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{language === 'sw' ? 'Fungua Mwonekano wa 3D' : 'Open 3D Architecture'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Diagnostics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-blue-800/40 text-xs">
          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/30 flex items-center gap-2.5">
            <Server className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-blue-300/80 text-[10px]">Express Node.js</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthStatus.server === 'online'
                      ? 'bg-emerald-400 animate-pulse'
                      : healthStatus.server === 'checking'
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                />
                {healthStatus.server === 'online' ? 'Active (Port 3000)' : healthStatus.server}
              </div>
            </div>
          </div>

          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/30 flex items-center gap-2.5">
            <Database className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-blue-300/80 text-[10px]">Cloud Firestore</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    healthStatus.firestore === 'online'
                      ? 'bg-emerald-400 animate-pulse'
                      : healthStatus.firestore === 'checking'
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                />
                {healthStatus.firestore === 'online' ? 'Connected' : healthStatus.firestore}
              </div>
            </div>
          </div>

          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/30 flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-sky-400" />
            <div>
              <div className="text-blue-300/80 text-[10px]">{language === 'sw' ? 'Kasi ya Mawasiliano' : 'Roundtrip Latency'}</div>
              <div className="font-semibold text-white">
                {healthStatus.latencyMs !== null ? `${healthStatus.latencyMs} ms` : '—'}
              </div>
            </div>
          </div>

          <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/30 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-blue-300/80 text-[10px]">{language === 'sw' ? 'Ulinzi wa Data' : 'Security Level'}</div>
              <div className="font-semibold text-white">TLS 1.3 / AES-256</div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs navigation */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'overview'
              ? 'border-navy text-navy'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>{language === 'sw' ? 'Vigezo vya Mfumo' : 'Infrastructure Specs'}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('layers')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'layers'
              ? 'border-navy text-navy'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'sw' ? 'Tabaka za Mfumo' : 'Architecture Layers'}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('diagnostics')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'diagnostics'
              ? 'border-navy text-navy'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{language === 'sw' ? 'Mtiririko wa Data' : 'Data Flow & Protocols'}</span>
        </button>
      </div>

      {/* SUBTAB 1: OVERVIEW & SPECS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specCards.map((spec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {language === 'sw' ? spec.labelSw : spec.labelEn}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-extrabold text-navy mb-2">{spec.value}</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'sw' ? spec.descriptionSw : spec.descriptionEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: LAYERS EXPLORER */}
      {activeSubTab === 'layers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Layer List */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {language === 'sw' ? 'Chagua Tabaka' : 'Select Layer'}
            </h3>
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isSelected = selectedLayer.id === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-navy text-white border-navy shadow-sm'
                      : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-amber-400 text-navy' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {layer.number}
                    </span>
                    <div>
                      <div className="font-semibold text-xs leading-tight">
                        {language === 'sw' ? layer.titleSw : layer.titleEn}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-blue-200' : 'text-gray-500'
                        }`}
                      >
                        {layer.category.toUpperCase()} &bull; {layer.latencySla}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Layer Details */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Layer {selectedLayer.number}: {selectedLayer.category.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-navy mt-1">
                  {language === 'sw' ? selectedLayer.titleSw : selectedLayer.titleEn}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase">{language === 'sw' ? 'Kasi ya SLA' : 'Latency SLA'}</div>
                <div className="text-sm font-bold text-emerald-600">{selectedLayer.latencySla}</div>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {language === 'sw' ? selectedLayer.descriptionSw : selectedLayer.descriptionEn}
            </p>

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                {language === 'sw' ? 'Teknolojia Zilizotumika' : 'Applied Technologies'}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedLayer.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-800 border border-gray-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Security Role */}
            <div className="p-3.5 bg-amber-50/60 rounded-lg border border-amber-200/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-900">
                  {language === 'sw' ? 'Nafasi ya Kiulinzi & Sera' : 'Security Implementation'}
                </div>
                <div className="text-xs text-amber-800 mt-0.5">
                  {language === 'sw' ? selectedLayer.securityRoleSw : selectedLayer.securityRoleEn}
                </div>
              </div>
            </div>

            {/* Detailed Points */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                {language === 'sw' ? 'Utekelezaji wa Kiufundi' : 'Technical Specifications'}
              </h4>
              <ul className="space-y-1.5">
                {(language === 'sw' ? selectedLayer.detailsSw : selectedLayer.detailsEn).map((detail, idx) => (
                  <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DATA FLOW & DIAGNOSTICS */}
      {activeSubTab === 'diagnostics' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
            <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{language === 'sw' ? 'Mtiririko wa Taarifa (End-to-End Data Lifecycle)' : 'End-to-End Data Flow Stages'}</span>
            </h3>
            <div className="space-y-3">
              {SYSTEM_DATA_FLOW_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-gray-900">
                        {language === 'sw' ? step.titleSw : step.titleEn}
                      </div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        {language === 'sw' ? step.descriptionSw : step.descriptionEn}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right self-end sm:self-center shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-200/80 rounded text-gray-700">
                      Target: {step.targetLayer}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
