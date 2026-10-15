import { supabase } from "./supabase";

/**
 * Browser-side image pipeline: compress first, upload second.
 * Target: WebP · max 1600px wide · quality 80 — highest fidelity per byte.
 */

export const IMAGE_BUCKET = "portfolio-images";
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
export const TARGET_MAX_WIDTH = 1600;
export const TARGET_QUALITY = 0.8;

export type ImageFolder = "projects" | "testimonials" | "avatars";

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

export type CompressionResult = {
  blob: Blob;
  /** `webp` or `jpeg` — whatever the browser accepted. */
  format: "webp" | "jpeg";
  width: number;
  height: number;
  fromBytes: number;
  toBytes: number;
};

function humanSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}

export function formatBytes(bytes: number): string {
  return humanSize(bytes);
}

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("unreadable"));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resizes to at most 1600px wide (never upscales) and exports WebP at 80%.
 * Falls back to JPEG 82% when the browser refuses WebP encoding.
 */
export async function compressImage(file: File | Blob): Promise<CompressionResult> {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`Image exceeds 10MB (${humanSize(file.size)})`);
  }
  const image = await loadImage(file);
  const scale = Math.min(1, TARGET_MAX_WIDTH / (image.naturalWidth || TARGET_MAX_WIDTH));
  const width = Math.max(1, Math.round((image.naturalWidth || 1) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || 1) * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas unsupported");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  let blob = await canvasToBlob(canvas, "image/webp", TARGET_QUALITY);
  let format: "webp" | "jpeg" = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, "image/jpeg", 0.82);
    format = "jpeg";
  }
  if (!blob) throw new Error("compression failed");

  return {
    blob,
    format,
    width,
    height,
    fromBytes: file.size,
    toBytes: blob.size,
  };
}

function randomName(): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}`;
}

export type UploadResult = {
  url: string;
  compression: CompressionResult;
};

/** Compresses locally, then pushes to the public `portfolio-images` bucket. */
export async function uploadImage(file: File | Blob, folder: ImageFolder): Promise<UploadResult> {
  if (!supabase) throw new Error("Supabase not configured");
  if (file.type && !ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Unsupported image type (jpeg, png, webp, gif)");
  }

  const compression = await compressImage(file);
  const path = `${folder}/${randomName()}.${compression.format}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, compression.blob, {
      contentType: compression.blob.type || `image/${compression.format}`,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, compression };
}
