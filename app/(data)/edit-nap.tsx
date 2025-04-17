import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import SleepInput from "../../src/components/SleepInput";
import { getEntryById, updateSleepEntry } from "../../src/storage/asyncStorage";
import { TimeData } from "@/src/types/data.types";

export default function EditNapScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [napData, setNapData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) {
          setError("No nap ID provided");
          setLoading(false);
          return;
        }

        const data = await getEntryById<TimeData>("nap", id as string);

        if (!data) {
          setError("Entry not found");
          setLoading(false);
          return;
        }

        setNapData(data);
      } catch (err) {
        console.error("Error loading nap data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdate = async (updatedData: TimeData) => {
    try {
      await updateSleepEntry(id as string, updatedData, true);
      router.back();
    } catch (error) {
      console.error("Error updating nap data:", error);
      setError("Failed to update data");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Nap",
          headerStyle: {
            backgroundColor: "#FFA500",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFA500" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : napData ? (
          <SleepInput
            onSave={handleUpdate}
            isNap={true}
            initialData={napData}
          />
        ) : (
          <Text style={styles.errorText}>Failed to load nap data</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
});
