export interface TrackerData {
  date: string;
  naps: number;
  caffeine: number;
  hoursSlept: number;
}

export interface DayData {
  day: string;
  date: string;
  caffeine: number;
  sleepHours: number;
  naps: number;
}

export interface CaffeineData {
  id: string;
  amount: number;
  timestamp: number;
}

export interface TimeData {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  isNap: boolean;
}

export interface TrackedItem {
  id: string;
  type: "caffeine" | "sleep" | "nap";
  date: string;
  data: CaffeineData | TimeData;
}

export interface DateData {
  date: string;
  id: string;
}

export type EntryType = "caffeine" | "sleep" | "nap";
