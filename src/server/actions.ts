"use server";
import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveFileInBucket } from "../lib/minio";
import { AccessToken } from "livekit-server-sdk";
import { env } from "@/env";
import { File } from "buffer";
import {
  files,
  posts,
  startups,
  users,
  insertConferenceSchema,
  conferences,
} from "./db/schema";
import { CreateNewPostSchema } from "@/lib/formSchema";
const fileSchema = z.instanceof(File).refine(
  (file) => {
    return (
      file.type.startsWith("image/") &&
      file.size > 0 &&
      file.size < 4 * 1024 * 1024
    );
  },
  {
    message:
      "File must be an image type and its size must be greater than 0 and less than 4 MB",
  },
);

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

  const file_id = uuidv4();

  const new_file = {
    id: file_id,
    originalName: data.image?.name ?? "default.png",
    fileName: `${file_id}.${data.image?.type.split("/")[1]}` ?? "default.png",
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
    return { message: "Error updating profile" };
  }
  revalidatePath("/dashboard/settings/profile");
  redirect("/dashboard/settings/profile");
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
    return { message: "Error deleting profile" };
  }
  revalidatePath("/dashboard/settings/profile");
  redirect("/");
}
const uuidSchema = z.string().uuid();
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
      eq(startups.id, data.createdBy),
      eq(startups.founderId, session?.user.id),
    ),
  });
  if (!startup) return { message: "Unauthorized" };

  const new_conference = await db
    .insert(conferences)
    .values({
      startDate: data.startDate,
      name: data.name,
      description: data.description,
      createdBy: startup.id,
    })
    .returning({ id: conferences.id });
  redirect(`/conference/${new_conference[0]?.id}`);
}
export async function createPost(
  formData: z.infer<typeof CreateNewPostSchema>,
) {
  const data = CreateNewPostSchema.parse(formData);

  if (!data) throw new Error("Invalid form data");
  const { data: uuid } = uuidSchema.safeParse(data.author_id);
  if (uuid) {
    const new_post = await db
      .insert(posts)
      .values({
        title: data.title,
        createdByUser: uuid,
        content: data.postContent,
        is_pinned: data.markpinned,
      })
      .returning({ id: posts.id });
    revalidatePath("/dashboard/startup/[id]", "page");
    return { id: new_post[0]?.id };
  }
  const new_post = await db
    .insert(posts)
    .values({
      content: data.postContent,
      title: data.title,
      is_pinned: data.markpinned,
      createdByStartup: data.author_id,
    })
    .returning({ id: posts.id });
  revalidatePath("/dashboard/startup/[id]", "page");

  return { id: new_post[0]?.id };
}

export async function createStartup(formData: FormData) {
  console.log(formData.entries());
  const schema = z.object({
    name: z.string(),
    description: z.string(),
    foundedAt: z
      .string()
      .refine((date) => new Date(date).toISOString() !== "Invalid Date")
      .default(() => new Date().toISOString()),
    logo: fileSchema.optional(),
  });
  const session = await getServerAuthSession();
  if (!session) return { message: "Unauthorized" };
  const parse = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    foundedAt: formData.get("foundedAt"),
    logo: formData.get("logo"),
  });
  if (!parse.success) {
    console.error("error parsing:", parse.error.errors);
    return { message: "Invalid form data" };
  }
  const data = parse.data;
  const { name, description, foundedAt, logo } = data;
  const new_startup = await db
    .insert(startups)
    .values({
      name: name,
      description: description,
      foundedAt: new Date(foundedAt),
      logo: logo?.name ?? "default.png",
      founderId: session.user.id,
    })
    .returning({ id: startups.id })
    .catch((e) => {
      console.error(e);
      return [];
    });
  revalidatePath(`/dashboard/startups`);
  redirect(`/dashboard/startup/${new_startup[0]?.id}`);
}

export async function generateParticiaptionToken(roomid: string) {
  const session = await getServerAuthSession();
  if (!session) return { message: "Unauthorized" };
  const room = await db.query.conferences.findFirst({
    where: eq(conferences.id, roomid),
  });
  if (!room) return { message: "Room not found" };
  const token = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: session.user.id,
    ttl: "20m",
  });
  token.addGrant({ roomJoin: true, room: roomid });
  return await token.toJwt();
}
