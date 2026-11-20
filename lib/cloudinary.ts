/**
 * Image upload abstraction.
 * Currently returns the original URL for demo purposes.
 * Replace uploadImage() with Cloudinary/S3 implementation for production.
 */

export interface UploadResult {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

/**
 * Upload an image file.
 * In production: upload to Cloudinary or S3 and return the URL.
 */
export async function uploadImage(
  file: File,
  folder: string = "farmconnect"
): Promise<UploadResult> {
  // Production: uncomment and configure Cloudinary
  /*
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "farmconnect");
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
  */

  // Development: return object URL (only works client-side)
  return {
    url: URL.createObjectURL(file),
  };
}

export function getOptimizedImageUrl(
  url: string,
  width: number = 800,
  quality: number = 80
): string {
  // If it's a Cloudinary URL, add transformations
  if (url.includes("res.cloudinary.com")) {
    return url.replace(
      "/upload/",
      `/upload/w_${width},q_${quality},f_auto/`
    );
  }

  // For Unsplash (demo), add size params
  if (url.includes("unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?w=${width}&q=${quality}`;
  }

  return url;
}
