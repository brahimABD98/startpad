"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { revalidatePath } from "next/cache";

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
    });
  
    const session = await getServerAuthSession();
    if (!session) 
        return{message:"Unauthorized"};
  
    const parse = schema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        email: formData.get("email"),
        phoneNumber: formData.get("phoneNumber"),
    });
    if (!parse.success) 
        return{message:"Invalid form data"};
    
    const data = parse.data;
    console.log("daata",data);  
    if (session.user.id !== data.id) 
        return{message:"Unauthorized"};
  
    try {
      const newdata = await db
        .update(users)
        .set({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        })
        .where(eq(users.id, data.id));
        revalidatePath("/dashboard/settings/profile")
      return { message: "Profile updated successfully" };
    } catch (error) {
      return { message: "Error updating profile" };
    }
  }
  