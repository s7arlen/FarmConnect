import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET = process.env.NEON_BUCKET_NAME || "assets";

export const s3 = new S3Client({
  forcePathStyle: true, // required: Neon uses path-style addressing
  region: process.env.AWS_REGION || "us-east-2",
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Upload a file buffer to Neon Object Storage.
 * Generates an authenticated presigned URL for viewing/downloading.
 */
export async function uploadToNeonStorage(
  key: string,
  buffer: Buffer,
  contentType: string = "image/jpeg"
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  // Generate a presigned URL valid for 7 days
  const getCommand = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  const presignedUrl = await getSignedUrl(s3, getCommand, {
    expiresIn: 60 * 60 * 24 * 7,
  });

  return {
    key,
    bucket: BUCKET,
    url: presignedUrl,
  };
}

/**
 * Delete an object from Neon Object Storage.
 */
export async function deleteFromNeonStorage(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return await s3.send(command);
}
