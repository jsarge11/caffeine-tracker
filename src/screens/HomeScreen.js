import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
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

const HomeScreen = ({ navigation }) => {
  const [todayData, setTodayData] = useState({
    caffeine: [],
    sleep: [],
    nap: [],
  });
  const [totalCaffeine, setTotalCaffeine] = useState(0);
  const [date, setDate] = useState(new Date());

  // Load data when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadTodayData();
    }, [date])
  );

  const loadTodayData = async () => {
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

  const handleDeleteCaffeine = async (id) => {
    const success = await deleteCaffeineEntry(id);
    if (success) {
      loadTodayData();
    }
  };

  const handleDeleteSleep = async (id, isNap) => {
    const success = await deleteSleepEntry(id, isNap);
    if (success) {
      loadTodayData();
    }
  };

  // Handle edit functionality
  const handleEditCaffeine = (id) => {
    navigation.navigate("EditCaffeine", { id });
  };

  const handleEditSleep = (id) => {
    navigation.navigate("EditSleep", { id });
  };

  const handleEditNap = (id) => {
    navigation.navigate("EditNap", { id });
  };

  const sleepEntriesWithoutNaps = todayData.sleep.filter(
    (entry) => !entry.isNap
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Caffeine Tracker</Text>
        <Text style={styles.date}>{formatDateFull(date)}</Text>
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
            <Text style={styles.summaryValue}>
              {sleepEntriesWithoutNaps.length}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Nap Entries</Text>
            <Text style={styles.summaryValue}>{todayData.nap.length}</Text>
          </View>
        </View>
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
          napData={todayData.nap}
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
});

export default HomeScreen;
