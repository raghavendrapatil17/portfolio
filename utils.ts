import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Compute a compact duration string (e.g. "1y 2m" or "5m") between two textual dates
// Dates are expected in formats like "Aug 2024" or the end string can be 'Present'.
export function formatExperienceDuration(startText: string, endText: string): string {
  const start = new Date(startText + ' 1');
  const end = endText === 'Present' ? new Date() : new Date(endText + ' 1');
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (months < 0) months = 0;
  const yrs = Math.floor(months / 12);
  const rem = months % 12;
  return yrs > 0 ? `${yrs}y${rem ? ' ' + rem + 'm' : ''}` : `${months}m`;
}

