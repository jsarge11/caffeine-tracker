import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { colors, spacing, buttonStyles } from "../theme";
import TrackedItemsList from "../components/TrackedItemsList";
import {
  getDataForDate,
  deleteCaffeineEntry,
  deleteSleepEntry,
} from "../storage/asyncStorage";
import { formatDateFull } from "../utils/dateTime";
import { DailyData } from "../types/data.types";
import { sleepTips } from "../data/sleepTips";
import { Ionicons } from "@expo/vector-icons";

interface HomeScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [todayData, setTodayData] = useState<DailyData>({
    caffeine: [],
    sleep: [],
    naps: [],
  });
  const [totalCaffeine, setTotalCaffeine] = useState<number>(0);
  const [date] = useState<Date>(new Date());
  const [sleepTip, setSleepTip] = useState<string>("");

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTodayData();
      // Get a random sleep tip
      const randomIndex = Math.floor(Math.random() * sleepTips.length);
      setSleepTip(sleepTips[randomIndex]);
    }, [date])
  );

  const loadTodayData = async (): Promise<void> => {
    try {
      const data = await getDataForDate(date);
      setTodayData(data);

      // Calculate total caffeine intake for today
      const total = data.caffeine.reduce((sum, item) => sum + item.amount, 0);
      setTotalCaffeine(total);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleDeleteCaffeine = async (id: string): Promise<void> => {
    const success = await deleteCaffeineEntry(id);
    if (success) {
      loadTodayData();
    }
  };

  const handleDeleteSleep = async (
    id: string,
    isNap: boolean
  ): Promise<void> => {
    const success = await deleteSleepEntry(id, isNap);
    if (success) {
      loadTodayData();
    }
  };

  // Handle edit functionality
  const handleEditCaffeine = (id: string): void => {
    navigation.navigate("EditCaffeine", { id });
  };

  const handleEditSleep = (id: string): void => {
    navigation.navigate("EditSleep", { id });
  };

  const handleEditNap = (id: string): void => {
    navigation.navigate("EditNap", { id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Caffeine Tracker</Text>
        <Text style={styles.date}>{formatDateFull(date)}</Text>
      </View>

      {/* Sleep Tip Box */}
      <View style={styles.sleepTipContainer}>
        <View style={styles.sleepTipContent}>
          <Ionicons
            name="moon"
            size={20}
            color="#008080"
            style={styles.sleepTipIcon}
          />
          <Text style={styles.sleepTipText}>{sleepTip}</Text>
        </View>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Today's Summary</Text>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Caffeine</Text>
            <Text style={styles.summaryValue}>{totalCaffeine} mg</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Sleep Entries</Text>
            <Text style={styles.summaryValue}>{todayData.sleep.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nap Entries</Text>
            <Text style={styles.summaryValue}>{todayData.naps.length}</Text>
          </View>
        </View>

        {/* Add All Entries button */}
        <TouchableOpacity
          style={styles.allEntriesButton}
          onPress={() => navigation.navigate("AllEntries")}
        >
          <Text style={styles.allEntriesButtonText}>View All Entries</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, buttonStyles.caffeine]}
          onPress={() => navigation.navigate("AddCaffeine")}
        >
          <Text style={styles.buttonText}>+ Caffeine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, buttonStyles.sleep]}
          onPress={() => navigation.navigate("AddSleep")}
        >
          <Text style={styles.buttonText}>+ Sleep</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, buttonStyles.nap]}
          onPress={() => navigation.navigate("AddNap")}
        >
          <Text style={styles.buttonText}>+ Nap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Today's Activities</Text>
        <TrackedItemsList
          caffeineData={todayData.caffeine}
          sleepData={todayData.sleep}
          napData={todayData.naps}
          onDeleteCaffeine={handleDeleteCaffeine}
          onDeleteSleep={handleDeleteSleep}
          onEditCaffeine={handleEditCaffeine}
          onEditSleep={handleEditSleep}
          onEditNap={handleEditNap}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.medium,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.small,
  },
  date: {
    fontSize: 16,
    color: colors.white,
  },
  summaryCard: {
    margin: spacing.medium,
    padding: spacing.medium,
    backgroundColor: colors.white,
    borderRadius: 8,
    ...{
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.medium,
    color: colors.text,
    textAlign: "center",
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: spacing.small,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  listContainer: {
    flex: 1,
    margin: spacing.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.medium,
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: spacing.medium,
    marginBottom: spacing.medium,
    marginTop: spacing.small,
    backgroundColor: colors.background,
  },
  button: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.small,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  allEntriesButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.medium,
  },
  allEntriesButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
  sleepTipContainer: {
    marginTop: 18,
    marginHorizontal: spacing.large,
    marginBottom: spacing.medium,
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sleepTipContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sleepTipIcon: {
    marginRight: 10,
  },
  sleepTipText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    fontStyle: "italic",
  },
});

export default HomeScreen;
