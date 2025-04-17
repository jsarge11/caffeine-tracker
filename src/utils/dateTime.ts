// Date and time utility functions for the Caffeine Tracker app
import { CaffeineData } from "../types/data.types";

// Format a date as YYYY-MM-DD
export const formatDate = (date: Date | number | string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

// Format time as HH:MM AM/PM
export const formatTime = (date: Date | number | string): string => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  return `${hours}:${minutes} ${ampm}`;
};

// Format sleep duration in hours and minutes
export const formatDuration = (
  startTime: Date | number | string,
  endTime: Date | number | string
): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Duration in milliseconds
  const durationMs = end.getTime() - start.getTime();

  // Convert to hours and minutes
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
};

// Check if a date is today
export const isToday = (date: Date | number | string): boolean => {
  const today = new Date();
  const d = new Date(date);

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

// Get start of today
export const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of today
export const getEndOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Create date with specific time
export const createDateWithTime = (hours: number, minutes: number): Date => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

// Add hours to a date
export const addHours = (date: Date | number | string, hours: number): Date => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

// Format time as 12-hour (1-12)
export const get12Hour = (hour: number): number => {
  return hour % 12 || 12;
};

// Format date as "Monday, April 11"
export const formatDateFull = (date: Date | number | string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
};
