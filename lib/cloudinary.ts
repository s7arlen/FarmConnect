/**
 * Image upload abstraction for client components.
 * Sends files to /api/upload which securely processes uploads via Cloudinary.
 */

export interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

/**
 * Upload an image file via the Next.js API route.
 */
export async function uploadImage(
  file: File,
  folder: string = "farmconnect/products"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to upload image");
  }

  return {
    url: data.url,
    publicId: data.publicId,
    width: data.width,
    height: data.height,
  };
}

export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 80
): string {
  if (!url) return "";

  // If it's a Cloudinary URL, add auto-format and responsive scaling
  if (url.includes("res.cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},q_${quality},f_auto/`
    );
  }

  // For Unsplash (demo), add size params
  if (url.includes("images.unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?w=${width}&q=${quality}`;
  }

  return url;
}
