import "server-only";
import { db } from "./db";
import { createAPIFormMethod, isValidURL } from "@/lib/utils";
import { getServerAuthSession } from "./auth";
import { eq, and, or, inArray } from "drizzle-orm";
import { env } from "@/env";
import { startups, posts, postimages, files } from "./db/schema";
import type { SelectPosts, SelectStartups } from "./db/schema";
import { createPresignedUrlToDownload } from "@/lib/minio";
export async function getUserStartups() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) return null;
  const startups = db.query.startups.findMany({
    where: (model, { eq }) => eq(model.founderId, userId),
  });

  return startups;
}

export async function getJobPostings() {
  return db.query.job_listings.findMany({
    with: {
      startup: true,
    },
    orderBy: (model, { desc }) => [desc(model.created_at)],
  });
}

export async function getUserData() {
  const session = await getServerAuthSession();

  const user = session?.user;
  if (!user) return null;

  const userdata = db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, user?.id),
  });
  return userdata;
}
export async function getStartupJoblistings(id: string) {
  const session = await getServerAuthSession();
  const is_founder = await isFounder(id);

  if (!session || is_founder)
    return db.query.job_listings.findMany({
      where: (model, { eq }) => eq(model.startup_id, id),
    });
  const user = session?.user;
  const job_applications_availble = await db.query.job_applications.findMany({
    with: {
      job: true,
    },
    where: (model, { eq, and, not }) =>
      and(eq(model.job_id, id), not(eq(model.user_id, user.id))),
  });
  return job_applications_availble.map((model) => model.job);
}

export async function getJobListingByid(id: string) {
  return db.query.job_listings.findFirst({
    where: (model, { eq }) => eq(model.id, id),
    with: {
      startup: true,
    },
  });
}
export async function getjobwithCandidates(startup_id: string, job_id: string) {
  const is_founder = await isFounder(startup_id);
  if (!is_founder) return [];
  return db.query.job_applications.findMany({
    with: {
      coverLetter: true,
      user: true,
      resume: true,
    },
    where: (model, { eq }) => eq(model.job_id, job_id),
  });
}

export async function isFounder(startup_id: string) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) return false;
  const startup = await db.query.startups.findFirst({
    where: (model, { eq }) => eq(model.id, startup_id),
  });
  if (!startup) return false;
  return startup.founderId === userId;
}
export async function getUserWithStartups() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) return null;
  return db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, userId),
    with: {
      startups: true,
    },
  });
}
export async function getImageURL(image: string | null | undefined) {
  if (!image) return;
  return isValidURL(image)
    ? image
    : await createPresignedUrlToDownload({
        bucketName: "startpad",
        fileName: image,
      });
}

export async function getStartupPosts(startup: SelectStartups) {
  return await db.query.posts.findMany({
    where: or(
      eq(posts.startup_id, startup.id),
      eq(posts.user_id, startup.founderId),
    ),
    with: {
      createdByUser: true,
      createdByStartup: true,
    },
    orderBy: (model, { desc }) => [desc(model.createdAt)],
  });
}

export async function getStartupInfo(id: string) {
  return db.query.startups.findFirst({
    where: and(eq(startups.id, id)),
  });
}

export const getStartupAnnouncements = async (startup: SelectStartups) => {
  return db.query.posts.findMany({
    where: or(
      and(eq(posts.startup_id, startup.id), eq(posts.is_pinned, true)),
      and(eq(posts.user_id, startup.founderId), eq(posts.is_pinned, true)),
    ),
    with: {
      createdByUser: true,
      createdByStartup: true,
    },
  });
};

export async function getStartupImages(posts: SelectPosts[]) {
  if (!posts.length) return [];
  return db.query.postimages.findMany({
    where: inArray(
      postimages.postId,
      posts.map((p) => p.id),
    ),
    with: {
      file: true,
    },
  });
}

export async function getFileByFilename(filename: string) {
  return await db.query.files.findFirst({
    where: eq(files.fileName, filename),
  });
}

export async function generateDocumentUrl(filename: string) {
  return createPresignedUrlToDownload({
    fileName: filename,
    bucketName: "startpad",
  });
}

export async function getLatestConferences(startup_id: string) {
  return await db.query.conferences.findMany({
    where: (model, { eq }) => eq(model.startup_id, startup_id),
    orderBy: (model, { desc }) => [desc(model.startDate)],
  });
}

export const image_moderation_request = createAPIFormMethod<{
  task_id: string;
  created_at: string;
}>({
  url: `${env.MODERATION_API_URL}/image`,
  method: "POST",
});
