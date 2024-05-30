import type { SelectStartups, StartupWithPosts } from "@/server/db/schema";
import React from "react";
import { getStartupImages, getStartupPosts } from "@/server/queries";
import { DisplayServerImages } from "@/app/_components/DisplayServerImages";
export async function StartupGallery({ startup }: { startup: SelectStartups }) {
  const posts = await getStartupPosts(startup);
  if (!posts) return null;
  const images = await getStartupImages(posts);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images?.map((image) => (
        <DisplayServerImages
          src={image.file?.fileName}
          key={image.file?.id}
          alt={image.file?.fileName ?? "image"}
        />
      ))}
    </div>
  );
}

