"use server";
import fs from "fs";
import { Readable } from "stream";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkfileExistsInBucket, saveFileInBucket } from "../lib/minio";
import type { File } from "buffer";
const fileSchema = z
  .object({
    size: z.number(),
    type: z.string(),
    name: z.string(),
    lastModified: z.number(),
  })
  .refine(
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
  console.log(formData.get("image"));
  const parse = schema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    image: formData.get("image"),
  });
  console.log("parse", parse);
  if (!parse.success) {
    return { message: "Invalid form data" };
  }

  const data = parse.data;

  if (session.user.id !== data.id) return { message: "Unauthorized" };
  try {
    const file = formData.get("image") as unknown as File;
    if (file) {
      const readableStream = new Readable({
        read() {
          const reader = file.stream().getReader();
          reader
            .read()
            .then(({ value, done }) => {
              if (done) {
                this.push(null);
              } else {
                this.push(new Buffer(value as string));
                reader.releaseLock();
              }
            })
            .catch((e) => console.error(e));
        },
      });
      
      await saveFileInBucket({
        fileName: file.name,
        bucketName: "startpad",
        file: readableStream,
      });
    }

    const newdata = await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        image: formData.get("image")?.toString(),
      })
      .where(eq(users.id, data.id));
    revalidatePath("/dashboard/settings/profile");
    redirect("/dashboard/settings/profile");
  } catch (error) {
    return { message: "Error updating profile" };
  }
}
