import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { aesDecrypt } from "./aes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return format(date, "MMM d, yyyy 'at' h:mm a");
};

export const truncateContent = (content: string, maxLength = 100) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};

export const getBaseUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export async function safeDecrypt(encryptedText: string) {
  try {
    return await aesDecrypt(encryptedText);
  } catch {
    return encryptedText;
  }
}
