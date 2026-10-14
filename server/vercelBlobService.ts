import { put, get } from "@vercel/blob";
import { Readable } from "stream";
import type { Request, Response } from "express";

interface InMemoryBlobItem {
  data: Buffer;
  contentType?: string;
  pathname: string;
  url: string;
}

const memoryStore = new Map<string, InMemoryBlobItem>();

/**
 * Validates BLOB_READ_WRITE_TOKEN availability
 */
export function getBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN || null;
}

/**
 * Securely serves private Vercel Blob files with streaming & nosniff headers.
 * Falls back to in-memory store if token is not configured.
 */
export async function handleGetPrivateBlob(req: Request, res: Response) {
  try {
    const pathname = (req.query.pathname as string) || (req.query.path as string);
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter" });
    }

    if (memoryStore.has(pathname)) {
      const item = memoryStore.get(pathname)!;
      res.setHeader("Cache-Control", "private, no-cache");
      if (item.contentType) {
        res.setHeader("Content-Type", item.contentType);
      }
      res.setHeader("X-Content-Type-Options", "nosniff");
      return res.send(item.data);
    }

    const token = getBlobToken();
    if (!token) {
      return res.status(404).send("Not found");
    }

    const result = await get(pathname, {
      access: "private",
      token,
    });

    if (result === null) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Cache-Control", "private, no-cache");
    if (result.blob.contentType) {
      res.setHeader("Content-Type", result.blob.contentType);
    }
    res.setHeader("X-Content-Type-Options", "nosniff");

    if (result.stream) {
      const nodeStream = Readable.fromWeb(result.stream as any);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (err: any) {
    console.error("Vercel Blob GET error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Failed to retrieve private blob",
    });
  }
}

/**
 * Uploads a file/document to private Vercel Blob storage, or in-memory stub if token missing.
 */
export async function handlePutPrivateBlob(req: Request, res: Response) {
  try {
    const { pathname, content, contentType } = req.body;
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter in request body" });
    }

    let bodyData: Buffer = Buffer.alloc(0);
    if (typeof content === "string" && content.startsWith("data:") && content.includes(";base64,")) {
      const base64Data = content.split(";base64,")[1];
      bodyData = Buffer.from(base64Data, "base64");
    } else if (typeof content === "string") {
      bodyData = Buffer.from(content, "utf-8");
    } else if (Buffer.isBuffer(content)) {
      bodyData = content;
    }

    const token = getBlobToken();
    if (token) {
      try {
        const blob = await put(pathname, bodyData, {
          access: "private",
          token,
          contentType: contentType || undefined,
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
      } catch (blobErr: any) {
        console.warn("Vercel Blob put error, falling back to in-memory store:", blobErr?.message);
      }
    }

    // In-memory fallback
    const fallbackUrl = `/api/blob?pathname=${encodeURIComponent(pathname)}`;
    memoryStore.set(pathname, {
      data: bodyData,
      contentType: contentType || "application/octet-stream",
      pathname,
      url: fallbackUrl,
    });

    return res.json({
      success: true,
      blob: {
        url: fallbackUrl,
        pathname,
        contentType: contentType || "application/octet-stream",
        contentDisposition: `inline; filename="${pathname.split("/").pop()}"`,
      },
    });
  } catch (err: any) {
    console.error("Vercel Blob PUT error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Failed to put private blob",
    });
  }
}
