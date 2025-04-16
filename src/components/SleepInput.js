import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import { colors, spacing, buttonStyles } from "../theme";
import RatingSelector from "./RatingSelector";

const SleepInput = ({ onSave, isNap = false, initialData = null }) => {
  const [startHour, setStartHour] = useState(null);
  const [startMinute, setStartMinute] = useState(null);
  const [startAmPm, setStartAmPm] = useState("PM");

  const [endHour, setEndHour] = useState(null);
  const [endMinute, setEndMinute] = useState(null);
  const [endAmPm, setEndAmPm] = useState("AM");

  // Initialize rating to 5 for naps or null for sleep
  const [rating, setRating] = useState(isNap ? 5 : null);

  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = [0, 15, 30, 45];

  // Initialize form with existing data if provided
  useEffect(() => {
    if (initialData) {
      // Set start time values
      const startDate = new Date(initialData.startTime);
      let hours = startDate.getHours();
      const isPM = hours >= 12;

      // Convert to 12-hour format
      hours = hours % 12;
      if (hours === 0) hours = 12;

      setStartHour(hours);
      setStartMinute(
        startDate.getMinutes() === 0
          ? 0
          : startDate.getMinutes() < 15
          ? 15
          : startDate.getMinutes() < 30
          ? 30
          : startDate.getMinutes() < 45
          ? 45
          : 0
      );
      setStartAmPm(isPM ? "PM" : "AM");

      // Set end time values
      const endDate = new Date(initialData.endTime);
      hours = endDate.getHours();
      const isEndPM = hours >= 12;

      // Convert to 12-hour format
      hours = hours % 12;
      if (hours === 0) hours = 12;

      setEndHour(hours);
      setEndMinute(
        endDate.getMinutes() === 0
          ? 0
          : endDate.getMinutes() < 15
          ? 15
          : endDate.getMinutes() < 30
          ? 30
          : endDate.getMinutes() < 45
          ? 45
          : 0
      );
      setEndAmPm(isEndPM ? "PM" : "AM");

      // Set rating
      setRating(initialData.rating);
    }
  }, [initialData, isNap]);

  const handleSave = () => {
    if (
      !startHour ||
      !startMinute ||
      !endHour ||
      !endMinute ||
      (!isNap && !rating)
    ) {
      return; // Don't save incomplete data
    }

    // Convert to 24-hour format
    const startHour24 = (startHour % 12) + (startAmPm === "PM" ? 12 : 0);
    const endHour24 = (endHour % 12) + (endAmPm === "PM" ? 12 : 0);

    // Create date objects
    const now = new Date();

    const startDate =
      initialData && initialData.startTime
        ? new Date(initialData.startTime)
        : new Date();

    // Keep the original date but update time
    startDate.setHours(startHour24, startMinute, 0, 0);

    const endDate =
      initialData && initialData.endTime
        ? new Date(initialData.endTime)
        : new Date();

    // Keep the original date but update time
    endDate.setHours(endHour24, endMinute, 0, 0);

    // More intelligent handling of the date logic for sleep durations
    if (endDate < startDate) {
      // Calculate what the duration would be if we add a day
      const nextDayEndDate = new Date(endDate);
      nextDayEndDate.setDate(nextDayEndDate.getDate() + 1);
      
      // Calculate durations
      const sameDayDuration = (24 * 60 * 60 * 1000) - (startDate.getTime() - endDate.getTime());
      const nextDayDuration = nextDayEndDate.getTime() - startDate.getTime();
      
      // If adding a day would make the duration unreasonably long (>16 hours),
      // and we're dealing with AM to AM times, use the same day calculation
      if (nextDayDuration > (16 * 60 * 60 * 1000) && 
          startAmPm === "AM" && endAmPm === "AM") {
        // Keep same day - don't modify endDate
      } else if (sameDayDuration <= (24 * 60 * 60 * 1000)) {
        // For other cases, add a day only if the resulting duration is reasonable
        endDate.setDate(endDate.getDate() + 1);
      }
    }
    
    // Double-check that the duration is not more than 24 hours
    const duration = endDate.getTime() - startDate.getTime();
    if (duration > 24 * 60 * 60 * 1000) {
      // If somehow we still have more than 24 hours, adjust end date
      endDate = new Date(startDate.getTime() + (16 * 60 * 60 * 1000)); // Cap at 16 hours
    }

    const sleepData = {
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
      rating: isNap ? 5 : rating, // Default rating of 5 for naps
      isNap,
    };

    // If editing, include the id
    if (initialData && initialData.id) {
      sleepData.id = initialData.id;
    }

    onSave(sleepData);
  };

  const title = isNap
    ? initialData
      ? "Edit Nap"
      : "Add Nap"
    : initialData
    ? "Edit Sleep"
    : "Add Sleep";

  const buttonStyle = isNap ? buttonStyles.nap : buttonStyles.sleep;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text
          style={[styles.title, isNap ? styles.napTitle : styles.sleepTitle]}
        >
          {title}
        </Text>

        {/* Start Time */}
        <Text style={styles.sectionLabel}>Start Time</Text>
        <View style={styles.timeSection}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Hour</Text>
            <ScrollView style={styles.pickerContainer}>
              {hours.map((hour) => (
                <TouchableOpacity
                  key={`start-hour-${hour}`}
                  style={[
                    styles.pickerItem,
                    startHour === hour && styles.selectedPickerItem,
                    isNap && startHour === hour && styles.selectedNapPickerItem,
                  ]}
                  onPress={() => setStartHour(hour)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      startHour === hour && styles.selectedPickerText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Minute</Text>
            <ScrollView style={styles.pickerContainer}>
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={`start-minute-${minute}`}
                  style={[
                    styles.pickerItem,
                    startMinute === minute && styles.selectedPickerItem,
                    isNap &&
                      startMinute === minute &&
                      styles.selectedNapPickerItem,
                  ]}
                  onPress={() => setStartMinute(minute)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      startMinute === minute && styles.selectedPickerText,
                    ]}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>AM/PM</Text>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  startAmPm === "AM" && styles.selectedAmPm,
                  isNap && startAmPm === "AM" && styles.selectedNapAmPm,
                ]}
                onPress={() => setStartAmPm("AM")}
              >
                <Text
                  style={[
                    styles.amPmText,
                    startAmPm === "AM" && styles.selectedAmPmText,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  startAmPm === "PM" && styles.selectedAmPm,
                  isNap && startAmPm === "PM" && styles.selectedNapAmPm,
                ]}
                onPress={() => setStartAmPm("PM")}
              >
                <Text
                  style={[
                    styles.amPmText,
                    startAmPm === "PM" && styles.selectedAmPmText,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* End Time */}
        <Text style={styles.sectionLabel}>End Time</Text>
        <View style={styles.timeSection}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Hour</Text>
            <ScrollView style={styles.pickerContainer}>
              {hours.map((hour) => (
                <TouchableOpacity
                  key={`end-hour-${hour}`}
                  style={[
                    styles.pickerItem,
                    endHour === hour && styles.selectedPickerItem,
                    isNap && endHour === hour && styles.selectedNapPickerItem,
                  ]}
                  onPress={() => setEndHour(hour)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      endHour === hour && styles.selectedPickerText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Minute</Text>
            <ScrollView style={styles.pickerContainer}>
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={`end-minute-${minute}`}
                  style={[
                    styles.pickerItem,
                    endMinute === minute && styles.selectedPickerItem,
                    isNap &&
                      endMinute === minute &&
                      styles.selectedNapPickerItem,
                  ]}
                  onPress={() => setEndMinute(minute)}
                >
                  <Text
                    style={[
                      styles.pickerText,
                      endMinute === minute && styles.selectedPickerText,
                    ]}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>AM/PM</Text>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  endAmPm === "AM" && styles.selectedAmPm,
                  isNap && endAmPm === "AM" && styles.selectedNapAmPm,
                ]}
                onPress={() => setEndAmPm("AM")}
              >
                <Text
                  style={[
                    styles.amPmText,
                    endAmPm === "AM" && styles.selectedAmPmText,
                  ]}
                >
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  endAmPm === "PM" && styles.selectedAmPm,
                  isNap && endAmPm === "PM" && styles.selectedNapAmPm,
                ]}
                onPress={() => setEndAmPm("PM")}
              >
                <Text
                  style={[
                    styles.amPmText,
                    endAmPm === "PM" && styles.selectedAmPmText,
                  ]}
                >
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quality Rating - Only show for sleep, not for naps */}
        {!isNap && (
          <RatingSelector selectedRating={rating} onSelectRating={setRating} />
        )}

        {/* Save Button - Made more prominent */}
        <View style={styles.saveButtonContainer}>
          <Button
            title={
              initialData
                ? isNap
                  ? "Update Nap"
                  : "Update Sleep"
                : isNap
                ? "Save Nap"
                : "Save Sleep"
            }
            disabled={
              !startHour ||
              !startMinute ||
              !endHour ||
              !endMinute ||
              (!isNap && !rating)
            }
            onPress={handleSave}
            buttonStyle={[
              styles.saveButton,
              isNap ? styles.napSaveButton : styles.sleepSaveButton,
              (!startHour ||
                !startMinute ||
                !endHour ||
                !endMinute ||
                (!isNap && !rating)) &&
                styles.disabledButton,
            ]}
            titleStyle={styles.saveButtonText}
            disabledStyle={styles.disabledButton}
            disabledTitleStyle={styles.disabledButtonText}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 30, // Add padding at the bottom for better scrolling
  },
  container: {
    padding: spacing.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: spacing.large,
    textAlign: "center",
  },
  sleepTitle: {
    color: colors.secondary,
  },
  napTitle: {
    color: colors.accent,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.small,
    color: colors.text,
  },
  timeSection: {
    flexDirection: "row",
    marginBottom: spacing.large,
  },
  timeColumn: {
    flex: 1,
    alignItems: "center",
  },
  timeLabel: {
    marginBottom: spacing.small,
    fontSize: 14,
  },
  pickerContainer: {
    height: 150,
    width: "70%",
  },
  pickerItem: {
    padding: spacing.medium,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 2,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
  },
  pickerText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedPickerItem: {
    backgroundColor: colors.secondary,
  },
  selectedNapPickerItem: {
    backgroundColor: colors.accent,
  },
  selectedPickerText: {
    color: colors.white,
    fontWeight: "700",
  },
  amPmContainer: {
    marginTop: spacing.small,
  },
  amPmButton: {
    padding: spacing.medium,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
    marginBottom: spacing.small,
    width: 60,
    alignItems: "center",
  },
  amPmText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedAmPm: {
    backgroundColor: colors.secondary,
  },
  selectedNapAmPm: {
    backgroundColor: colors.accent,
  },
  selectedAmPmText: {
    color: colors.white,
    fontWeight: "700",
  },
  timePreview: {
    backgroundColor: colors.cardBackground,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: "center",
    marginTop: spacing.medium,
    marginBottom: spacing.large,
  },
  timePreviewText: {
    fontSize: 18,
    fontWeight: "700",
  },
  sleepTimePreviewText: {
    color: colors.secondary,
  },
  napTimePreviewText: {
    color: colors.accent,
  },
  saveButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  saveButton: {
    padding: spacing.medium,
    borderRadius: 8,
    height: 50,
  },
  sleepSaveButton: {
    backgroundColor: colors.secondary,
  },
  napSaveButton: {
    backgroundColor: colors.accent,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  saveButtonText: {
    fontWeight: "700",
    fontSize: 18,
    color: "white",
  },
  disabledButtonText: {
    color: "#666666",
  },
});

export default SleepInput;
