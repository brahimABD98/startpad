import "server-only";
import { db } from "./db";
import { isValidURL } from "@/lib/utils";
import { getServerAuthSession } from "./auth";
import { eq, and, or, inArray } from "drizzle-orm";
import { startups, posts, postimages } from "./db/schema";
import type { SelectPosts, SelectStartups } from "./db/schema";
import { createPresignedUrlToDownload } from "@/lib/minio";
export async function getUserStartups() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) throw Error("Unauthorized");
  const startups = db.query.startups.findMany({
    where: (model, { eq }) => eq(model.founderId, userId),
  });

  return startups;
}

export async function getUserData() {
  const session = await getServerAuthSession();

  const user = session?.user;
  if (!user) throw Error("Unauthorized");

  const userdata = db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, user?.id),
  });
  return userdata;
}

export async function getUserWithStartups() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) throw Error("Unauthorized");
  return db.query.users.findFirst({
    where: (model, { eq }) => eq(model.id, userId),
    with: {
      startups: true,
    },
  });
  5;
}
export async function getImageURL(image: string | null | undefined) {
  //add 4 sec latency
  await new Promise((res) => setTimeout(res, 10000));
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
      eq(posts.createdByStartup, startup.id),
      eq(posts.createdByUser, startup.founderId),
    ),
    with: {
      createdByUser: true,
      createdByStartup: true,
    },
    orderBy: (model, { desc }) => [desc(model.createdAt)],
  });
}

export async function getStartupInfo(id: string) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) throw Error("Unauthorized");
  return db.query.startups.findFirst({
    where: and(eq(startups.id, Number(id)), eq(startups.founderId, userId)),
  });
}

export const getStartupAnnouncements = async (startup: SelectStartups) => {
  return db.query.posts.findMany({
    where: or(
      and(eq(posts.createdByStartup, startup.id), eq(posts.is_pinned, true)),
      and(
        eq(posts.createdByUser, startup.founderId),
        eq(posts.is_pinned, true),
      ),
    ),
    with: {
      createdByUser: true,
      createdByStartup: true,
    },
  });
};

export async function getStartupImages(posts: SelectPosts[]) {
  // add 10 sec delay
  await new Promise((res) => setTimeout(res, 10000));
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
