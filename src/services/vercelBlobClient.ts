/**
 * Client service to interact with private Vercel Blob storage via secure server proxy
 */

export interface PutBlobResult {
  success: boolean;
  blob?: {
    url: string;
    pathname: string;
    contentType?: string;
    contentDisposition?: string;
  };
  error?: string;
}

/**
 * Uploads a file (text, json, base64, or binary) to private Vercel Blob storage
 */
export async function uploadPrivateBlob(
  pathname: string,
  content: string | Blob | File,
  contentType?: string
): Promise<PutBlobResult> {
  try {
    let bodyContent: string;

    if (typeof content !== "string") {
      bodyContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(content);
      });
    } else {
      bodyContent = content;
    }

    const response = await fetch("/api/blob/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pathname,
        content: bodyContent,
        contentType:
          contentType ||
          (typeof content !== "string" && "type" in content ? content.type : undefined),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.error("uploadPrivateBlob error:", err);
    return {
      success: false,
      error: err?.message || "Failed to upload file to private blob storage",
    };
  }
}

/**
 * Constructs the secure streaming URL for a private Vercel Blob
 */
export function getPrivateBlobProxyUrl(pathname: string): string {
  return `/api/blob?pathname=${encodeURIComponent(pathname)}`;
}
