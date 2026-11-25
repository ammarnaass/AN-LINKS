import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export interface S3StorageConfig {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  publicBaseUrl?: string;
}

export interface StorageUploadResult {
  url: string;
  provider: "s3" | "local";
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data).digest();
}

function sha256Hex(data: Buffer | string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Reads optional S3/Cloudflare R2 configuration from environment variables.
 */
export function getS3Config(): S3StorageConfig | null {
  const endpoint = process.env.S3_ENDPOINT?.trim();
  const bucket = process.env.S3_BUCKET?.trim();
  const accessKeyId = process.env.S3_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY?.trim();

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return {
    endpoint: endpoint.replace(/\/$/, ""),
    bucket,
    accessKeyId,
    secretAccessKey,
    region: process.env.S3_REGION?.trim() || "auto",
    publicBaseUrl: process.env.S3_PUBLIC_URL?.trim().replace(/\/$/, ""),
  };
}

/**
 * Uploads a buffer to an S3-compatible object store (Cloudflare R2 / AWS S3) using SigV4.
 */
export async function uploadToS3(
  buffer: Buffer,
  objectKey: string,
  contentType: string,
  config: S3StorageConfig
): Promise<string> {
  const targetUrl = new URL(`${config.endpoint}/${config.bucket}/${objectKey}`);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(buffer);

  const canonicalHeaders = `host:${targetUrl.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [
    "PUT",
    targetUrl.pathname,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmacSha256(`AWS4${config.secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, config.region);
  const kService = hmacSha256(kRegion, "s3");
  const kSigning = hmacSha256(kService, "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(targetUrl.toString(), {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
      Authorization: authorization,
    },
    body: new Uint8Array(buffer),
  });

  if (!res.ok) {
    throw new Error(`S3 upload failed with HTTP ${res.status}`);
  }

  return config.publicBaseUrl
    ? `${config.publicBaseUrl}/${objectKey}`
    : targetUrl.toString();
}

/**
 * Uploads an image to S3/R2 when configured, or falls back to local `public/uploads` in dev.
 */
export async function uploadProcessedImage(
  buffer: Buffer,
  filename: string,
  contentType = "image/webp"
): Promise<StorageUploadResult> {
  const s3Config = getS3Config();
  if (s3Config) {
    const url = await uploadToS3(buffer, `avatars/${filename}`, contentType, s3Config);
    return { url, provider: "s3" };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, filename);
  await fs.writeFile(filePath, buffer);

  return { url: `/uploads/${filename}`, provider: "local" };
}
