# Caffeine Tracker App

A React Native app to track your caffeine intake and sleep patterns, helping you understand how caffeine affects your sleep quality.

## Features

- **Comprehensive Caffeine Tracking**: Log caffeine intake in mg with preset options or custom values
- **Sleep Monitoring**: Record sleep times and quality ratings (1-10 scale)
- **Nap Tracking**: Separately track naps with duration and quality
- **Interactive Dashboard**: Visualize your caffeine consumption alongside sleep data
- **Data Visualization**: View correlations between caffeine intake, sleep hours, naps, and sleep quality
- **Daily Summary**: View your daily caffeine consumption and sleep data at a glance
- **Local Storage**: All data is stored locally on your device for privacy

## Dashboard Visualization

The app features an enhanced dashboard that:

- Displays 4-day data views with navigation controls
- Shows bar charts for caffeine intake, sleep hours, nap frequency, and sleep quality
- Uses consistent date formatting for better readability
- Provides clear visual correlation between caffeine consumption and sleep patterns

## Getting Started

1. Install dependencies

   ```bash
   yarn install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Run on iOS simulator

   ```bash
   yarn ios
   ```

## Project Structure

```
CaffeineTracker/
├── app/
│   └── (tabs)/              # Tab-based navigation structure
│       ├── index.tsx        # Home tab
│       └── dashboard.tsx    # Analytics dashboard
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/             # Main app screens
│   ├── storage/             # Local storage functions
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Helper functions including dateTime utilities
│   └── theme/               # Teal theme configuration
├── components/
│   └── ui/                  # UI components including visualization charts
└── assets/                  # App assets
```

## Core Functionality

- **Home Screen**: View today's tracked items and access tracking functions
- **Dashboard**: Interactive visualization of caffeine and sleep data with:
  - Caffeine consumption bars
  - Sleep duration visualization
  - Nap frequency indicators
  - Sleep quality ratings
- **Add Caffeine**: Record caffeine intake with amount and time
- **Add Sleep**: Track sleep with start/end times and quality rating
- **Add Nap**: Similar to sleep tracking but categorized as naps

## Tech Stack

- **React Native**: UI framework
- **Expo**: Development platform with Expo Router
- **AsyncStorage**: Local data persistence
- **Custom Visualizations**: Interactive charts and graphs
- **TypeScript**: Type-safe code

## Future Enhancements

- Data export functionality
- Cloud backup options
- More detailed reporting
- Caffeine reduction recommendations
