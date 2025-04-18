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

interface EditSleepScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function EditSleepScreen({ navigation }: EditSleepScreenProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [sleepData, setSleepData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSleepData = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getEntryById("sleep", id as string);
          setSleepData(data as TimeData);
          setError(null);
        } catch (error) {
          console.error("Error loading sleep data:", error);
          setError("Failed to load sleep data");
        } finally {
          setLoading(false);
        }
      }
    };

    loadSleepData();
  }, [id]);

  const handleUpdate = async (updatedData: TimeData) => {
    try {
      await updateSleepEntry(id as string, updatedData);
      navigation.goBack();
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
          headerTintColor: '#008080',
        }}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#008080" />
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          sleepData && <SleepInput onSave={handleUpdate} initialData={sleepData} isNap={false} />
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
