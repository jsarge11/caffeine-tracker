import { normalizeData } from "@/src/storage/dataService";
import { BubbleChartData } from "@/src/types/data.types";
import { WINDOW_SIZE } from "@/src/utils/fns";
import React, { useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryScatter,
} from "victory-native";

const { width } = Dimensions.get("window");

export const BubbleChart: React.FC<{ data: BubbleChartData[] }> = ({
  data,
}) => {
  const [windowStart, setWindowStart] = React.useState(0);

  const chartData = useMemo(() => {
    return data.slice(windowStart, windowStart + WINDOW_SIZE);
  }, [windowStart, data]);

  // Use the local normalizeData function defined at the bottom of this file
  const { dates, hoursSlept, naps, caffeine } = useMemo(() => {
    // Make sure we're using the local normalizeData function
    const result = normalizeData(chartData);
    console.log("Using local normalizeData, result:", result);
    return result;
  }, [chartData]);

  // Calculate averages for the current window
  const windowAverages = useMemo(() => {
    return {
      caffeine: Number(
        (caffeine.reduce((a, b) => a + b, 0) / caffeine.length).toFixed(1)
      ),
      hoursSlept: Number(
        (hoursSlept.reduce((a, b) => a + b, 0) / hoursSlept.length).toFixed(1)
      ),
      naps: Number((naps.reduce((a, b) => a + b, 0) / naps.length).toFixed(1)),
    };
  }, [caffeine, hoursSlept, naps]);

  // Calculate overall averages
  const overallAverages = useMemo(() => {
    const allCaffeine = data.map((d) => d.caffeine);
    const allHoursSlept = data.map((d) => d.hoursSlept);
    const allNaps = data.map((d) => d.naps);

    // Add null checks to prevent NaN
    return {
      caffeine: allCaffeine.length > 0 
        ? Number((allCaffeine.reduce((a, b) => a + b, 0) / allCaffeine.length).toFixed(1))
        : 0,
      hoursSlept: allHoursSlept.length > 0
        ? Number((allHoursSlept.reduce((a, b) => a + b, 0) / allHoursSlept.length).toFixed(1))
        : 0,
      naps: allNaps.length > 0
        ? Number((allNaps.reduce((a, b) => a + b, 0) / allNaps.length).toFixed(1))
        : 0,
    };
  }, [data]); // Add data as a dependency

  const canGoBack = windowStart > 0;
  const canGoForward = windowStart + WINDOW_SIZE < data.length;

  // Calculate max value for caffeine for proper scaling
  const maxCaffeine = Math.max(...caffeine);

  // Format date for x-axis
  const formatDate = (date?: Date) => {
    if (!date) return "";
    // Ensure we're displaying the correct date by using local date methods
    return `${date.toLocaleString("default", {
      month: "numeric",
    })}/${date.getDate()}`;
  };

  const chartPadding = { top: 10, bottom: 50, left: 20, right: 65 };

  const getFormattedDates = () => {
    if (dates.length > 0) {
      return `${formatDate(dates[0])} - ${formatDate(dates[dates.length - 1])}`;
    }
    return "";
  };

  const noDataText = "No data available";

  return (
    <View style={styles.outerContainer}>
      {/* Add date range and title header */}
      <View style={styles.chartHeader}>
        <View style={styles.dateRangeContainer}>
          <View style={styles.dateRangeIndicator}>
            <Text style={styles.dateRangeText}>{getFormattedDates()}</Text>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.chartTitle}>Caffeine & Sleep Correlation</Text>
            <Text style={styles.chartSubtitle}>
              Visualizing your consumption patterns
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.container}>
        {/* Add a legend at the top */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
            />
            <Text style={styles.legendText}>Sleep (hrs)</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#2196F3" }]}
            />
            <Text style={styles.legendText}>Naps</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: "#FF5733" }]}
            />
            <Text style={styles.legendText}>Caffeine (mg)</Text>
          </View>
        </View>

        {/* First chart for sleep hours and naps with 0-12 scale */}
        <View style={styles.chartContainer}>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{ x: 20 }}
            padding={chartPadding}
          >
            {/* X-Axis with Dates */}
            <VictoryAxis
              tickValues={dates}
              tickFormat={formatDate}
              style={{
                ticks: { stroke: "grey", size: 5 },
                tickLabels: { fontSize: 10, padding: 5 },
              }}
            />

            {/* Left Y-Axis for Hours Slept and Naps (0-12) */}
            <VictoryAxis
              dependentAxis
              domain={[0, 12]} // Fixed domain from 0 to 12
              tickValues={[0, 2, 4, 6, 8, 10, 12]}
              style={{
                axis: { stroke: "#4CAF50" },
                ticks: { stroke: "#4CAF50", size: 5 },
                tickLabels: { fontSize: 10, padding: 2, fill: "#4CAF50" },
              }}
              axisLabelComponent={
                <VictoryLabel dy={40} style={{ fill: "#4CAF50" }} />
              }
            />

            {/* Sleep Hours Bar (green) */}
            <VictoryBar
              data={hoursSlept.map((y, index) => ({ x: dates[index], y }))}
              style={{
                data: { fill: "#4CAF50", opacity: 0.7 },
              }}
              barWidth={8}
              labels={({ datum }) => `${datum.y}`}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 8, fill: "#4CAF50" }}
                  dy={-10}
                />
              }
            />

            {/* Nap Line (blue) */}
            <VictoryLine
              data={naps.map((y, index) => ({ x: dates[index], y }))}
              style={{
                data: { stroke: "#2196F3", strokeWidth: 3 },
              }}
            />

            {/* Nap data points with labels */}
            <VictoryScatter
              data={naps.map((y, index) => ({ x: dates[index], y }))}
              size={4}
              style={{ data: { fill: "#2196F3" } }}
              labels={({ datum }) => `${datum.y}`}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 8, fill: "#2196F3" }}
                  dy={-10}
                />
              }
            />
          </VictoryChart>
        </View>

        {/* Second chart for caffeine with its own scale */}
        <View style={[styles.chartContainer, styles.overlayChart]}>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{ x: 20 }}
            padding={chartPadding}
          >
            {/* X-Axis with Dates (transparent, just for alignment) */}
            <VictoryAxis
              tickValues={dates}
              tickFormat={formatDate}
              style={{
                axis: { stroke: "transparent" },
                ticks: { stroke: "transparent" },
                tickLabels: { fill: "transparent" },
              }}
            />

            {/* Right Y-Axis for Caffeine (0-300) */}
            <VictoryAxis
              dependentAxis
              orientation="right"
              domain={[0, Math.ceil(maxCaffeine * 1.1)]} // Add 10% padding
              tickValues={[0, 50, 100, 150, 200, 250, 300].filter(
                (v) => v <= maxCaffeine * 1.1
              )}
              style={{
                axis: { stroke: "#FF5733" },
                ticks: { stroke: "#FF5733", size: 5 },
                tickLabels: { fontSize: 10, padding: 5, fill: "#FF5733" },
                grid: { stroke: "transparent" },
              }}
              axisLabelComponent={
                <VictoryLabel dy={-40} style={{ fill: "#FF5733" }} />
              }
            />

            {/* Caffeine Line (orange/red) */}
            <VictoryLine
              data={caffeine.map((y, index) => ({ x: dates[index], y }))}
              style={{
                data: {
                  stroke: "#FF5733",
                  strokeWidth: 2,
                  strokeDasharray: "5,5",
                },
              }}
            />

            {/* Caffeine data points with values as labels */}
            <VictoryScatter
              data={caffeine.map((y, index) => ({ x: dates[index], y }))}
              size={4}
              style={{ data: { fill: "#FF5733" } }}
              labels={({ datum }) => `${datum.y}`}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 8, fill: "#FF5733" }}
                  dy={10}
                />
              }
            />
          </VictoryChart>
        </View>
      </View>

      {/* Averages Section */}
      <View style={styles.averagesContainer}>
        <Text style={styles.averagesTitle}>Averages</Text>

        <View style={styles.averagesRow}>
          <View style={styles.averageColumn}>
            <Text style={styles.averageLabel}>Current Window</Text>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF5733" }]}
              />
              <Text style={styles.averageText}>
                {windowAverages?.caffeine
                  ? `Caffeine: ${windowAverages.caffeine} mg`
                  : noDataText}
              </Text>
            </View>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.averageText}>
                {windowAverages?.hoursSlept
                  ? `Sleep: ${windowAverages.hoursSlept} hrs`
                  : noDataText}
              </Text>
            </View>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#2196F3" }]}
              />
              <Text style={styles.averageText}>
                {windowAverages?.naps
                  ? `Naps: ${windowAverages.naps}`
                  : noDataText}
              </Text>
            </View>
          </View>

          <View style={styles.averageColumn}>
            <Text style={styles.averageLabel}>Overall</Text>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#FF5733" }]}
              />
              <Text style={styles.averageText}>
                {overallAverages?.caffeine
                  ? `Caffeine: ${overallAverages.caffeine} mg`
                  : noDataText}
              </Text>
            </View>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
              />
              <Text style={styles.averageText}>
                {overallAverages?.hoursSlept
                  ? `Sleep: ${overallAverages.hoursSlept} hrs`
                  : noDataText}
              </Text>
            </View>
            <View style={styles.averageItem}>
              <View
                style={[styles.legendColor, { backgroundColor: "#2196F3" }]}
              />
              <Text style={styles.averageText}>
                {overallAverages?.naps
                  ? `Naps: ${overallAverages.naps}`
                  : noDataText}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Button placed below the chart */}
      <View style={styles.nav}>
        <TouchableOpacity
          onPress={() => setWindowStart((prev) => Math.max(0, prev - 1))}
          disabled={!canGoBack}
          style={[styles.button, !canGoBack && styles.disabled]}
        >
          <Text style={styles.buttonText}>Previous (Day)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setWindowStart((prev) => prev + 1)}
          disabled={!canGoForward}
          style={[styles.button, !canGoForward && styles.disabled]}
        >
          <Text style={styles.buttonText}>Forward (Day)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: width - 32,
    margin: 16,
  },
  chartHeader: {
    marginBottom: 10,
    width: "90%",
  },
  dateRangeContainer: {
    backgroundColor: "rgba(0, 128, 128, 0.1)",
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#008080",
  },
  dateRangeIndicator: {
    alignItems: "center",
    marginBottom: 8,
  },
  dateRangeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#008080",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008080",
    marginBottom: 2,
  },
  chartSubtitle: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  container: {
    height: 375,
    width: "100%",
    position: "relative",
  },
  chartContainer: {
    position: "absolute",
    top: 30, // Account for the legend
    left: -20,
    right: 0,
    bottom: 0,
  },
  overlayChart: {
    backgroundColor: "transparent",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
    zIndex: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 10,
  },
  button: {
    backgroundColor: "#008080",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 52,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    padding: 8,
  },
  disabled: {
    backgroundColor: "#ccc",
  },
  nav: {
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
  },
  averagesContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "rgba(240, 240, 240, 0.5)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "90%",
  },
  averagesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#008080",
  },
  averagesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  averageColumn: {
    flex: 1,
  },
  averageLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  averageItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  averageText: {
    fontSize: 12,
  },
});
