import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { AdmissionDocument } from '../types';
import {
  downloadStudentAdmissionFormPdf,
  downloadOfficialMedicalExaminationFormPdf,
  downloadParentGuardianFormPdf,
  downloadOfficialJoiningInstructions2027Pdf,
  downloadSchoolRulesAndRegulationsPdf,
  downloadVituMuhimuPdf,
} from '../utils/pdfService';

const COLLECTION_NAME = 'admission_documents';
const STORAGE_KEY = 'uomboni_admission_documents';

/**
 * Pre-seeded official authentic admission documents for Uomboni Secondary School.
 * These are guaranteed to exist, fully functional with professional print-ready PDF generators.
 */
export const DEFAULT_OFFICIAL_ADMISSION_DOCUMENTS: AdmissionDocument[] = [
  {
    id: 'uom-adm-01',
    code: 'UOM-ADM-01',
    titleSw: 'Fomu Rasmi ya Udahili & Usajili wa Mwanafunzi (Kidato cha 1 & Uhamisho)',
    titleEn: 'Official Student Admission & Registration Form (Form 1 & Transfers)',
    descriptionSw:
      'Fomu kamilifu ya taarifa binafsi za mwanafunzi, matokeo ya Darasa la Saba (PSLE), machaguo ya bweni au kutwa, mawasiliano ya wazazi na tamko la maombi ya kujiunga.',
    descriptionEn:
      'Official student biodata form, primary school leaving results (PSLE), day or boarding preference, parent contacts, and formal admission declaration.',
    category: 'admission',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '248 KB',
    fileName: 'FOMU_YA_UDAHILI_UOMBONI_SECONDARY_2026_2027.pdf',
    downloadType: 'generator',
    generatorKey: 'admission_form',
    published: true,
    featured: true,
    order: 1,
    downloadsCount: 184,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'uom-adm-02',
    code: 'UOM-ADM-02',
    titleSw: 'Fomu Rasmi ya Upimaji wa Afya ya Daktari (Student Medical Examination Form)',
    titleEn: 'Official Student Medical Examination Form (Bilingual Swahili & English)',
    descriptionSw:
      'Fomu rasmi ya A4 kwa ajili ya uchunguzi wa kimatibabu na daktari aliyesajiliwa: vipimo vya mwili, mzio, magonjwa sugu, mifumo ya hewa na moyo, ushauri wa kitiba na muhuri wa hospitali.',
    descriptionEn:
      'Official print-ready A4 clinical examination form for authorized medical practitioners: physical vitals, allergies, respiratory, cardio, clinical assessment, hospital stamp & signature.',
    category: 'medical',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '312 KB',
    fileName: 'FOMU_YA_AFYA_UOMBONI_SECONDARY.pdf',
    downloadType: 'generator',
    generatorKey: 'medical_form',
    published: true,
    featured: true,
    order: 2,
    downloadsCount: 226,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'uom-adm-03',
    code: 'UOM-ADM-03',
    titleSw: 'Fomu ya Taarifa za Mzazi/Mlezi na Maagano ya Malezi & Ulipaji Ada',
    titleEn: 'Parent/Guardian Information & Commitment Undertaking Agreement',
    descriptionSw:
      'Fomu ya kisheria ya taarifa za wazazi, mawasiliano ya dharura, makubaliano ya kufuata miongozo na maadili ya Kikatoliki, na ahadi ya kulipa ada kwa wakati kabla ya muhula kuanza.',
    descriptionEn:
      'Official statutory parent declaration, emergency contacts, agreement to uphold Catholic morals and discipline, and fee payment schedule undertaking.',
    category: 'parent',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '210 KB',
    fileName: 'FOMU_YA_MZAZI_MAAGANO_UOMBONI.pdf',
    downloadType: 'generator',
    generatorKey: 'parent_form',
    published: true,
    featured: false,
    order: 3,
    downloadsCount: 142,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'uom-adm-04',
    code: 'UOM-ADM-04',
    titleSw: 'Maelekezo Rasmi ya Kujiunga na Shule (Student Joining Instructions 2026/2027)',
    titleEn: 'Official Student Joining Instructions & Intake Prospectus',
    descriptionSw:
      'Waraka rasmi wenye ratiba ya kuripoti Marangu, mchanganuo wa ada (TZS 1,600,000/= bweni), akaunti za benki (CRDB, NMB, Mkombozi), sare rasmi na maelekezo ya usafiri.',
    descriptionEn:
      'Official joining prospectus detailing arrival dates at Marangu, fee schedule (TZS 1,600,000/= boarding), official bank accounts (CRDB, NMB, Mkombozi), and travel guidelines.',
    category: 'joining',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '485 KB',
    fileName: 'MAELEKEZO_YA_KUJIUNGA_UOMBONI_2026_2027.pdf',
    downloadType: 'generator',
    generatorKey: 'joining_instructions',
    published: true,
    featured: true,
    order: 4,
    downloadsCount: 318,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'uom-adm-05',
    code: 'UOM-ADM-05',
    titleSw: 'Sheria, Kanuni na Mwongozo wa Nidhamu wa Shule ya Sekondari Uomboni',
    titleEn: 'Official School Rules, Code of Conduct & Disciplinary Policy',
    descriptionSw:
      'Kanuni 10 za msingi za nidhamu, mahudhurio, sare rasmi, marufuku kamili ya simu za mkononi na hita, maadili ya kiroho, taratibu za bweni, na hatua za kinidhamu.',
    descriptionEn:
      'The 10 foundational institutional rules: punctuality, dress code, zero-tolerance mobile phone policy, moral conduct, boarding regulations, and suspension/expulsion policies.',
    category: 'rules',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '230 KB',
    fileName: 'SHERIA_NA_KANUNI_UOMBONI_SECONDARY.pdf',
    downloadType: 'generator',
    generatorKey: 'school_rules',
    published: true,
    featured: false,
    order: 5,
    downloadsCount: 169,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'uom-adm-06',
    code: 'UOM-ADM-06',
    titleSw: 'Orodha ya Vitu Muhimu na Nyaraka Zinazotakiwa Wakati wa Kuripoti (Vitu Muhimu)',
    titleEn: 'Required Admission Documents Checklist & Essential Items (Vitu Muhimu)',
    descriptionSw:
      'Orodha kamilifu ya vifaa vya masomo, daftari, sare za darasani na michezo, vifaa vya bweni (godoro, shuka, chandarua), sanduku la bati, na nakala za vyeti vya usajili.',
    descriptionEn:
      'Comprehensive checklist of academic supplies, uniforms, boarding requirements (mattress, bedsheets, mosquito net), metal trunk, and required registration certificates.',
    category: 'checklist',
    academicYear: '2026/2027',
    fileType: 'PDF',
    fileSize: '340 KB',
    fileName: 'VITU_MUHIMU_ORODHA_UOMBONI_SECONDARY.pdf',
    downloadType: 'generator',
    generatorKey: 'checklist',
    published: true,
    featured: true,
    order: 6,
    downloadsCount: 295,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
];

/**
 * Helper to safely read from localStorage
 */
function getCachedDocuments(): AdmissionDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read cached admission documents', err);
  }
  return DEFAULT_OFFICIAL_ADMISSION_DOCUMENTS;
}

/**
 * Helper to safely write to localStorage
 */
function setCachedDocuments(docs: AdmissionDocument[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.warn('Could not write cached admission documents', err);
  }
}

/**
 * Fetch all published admission documents for visitors
 */
export async function getPublishedAdmissionDocuments(): Promise<AdmissionDocument[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const docs: AdmissionDocument[] = [];
      snap.forEach((d) => {
        const data = d.data() as AdmissionDocument;
        if (data.published) {
          docs.push({ ...data, id: d.id });
        }
      });
      // Sort by order or code
      docs.sort((a, b) => (a.order || 99) - (b.order || 99));
      if (docs.length > 0) {
        setCachedDocuments(docs);
        return docs;
      }
    }
  } catch (err) {
    console.warn('Could not fetch admission documents from Firestore, using local fallback:', err);
  }

  // Fallback to local cache or defaults
  const cached = getCachedDocuments();
  return cached.filter((d) => d.published);
}

/**
 * Fetch all admission documents (both published and draft) for authenticated administrators
 */
export async function getAllAdmissionDocuments(): Promise<AdmissionDocument[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);

    if (!snap.empty) {
      const docs: AdmissionDocument[] = [];
      snap.forEach((d) => {
        const data = d.data() as AdmissionDocument;
        docs.push({ ...data, id: d.id });
      });
      docs.sort((a, b) => (a.order || 99) - (b.order || 99));
      setCachedDocuments(docs);
      return docs;
    }
  } catch (err) {
    console.warn('Admin fetching admission documents fallback:', err);
  }

  return getCachedDocuments();
}

/**
 * Validates uploaded file type and size according to security guidelines
 */
export function validateAdmissionFile(file: File): { valid: boolean; error?: string } {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];
  const maxBytes = 10 * 1024 * 1024; // 10MB limit

  const fileName = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some((ext) => fileName.endsWith(ext));

  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Aina ya faili haikubaliwi. Tafadhali pakia faili la PDF (.pdf), Word (.docx, .doc), au picha (.jpg, .png).',
    };
  }

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Faili ni kubwa mno (${(file.size / (1024 * 1024)).toFixed(1)}MB). Ukubwa wa juu unaoruhusiwa ni 10MB.`,
    };
  }

  return { valid: true };
}

/**
 * Converts a browser File into a base64 Data URL for persistent document storage
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Create a new admission document (Admin only)
 */
export async function createAdmissionDocument(
  data: Omit<AdmissionDocument, 'id' | 'createdAt' | 'updatedAt' | 'downloadsCount'>,
  file?: File
): Promise<AdmissionDocument> {
  const docId = `uom-adm-${Date.now()}`;
  const now = new Date().toISOString();

  let fileDataUrl: string | undefined = undefined;
  let fileSizeStr = data.fileSize || '150 KB';
  let fileNameStr = data.fileName || `${data.code || 'DOC'}.pdf`;

  if (file) {
    const validation = validateAdmissionFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    fileDataUrl = await fileToDataUrl(file);
    fileSizeStr = `${Math.round(file.size / 1024)} KB`;
    fileNameStr = file.name;
  }

  const newDoc: AdmissionDocument = {
    ...data,
    id: docId,
    fileData: fileDataUrl,
    fileSize: fileSizeStr,
    fileName: fileNameStr,
    downloadsCount: 0,
    uploadedBy: auth.currentUser?.email || 'admin@uombonisec.ac.tz',
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await setDoc(docRef, newDoc);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.CREATE, `${COLLECTION_NAME}/${docId}`);
  }

  // Update local cache
  const cached = getCachedDocuments();
  cached.push(newDoc);
  setCachedDocuments(cached);

  return newDoc;
}

/**
 * Update an existing admission document (Admin only)
 */
export async function updateAdmissionDocument(
  id: string,
  updates: Partial<AdmissionDocument>,
  file?: File
): Promise<void> {
  const now = new Date().toISOString();
  const finalUpdates: any = { ...updates, updatedAt: now };

  if (file) {
    const validation = validateAdmissionFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    finalUpdates.fileData = await fileToDataUrl(file);
    finalUpdates.fileSize = `${Math.round(file.size / 1024)} KB`;
    finalUpdates.fileName = file.name;
    finalUpdates.downloadType = 'uploaded';
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, finalUpdates);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
  }

  // Update local cache
  const cached = getCachedDocuments();
  const idx = cached.findIndex((d) => d.id === id);
  if (idx !== -1) {
    cached[idx] = { ...cached[idx], ...finalUpdates };
    setCachedDocuments(cached);
  }
}

/**
 * Toggle publication status of an admission document
 */
export async function togglePublishAdmissionDocument(id: string, published: boolean): Promise<void> {
  await updateAdmissionDocument(id, { published });
}

/**
 * Delete an admission document (Admin only)
 */
export async function deleteAdmissionDocument(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
  }

  const cached = getCachedDocuments();
  const filtered = cached.filter((d) => d.id !== id);
  setCachedDocuments(filtered);
}

/**
 * Increments the download counter for analytics
 */
export async function recordDocumentDownload(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      downloadsCount: increment(1),
    });
  } catch {
    // Non-blocking
  }

  const cached = getCachedDocuments();
  const item = cached.find((d) => d.id === id);
  if (item) {
    item.downloadsCount = (item.downloadsCount || 0) + 1;
    setCachedDocuments(cached);
  }
}

/**
 * Universal download executor: downloads the real PDF document or uploaded file
 */
export async function downloadAdmissionDocument(document: AdmissionDocument): Promise<void> {
  recordDocumentDownload(document.id);

  // If this is an uploaded document with fileData
  if (document.downloadType === 'uploaded' && document.fileData) {
    const link = window.document.createElement('a');
    link.href = document.fileData;
    link.download = document.fileName || `${document.code || 'DOC'}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    return;
  }

  // If this is one of our authentic official generators
  switch (document.generatorKey) {
    case 'admission_form':
      downloadStudentAdmissionFormPdf();
      break;

    case 'medical_form':
      downloadOfficialMedicalExaminationFormPdf();
      break;

    case 'parent_form':
      downloadParentGuardianFormPdf();
      break;

    case 'joining_instructions':
      downloadOfficialJoiningInstructions2027Pdf();
      break;

    case 'school_rules':
      downloadSchoolRulesAndRegulationsPdf();
      break;

    case 'checklist':
      downloadVituMuhimuPdf();
      break;

    default:
      // Fallback: generate admission form if no specific generator is set
      downloadStudentAdmissionFormPdf();
      break;
  }
}
