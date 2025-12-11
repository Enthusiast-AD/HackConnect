import { format, formatDistanceToNow, isToday, isYesterday, isSameYear } from "date-fns";

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(d)) {
    return `Today at ${format(d, "h:mm a")}`;
  }
  
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, "h:mm a")}`;
  }
  
  if (isSameYear(d, new Date())) {
    return format(d, "MMM d 'at' h:mm a");
  }
  
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "h:mm a");
}

export function formatEventDate(startDate: Date | string, endDate?: Date | string): string {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  
  if (!endDate) {
    return format(start, "MMMM d, yyyy");
  }
  
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  
  if (format(start, "MMMM yyyy") === format(end, "MMMM yyyy")) {
    return `${format(start, "MMMM d")} - ${format(end, "d, yyyy")}`;
  }
  
  if (format(start, "yyyy") === format(end, "yyyy")) {
    return `${format(start, "MMMM d")} - ${format(end, "MMMM d, yyyy")}`;
  }
  
  return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
}

export function getDaysUntil(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
