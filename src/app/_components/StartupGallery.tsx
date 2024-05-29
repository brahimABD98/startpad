import type { SelectStartups } from "@/server/db/schema";
import React from "react";
import Image from "next/image";
import { getStartupImages } from "@/server/queries";
export async function StartupGallery({ startup }: { startup: SelectStartups }) {
  const images = await Promise.allSettled(await getStartupImages(startup));
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <>
          {image.status === "fulfilled" && (
            <Image
              alt={image.value.file?.originalName ?? "image"}
              className="rounded-lg object-cover"
              height={300}
              src={image.value.url ?? "/placeholder.svg"}
              style={{
                aspectRatio: "400/300",
                objectFit: "cover",
              }}
              width={400}
            />
          )}
        </>
      ))}
    </div>
  );
}
