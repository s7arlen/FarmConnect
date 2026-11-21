import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { uploadBufferToCloudinary } from "@/lib/cloudinary.server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const ALLOWED_FOLDERS = [
  "farmconnect/products",
  "farmconnect/farms",
  "farmconnect/avatars",
];

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request);

    // Strictly enforce authentication for all file uploads across all environments
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload images." },
        { status: 401 }
      );
    }

    const clientIp = getClientIp(request.headers);
    const rateLimit = checkRateLimit(`upload_${clientIp}_${session.userId}`, 15, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Upload rate limit exceeded. Please wait a moment." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedFolder = formData.get("folder") as string;
    const folder = ALLOWED_FOLDERS.includes(requestedFolder)
      ? requestedFolder
      : "farmconnect/products";

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Please upload a JPEG, PNG, WebP, or AVIF image.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image file exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename to prevent directory traversal
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

    const result = await uploadBufferToCloudinary(buffer, folder, safeFilename);

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
