# Caffeine Tracker App 

A simple iOS app to track your caffeine intake and sleep patterns as you wean off caffeine.

## Features

- **Simple Caffeine Tracking**: Log caffeine intake in mg with preset options or custom values
- **Sleep Tracking**: Record sleep times and quality ratings
- **Nap Tracking**: Separately track naps with duration and quality
- **Daily Summary**: View your daily caffeine consumption and sleep data at a glance
- **Local Storage**: All data is stored locally on your device for privacy

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on iOS simulator

   ```bash
   npm run ios
   ```

## Project Structure

```
CaffeineTracker/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Main app screens
│   ├── storage/             # Local storage functions
│   ├── utils/               # Helper functions
│   └── theme.js             # Teal/blue theme configuration
├── App.js                   # Main app component with navigation
└── app.json                 # App configuration
```

## Core Functionality

- **Home Screen**: View today's tracked items and access tracking functions
- **Add Caffeine**: Record caffeine intake with amount and time
- **Add Sleep**: Track sleep with start/end times and quality rating
- **Add Nap**: Similar to sleep tracking but categorized as naps

## Tech Stack

- **React Native**: UI framework
- **Expo**: Development platform
- **AsyncStorage**: Local data persistence
- **React Navigation**: Screen navigation
- **Expo Notifications**: Reminders

## Future Enhancements

- Analytics dashboard for correlating caffeine and sleep
- Data export functionality
- Cloud backup options
- More detailed reporting
