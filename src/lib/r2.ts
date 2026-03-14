import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadToR2(
  file: Buffer | Blob | ArrayBuffer,
  fileName: string,
  contentType: string
) {
  const bucketName = process.env.R2_BUCKET_NAME!;
  
  const body = file instanceof Blob ? await file.arrayBuffer() : file;
  const buffer = body instanceof ArrayBuffer ? Buffer.from(body) : body;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  // Return the public URL or a presigned URL
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  }

  // Fallback to presigned URL if no public URL configured
  const getCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileName,
  });
  return await getSignedUrl(s3, getCommand, { expiresIn: 3600 * 24 * 7 });
}
