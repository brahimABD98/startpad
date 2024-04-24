import * as Minio from "minio";
import { env } from "@/env";
import type internal from "stream";

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
  file: internal.Readable;
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
