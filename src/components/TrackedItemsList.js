import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { colors, spacing } from "../theme";
import { formatTime, formatDuration } from "../utils/dateTime";

const TrackedItemsList = ({
  caffeineData = [],
  sleepData = [],
  napData = [],
  onDeleteCaffeine,
  onDeleteSleep,
  onEditCaffeine,
  onEditSleep,
  onEditNap,
}) => {
  // Combine all data and sort by timestamp (most recent first)
  const allData = [
    ...caffeineData.map((item) => ({ ...item, type: "caffeine", uniqueKey: `caffeine-${item.id}` })),
    ...sleepData.map((item) => ({ ...item, type: "sleep", uniqueKey: `sleep-${item.id}` })),
    ...napData.map((item) => ({ ...item, type: "nap", uniqueKey: `nap-${item.id}` })),
  ].sort((a, b) => {
    // Sort by time (most recent first)
    const timeA = a.type === "caffeine" ? a.timestamp : a.startTime;
    const timeB = b.type === "caffeine" ? b.timestamp : b.startTime;
    return timeB - timeA;
  });

  const renderItem = ({ item }) => {
    if (item.type === "caffeine") {
      return (
        <View style={[styles.itemContainer, styles.caffeineItem]}>
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>Caffeine</Text>
            <Text style={styles.itemDetail}>{item.amount} mg</Text>
            <Text style={styles.itemTime}>{formatTime(item.timestamp)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => onEditCaffeine && onEditCaffeine(item.id)}
            >
              <Text style={styles.editButtonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDeleteCaffeine && onDeleteCaffeine(item.id)}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else if (item.type === "sleep" || item.type === "nap") {
      const isNap = item.type === "nap";
      return (
        <View
          style={[
            styles.itemContainer,
            isNap ? styles.napItem : styles.sleepItem,
          ]}
        >
          <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>{isNap ? "Nap" : "Sleep"}</Text>
            <Text style={styles.itemDetail}>
              {formatTime(item.startTime)} - {formatTime(item.endTime)}
            </Text>
            <Text style={styles.itemDetail}>
              Duration: {formatDuration(item.startTime, item.endTime)}
            </Text>
            {item.type === "sleep" && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Quality: </Text>
                <Text style={styles.ratingValue}>{item.rating}/10</Text>
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                if (isNap && onEditNap) {
                  onEditNap(item.id);
                } else if (!isNap && onEditSleep) {
                  onEditSleep(item.id);
                }
              }}
            >
              <Text style={styles.editButtonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDeleteSleep && onDeleteSleep(item.id, isNap)}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  // If no data, show a message
  if (allData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No entries yet for today</Text>
        <Text style={styles.emptySubtext}>
          Use the buttons below to track your caffeine and sleep
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={allData}
      renderItem={renderItem}
      keyExtractor={(item) => item.uniqueKey || item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: spacing.medium,
  },
  itemContainer: {
    marginBottom: spacing.medium,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    ...{
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
  },
  caffeineItem: {
    backgroundColor: colors.cardBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  sleepItem: {
    backgroundColor: colors.cardBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  napItem: {
    backgroundColor: colors.cardBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.small,
    color: colors.text,
  },
  itemDetail: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  itemTime: {
    fontSize: 14,
    color: colors.lightText,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingLabel: {
    fontSize: 14,
    color: colors.text,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: colors.secondary,
  },
  deleteButton: {
    backgroundColor: colors.grey,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  deleteButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyContainer: {
    padding: spacing.large,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.small,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.lightText,
    textAlign: "center",
  },
});

export default TrackedItemsList;
