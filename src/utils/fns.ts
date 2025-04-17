import { TrackerData } from "@/src/types/data.types";

export const WINDOW_SIZE = 7;

export const normalizeData = (data: TrackerData[]) => {
  const dates = data.map((d) => new Date(d.date));
  const hoursSlept = data.map((d) => d.hoursSlept);
  const naps = data.map((d) => d.naps);
  const caffeine = data.map((d) => d.caffeine);

  return { dates, hoursSlept, naps, caffeine };
};
