import React, { useState, useEffect, useRef, Suspense } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolLogo } from './components/SchoolLogo';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { AcademicsSection } from './components/AcademicsSection';
import { LeadershipTeachersSection } from './components/LeadershipTeachersSection';
import { ParentsGuardiansSection } from './components/ParentsGuardiansSection';
import { StudentLifeSection } from './components/StudentLifeSection';
import { SchoolManagementSection } from './components/SchoolManagementSection';
import { AdmissionsSection } from './components/AdmissionsSection';
import { ResultsSection } from './components/ResultsSection';
import { NewsEventsSection } from './components/NewsEventsSection';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { StaffRole } from './services/staffSecurityService';
import { AcademicRole } from './components/AcademicPortalModal';
import { Loader2 } from 'lucide-react';

// Modals statically imported for guaranteed availability and zero dynamic import fetch failures
import { StaffSecurityGateModal } from './components/StaffSecurityGateModal';
import { StudentPortalModal } from './components/StudentPortalModal';
import { ApplyNowModal } from './components/ApplyNowModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { BursarPortalModal } from './components/BursarPortalModal';
import { AcademicPortalModal } from './components/AcademicPortalModal';
import { TeacherStaffPortalModal } from './components/portal/TeacherStaffPortalModal';
import { NectaResultsModal } from './components/results/NectaResultsModal';
import { SchoolResultsModal } from './components/results/SchoolResultsModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

// Auth Views
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './components/auth/VerifyEmailPage';
import { PortalContainer } from './components/portal/PortalContainer';

const ModalFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A43]/75 backdrop-blur-xs">
    <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-lg shadow-xl border border-[#102A43]/20">
      <Loader2 className="w-8 h-8 text-[#102A43] animate-spin" />
      <span className="text-xs font-semibold text-[#102A43]">Loading school system...</span>
    </div>
  </div>
);

function MainSchoolApp() {
  const { activeView, setActiveView, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('home');

  // Modals state
  const [isStaffGateOpen, setIsStaffGateOpen] = useState(false);
  const [isTeacherStaffPortalOpen, setIsTeacherStaffPortalOpen] = useState(false);
  const [isParentPortalOpen, setIsParentPortalOpen] = useState(false);
  const [isAdmissionsModalOpen, setIsAdmissionsModalOpen] = useState(false);
  const [isNectaResultsOpen, setIsNectaResultsOpen] = useState(false);
  const [isSchoolResultsOpen, setIsSchoolResultsOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBursarModalOpen, setIsBursarModalOpen] = useState(false);
  const [isAcademicPortalOpen, setIsAcademicPortalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  const [staffGateInitialRole, setStaffGateInitialRole] = useState<StaffRole>('admin');
  const [academicInitialRole, setAcademicInitialRole] = useState<AcademicRole>('academic_master');

  const handleOpenStaffGate = (role: StaffRole = 'admin') => {
    setStaffGateInitialRole(role);
    setIsStaffGateOpen(true);
  };

  const handleOpenAcademicPortalWithRole = (role: AcademicRole = 'academic_master') => {
    setAcademicInitialRole(role);
    setIsAcademicPortalOpen(true);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // URL Hash Listener & Hotkeys
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#login' || hash === '#ingia') {
        setActiveView('login');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#signup' || hash === '#register') {
        setActiveView('signup');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#portal' || hash === '#dashboard') {
        setActiveView('portal');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#admin' || hash === '#uomboni' || hash === '#s0486') {
        handleOpenStaffGate('admin');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#staff' || hash === '#teacher' || hash === '#walimu' || hash === '#staffportal') {
        setIsTeacherStaffPortalOpen(true);
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#bursar' || hash === '#mhasibu') {
        handleOpenStaffGate('bursar');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#academic' || hash === '#taaluma') {
        handleOpenStaffGate('academic_master');
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#parent' || hash === '#wazazi') {
        setIsParentPortalOpen(true);
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#necta') {
        setIsNectaResultsOpen(true);
        history.replaceState(null, '', window.location.pathname);
      } else if (hash === '#architecture' || hash === '#tech') {
        setIsArchitectureModalOpen(true);
        history.replaceState(null, '', window.location.pathname);
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [setActiveView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#102A43] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-16 h-16 mb-4 animate-pulse bg-white p-2 rounded-lg">
          <SchoolLogo className="w-full h-full object-contain" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          UOMBONI SECONDARY SCHOOL
        </h2>
        <p className="text-xs text-[#C9A227] mt-1 font-medium">
          Building Knowledge, Character &amp; Excellence · NECTA S0486
        </p>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#FFFFF0]/80">
          <Loader2 className="w-4 h-4 animate-spin text-[#C9A227]" />
          <span>Inapakia mfumo wa shule...</span>
        </div>
      </div>
    );
  }

  if (activeView === 'login') return <Suspense fallback={<ModalFallback />}><LoginPage /></Suspense>;
  if (activeView === 'signup') return <Suspense fallback={<ModalFallback />}><SignUpPage /></Suspense>;
  if (activeView === 'forgot-password') return <Suspense fallback={<ModalFallback />}><ForgotPasswordPage /></Suspense>;
  if (activeView === 'verify-email') return <Suspense fallback={<ModalFallback />}><VerifyEmailPage /></Suspense>;
  if (activeView === 'portal') return <Suspense fallback={<ModalFallback />}><PortalContainer /></Suspense>;

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#102A43] font-sans flex flex-col selection:bg-[#102A43] selection:text-white">
      {/* 1. Navigation */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenParentPortal={() => setIsParentPortalOpen(true)}
        onOpenStaffPortal={() => setIsTeacherStaffPortalOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        onOpenLogin={() => setActiveView('login')}
      />

      <main className="flex-grow">
        {/* 2. Hero */}
        <Hero
          onNavigate={handleNavigate}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* 3. About */}
        <AboutSection
          onNavigate={handleNavigate}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* 4. Academics */}
        <AcademicsSection
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
          onOpenResults={() => setIsSchoolResultsOpen(true)}
        />

        {/* 5. Teachers (Meet Our Teachers) */}
        <LeadershipTeachersSection />

        {/* 6. Parents & Guardians */}
        <ParentsGuardiansSection
          onOpenParentPortal={() => setIsParentPortalOpen(true)}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* 7. Students (Student Life) */}
        <StudentLifeSection
          onNavigate={handleNavigate}
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* 8. School Management (Staff Only - No Student Portal) */}
        <SchoolManagementSection
          onOpenStaffPortal={() => setIsTeacherStaffPortalOpen(true)}
        />

        {/* 9. Admissions */}
        <AdmissionsSection
          onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        />

        {/* 10. Academic Results */}
        <ResultsSection
          onOpenNectaResults={() => setIsNectaResultsOpen(true)}
          onOpenSchoolResults={() => setIsSchoolResultsOpen(true)}
        />

        {/* 11. News & Events */}
        <NewsEventsSection />

        {/* 12. Gallery */}
        <GallerySection />

        {/* 13. Contact */}
        <ContactSection />
      </main>

      {/* 14. Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenStaffPortal={() => setIsTeacherStaffPortalOpen(true)}
        onOpenParentPortal={() => setIsParentPortalOpen(true)}
        onOpenAdmissions={() => setIsAdmissionsModalOpen(true)}
        onOpenResults={() => setIsSchoolResultsOpen(true)}
      />

      {/* Modals */}
      {/* Staff Security Gate Modal */}
      {isStaffGateOpen && (
        <Suspense fallback={<ModalFallback />}>
          <StaffSecurityGateModal
            isOpen={isStaffGateOpen}
            onClose={() => setIsStaffGateOpen(false)}
            initialRole={staffGateInitialRole}
            onOpenAdmin={() => {
              setIsStaffGateOpen(false);
              setIsAdminModalOpen(true);
            }}
            onOpenBursar={() => {
              setIsStaffGateOpen(false);
              setIsBursarModalOpen(true);
            }}
            onOpenAcademicMaster={() => {
              setIsStaffGateOpen(false);
              handleOpenAcademicPortalWithRole('academic_master');
            }}
            onOpenTeacher={() => {
              setIsStaffGateOpen(false);
              setIsTeacherStaffPortalOpen(true);
            }}
          />
        </Suspense>
      )}

      {/* Teachers & Staff Portal Modal (Sepia Identity) */}
      {isTeacherStaffPortalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <TeacherStaffPortalModal
            isOpen={isTeacherStaffPortalOpen}
            onClose={() => setIsTeacherStaffPortalOpen(false)}
            onOpenAdminPortal={() => {
              setIsTeacherStaffPortalOpen(false);
              setIsAdminModalOpen(true);
            }}
            onOpenBursarPortal={() => {
              setIsTeacherStaffPortalOpen(false);
              setIsBursarModalOpen(true);
            }}
            onOpenStaffGate={() => {
              setIsTeacherStaffPortalOpen(false);
              handleOpenStaffGate('admin');
            }}
          />
        </Suspense>
      )}

      {/* Parent Portal Modal (Sepia Identity) */}
      {isParentPortalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <StudentPortalModal
            isOpen={isParentPortalOpen}
            onClose={() => setIsParentPortalOpen(false)}
          />
        </Suspense>
      )}

      {/* Admissions / Apply Modal */}
      {isAdmissionsModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <ApplyNowModal
            isOpen={isAdmissionsModalOpen}
            onClose={() => setIsAdmissionsModalOpen(false)}
          />
        </Suspense>
      )}

      {/* NECTA Results Modal */}
      {isNectaResultsOpen && (
        <Suspense fallback={<ModalFallback />}>
          <NectaResultsModal
            isOpen={isNectaResultsOpen}
            onClose={() => setIsNectaResultsOpen(false)}
          />
        </Suspense>
      )}

      {/* School Results Modal */}
      {isSchoolResultsOpen && (
        <Suspense fallback={<ModalFallback />}>
          <SchoolResultsModal
            isOpen={isSchoolResultsOpen}
            onClose={() => setIsSchoolResultsOpen(false)}
            onOpenParentPortal={() => setIsParentPortalOpen(true)}
          />
        </Suspense>
      )}

      {/* Admin Portal Modal */}
      {isAdminModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <AdminPortalModal
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            onOpenBursar={() => {
              setIsAdminModalOpen(false);
              setIsBursarModalOpen(true);
            }}
            onOpenAcademic={(role) => {
              setIsAdminModalOpen(false);
              handleOpenAcademicPortalWithRole(role);
            }}
          />
        </Suspense>
      )}

      {/* Bursar Portal Modal */}
      {isBursarModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <BursarPortalModal
            isOpen={isBursarModalOpen}
            onClose={() => setIsBursarModalOpen(false)}
            onOpenAdmin={() => {
              setIsBursarModalOpen(false);
              setIsAdminModalOpen(true);
            }}
            onOpenAcademic={(role) => {
              setIsBursarModalOpen(false);
              handleOpenAcademicPortalWithRole(role);
            }}
          />
        </Suspense>
      )}

      {/* Academic Master Portal Modal */}
      {isAcademicPortalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <AcademicPortalModal
            isOpen={isAcademicPortalOpen}
            onClose={() => setIsAcademicPortalOpen(false)}
            initialRole={academicInitialRole}
          />
        </Suspense>
      )}

      {/* System Architecture Modal (technical blueprint via #architecture) */}
      {isArchitectureModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <SystemArchitectureModal
            isOpen={isArchitectureModalOpen}
            onClose={() => setIsArchitectureModalOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <MainSchoolApp />
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
}
