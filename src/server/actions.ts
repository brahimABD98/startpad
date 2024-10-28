"use server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveFileInBucket } from "../lib/minio";
import { AccessToken } from "livekit-server-sdk";
import { env } from "@/env";
import {
  files,
  posts,
  startups,
  users,
  job_applications,
  insertConferenceSchema,
  conferences,
  fileSchema,
  insertStartupSchema,
  insertPostSchema,
  postimages,
  insertJobListingSchema,
  job_listings,
  insertJobApplicationSchema,
} from "./db/schema";
import {
  getUserStartups,
  image_moderation_request,
  getFileByFilename,
  isFounder,
} from "./queries";
import { nanoid } from "nanoid";

export async function updateProfile(
  prevState: {
    message: string;
  },
  formData: FormData,
) {
  const schema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(),
    image: fileSchema.optional(),
  });
  const session = await getServerAuthSession();
  if (!session) return { message: "Unauthorized" };
  const parse = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    image: formData.get("image"),
  });
  if (!parse.success) {
    return { message: "Invalid form data" };
  }

  const data = parse.data;

  const file_id = nanoid();

  const new_file = {
    id: file_id,
    originalName: data.image?.name ?? "default.png",
    fileName: `${file_id}.${data.image?.type.split("/")[1]}`,
    size: data.image?.size ?? 0,
    bucket: "startpad",
  };

  if (session.user.id !== data.id) return { message: "Unauthorized" };
  try {
    if (data.image) {
      const file = Buffer.from(await data.image.arrayBuffer());
      await saveFileInBucket({
        bucketName: new_file.bucket,
        file: file,
        fileName: new_file.fileName,
      });
    }
    await db
      .insert(files)
      .values({
        originalName: new_file.originalName,
        bucket: new_file.bucket,
        fileName: new_file.fileName,
        size: new_file.size,
      })
      .catch((e) => {
        console.log(e);
      });
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        image: new_file.fileName,
      })
      .where(eq(users.id, data.id))
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log("update profile error", error);
    throw new Error("Error updating profile");
  }
  revalidatePath("/dashboard/settings");
  redirect("/dashboard/settings/");
}

export async function deleteProfile() {
  const session = await getServerAuthSession();
  if (!session) return { message: "Unauthorized" };
  try {
    await db
      .delete(users)
      .where(eq(users.id, session.user.id))
      .catch((e) => {
        console.log(e);
      });
  } catch (error) {
    console.log("delete profile error", error);
    throw new Error("Error deleting profile");
  }
  revalidatePath("/dashboard/settings");
  redirect("/");
}

export async function createJobListing(
  formData: z.infer<typeof insertJobListingSchema>,
) {
  const {
    title,
    description,
    location,
    startup_id,
    type,
    responsabilities,
    requirements,
    payrange,
  } = insertJobListingSchema.parse(formData);
  const is_founder = await isFounder(startup_id);
  if (!is_founder) return { message: "Unauthorized" };
  await db.insert(job_listings).values({
    title,
    payrange,
    responsabilities,
    requirements,
    description,
    location,
    startup_id,
    type,
  });
  revalidatePath(`/startup/${startup_id}`);
}

export async function updateJobListing(
  id: string,
  formData: z.infer<typeof insertJobListingSchema>,
) {
  const data = insertJobListingSchema.parse(formData);
  data.updated_at = new Date();

  if (!data) throw new Error("Invalid data");
  await db.update(job_listings).set(data).where(eq(job_listings.id, id));
  revalidatePath(`/startup/${data.startup_id}`);
}

export async function deleteJobListing(data: FormData) {
  const startup_id = data.get("startup_id")?.toString() ?? "";
  const job_id = data.get("job_id")?.toString() ?? "";

  const is_founder = await isFounder(startup_id);
  if (!is_founder) throw new Error("Unauthorized");
  await db
    .delete(job_listings)
    .where(
      and(eq(job_listings.id, job_id), eq(job_listings.startup_id, startup_id)),
    )
    .catch((e) => {
      console.log(e);
    });

  revalidatePath(`/`);
}

export async function createConfernence(
  formData: z.infer<typeof insertConferenceSchema>,
) {
  const data = insertConferenceSchema.parse(formData);
  if (!data) throw new Error("Invalid data");

  const session = await getServerAuthSession();
  if (!session) return { message: "Unauthorized" };

  // check if data.createdby is in users.startups
  const startup = await db.query.startups.findFirst({
    where: and(
      eq(startups.id, data.startup_id),
      eq(startups.founderId, session?.user.id),
    ),
  });
  if (!startup) return { message: "Unauthorized" };

  const [new_conference] = await db
    .insert(conferences)
    .values({
      startDate: data.startDate,
      name: data.name,
      description: data.description,
      startup_id: startup.id,
    })
    .returning({ id: conferences.id });
  redirect(`/conference/${new_conference?.id}`);
}
export async function addJobApplication(formData: FormData) {
  console.log("Starting job application process");

  const session = await getServerAuthSession();
  const user = session?.user;
  if (!user) {
    console.error("No user session found");
    return null;
  }

  try {
    const data = insertJobApplicationSchema.parse({
      job_id: formData.get("job_id"),
      user_id: user.id,
      resume: formData.get("resume"),
      cover_letter: formData.get("cover_letter"),
    });

    const job = await db.query.job_listings.findFirst({
      where: eq(job_listings.id, data.job_id),
    });
    if (!job) {
      console.error("Job not found");
      return null;
    }

    const [resume, cover_letter] = await Promise.all([
      data.resume ? handleFileUpload(data.resume) : null,
      data.cover_letter ? handleFileUpload(data.cover_letter) : null,
    ]);

    await db.insert(job_applications).values({
      job_id: job.id,
      user_id: user.id,
      resume: resume?.id,
      cover_letter: cover_letter?.id,
    });

    console.log("Job application submitted successfully");
  } catch (error) {
    console.error("Error processing job application:", error);
    return null;
  }
}
async function handleFileUpload(file: File) {
  const uploadedFilename = await fileUpload(
    file,
    fileUploadType.document,
    false,
  );
  return getFileByFilename(uploadedFilename);
}
export async function createPost(formData: FormData) {
  const startups = await getUserStartups();
  const parse = insertPostSchema.safeParse({
    title: formData.get("title"),
    media: (formData.get("media") as File)
      ? (formData.get("media") as File)
      : undefined,
    is_pinned: formData.get("is_pinned"),
    content: formData.get("content"),
    startup_id: formData.get("startup_id"),
  });
  if (!parse.success) {
    console.error("error parsing:", parse.error.errors);
    return { message: "Invalid form data", error: parse.error.errors };
  }
  const { data } = parse;
  if (!startups?.some((startup) => startup.id === data?.startup_id)) {
    return "unallowed";
  }

  const new_post = await db
    .insert(posts)
    .values({
      content: data.content,
      title: data.title,
      is_pinned: data.is_pinned,
      startup_id: data.startup_id,
    })
    .returning({ id: posts.id });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const filename = await fileUpload(data.media);
  const new_file = await db.query.files.findFirst({
    where: eq(files.fileName, filename),
  });

  if (new_file && new_post[0]) {
    await db.insert(postimages).values({
      fileId: new_file.id,
      postId: new_post[0]?.id,
    });
  }
  revalidatePath("/dashboard/startup/[id]", "page");

  return { id: new_post[0]?.id };
}

export async function createStartup(formData: FormData) {
  const session = await getServerAuthSession();

  if (!session) return { message: "Unauthorized" };

  console.log("session", formData);

  const parse = insertStartupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    foundedAt: formData.get("foundedAt"),
    logo: formData.get("logo"),
    founderId: session.user.id,
  });

  if (!parse.success) {
    console.error("error parsing:", parse.error.errors);
    return { message: "Invalid form data" };
  }

  const { name, description, foundedAt, logo } = parse.data;
  const file = await fileUpload(logo);
  const new_startup = await db
    .insert(startups)
    .values({
      name,
      description,
      foundedAt: new Date(foundedAt),
      logo: file,
      founderId: session.user.id,
    })
    .returning({ id: startups.id })
    .catch((e) => {
      console.error(e);
      return [];
    });
  revalidatePath(`/dashboard/`);
  redirect(`/startup/${new_startup[0]?.id}`);
}

export async function generateParticiaptionToken(roomid: string) {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");
  const room = await db.query.conferences.findFirst({
    where: eq(conferences.id, roomid),
  });
  if (!room) throw new Error("Room not found");
  const token = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: session.user.id,
    ttl: "20m",
  });
  token.addGrant({ roomJoin: true, room: roomid });
  return await token.toJwt();
}

enum fileUploadType {
  image,
  video,
  document,
}

export async function fileUpload(
  data: globalThis.File | undefined,
  type: fileUploadType = fileUploadType.image,
  with_moderation = true,
) {
  if (!data) throw new Error("No file provided");
  let moderation = null;
  if (with_moderation) {
    const moderation_form_data = new FormData();
    switch (type) {
      case fileUploadType.image:
        moderation_form_data.append("image", data as Blob);
        moderation = await image_moderation_request(moderation_form_data);
        break;
      case fileUploadType.video:
        moderation_form_data.append("video", data as Blob);
        moderation = await image_moderation_request(moderation_form_data);
        break;
      case fileUploadType.document:
        moderation_form_data.append("document", data as Blob);
        break;
    }
  }
  const id = nanoid();
  const filename = `${id}.${data.type.split("/")[1]}`;

  const file = Buffer.from(await data.arrayBuffer());

  await saveFileInBucket({
    bucketName: "startpad",
    fileName: filename,
    file,
  });

  await db.insert(files).values({
    originalName: data.name,
    fileName: filename,
    size: data.size,
    bucket: "startpad",
    moderation_id: moderation?.task_id ?? "",
  });
  return filename;
}
