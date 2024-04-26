import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
