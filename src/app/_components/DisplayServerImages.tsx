import { getImageURL } from "@/server/queries";
import type { ImageProps } from "next/image";
import Image from "next/image";
import React from "react";
interface Props
  extends Omit<ImageProps, "src" | "height" | "width" | "style" | "className"> {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}
export async function DisplayServerImages({
  src = "placeholder.svg",
  alt = "image",
  width = 400,
  height = 300,
  style = {
    aspectRatio: `${width}/${height}`,
    objectFit: "cover",
  },
  className = "rounded-lg object-cover",
  ...props
}: Props) {
  const image_url = await getImageURL(src);
  return (
    <Image
      src={image_url ?? "placeholer.jpg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        aspectRatio: `${width}/${height}`,
        objectFit: "cover",
        ...style,
      }}
      {...props}
    />
  );
}
