import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import SleepInput from "../../src/components/SleepInput";
import { getEntryById, updateSleepEntry } from "../../src/storage/asyncStorage";
import { ThemedText } from "../../components/ThemedText";
import { TimeData } from "@/src/types/data.types";

export default function EditSleepScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [sleepData, setSleepData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) {
          setError("No entry ID provided");
          setLoading(false);
          return;
        }

        const data = await getEntryById<TimeData>("sleep", id as string);
        if (!data) {
          setError("Entry not found");
          setLoading(false);
          return;
        }

        setSleepData(data);
      } catch (err) {
        console.error("Error loading sleep data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdate = async (updatedData: TimeData) => {
    try {
      await updateSleepEntry(id as string, updatedData, false);
      router.back();
    } catch (error) {
      console.error("Error updating sleep data:", error);
      setError("Failed to update data");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Sleep",
          headerStyle: {
            backgroundColor: "#1E90FF",
          },
          headerTintColor: "#fff",
        }}
      />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#1E90FF" />
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          <SleepInput
            onSave={handleUpdate}
            initialData={sleepData}
            isNap={false}
          />
        )}
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
    justifyContent: "center",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    padding: 20,
  },
});
