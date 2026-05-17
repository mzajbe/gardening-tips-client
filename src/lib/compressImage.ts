/**
 * compressImage
 * -------------
 * Pure browser-side image compressor using the Canvas API.
 * No external dependencies — works with any image format the browser supports
 * (JPEG, PNG, WebP, AVIF, BMP, etc.).
 *
 * Output format: WebP (falls back to JPEG in browsers that don't support WebP export).
 * Animation is NOT preserved (canvas is always a single frame).
 */

export interface CompressOptions {
  /** Maximum output width in pixels. Defaults to 1280. */
  maxWidth?: number;
  /** Maximum output height in pixels. Defaults to 720. */
  maxHeight?: number;
  /** Encoder quality, 0–1. Defaults to 0.82. */
  quality?: number;
}

/**
 * Loads a File/Blob into an HTMLImageElement.
 * Returns a Promise that resolves when the image is fully decoded.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
}

/**
 * Draws the image onto a canvas (scaled down to fit maxWidth × maxHeight while
 * preserving the aspect ratio — never upscales) and returns the canvas blob.
 */
function drawAndExport(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const srcW = img.naturalWidth;
    const srcH = img.naturalHeight;

    // Calculate target dimensions (scale down only, never upscale)
    const widthRatio = srcW > maxWidth ? maxWidth / srcW : 1;
    const heightRatio = srcH > maxHeight ? maxHeight / srcH : 1;
    const scale = Math.min(widthRatio, heightRatio);

    const targetW = Math.round(srcW * scale);
    const targetH = Math.round(srcH * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas 2D context unavailable"));
      return;
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Try WebP first; fall back to JPEG
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }
        // WebP not supported as output — retry with JPEG
        canvas.toBlob(
          (jpegBlob) => {
            if (jpegBlob) {
              resolve(jpegBlob);
            } else {
              reject(new Error("canvas.toBlob() returned null"));
            }
          },
          "image/jpeg",
          quality,
        );
      },
      "image/webp",
      quality,
    );
  });
}

/**
 * Main export.
 *
 * @param file    The original image File selected by the user.
 * @param options Optional tuning (maxWidth, maxHeight, quality).
 * @returns       A new, smaller File object ready to be appended to FormData.
 *                Falls back to the original file if anything goes wrong.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<File> {
  const { maxWidth = 1280, maxHeight = 720, quality = 0.82 } = options;

  try {
    const img = await loadImage(file);
    const blob = await drawAndExport(img, maxWidth, maxHeight, quality);

    // Keep a sensible name; replace extension with the actual output type
    const isWebP = blob.type === "image/webp";
    const baseName = file.name.replace(/\.[^/.]+$/, ""); // strip extension
    const outName = `${baseName}_compressed.${isWebP ? "webp" : "jpg"}`;

    return new File([blob], outName, { type: blob.type });
  } catch (err) {
    // Safety net: if compression fails for any reason, return the original
    console.warn("[compressImage] Compression failed, using original file:", err);
    return file;
  }
}

/** Formats a byte count as a human-readable string (KB or MB). */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
