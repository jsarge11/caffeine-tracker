import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";
import { colors, spacing } from "../theme";
import { TimeData } from "../types/data.types";

interface SleepInputProps {
  onSave: (data: TimeData) => void;
  isNap?: boolean;
  initialData?: TimeData | null;
}

const SleepInput: React.FC<SleepInputProps> = ({
  onSave,
  isNap = false,
  initialData = null,
}) => {
  const [startHour, setStartHour] = useState<number | null>(null);
  const [startMinute, setStartMinute] = useState<number | null>(null);
  const [startAmPm, setStartAmPm] = useState<"AM" | "PM">("PM");

  const [endHour, setEndHour] = useState<number | null>(null);
  const [endMinute, setEndMinute] = useState<number | null>(null);
  const [endAmPm, setEndAmPm] = useState<"AM" | "PM">("AM");

  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = [0, 15, 30, 45];

  const isDisabled =
    startHour !== null &&
    startMinute !== null &&
    endHour !== null &&
    endMinute !== null;

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
    }
  }, [initialData, isNap]);

  const handleSave = (): void => {
    if (!isDisabled) {
      return; // Don't save incomplete data
    }

    // Convert to 24-hour format
    const startHour24 = (startHour % 12) + (startAmPm === "PM" ? 12 : 0);
    const endHour24 = (endHour % 12) + (endAmPm === "PM" ? 12 : 0);

    // Create date objects
    const now = new Date();

    const startDate =
      initialData && "startTime" in initialData && initialData.startTime
        ? new Date(initialData.startTime)
        : new Date();

    // Keep the original date but update time
    startDate.setHours(startHour24, startMinute, 0, 0);

    const endDate =
      initialData && "endTime" in initialData && initialData.endTime
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
      const sameDayDuration =
        24 * 60 * 60 * 1000 - (startDate.getTime() - endDate.getTime());
      const nextDayDuration = nextDayEndDate.getTime() - startDate.getTime();

      // If adding a day would make the duration unreasonably long (>16 hours),
      // and we're dealing with AM to AM times, use the same day calculation
      if (
        nextDayDuration > 16 * 60 * 60 * 1000 &&
        startAmPm === "AM" &&
        endAmPm === "AM"
      ) {
        // Keep same day - don't modify endDate
      } else if (sameDayDuration <= 24 * 60 * 60 * 1000) {
        // For other cases, add a day only if the resulting duration is reasonable
        endDate.setDate(endDate.getDate() + 1);
      }
    }

    // Create the data object
    const timeData: TimeData = {
      id: initialData?.id || Date.now().toString(),
      isNap,
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
    };

    // If editing, pass the id along
    if (initialData && initialData.id) {
      timeData.id = initialData.id;
    }

    onSave(timeData);
  };

  // Calculate and format the duration
  const calculateDuration = (): string => {
    if (!startHour || !startMinute || !endHour || !endMinute) {
      return "Select times";
    }

    // Convert to 24-hour format
    const startHour24 = (startHour % 12) + (startAmPm === "PM" ? 12 : 0);
    const endHour24 = (endHour % 12) + (endAmPm === "PM" ? 12 : 0);

    // Create date objects for calculation
    const startDate = new Date();
    startDate.setHours(startHour24, startMinute, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHour24, endMinute, 0, 0);

    // If end time is before start time, assume it's the next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    // Calculate duration in milliseconds
    const durationMs = endDate.getTime() - startDate.getTime();

    if (isNap) {
      // For naps, show minutes
      const minutes = Math.round(durationMs / (60 * 1000));
      return `${minutes} minutes`;
    } else {
      // For sleep, show hours and minutes
      const hours = Math.floor(durationMs / (60 * 60 * 1000));
      const minutes = Math.round((durationMs % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Text
          style={[styles.title, isNap ? styles.napTitle : styles.sleepTitle]}
        >
          {initialData
            ? isNap
              ? "Edit Nap"
              : "Edit Sleep"
            : isNap
            ? "Add Nap"
            : "Add Sleep"}
        </Text>

        {/* Start Time Section */}
        <Text style={styles.sectionLabel}>Start Time</Text>
        <View style={styles.timeSection}>
          {/* Hours Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Hour</Text>
            <ScrollView
              style={styles.pickerContainer}
              showsVerticalScrollIndicator={false}
            >
              {hours.map((hour) => (
                <TouchableOpacity
                  key={`start-hour-${hour}`}
                  style={[
                    styles.pickerItem,
                    startHour === hour &&
                      (isNap
                        ? styles.selectedNapPickerItem
                        : styles.selectedPickerItem),
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

          {/* Minutes Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Minute</Text>
            <ScrollView
              style={styles.pickerContainer}
              showsVerticalScrollIndicator={false}
            >
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={`start-minute-${minute}`}
                  style={[
                    styles.pickerItem,
                    startMinute === minute &&
                      (isNap
                        ? styles.selectedNapPickerItem
                        : styles.selectedPickerItem),
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

          {/* AM/PM Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>AM/PM</Text>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  startAmPm === "AM" &&
                    (isNap ? styles.selectedNapAmPm : styles.selectedAmPm),
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
                  startAmPm === "PM" &&
                    (isNap ? styles.selectedNapAmPm : styles.selectedAmPm),
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

        {/* End Time Section */}
        <Text style={styles.sectionLabel}>End Time</Text>
        <View style={styles.timeSection}>
          {/* Hours Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Hour</Text>
            <ScrollView
              style={styles.pickerContainer}
              showsVerticalScrollIndicator={false}
            >
              {hours.map((hour) => (
                <TouchableOpacity
                  key={`end-hour-${hour}`}
                  style={[
                    styles.pickerItem,
                    endHour === hour &&
                      (isNap
                        ? styles.selectedNapPickerItem
                        : styles.selectedPickerItem),
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

          {/* Minutes Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Minute</Text>
            <ScrollView
              style={styles.pickerContainer}
              showsVerticalScrollIndicator={false}
            >
              {minutes.map((minute) => (
                <TouchableOpacity
                  key={`end-minute-${minute}`}
                  style={[
                    styles.pickerItem,
                    endMinute === minute &&
                      (isNap
                        ? styles.selectedNapPickerItem
                        : styles.selectedPickerItem),
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

          {/* AM/PM Column */}
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>AM/PM</Text>
            <View style={styles.amPmContainer}>
              <TouchableOpacity
                style={[
                  styles.amPmButton,
                  endAmPm === "AM" &&
                    (isNap ? styles.selectedNapAmPm : styles.selectedAmPm),
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
                  endAmPm === "PM" &&
                    (isNap ? styles.selectedNapAmPm : styles.selectedAmPm),
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

        {/* Duration Preview */}
        <View style={styles.timePreview}>
          <Text
            style={[
              styles.timePreviewText,
              isNap ? styles.napTimePreviewText : styles.sleepTimePreviewText,
            ]}
          >
            Duration: {calculateDuration()}
          </Text>
        </View>

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
            disabled={!isDisabled}
            onPress={handleSave}
            buttonStyle={[
              styles.saveButton,
              isNap ? styles.napSaveButton : styles.sleepSaveButton,
              !isDisabled && styles.disabledButton,
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
