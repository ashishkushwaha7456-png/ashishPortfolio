import { S3Client } from "@aws-sdk/client-s3";

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client | null {
  if (s3Client) return s3Client;

  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    return null;
  }

  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  });

  return s3Client;
}

export function getS3Bucket(): string {
  return process.env.AWS_S3_BUCKET_NAME || "ashish-portfolio-media";
}

export function isS3Configured(): boolean {
  return getS3Client() !== null;
}

/**
 * Build the public URL for an S3 object.
 * Uses the standard virtual-hosted-style URL.
 */
export function s3PublicUrl(key: string): string {
  const bucket = getS3Bucket();
  const region = process.env.AWS_REGION || "ap-south-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}
