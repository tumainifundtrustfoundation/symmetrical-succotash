/**
 * Central Storage Service using Vercel Blob architecture
 * Provides upload, retrieval, listing, and deletion for school assets, documents, and media.
 */
import { put, get, del, head, list, PutBlobResult } from '@vercel/blob';

export interface UploadOptions {
  access?: 'public' | 'private';
  contentType?: string;
}

/**
 * Upload a file, image, or text content to Blob Storage
 */
export async function uploadToStorage(
  pathname: string,
  content: File | Blob | string | ArrayBuffer,
  options: UploadOptions = { access: 'public' }
): Promise<PutBlobResult> {
  const cleanPath = pathname.replace(/^\/+/, '');
  return await put(cleanPath, content, options);
}

/**
 * Fetch a private or public blob from Storage
 */
export async function getFromStorage(pathname: string) {
  return await get(pathname, { access: 'private' });
}

/**
 * Delete a blob from Storage
 */
export async function deleteFromStorage(pathnameOrUrl: string): Promise<void> {
  await del(pathnameOrUrl);
}

/**
 * Get blob metadata
 */
export async function getStorageMetadata(pathnameOrUrl: string) {
  return await head(pathnameOrUrl);
}

/**
 * List all stored blobs
 */
export async function listStorageBlobs() {
  return await list();
}

export default {
  uploadToStorage,
  getFromStorage,
  deleteFromStorage,
  getStorageMetadata,
  listStorageBlobs,
};
