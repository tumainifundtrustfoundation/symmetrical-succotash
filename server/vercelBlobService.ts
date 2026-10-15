import { put, get } from "@vercel/blob";
import { Readable } from "stream";
import type { Request, Response } from "express";

// MOCKED — in-memory Map stub per migration guide, data kept during process lifecycle
interface InMemoryBlobItem {
  content: Buffer;
  contentType: string;
  pathname: string;
  uploadedAt: string;
}

const inMemoryBlobStore = new Map<string, InMemoryBlobItem>();

/**
 * Validates BLOB_READ_WRITE_TOKEN availability
 */
export function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

/**
 * Securely serves private Blob files with streaming & nosniff headers
 */
export async function handleGetPrivateBlob(req: Request, res: Response) {
  try {
    const pathname = (req.query.pathname as string) || (req.query.path as string);
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter" });
    }

    const token = getBlobToken();

    // If token is configured, try fetching from Vercel Blob first
    if (token) {
      try {
        const result = await get(pathname, {
          access: "private",
          token,
        });

        if (result !== null) {
          res.setHeader("Cache-Control", "private, no-cache");
          if (result.blob.contentType) {
            res.setHeader("Content-Type", result.blob.contentType);
          }
          res.setHeader("X-Content-Type-Options", "nosniff");

          if (result.stream) {
            const nodeStream = Readable.fromWeb(result.stream as any);
            return nodeStream.pipe(res);
          } else {
            return res.end();
          }
        }
      } catch (cloudErr) {
        console.warn("Vercel Blob remote fetch note, falling back to memory:", cloudErr);
      }
    }

    // In-memory Map stub fallback
    const item = inMemoryBlobStore.get(pathname);
    if (!item) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Cache-Control", "private, no-cache");
    res.setHeader("Content-Type", item.contentType || "application/octet-stream");
    res.setHeader("X-Content-Type-Options", "nosniff");
    return res.end(item.content);
  } catch (err: any) {
    console.error("Blob GET error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Failed to retrieve blob",
    });
  }
}

/**
 * Uploads a file/document to Blob storage (in-memory Map stub or Vercel Blob if configured)
 */
export async function handlePutPrivateBlob(req: Request, res: Response) {
  try {
    const { pathname, content, contentType } = req.body;
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter in request body" });
    }

    const token = getBlobToken();

    let bodyData: Buffer;
    if (typeof content === "string" && content.startsWith("data:") && content.includes(";base64,")) {
      const base64Data = content.split(";base64,")[1];
      bodyData = Buffer.from(base64Data, "base64");
    } else if (Buffer.isBuffer(content)) {
      bodyData = content;
    } else {
      bodyData = Buffer.from(String(content || ""), "utf-8");
    }

    const finalContentType = contentType || "application/octet-stream";

    if (token) {
      try {
        const blob = await put(pathname, bodyData, {
          access: "private",
          token,
          contentType: finalContentType,
        });

        return res.json({
          success: true,
          blob: {
            url: blob.url,
            pathname: blob.pathname,
            contentType: blob.contentType,
            contentDisposition: blob.contentDisposition,
          },
        });
      } catch (cloudErr: any) {
        console.warn("Vercel Blob put error, storing in memory stub:", cloudErr?.message || cloudErr);
      }
    }

    // Save into in-memory store
    inMemoryBlobStore.set(pathname, {
      content: bodyData,
      contentType: finalContentType,
      pathname,
      uploadedAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      blob: {
        url: `/api/blob?pathname=${encodeURIComponent(pathname)}`,
        pathname,
        contentType: finalContentType,
        contentDisposition: `inline; filename="${pathname.split("/").pop() || "file"}"`,
      },
    });
  } catch (err: any) {
    console.error("Blob PUT error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Failed to put blob",
    });
  }
}
