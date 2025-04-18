import { TimeData } from "../types";

export const WINDOW_SIZE = 7;

export const getSleepDuration = (timeData: TimeData) => {
  // Calculate duration in milliseconds
  const durationMs = timeData.endTime - timeData.startTime;
  
  // Return the duration in milliseconds
  // This will be processed appropriately by the normalizeDataForDashboard function
  return durationMs;
};
