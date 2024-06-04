import {
  Avatar as Av,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getImageURL } from "@/server/queries";
import React from "react";
import Avatar from "boring-avatars";
export default async function DisplayAvatar({
  src,
  alt,
  height,
  width,
}: {
  src: string | null | undefined;
  alt: string | null | undefined;
  height?: number;
  width?: number;
}) {
  const image = await getImageURL(src);
  return (
    <>
      <Av>
        <AvatarImage
          src={image}
          width={width ?? 40}
          alt={alt ?? "avatar"}
          height={height ?? 40}
        />
        <AvatarFallback>
          <AvatarFallback>
            <Avatar
              name={alt ?? "user avatar"}
              size="80"
              variant="marble"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
          </AvatarFallback>
        </AvatarFallback>
      </Av>
    </>
  );
}
