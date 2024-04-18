"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { File } from "buffer";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addScheme = z.object({
  name: z.string().min(1),
  file: fileSchema.refine(
    (file) => file.size > 0,
    "File size was 0, please upload a proper file!"
  ),
  image: imageSchema.refine(
    (file) => file.size > 0,
    "File size was 0, please upload a proper file!"
  ),
}); 
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
      image:addScheme.optional()
    });
    const session = await getServerAuthSession();
    if (!session) 
        return{message:"Unauthorized"};
  
    const parse = schema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
        image:formData.get("image")
    });
    console.log("parse",parse)
    if (!parse.success) {
        parse.error.errors.map((error) => console.log(error));
        return{message:"Invalid form data"};
    }

    console.log("no parse",parse)
    const data = parse.data;
    
    console.log("data",data)

    if (session.user.id !== data.id) 
        return{message:"Unauthorized"};
  
    try {
      const newdata = await db
        .update(users)
        .set({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          image:data.image?.name
        })
        .where(eq(users.id, data.id));
        revalidatePath("/dashboard/settings/profile");
        redirect("/dashboard/settings/profile");
      return { message: "Profile updated successfully" };
    } catch (error) {
      return { message: "Error updating profile" };
    }
  }
  