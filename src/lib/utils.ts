import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createPresignedUrlToDownload } from "./minio";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidURL(urlString: string) {
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}

// export async function getProfileImageURL(image: string) {
//   return isValidURL(image)
//     ? image
//     : await createPresignedUrlToDownload({
//         bucketName: "startpad",
//         fileName: image,
//       });
// }
