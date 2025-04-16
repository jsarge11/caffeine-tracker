// Date and time utility functions for the Caffeine Tracker app

// Format a date as YYYY-MM-DD
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

// Format time as HH:MM AM/PM
export const formatTime = (date) => {
  const d = new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${hours}:${minutes} ${ampm}`;
};

// Format sleep duration in hours and minutes
export const formatDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // Duration in milliseconds
  const durationMs = end - start;
  
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
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// Get start of today
export const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of today
export const getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Create date with specific time
export const createDateWithTime = (hours, minutes) => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
};

// Add hours to a date
export const addHours = (date, hours) => {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d;
};

// Format time as 12-hour (1-12)
export const get12Hour = (hour) => {
  return hour % 12 || 12;
};

// Format date as "Monday, April 11"
export const formatDateFull = (date) => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Get caffeine data by time of day 
export const getCaffeineByTimeOfDay = (caffeineData) => {
  return caffeineData.reduce((acc, item) => {
    const hour = new Date(item.timestamp).getHours();
    
    if (hour >= 5 && hour < 12) {
      acc.morning += item.amount;
    } else if (hour >= 12 && hour < 17) {
      acc.afternoon += item.amount;
    } else {
      acc.evening += item.amount;
    }
    
    return acc;
  }, { morning: 0, afternoon: 0, evening: 0 });
};
