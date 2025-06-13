import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { format, fromUnixTime } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatUnixDate = (date: number) => {
  return format(fromUnixTime(date), "MMM d, yyyy 'at' h:mm a");
};

export const truncateContent = (content: string, maxLength = 100) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + "...";
};
