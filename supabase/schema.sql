-- ====================================================================
-- UOMBONI SECONDARY SCHOOL — PRODUCTION POSTGRESQL SCHEMA FOR SUPABASE
-- NECTA Centre S0486 | Moshi-Marangu, Kilimanjaro, Tanzania
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  CREATE TYPE user_school_role AS ENUM (
    'admin',
    'academic_master',
    'teacher',
    'bursar',
    'student',
    'parent'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status_enum AS ENUM (
    'draft',
    'submitted',
    'returned',
    'approved',
    'published'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE admission_status_enum AS ENUM (
    'pending',
    'under_review',
    'accepted',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_school_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. USER ROLES (Privileged role assignments controlled by Admin)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_school_role NOT NULL,
  assigned_by UUID REFERENCES public.profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  prem_number TEXT UNIQUE,
  examination_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender CHAR(1) CHECK (gender IN ('M', 'F')),
  date_of_birth DATE,
  class_level TEXT NOT NULL,
  stream TEXT DEFAULT 'A',
  academic_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PARENTS AND GUARDIANS
CREATE TABLE IF NOT EXISTS public.parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  occupation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_parent_relationships (
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'Parent',
  PRIMARY KEY (student_id, parent_id)
);

-- 7. TEACHERS TABLE
CREATE TABLE IF NOT EXISTS public.teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  staff_id TEXT UNIQUE,
  phone TEXT,
  email TEXT NOT NULL,
  specialization TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. CLASSES AND SUBJECTS
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  level TEXT NOT NULL, -- 'Form 1', 'Form 2', 'Form 3', 'Form 4'
  stream TEXT DEFAULT 'A',
  academic_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 9. TEACHER ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  academic_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  CONSTRAINT unique_teacher_class_subject UNIQUE (teacher_id, class_id, subject_id, academic_year)
);

-- 10. EXAMINATIONS
CREATE TABLE IF NOT EXISTS public.examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  term TEXT NOT NULL, -- 'Term 1', 'Term 2', 'Mid-Term', 'Annual', 'Mock'
  academic_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  class_level TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. RESULTS SUBMISSIONS (Teacher -> Academic Master -> Approval)
CREATE TABLE IF NOT EXISTS public.results_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.teachers(id) ON DELETE CASCADE,
  status submission_status_enum NOT NULL DEFAULT 'draft',
  comments TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_exam_class_subject_submission UNIQUE (exam_id, class_id, subject_id)
);

-- 12. STUDENT RESULTS
CREATE TABLE IF NOT EXISTS public.student_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES public.results_submissions(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.examinations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  marks NUMERIC(5, 2) NOT NULL CHECK (marks >= 0 AND marks <= 100),
  grade VARCHAR(2),
  points INT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_exam_student_subject_result UNIQUE (exam_id, student_id, subject_id)
);

-- 13. ADMISSION APPLICATIONS
CREATE TABLE IF NOT EXISTS public.admission_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_number TEXT NOT NULL UNIQUE,
  prem_number TEXT,
  student_name TEXT NOT NULL,
  gender CHAR(1) NOT NULL CHECK (gender IN ('M', 'F')),
  date_of_birth DATE,
  nationality TEXT DEFAULT 'Tanzanian',
  applying_for TEXT NOT NULL,
  academic_year INT NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE) + 1,
  current_school TEXT,
  parent_name TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  parent_email TEXT,
  parent_address TEXT,
  medical_info JSONB,
  documents JSONB,
  status admission_status_enum NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_by UUID REFERENCES public.profiles(id),
  review_notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. MEDICAL FORMS (Official clinician examination records)
CREATE TABLE IF NOT EXISTS public.medical_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES public.admission_applications(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  application_number TEXT NOT NULL,
  medical_history TEXT,
  allergies TEXT,
  chronic_illnesses TEXT,
  physical_examination TEXT,
  clinician_name TEXT,
  clinician_facility TEXT,
  examination_date DATE,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. SCHOOL VIDEOS (YouTube Embeds Management)
CREATE TABLE IF NOT EXISTS public.school_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL,
  category TEXT DEFAULT 'School Life',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  order_index INT DEFAULT 0,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. FAQS AND ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'Admissions',
  order_index INT DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_parent_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security Helper Functions
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_school_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'academic_master')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- Public content readable by anyone
CREATE POLICY "Public videos are viewable by all"
  ON public.school_videos FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage school videos"
  ON public.school_videos FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public FAQs are viewable by all"
  ON public.faqs FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage faqs"
  ON public.faqs FOR ALL
  USING (public.is_admin());

CREATE POLICY "Public announcements viewable by all"
  ON public.announcements FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin());

-- Admission Applications
CREATE POLICY "Applicants can create admission applications"
  ON public.admission_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view and manage admission applications"
  ON public.admission_applications FOR ALL
  USING (public.is_admin());

-- Medical Forms (Restricted Access)
CREATE POLICY "Authorized staff can view and manage medical forms"
  ON public.medical_forms FOR ALL
  USING (public.is_admin());

-- Results & Submissions
CREATE POLICY "Teachers can view assigned submissions"
  ON public.results_submissions FOR SELECT
  USING (
    public.is_admin() OR
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
  );

CREATE POLICY "Teachers can insert and update their own submissions"
  ON public.results_submissions FOR INSERT
  WITH CHECK (
    public.is_admin() OR
    teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
  );

CREATE POLICY "Teachers can modify their draft submissions"
  ON public.results_submissions FOR UPDATE
  USING (
    public.is_admin() OR
    (teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid()) AND status IN ('draft', 'returned'))
  );

CREATE POLICY "Admins can approve and manage submissions"
  ON public.results_submissions FOR ALL
  USING (public.is_admin());

-- Student Results
CREATE POLICY "Published results are viewable by students and parents"
  ON public.student_results FOR SELECT
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.examinations e
      WHERE e.id = exam_id AND e.is_published = true
    )
  );

CREATE POLICY "Teachers and admins can manage marks"
  ON public.student_results FOR ALL
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.results_submissions rs
      WHERE rs.id = submission_id
        AND rs.teacher_id IN (SELECT id FROM public.teachers WHERE user_id = auth.uid())
        AND rs.status IN ('draft', 'returned')
    )
  );

-- Audit Logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "System can append audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Trigger to sync new auth users into profiles automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student' -- Default to student, never grant privileged roles
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
