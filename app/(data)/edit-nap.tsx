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
import { ThemedText } from "../../components/ThemedText";

interface EditNapScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function EditNapScreen({ navigation }: EditNapScreenProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [napData, setNapData] = useState<TimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNapData = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getEntryById("nap", id as string);
          setNapData(data as TimeData);
          setError(null);
        } catch (error) {
          console.error("Error loading nap data:", error);
          setError("Failed to load nap data");
        } finally {
          setLoading(false);
        }
      }
    };

    loadNapData();
  }, [id]);

  const handleUpdate = async (updatedData: TimeData) => {
    try {
      await updateSleepEntry(id as string, updatedData, true);
      navigation.goBack();
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
          headerTintColor: "#008080",
        }}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#008080" />
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          napData && <SleepInput onSave={handleUpdate} initialData={napData} isNap={true} />
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
