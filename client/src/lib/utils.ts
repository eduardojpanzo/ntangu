import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatToFullDate = (date: string | Date): string => {
  const parsedDate = typeof date === "string" ? parseISO(date) : date;

  try {
    return format(parsedDate, "d 'de' MMMM 'de' yyyy", { locale: pt });
  } catch {
    return "-";
  }
};

export const formatDateRange = (data?: { date: string }[]): string => {
  if (!data || data.length === 0) return "-";

  // Ordenar as datas para garantir que estão em ordem
  const sortedDates = data
    .map((item) => parseISO(item.date))
    .sort((a, b) => a.getTime() - b.getTime());

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];

  const formattedStart = format(startDate, "d MMMM", { locale: pt });
  const formattedEnd = format(endDate, "d MMMM yyyy", { locale: pt });

  return `${formattedStart} - ${formattedEnd}`;
};
