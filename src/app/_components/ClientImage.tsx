"use client";
import { getImageURL } from "@/server/queries";
import type { ImageProps } from "next/image";
import Image from "next/image";
import React, { useEffect, useState } from "react";
interface Props
  extends Omit<ImageProps, "src" | "height" | "width" | "style" | "className"> {
  src: string | null | undefined;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}
export default function ClientImage({
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
  const [url, setUrl] = useState("");
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const res = await fetch(`/api/logo?filename=${src}`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        if (data) setUrl(data.url);
      } catch (error) {
        console.error("Image URL fetch error:", error);
      }
    };
    void fetchImageUrl();
  }, [src]);
  return (
    <Image
      src={url}
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
