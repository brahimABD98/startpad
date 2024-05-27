"use client";
import {
  Avatar as Av,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import React from "react";
import type { SelectUser } from "@/server/db/schema";
import Avatar from "boring-avatars";
export default function UserAvatar({
  user,
  image_url,
  height,
  width,
}: {
  user: SelectUser;
  image_url: string;
  height?: number;
  width?: number;
}) {
  return (
    <>
      <Av>
        <AvatarImage
          src={image_url}
          alt={`${user.name}'s avatar`}
          width={width ?? 40}
          height={height ?? 40}
        />
        <AvatarFallback>
          <AvatarFallback>
            {user.name && (
              <Avatar
                name={user.name}
                size="80"
                variant="marble"
                colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
              />
            )}
          </AvatarFallback>
        </AvatarFallback>
      </Av>
    </>
  );
}
