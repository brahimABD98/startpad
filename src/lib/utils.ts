import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
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

export function generateConferenceId() {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 12);
  const new_id = nanoid();
  return new_id.match(/.{1,4}/g)?.join("-") ?? new_id;
}
export const getDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};
export const getTime = (date: string) => {
  return new Date(date).toLocaleTimeString();
};
