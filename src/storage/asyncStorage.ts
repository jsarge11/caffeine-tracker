import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CaffeineData,
  CaffeineEntryWithDate,
  DailyData,
  DateData,
  EntryType,
  NapEntryWithDate,
  SleepEntryWithDate,
  TimeData,
} from "../types/data.types";

// Keys for AsyncStorage
const STORAGE_KEYS = {
  CAFFEINE_DATA: "caffeine_tracker_caffeine_data",
  SLEEP_DATA: "caffeine_tracker_sleep_data",
  NAP_DATA: "caffeine_tracker_nap_data",
};

// Save caffeine data
export const saveCaffeineData = async (
  caffeineData: Omit<CaffeineData, "id">
): Promise<CaffeineEntryWithDate> => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(caffeineData.timestamp);
    // Use local date formatting instead of UTC to avoid timezone issues
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const formattedData: CaffeineEntryWithDate = {
      ...caffeineData,
      id: Date.now().toString(),
      date: formattedDate,
    };

    // Get existing data
    const existingDataJson = await AsyncStorage.getItem(
      STORAGE_KEYS.CAFFEINE_DATA
    );
    const existingData: CaffeineEntryWithDate[] = existingDataJson
      ? JSON.parse(existingDataJson)
      : [];

    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(
      STORAGE_KEYS.CAFFEINE_DATA,
      JSON.stringify(updatedData)
    );

    return formattedData;
  } catch (error) {
    console.error("Error saving caffeine data:", error);
    throw error;
  }
};

// Save sleep data - now specifically for sleep only (not naps)
export const saveSleepData = async (
  sleepData: Omit<TimeData, "id">
): Promise<SleepEntryWithDate> => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(sleepData.startTime);
    // Use local date formatting instead of UTC to avoid timezone issues
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const formattedData: SleepEntryWithDate = {
      ...sleepData,
      id: Date.now().toString(),
      date: formattedDate,
    };

    // Always use the sleep storage key
    const storageKey = STORAGE_KEYS.SLEEP_DATA;
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    const existingData: SleepEntryWithDate[] = existingDataJson
      ? JSON.parse(existingDataJson)
      : [];

    // Add debugging
    console.log(`Saving sleep data with id: ${formattedData.id}`);

    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));

    return formattedData;
  } catch (error) {
    console.error("Error saving sleep data:", error);
    throw error;
  }
};

// Save nap data - now completely separate from sleep data
export const saveNapData = async (
  napData: Omit<TimeData, "id">
): Promise<NapEntryWithDate> => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(napData.startTime);
    // Use local date formatting instead of UTC to avoid timezone issues
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    const formattedData: NapEntryWithDate = {
      ...napData,
      id: Date.now().toString(),
      date: formattedDate,
    };

    // Always use the nap storage key
    const storageKey = STORAGE_KEYS.NAP_DATA;
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    const existingData: NapEntryWithDate[] = existingDataJson
      ? JSON.parse(existingDataJson)
      : [];

    // Add debugging
    console.log(`Saving nap data with id: ${formattedData.id}`);

    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));

    return formattedData;
  } catch (error) {
    console.error("Error saving nap data:", error);
    throw error;
  }
};

// Get all caffeine data
export const getAllCaffeineData = async (): Promise<
  CaffeineEntryWithDate[]
> => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error("Error getting caffeine data:", error);
    return [];
  }
};

// Get all sleep data
export const getAllSleepData = async (): Promise<SleepEntryWithDate[]> => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error("Error getting sleep data:", error);
    return [];
  }
};

// Get all nap data - now completely separate from sleep data
export const getAllNapData = async (): Promise<NapEntryWithDate[]> => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.NAP_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error("Error getting nap data:", error);
    return [];
  }
};

// Get data for a specific date
export const getDataForDate = async (
  date: Date | string
): Promise<DailyData> => {
  try {
    // Convert date to YYYY-MM-DD format
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const dateString = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

    // Get all data
    const caffeineData = await getAllCaffeineData();
    const sleepData = await getAllSleepData();
    const napData = await getAllNapData();

    // Filter data for the specified date
    return {
      caffeine: caffeineData.filter((item) => item.date === dateString),
      sleep: sleepData.filter((item) => item.date === dateString),
      naps: napData.filter((item) => item.date === dateString),
    };
  } catch (error) {
    console.error("Error getting data for date:", error);
    return { caffeine: [], sleep: [], naps: [] };
  }
};

// Delete a caffeine entry
export const deleteCaffeineEntry = async (id: string): Promise<boolean> => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    if (!dataJson) return false;

    const data: CaffeineEntryWithDate[] = JSON.parse(dataJson);
    const updatedData = data.filter((item) => item.id !== id);

    await AsyncStorage.setItem(
      STORAGE_KEYS.CAFFEINE_DATA,
      JSON.stringify(updatedData)
    );
    return true;
  } catch (error) {
    console.error("Error deleting caffeine entry:", error);
    return false;
  }
};

// Delete a sleep entry
export const deleteSleepEntry = async (
  id: string,
  isNap = false
): Promise<boolean> => {
  const storageKey = isNap ? STORAGE_KEYS.NAP_DATA : STORAGE_KEYS.SLEEP_DATA;

  try {
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) return false;

    const data: (SleepEntryWithDate | NapEntryWithDate)[] =
      JSON.parse(dataJson);
    const updatedData = data.filter((item) => item.id !== id);

    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error("Error deleting sleep/nap entry:", error);
    return false;
  }
};

// Clear all data - for testing or reset
export const clearAllData = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CAFFEINE_DATA,
      STORAGE_KEYS.SLEEP_DATA,
      STORAGE_KEYS.NAP_DATA,
    ]);
    return true;
  } catch (error) {
    console.error("Error clearing all data:", error);
    return false;
  }
};

// Update existing entry
export const updateEntry = async <T extends object>(
  type: EntryType,
  id: string,
  updatedData: Partial<T>
): Promise<T & DateData> => {
  let storageKey: string;
  switch (type) {
    case "caffeine":
      storageKey = STORAGE_KEYS.CAFFEINE_DATA;
      break;
    case "sleep":
      storageKey = STORAGE_KEYS.SLEEP_DATA;
      break;
    case "nap":
      storageKey = STORAGE_KEYS.NAP_DATA;
      break;
    default:
      throw new Error("Invalid entry type");
  }

  try {
    // Get existing data
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) throw new Error("No data found");

    const data: (T & DateData)[] = JSON.parse(dataJson);

    // Find the entry by id
    const entryIndex = data.findIndex((item) => item.id === id);
    if (entryIndex === -1) throw new Error("Entry not found");

    // Update the entry
    data[entryIndex] = {
      ...data[entryIndex],
      ...updatedData,
    };

    // Save updated data
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));

    return data[entryIndex];
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error;
  }
};

// Get entry by ID
export const getEntryById = async <T extends { id: string }>(
  type: EntryType,
  id: string
): Promise<T> => {
  let storageKey: string;
  switch (type) {
    case "caffeine":
      storageKey = STORAGE_KEYS.CAFFEINE_DATA;
      break;
    case "sleep":
      storageKey = STORAGE_KEYS.SLEEP_DATA;
      break;
    case "nap":
      storageKey = STORAGE_KEYS.NAP_DATA;
      break;
    default:
      throw new Error("Invalid entry type");
  }

  try {
    // Get data
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) throw new Error("No data found");

    const data: T[] = JSON.parse(dataJson);

    // Find the entry by id
    const entry = data.find((item) => item.id === id);
    if (!entry) throw new Error("Entry not found");

    return entry;
  } catch (error) {
    console.error("Error getting entry by ID:", error);
    throw error;
  }
};

// Update existing caffeine entry
export const updateCaffeineEntry = async (
  id: string,
  updatedData: Partial<CaffeineData>
): Promise<CaffeineEntryWithDate> => {
  return updateEntry<CaffeineData>("caffeine", id, updatedData);
};

// Update existing sleep entry
export const updateSleepEntry = async (
  id: string,
  updatedData: Partial<TimeData>,
  isNap = false
): Promise<SleepEntryWithDate | NapEntryWithDate> => {
  return updateEntry(isNap ? "nap" : "sleep", id, updatedData);
};
