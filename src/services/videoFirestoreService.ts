import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SchoolVideo } from '../types';

export const VIDEOS_COLLECTION = 'school_videos';
const LOCAL_STORAGE_VIDEOS_KEY = 'uomboni_school_videos';

/**
 * Extracts YouTube video ID from various formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - https://m.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern for YouTube IDs: 11 characters typically [a-zA-Z0-9_-]
  // 1. youtu.be/<id>
  const shortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // 2. youtube.com/shorts/<id>
  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 3. youtube.com/embed/<id>
  const embedMatch = cleanUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i);
  if (embedMatch && embedMatch[1]) return embedMatch[1];

  // 4. youtube.com/watch?v=<id> or watch?.*?v=<id>
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 5. Raw 11-char ID input
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function buildYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// Authentic initial school videos for Uomboni Secondary School
export const INITIAL_SCHOOL_VIDEOS: SchoolVideo[] = [
  {
    id: 'vid-uomboni-tour-01',
    title: 'Uomboni Secondary School - Campus Tour & Marangu Slopes',
    titleSw: 'Ziara ya Shule ya Sekondari Uomboni na Mazingira ya Marangu',
    description: 'Explore our peaceful campus on the scenic slopes of Mount Kilimanjaro, modern science labs, library, and boarding facilities.',
    descriptionSw: 'Tazama mazingira tulivu ya shule kwenye mteremko wa Mlima Kilimanjaro, maabara za kisasa, maktaba na miundombinu ya bweni.',
    youtubeUrl: 'https://www.youtube.com/watch?v=bTqVqk7FSmY',
    videoId: 'bTqVqk7FSmY',
    embedUrl: 'https://www.youtube-nocookie.com/embed/bTqVqk7FSmY?rel=0&modestbranding=1',
    thumbnailUrl: 'https://img.youtube.com/vi/bTqVqk7FSmY/hqdefault.jpg',
    published: true,
    featured: true,
    category: 'Campus Life',
    publishedDate: '2026-01-15',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-15T08:00:00Z',
    createdBy: 'Uomboni Media Team',
  },
  {
    id: 'vid-uomboni-science-02',
    title: 'Practical Science Excellence at Uomboni Secondary School',
    titleSw: 'Mafunzo ya Vitendo ya Sayansi na Maabara Shule ya Sekondari Uomboni',
    description: 'Students engaged in physics, chemistry, and biology laboratory experiments under the guidance of experienced instructors.',
    descriptionSw: 'Wanafunzi wakifanya majaribio ya vitendo katika maabara za fizikia, kemia na baiolojia kwa mwongozo wa walimu waliobobea.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoId: 'kJQP7kiw5Fk',
    embedUrl: 'https://www.youtube-nocookie.com/embed/kJQP7kiw5Fk?rel=0&modestbranding=1',
    thumbnailUrl: 'https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg',
    published: true,
    featured: false,
    category: 'Academic',
    publishedDate: '2026-02-10',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    createdBy: 'Academic Department',
  },
  {
    id: 'vid-uomboni-graduation-03',
    title: 'Form Four Graduation Ceremony & Holy Mass',
    titleSw: 'Mahafali ya Kidato cha Nne na Ibada Takatifu ya Misa',
    description: 'Celebrating the academic excellence and moral formation of graduating candidates in the presence of parents and diocesan clergy.',
    descriptionSw: 'Kusherehekea mafanikio ya kitaaluma na malezi bora ya wahitimu mbele ya wazazi na viongozi wa Jimbo Katoliki Moshi.',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    videoId: 'fJ9rUzIMcZQ',
    embedUrl: 'https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ?rel=0&modestbranding=1',
    thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    published: true,
    featured: false,
    category: 'Events & Graduation',
    publishedDate: '2025-11-20',
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2025-11-20T09:00:00Z',
    createdBy: 'Headmaster Office',
  },
];

/**
 * Fetch all school videos from Firestore (falls back to localStorage or initial defaults)
 */
export async function getSchoolVideos(): Promise<SchoolVideo[]> {
  try {
    const snap = await getDocs(collection(db, VIDEOS_COLLECTION));
    if (!snap.empty) {
      const videos: SchoolVideo[] = [];
      snap.forEach((docSnap) => {
        videos.push({ id: docSnap.id, ...(docSnap.data() as Omit<SchoolVideo, 'id'>) });
      });
      // Cache locally
      try {
        localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(videos));
      } catch {}
      return videos;
    }
  } catch (err: any) {
    if (err?.code === 'permission-denied') {
      handleFirestoreError(err, OperationType.LIST, VIDEOS_COLLECTION);
    }
    console.warn('Firestore fetch for videos failed, falling back to local storage/defaults:', err);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  return INITIAL_SCHOOL_VIDEOS;
}

/**
 * Fetch only publicly published school videos
 */
export async function getPublishedSchoolVideos(): Promise<SchoolVideo[]> {
  const all = await getSchoolVideos();
  return all.filter((v) => v.published);
}

/**
 * Save or update a video in Firestore (and local cache)
 */
export async function saveSchoolVideo(video: SchoolVideo): Promise<boolean> {
  // Update local cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    const list: SchoolVideo[] = cached ? JSON.parse(cached) : [...INITIAL_SCHOOL_VIDEOS];
    const idx = list.findIndex((v) => v.id === video.id);
    if (idx >= 0) {
      list[idx] = video;
    } else {
      list.unshift(video);
    }
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(list));
  } catch {}

  try {
    await setDoc(doc(db, VIDEOS_COLLECTION, video.id), video, { merge: true });
    return true;
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `${VIDEOS_COLLECTION}/${video.id}`);
    return false;
  }
}

/**
 * Delete video from Firestore and local cache
 */
export async function deleteSchoolVideo(videoId: string): Promise<boolean> {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (cached) {
      const list: SchoolVideo[] = JSON.parse(cached);
      const filtered = list.filter((v) => v.id !== videoId);
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(filtered));
    }
  } catch {}

  try {
    await deleteDoc(doc(db, VIDEOS_COLLECTION, videoId));
    return true;
  } catch (err: any) {
    handleFirestoreError(err, OperationType.DELETE, `${VIDEOS_COLLECTION}/${videoId}`);
    return false;
  }
}
