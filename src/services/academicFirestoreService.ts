import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { PendingSubjectSubmission, PendingStudentScore, StudentResult, AcademicDirective } from '../types';

const PENDING_RESULTS_COLLECTION = 'pendingResults';
const LOCAL_STORAGE_PENDING_KEY = 'uomboni_pending_subject_results';
const ACADEMIC_DIRECTIVES_COLLECTION = 'academicDirectives';
const LOCAL_STORAGE_DIRECTIVES_KEY = 'uomboni_academic_directives';

/**
 * Helper to safely save backup copy to localStorage
 */
function backupToLocalStorage(submission: PendingSubjectSubmission) {
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
    const existing: PendingSubjectSubmission[] = existingStr ? JSON.parse(existingStr) : [];
    const filtered = existing.filter((s) => s.id !== submission.id);
    filtered.unshift(submission);
    localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (err) {
    console.warn('Could not backup pending results to localStorage:', err);
  }
}

/**
 * Helper to get local backup submissions
 */
function getFromLocalStorage(): PendingSubjectSubmission[] {
  try {
    const existingStr = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
    return existingStr ? JSON.parse(existingStr) : [];
  } catch {
    return [];
  }
}

/**
 * Generates a clean, human-readable yet unique Firestore document ID
 */
export function generatePendingSubmissionId(
  form: string,
  examType: string,
  subject: string
): string {
  const safeForm = form.replace(/\s+/g, '_');
  const safeExam = examType.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
  const safeSubject = subject.replace(/\s+/g, '_');
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  return `pending_${safeForm}_${safeExam}_${safeSubject}_${timestamp}`;
}

/**
 * Save teacher-uploaded student scores by subject to Cloud Firestore with status 'pending'
 */
export async function savePendingSubjectScoresToFirestore(params: {
  subject: string;
  subjectCode: string;
  form: string;
  stream: string;
  examType: string;
  academicYear?: string;
  teacherName: string;
  teacherEmail?: string;
  teacherId?: string;
  scores: Array<{
    examNumber: string;
    studentName: string;
    gender?: 'M' | 'F';
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    points: number;
    remarks: string;
  }>;
}): Promise<{
  success: boolean;
  submissionId: string;
  count: number;
  firestoreSaved: boolean;
  error?: string;
}> {
  const submissionId = generatePendingSubmissionId(params.form, params.examType, params.subject);
  const now = new Date().toISOString();

  const studentScores: PendingStudentScore[] = params.scores.map((sc) => ({
    examNumber: sc.examNumber.trim(),
    studentName: sc.studentName.trim(),
    gender: sc.gender || 'M',
    score: sc.score,
    grade: sc.grade,
    points: sc.points,
    remarks: sc.remarks,
    status: 'pending' as const,
  }));

  const pendingSubmission: PendingSubjectSubmission = {
    id: submissionId,
    subject: params.subject,
    subjectCode: params.subjectCode,
    form: params.form,
    stream: params.stream || 'ALL',
    examType: params.examType,
    academicYear: params.academicYear || '2025/2026',
    teacherName: params.teacherName,
    teacherEmail: params.teacherEmail || '',
    teacherId: params.teacherId || '',
    status: 'pending', // Explicitly marked as pending
    submittedCount: studentScores.length,
    studentScores,
    submittedAt: now,
    reviewedAt: null,
    reviewedBy: null,
    academicMasterNotes: '',
  };

  // Always save local backup first
  backupToLocalStorage(pendingSubmission);

  let firestoreSaved = false;
  let firestoreError: string | undefined;

  try {
    // 1. Write the main pending batch submission to Firestore
    const submissionRef = doc(db, PENDING_RESULTS_COLLECTION, submissionId);
    await setDoc(submissionRef, {
      ...pendingSubmission,
      firestoreCreatedAt: serverTimestamp(),
      approvalStatus: 'pending',
    });

    // 2. Also record in Firestore `results` or `subjectSubmissions`
    const summaryDocId = `${params.form}_${params.examType}_${params.subject}`
      .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
      .slice(0, 100);
    const summaryRef = doc(db, 'subjectSubmissions', summaryDocId);
    await setDoc(
      summaryRef,
      {
        id: submissionId,
        form: params.form,
        examType: params.examType,
        subject: params.subject,
        subjectCode: params.subjectCode,
        teacherName: params.teacherName,
        submittedAt: now,
        count: studentScores.length,
        status: 'pending',
        latestSubmissionId: submissionId,
      },
      { merge: true }
    );

    firestoreSaved = true;
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.CREATE, `${PENDING_RESULTS_COLLECTION}/${submissionId}`);
    }
    console.warn('Firestore write for pending results:', err);
    firestoreError = err?.message || 'Hitilafu ya mtandao wa Firestore';
  }

  return {
    success: true,
    submissionId,
    count: studentScores.length,
    firestoreSaved,
    error: firestoreError,
  };
}

/**
 * Fetch all pending subject submissions from Firestore
 */
export async function getPendingSubjectSubmissionsFromFirestore(): Promise<PendingSubjectSubmission[]> {
  // If user is not authenticated, they do not have teacher/staff permissions to list internal draft submissions.
  // Return the local fallback directly to prevent unauthorized read attempts.
  if (!auth.currentUser) {
    return getFromLocalStorage();
  }

  try {
    const colRef = collection(db, PENDING_RESULTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const results: PendingSubjectSubmission[] = [];
      snap.forEach((d) => {
        const data = d.data() as PendingSubjectSubmission;
        results.push(data);
      });
      // Sort newest first
      return results.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.LIST, PENDING_RESULTS_COLLECTION);
    }
    console.warn('Could not read pending results from Firestore, falling back to local store:', err);
  }

  // Fallback to local storage
  return getFromLocalStorage();
}

/**
 * Academic Master certifies/approves a pending submission in Firestore
 */
export async function approvePendingSubjectSubmissionInFirestore(
  submissionId: string,
  reviewerName: string,
  notes: string = 'Matokeo yamekaguliwa na kuidhinishwa na Mkuu wa Taaluma.'
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();
  try {
    const docRef = doc(db, PENDING_RESULTS_COLLECTION, submissionId);
    await updateDoc(docRef, {
      status: 'approved',
      reviewedAt: now,
      reviewedBy: reviewerName,
      academicMasterNotes: notes,
    });

    // Update local cache
    const locals = getFromLocalStorage();
    const updated = locals.map((s) =>
      s.id === submissionId
        ? {
            ...s,
            status: 'approved' as const,
            reviewedAt: now,
            reviewedBy: reviewerName,
            academicMasterNotes: notes,
          }
        : s
    );
    localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(updated));

    return { success: true };
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.UPDATE, `${PENDING_RESULTS_COLLECTION}/${submissionId}`);
    }
    console.error('Error approving pending submission in Firestore:', err);
    return { success: false, error: err?.message };
  }
}

/**
  * Backup academic directives to local storage
  */
function backupDirectivesToLocalStorage(directives: AcademicDirective[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_DIRECTIVES_KEY, JSON.stringify(directives));
  } catch (err) {
    console.warn('Could not backup academic directives to localStorage:', err);
  }
}

/**
 * Retrieve cached academic directives from local storage
 */
export function getDirectivesFromLocalStorage(): AcademicDirective[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DIRECTIVES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return [];
}

/**
 * Save an Academic Directive from Academic Master to Cloud Firestore
 */
export async function saveAcademicDirectiveToFirestore(directive: AcademicDirective): Promise<void> {
  // Update local storage first for snappy UX
  const locals = getDirectivesFromLocalStorage();
  const filtered = locals.filter((d) => d.id !== directive.id);
  filtered.unshift(directive);
  backupDirectivesToLocalStorage(filtered);

  try {
    const docRef = doc(db, ACADEMIC_DIRECTIVES_COLLECTION, directive.id);
    await setDoc(docRef, {
      ...directive,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.WRITE, `${ACADEMIC_DIRECTIVES_COLLECTION}/${directive.id}`);
    }
    console.warn('Could not save academic directive to Firestore, cached locally:', err);
  }
}

/**
 * Fetch all Academic Directives from Cloud Firestore
 */
export async function getAcademicDirectivesFromFirestore(): Promise<AcademicDirective[]> {
  try {
    const q = collection(db, ACADEMIC_DIRECTIVES_COLLECTION);
    const snap = await getDocs(q);
    if (!snap.empty) {
      const remoteList: AcademicDirective[] = [];
      snap.forEach((d) => {
        const data = d.data();
        remoteList.push({
          id: d.id,
          title: data.title || '',
          message: data.message || '',
          senderName: data.senderName || 'Mkuu wa Taaluma',
          senderRole: data.senderRole || 'Mkuu wa Taaluma (Academic Master)',
          targetForm: data.targetForm || 'ALL',
          examType: data.examType || 'NECTA Mock 2025',
          deadlineDate: data.deadlineDate || '2026-03-30',
          isOpenForEntry: typeof data.isOpenForEntry === 'boolean' ? data.isOpenForEntry : true,
          allowLateSubmissions: !!data.allowLateSubmissions,
          priority: data.priority || 'high',
          dateIssued: data.dateIssued || new Date().toISOString().split('T')[0],
          timestamp: data.timestamp || Date.now(),
          status: data.status || 'active',
        });
      });
      remoteList.sort((a, b) => b.timestamp - a.timestamp);
      backupDirectivesToLocalStorage(remoteList);
      return remoteList;
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      try {
        handleFirestoreError(err, OperationType.LIST, ACADEMIC_DIRECTIVES_COLLECTION);
      } catch (e) {
        console.warn('Academic directives access notice, using fallback storage:', e);
      }
    } else {
      console.warn('Could not read academic directives from Firestore, using local cache:', err);
    }
  }

  return getDirectivesFromLocalStorage();
}

