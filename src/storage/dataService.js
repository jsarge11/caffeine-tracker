// Process data utilities for the Caffeine Tracker app
import { formatTime, formatDuration } from '../utils/dateTime';

// Maximum values for scaling in dashboard
export const MAX_VALUES = {
  CAFFEINE: 300, // In mg
  SLEEP: 10,     // In hours
  NAPS: 3,       // Count
  SLEEP_QUALITY: 10 // Rating 1-10
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
export const processDataForDashboard = async (daysToShow) => {
  try {
    // Fetch caffeine, sleep and nap data using the correct function names
    const caffeineData = (await getAllCaffeineData()) || [];
    const sleepData = (await getAllSleepData()) || [];
    const napData = (await getAllNapData()) || []; // Get nap data from NAP_DATA storage key

    console.log("Total sleep entries found:", sleepData.length);
    console.log("Total nap entries found:", napData.length);

    // Get dates for the past N days
    const daysArray = [];
    const today = new Date();

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        date.getDay()
      ];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateString = `${month}/${day}`;

      daysArray.push({
        day: dayOfWeek,
        date: dateString,
        caffeine: 0,
        sleepHours: 0,
        naps: 0,
        sleepQuality: 0,
      });
    }

    // Process caffeine data
    caffeineData.forEach((entry) => {
      const entryDate = new Date(entry.timestamp);
      const month = entryDate.getMonth() + 1;
      const day = entryDate.getDate();
      const dateString = `${month}/${day}`;

      const dayData = daysArray.find((d) => d.date === dateString);
      if (dayData) {
        dayData.caffeine += entry.amount;
      }
    });

    // Process sleep data - now only for actual sleep (not naps)
    sleepData.forEach((entry) => {
      const entryDate = new Date(entry.startTime);
      const month = entryDate.getMonth() + 1;
      const day = entryDate.getDate();
      const dateString = `${month}/${day}`;

      const dayData = daysArray.find((d) => d.date === dateString);
      if (dayData) {
        // Calculate sleep hours from start and end time
        const hoursSlept =
          entry.endTime && entry.startTime
            ? (entry.endTime - entry.startTime) / (1000 * 60 * 60)
            : 0;

        dayData.sleepHours = hoursSlept;
        // Ensure sleep quality is a number between 1-10 and always set
        dayData.sleepQuality = Number(entry.rating) || 0;

        // Log to help debug
        console.log(
          `Processing sleep data for ${dateString}: Quality = ${dayData.sleepQuality}, Hours = ${hoursSlept.toFixed(1)}`
        );
      }
    });

    // Process nap data - now using completely separate nap data
    napData.forEach((entry) => {
      const entryDate = new Date(entry.startTime);
      const month = entryDate.getMonth() + 1;
      const day = entryDate.getDate();
      const dateString = `${month}/${day}`;

      const dayData = daysArray.find((d) => d.date === dateString);
      if (dayData) {
        // Increment nap count and log for debugging
        dayData.naps += 1;
        console.log(`Added nap for ${dateString}, count now: ${dayData.naps}`);
      }
    });

    return daysArray;
  } catch (error) {
    console.error("Error processing dashboard data:", error);
    return [];
  }
};

// Delete entries
export const deleteCaffeineEntryById = async (id) => {
  return await deleteCaffeineEntry(id);
};

export const deleteSleepEntryById = async (id, isNap) => {
  return await deleteSleepEntry(id, isNap);
};
