/**
 * In-Memory & Server-backed @vercel/blob drop-in replacement
 * Conforms to @vercel/blob API specification for AI Studio environments.
 * Per migration guidelines: @vercel/blob is mapped to an in-memory/server stub.
 */

export interface PutBlobResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  contentDisposition: string;
}

export interface PutOptions {
  access?: 'public' | 'private';
  contentType?: string;
  addRandomSuffix?: boolean;
  token?: string;
}

export interface GetBlobResult {
  blob: {
    url: string;
    downloadUrl: string;
    pathname: string;
    contentType: string;
    size: number;
    uploadedAt: Date;
  };
  stream: ReadableStream | any;
  statusCode: number;
}

const memoryBlobs = new Map<
  string,
  { content: any; contentType: string; url: string; pathname: string }
>();

export async function put(
  pathname: string,
  body: string | Blob | ArrayBuffer | Buffer | ReadableStream | any,
  options?: PutOptions
): Promise<PutBlobResult> {
  let textOrBuffer: any = body;
  let detectedContentType = options?.contentType || 'text/plain';

  if (typeof Blob !== 'undefined' && body instanceof Blob) {
    detectedContentType = options?.contentType || body.type || 'application/octet-stream';
    textOrBuffer = await body.text();
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  const cleanPath = pathname.replace(/^\/+/, '');
  const url = `${baseUrl}/api/blobs/${cleanPath}`;
  const downloadUrl = `${url}?download=1`;
  const filename = cleanPath.split('/').pop() || 'file';

  memoryBlobs.set(cleanPath, {
    content: textOrBuffer,
    contentType: detectedContentType,
    url,
    pathname: cleanPath,
  });

  if (typeof fetch !== 'undefined') {
    try {
      await fetch(`/api/blobs/${cleanPath}`, {
        method: 'PUT',
        headers: { 'Content-Type': detectedContentType },
        body: typeof textOrBuffer === 'string' ? textOrBuffer : JSON.stringify(textOrBuffer),
      });
    } catch {
      // In-memory fallback
    }
  }

  return {
    url,
    downloadUrl,
    pathname: cleanPath,
    contentType: detectedContentType,
    contentDisposition: `inline; filename="${filename}"`,
  };
}

export async function get(
  pathnameOrUrl: string,
  options?: { access?: 'public' | 'private'; token?: string }
): Promise<GetBlobResult | null> {
  const cleanPath = pathnameOrUrl
    .replace(/^https?:\/\/[^/]+\/api\/blobs\//, '')
    .replace(/^\/+/, '');

  let item = memoryBlobs.get(cleanPath);

  // If not found in client memory, try fetching from server endpoint
  if (!item && typeof fetch !== 'undefined') {
    try {
      const res = await fetch(`/api/blobs/${cleanPath}`);
      if (res.ok) {
        const text = await res.text();
        item = {
          content: text,
          contentType: res.headers.get('content-type') || 'text/plain',
          url: `/api/blobs/${cleanPath}`,
          pathname: cleanPath,
        };
        memoryBlobs.set(cleanPath, item);
      }
    } catch {}
  }

  if (!item) return null;

  const contentStr =
    typeof item.content === 'string' ? item.content : JSON.stringify(item.content);

  let stream: any = null;
  if (typeof ReadableStream !== 'undefined') {
    stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(contentStr));
        controller.close();
      },
    });
  }

  return {
    blob: {
      url: item.url,
      downloadUrl: `${item.url}?download=1`,
      pathname: item.pathname,
      contentType: item.contentType,
      size: contentStr.length,
      uploadedAt: new Date(),
    },
    stream,
    statusCode: 200,
  };
}

export async function del(url: string | string[]): Promise<void> {
  const urls = Array.isArray(url) ? url : [url];
  for (const u of urls) {
    const cleanPath = u.replace(/^https?:\/\/[^/]+\/api\/blobs\//, '').replace(/^\/+/, '');
    memoryBlobs.delete(cleanPath);
    if (typeof fetch !== 'undefined') {
      try {
        await fetch(`/api/blobs/${cleanPath}`, { method: 'DELETE' });
      } catch {}
    }
  }
}

export async function head(url: string) {
  const cleanPath = url.replace(/^https?:\/\/[^/]+\/api\/blobs\//, '').replace(/^\/+/, '');
  const item = memoryBlobs.get(cleanPath);
  if (!item) throw new Error('Blob not found');
  return {
    url: item.url,
    pathname: item.pathname,
    contentType: item.contentType,
    size: typeof item.content === 'string' ? item.content.length : 0,
    uploadedAt: new Date(),
  };
}

export async function list() {
  return {
    blobs: Array.from(memoryBlobs.values()).map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: typeof b.content === 'string' ? b.content.length : 0,
      uploadedAt: new Date(),
    })),
  };
}

export default { put, get, del, head, list };
