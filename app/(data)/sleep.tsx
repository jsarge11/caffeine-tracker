import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import SleepInput from "../../src/components/SleepInput";
import { saveSleepData } from "../../src/storage/asyncStorage";
import { TimeData } from "../../src/types/data.types";

export default function AddSleepScreen() {
  const router = useRouter();

  const handleSave = async (sleepData: TimeData) => {
    try {
      await saveSleepData(sleepData);
      router.back();
    } catch (error) {
      console.error("Error saving sleep data:", error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add Sleep",
          headerStyle: {
            backgroundColor: "#1E90FF",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.content}>
        <SleepInput onSave={handleSave} isNap={false} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
  },
});
