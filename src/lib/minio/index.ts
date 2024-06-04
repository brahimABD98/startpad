import * as Minio from "minio";
import { env } from "@/env";

export const s3client = new Minio.Client({
  endPoint: env.S3_ENDPOINT,
  port: env.S3_PORT ? Number(env.S3_PORT) : undefined,
  accessKey: env.S3_ACCESS_KEY,
  secretKey: env.S3_SECRET_KEY,
  useSSL: false,
});

export async function createBucketIfNotExists(bucketName: string) {
  const bucketExists = await s3client.bucketExists(bucketName);
  if (!bucketExists) {
    await s3client.makeBucket(bucketName);
  }
}

export async function saveFileInBucket({
  bucketName,
  fileName,
  file,
}: {
  bucketName: string;
  fileName: string;
  file: Buffer;
    }) {
  await createBucketIfNotExists(bucketName);
  const fileExists = await checkfileExistsInBucket({
    bucketName,
    fileName,
  });
  if (fileExists) {
    throw new Error("file already exists");
  }
  await s3client.putObject(bucketName, fileName, file);
}

export async function checkfileExistsInBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3client.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
    return null;
  }
  return await s3client.getObject(bucketName, fileName);
}

export async function getFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3client.statObject(bucketName, fileName);
  } catch (error) {
    console.error(error);
  }
  return await s3client.getObject(bucketName, fileName);
}

export async function deleteFileFromBucket({
  bucketName,
  fileName,
}: {
  bucketName: string;
  fileName: string;
}) {
  try {
    await s3client.removeObject(bucketName, fileName);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}

export async function createPresignedUrlToUpload({
  bucketName,
  fileName,
  expiry = 60 * 60, // 1 hour
}: {
  bucketName: string;
  fileName: string;
  expiry?: number;
}) {
  // Create bucket if it doesn't exist
  await createBucketIfNotExists(bucketName);

  return await s3client.presignedPutObject(bucketName, fileName, expiry);
}

export async function createPresignedUrlToDownload({
  bucketName,
  fileName,
  expiry = 60 * 60, // 1 hour
}: {
  bucketName: string;
  fileName: string;
  expiry?: number;
}) {
  return await s3client.presignedGetObject(bucketName, fileName, expiry);
}
