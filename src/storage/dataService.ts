// Process data utilities for the Caffeine Tracker app
import {
  BubbleChartData,
  CaffeineEntryWithDate,
  DailyData,
  NapEntryWithDate,
  SleepEntryWithDate,
} from "../types/data.types";
import { getSleepDuration } from "../utils/fns";

// Maximum values for scaling in dashboard
export const MAX_VALUES: { [key: string]: number } = {
  CAFFEINE: 300, // In mg
  SLEEP: 10, // In hours
  NAPS: 3, // Count
  SLEEP_QUALITY: 10, // Rating 1-10
};

// Import the correct functions from asyncStorage.js
import {
  getAllCaffeineData,
  getAllSleepData,
  getAllNapData,
  deleteCaffeineEntry,
  deleteSleepEntry,
} from "./asyncStorage";

// Process data for dashboard
export const processDataForDashboard = async (): Promise<DailyData> => {
  try {
    // Fetch caffeine, sleep and nap data using the correct function names
    const caffeine: CaffeineEntryWithDate[] =
      (await getAllCaffeineData()) || [];
    const sleep: SleepEntryWithDate[] = (await getAllSleepData()) || [];
    const naps: NapEntryWithDate[] = (await getAllNapData()) || []; // Get nap data from NAP_DATA storage key

    return {
      caffeine,
      sleep,
      naps,
    };
  } catch (error) {
    console.error("Error processing dashboard data:", error);
    return {
      caffeine: [],
      sleep: [],
      naps: [],
    };
  }
};

// Delete entries
export const deleteCaffeineEntryById = async (id: string): Promise<boolean> => {
  return await deleteCaffeineEntry(id);
};

export const deleteSleepEntryById = async (
  id: string,
  isNap: boolean = false
): Promise<boolean> => {
  return await deleteSleepEntry(id, isNap);
};

export const normalizeDataForDashboard = (
  data: DailyData
): BubbleChartData[] => {
  const { caffeine, sleep, naps } = data;

  const days: {
    [key: string]: { caffeine: number; sleep: number; naps: number };
  } = {};

  caffeine.forEach((c) => {
    const { date } = c;
    if (!days[date]) {
      days[date] = { caffeine: 0, sleep: 0, naps: 0 };
    }
    days[date].caffeine += c.amount;
  });

  sleep.forEach((s) => {
    const { date } = s;
    if (!days[date]) {
      days[date] = { caffeine: 0, sleep: 0, naps: 0 };
    }
    days[date].sleep += getSleepDuration(s);
  });

  naps.forEach((n) => {
    const { date } = n;
    if (!days[date]) {
      days[date] = { caffeine: 0, sleep: 0, naps: 0 };
    }
    days[date].naps += getSleepDuration(n);
  });

  const bubbleChartData: BubbleChartData[] = Object.entries(days).map(
    ([date, { caffeine, sleep, naps }]) => ({
      date,
      caffeine,
      hoursSlept: sleep / (1000 * 60 * 60), // Convert milliseconds to hours
      naps: naps / (1000 * 60 * 60), // Convert milliseconds to hours
    })
  );

  console.log(bubbleChartData);
  return bubbleChartData;
};

export const normalizeData = (data: BubbleChartData[]) => {
  console.log("Raw data received in normalizeData:", data);

  // Ensure we have valid data before processing
  if (!data || data.length === 0) {
    console.log("No data to normalize");
    return { dates: [], hoursSlept: [], naps: [], caffeine: [] };
  }

  // Parse date strings to Date objects
  const dates = data.map((d) => {
    console.log(`Converting date string: ${d.date}`);
    // Fix timezone issue by parsing the date and setting it to noon local time
    // This ensures the date is displayed correctly regardless of timezone
    const dateParts = d.date.split("-");
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
      const day = parseInt(dateParts[2]);
      return new Date(year, month, day, 12, 0, 0);
    }
    return new Date(d.date);
  });

  const hoursSlept = data.map((d) => d.hoursSlept || 0);
  const naps = data.map((d) => d.naps || 0);
  const caffeine = data.map((d) => d.caffeine || 0);

  console.log("Normalized data:", {
    dates: dates.map((d) => d.toISOString()),
    hoursSlept,
    naps,
    caffeine,
  });

  return { dates, hoursSlept, naps, caffeine };
};
