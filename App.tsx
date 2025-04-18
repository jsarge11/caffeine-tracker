import React, { useEffect } from "react";
import { StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./src/theme";
import * as Notifications from "expo-notifications";

// Import screens
import HomeScreen from "./src/screens/HomeScreen";
import AddCaffeineScreen from "./src/screens/AddCaffeineScreen";
import AddSleepScreen from "./src/screens/AddSleepScreen";
import AddNapScreen from "./src/screens/AddNapScreen";

// Create stack navigator
const Stack = createNativeStackNavigator();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Type for the async function
async function registerForPushNotificationsAsync(): Promise<void> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for notifications!");
    return;
  }

  // We could store the token if needed for server-side notifications
  // const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Configure for iOS
  if (Platform.OS === "ios") {
    Notifications.setNotificationCategoryAsync("default", []);
  } 
  // Configure for Android
  else if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

export default function App(): JSX.Element {
  useEffect(() => {
    // Request permission for notifications
    registerForPushNotificationsAsync();

    // Set up notification listener
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    return () => {
      // Clean up listeners on unmount
      Notifications.removeNotificationSubscription(notificationListener);
    };
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Caffeine Tracker" }}
        />
        <Stack.Screen
          name="AddCaffeine"
          component={AddCaffeineScreen}
          options={{ title: "Add Caffeine" }}
        />
        <Stack.Screen
          name="AddSleep"
          component={AddSleepScreen}
          options={{ title: "Add Sleep" }}
        />
        <Stack.Screen
          name="AddNap"
          component={AddNapScreen}
          options={{ title: "Add Nap" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Schedule a notification reminder (can be called from any screen)
export async function scheduleNotification(title: string, body: string, trigger: any): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      sound: true,
    },
    trigger,
  });
}
