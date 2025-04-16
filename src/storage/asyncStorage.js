import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const STORAGE_KEYS = {
  CAFFEINE_DATA: 'caffeine_tracker_caffeine_data',
  SLEEP_DATA: 'caffeine_tracker_sleep_data',
  NAP_DATA: 'caffeine_tracker_nap_data',
};

// Data structure for caffeine entry
// {
//   id: string (timestamp),
//   amount: number (in mg),
//   timestamp: number (date.getTime()),
//   date: string (YYYY-MM-DD)
// }

// Data structure for sleep/nap entry
// {
//   id: string (timestamp),
//   startTime: number (date.getTime()),
//   endTime: number (date.getTime()),
//   rating: number (1-10),
//   date: string (YYYY-MM-DD)
// }

// Save caffeine data
export const saveCaffeineData = async (caffeineData) => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(caffeineData.timestamp);
    const formattedData = {
      ...caffeineData,
      id: Date.now().toString(),
      date: date.toISOString().split('T')[0],
    };
    
    // Get existing data
    const existingDataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
    
    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(STORAGE_KEYS.CAFFEINE_DATA, JSON.stringify(updatedData));
    
    return formattedData;
  } catch (error) {
    console.error('Error saving caffeine data:', error);
    throw error;
  }
};

// Save sleep data - now specifically for sleep only (not naps)
export const saveSleepData = async (sleepData) => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(sleepData.startTime);
    const formattedData = {
      ...sleepData,
      id: Date.now().toString(),
      date: date.toISOString().split('T')[0],
    };

    // Always use the sleep storage key
    const storageKey = STORAGE_KEYS.SLEEP_DATA;
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
    
    // Add debugging
    console.log(`Saving sleep data with id: ${formattedData.id}`);
    
    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    
    return formattedData;
  } catch (error) {
    console.error('Error saving sleep data:', error);
    throw error;
  }
};

// Save nap data - now completely separate from sleep data
export const saveNapData = async (napData) => {
  try {
    // Format the data to include a date string for easier filtering
    const date = new Date(napData.startTime);
    const formattedData = {
      ...napData,
      id: Date.now().toString(),
      date: date.toISOString().split('T')[0],
    };

    // Always use the nap storage key
    const storageKey = STORAGE_KEYS.NAP_DATA;
    const existingDataJson = await AsyncStorage.getItem(storageKey);
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
    
    // Add debugging
    console.log(`Saving nap data with id: ${formattedData.id}`);
    
    // Save updated data
    const updatedData = [...existingData, formattedData];
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    
    return formattedData;
  } catch (error) {
    console.error('Error saving nap data:', error);
    throw error;
  }
};

// Get all caffeine data
export const getAllCaffeineData = async () => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error('Error getting caffeine data:', error);
    return [];
  }
};

// Get all sleep data
export const getAllSleepData = async () => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error('Error getting sleep data:', error);
    return [];
  }
};

// Get all nap data - now completely separate from sleep data
export const getAllNapData = async () => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.NAP_DATA);
    return dataJson ? JSON.parse(dataJson) : [];
  } catch (error) {
    console.error('Error getting nap data:', error);
    return [];
  }
};

// Get data for a specific date
export const getDataForDate = async (date) => {
  const dateString = date.toISOString().split('T')[0];
  
  try {
    // Get all data types
    const caffeineDataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    const sleepDataJson = await AsyncStorage.getItem(STORAGE_KEYS.SLEEP_DATA);
    const napDataJson = await AsyncStorage.getItem(STORAGE_KEYS.NAP_DATA);
    
    // Parse JSON data or use empty arrays if no data exists
    const caffeineData = caffeineDataJson ? JSON.parse(caffeineDataJson) : [];
    const sleepData = sleepDataJson ? JSON.parse(sleepDataJson) : [];
    const napData = napDataJson ? JSON.parse(napDataJson) : [];
    
    // Filter data for the given date
    return {
      caffeine: caffeineData.filter(item => item.date === dateString),
      sleep: sleepData.filter(item => item.date === dateString),
      nap: napData.filter(item => item.date === dateString),
    };
  } catch (error) {
    console.error('Error getting data for date:', error);
    return { caffeine: [], sleep: [], nap: [] };
  }
};

// Delete a caffeine entry
export const deleteCaffeineEntry = async (id) => {
  try {
    const dataJson = await AsyncStorage.getItem(STORAGE_KEYS.CAFFEINE_DATA);
    if (!dataJson) return false;
    
    const data = JSON.parse(dataJson);
    const updatedData = data.filter(item => item.id !== id);
    
    await AsyncStorage.setItem(STORAGE_KEYS.CAFFEINE_DATA, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error deleting caffeine entry:', error);
    return false;
  }
};

// Delete a sleep entry
export const deleteSleepEntry = async (id, isNap = false) => {
  const storageKey = isNap ? STORAGE_KEYS.NAP_DATA : STORAGE_KEYS.SLEEP_DATA;
  
  try {
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) return false;
    
    const data = JSON.parse(dataJson);
    const updatedData = data.filter(item => item.id !== id);
    
    await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    return true;
  } catch (error) {
    console.error('Error deleting sleep/nap entry:', error);
    return false;
  }
};

// Clear all data - for testing or reset
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.CAFFEINE_DATA,
      STORAGE_KEYS.SLEEP_DATA,
      STORAGE_KEYS.NAP_DATA,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

// Update existing entry
export const updateEntry = async (type, id, updatedData) => {
  let storageKey;
  switch (type) {
    case 'caffeine':
      storageKey = STORAGE_KEYS.CAFFEINE_DATA;
      break;
    case 'sleep':
      storageKey = STORAGE_KEYS.SLEEP_DATA;
      break;
    case 'nap':
      storageKey = STORAGE_KEYS.NAP_DATA;
      break;
    default:
      throw new Error('Invalid entry type');
  }
  
  try {
    // Get existing data
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) throw new Error('No data found');
    
    const data = JSON.parse(dataJson);
    
    // Find the entry by id
    const entryIndex = data.findIndex(item => item.id === id);
    if (entryIndex === -1) throw new Error('Entry not found');
    
    // Update the entry
    data[entryIndex] = {
      ...data[entryIndex],
      ...updatedData,
    };
    
    // Save updated data
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    
    return data[entryIndex];
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

// Get entry by ID
export const getEntryById = async (type, id) => {
  let storageKey;
  switch (type) {
    case 'caffeine':
      storageKey = STORAGE_KEYS.CAFFEINE_DATA;
      break;
    case 'sleep':
      storageKey = STORAGE_KEYS.SLEEP_DATA;
      break;
    case 'nap':
      storageKey = STORAGE_KEYS.NAP_DATA;
      break;
    default:
      throw new Error('Invalid entry type');
  }
  
  try {
    // Get data
    const dataJson = await AsyncStorage.getItem(storageKey);
    if (!dataJson) throw new Error('No data found');
    
    const data = JSON.parse(dataJson);
    
    // Find the entry by id
    const entry = data.find(item => item.id === id);
    if (!entry) throw new Error('Entry not found');
    
    return entry;
  } catch (error) {
    console.error('Error getting entry by ID:', error);
    throw error;
  }
};

// Update existing caffeine entry
export const updateCaffeineEntry = async (id, updatedData) => {
  return updateEntry('caffeine', id, updatedData);
};

// Update existing sleep entry
export const updateSleepEntry = async (id, updatedData, isNap = false) => {
  return updateEntry(isNap ? 'nap' : 'sleep', id, updatedData);
};
