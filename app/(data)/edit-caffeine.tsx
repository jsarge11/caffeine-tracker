import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import CaffeineInput from "../../src/components/CaffeineInput";
import {
  getEntryById,
  updateCaffeineEntry,
} from "../../src/storage/asyncStorage";
import { ThemedText } from "../../components/ThemedText";
import { CaffeineData } from "@/src/types/data.types";

interface EditCaffeineScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function EditCaffeineScreen({ navigation }: EditCaffeineScreenProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [caffeineData, setCaffeineData] = useState<CaffeineData | null>(null);
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

        const data = await getEntryById<CaffeineData>("caffeine", id as string);
        if (!data) {
          setError("Entry not found");
          setLoading(false);
          return;
        }

        setCaffeineData(data);
      } catch (err) {
        console.error("Error loading caffeine data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleUpdate = async (updatedData: CaffeineData) => {
    try {
      await updateCaffeineEntry(id as string, updatedData);
      navigation.goBack();
    } catch (error) {
      console.error("Error updating caffeine data:", error);
      setError("Failed to update data");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Caffeine",
          headerStyle: {
            backgroundColor: "#008080",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#008080" />
        ) : error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : (
          <CaffeineInput onSave={handleUpdate} initialData={caffeineData} />
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
