import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import CaffeineInput from "../../src/components/CaffeineInput";
import { saveCaffeineData } from "../../src/storage/asyncStorage";
import { useRouter } from "expo-router";
import { CaffeineData } from "../../src/types/data.types";

export default function AddCaffeineScreen() {
  const router = useRouter();

  const handleSave = async (caffeineData: CaffeineData) => {
    try {
      await saveCaffeineData(caffeineData);
      router.back();
    } catch (error) {
      console.error("Error saving caffeine data:", error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add Caffeine",
          headerStyle: {
            backgroundColor: "#008080",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.content}>
        <CaffeineInput onSave={handleSave} />
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
