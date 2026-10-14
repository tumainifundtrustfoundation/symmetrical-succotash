import { put, get, head, del, list } from "@vercel/blob";
import { Readable } from "stream";
import type { Request, Response } from "express";

/**
 * Validates BLOB_READ_WRITE_TOKEN availability
 */
export function getBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. Please configure it in your Vercel or local .env environment."
    );
  }
  return token;
}

/**
 * Securely serves private Vercel Blob files with streaming & nosniff headers
 */
export async function handleGetPrivateBlob(req: Request, res: Response) {
  try {
    const pathname = (req.query.pathname as string) || (req.query.path as string);
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter" });
    }

    const token = getBlobToken();

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
 * Uploads a file/document to private Vercel Blob storage
 */
export async function handlePutPrivateBlob(req: Request, res: Response) {
  try {
    const { pathname, content, contentType } = req.body;
    if (!pathname) {
      return res.status(400).json({ error: "Missing pathname parameter in request body" });
    }

    const token = getBlobToken();

    let bodyData: Buffer | string = content || "";
    if (typeof content === "string" && content.startsWith("data:") && content.includes(";base64,")) {
      const base64Data = content.split(";base64,")[1];
      bodyData = Buffer.from(base64Data, "base64");
    }

    const blob = await put(pathname, bodyData, {
      access: "private",
      token,
      contentType: contentType || undefined,
    });

    res.json({
      success: true,
      blob: {
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        contentDisposition: blob.contentDisposition,
      },
    });
  } catch (err: any) {
    console.error("Vercel Blob PUT error:", err?.message || err);
    res.status(500).json({
      error: err?.message || "Failed to put private blob",
    });
  }
}
