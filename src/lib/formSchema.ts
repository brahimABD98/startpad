import { z } from "zod";
export const CreateNewPostSchema = z.object({
  markpinned: z.boolean().optional().default(false),
  postContent: z.string().refine(
    (content) => {
      const regex = /(<([^>]+)>)/gi;
      const clean_content = content.replace(regex, "");
      return !!clean_content.trim().length;
    },
    { message: "Post content cannot be empty" },
  ),
});
