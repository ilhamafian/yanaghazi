import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

export function isString(value: any): value is string {
  return typeof value === "string" || value instanceof String;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
