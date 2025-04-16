import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
  VictoryLegend,
  VictoryScatter,
} from "victory-native";

const { width } = Dimensions.get("window");

const data = [
  { date: "2025-04-15", naps: 1, caffeine: 100, hoursSlept: 3 },
  { date: "2025-04-16", naps: 0, caffeine: 200, hoursSlept: 4 },
  { date: "2025-04-17", naps: 2, caffeine: 150, hoursSlept: 5 },
  { date: "2025-04-18", naps: 0, caffeine: 300, hoursSlept: 6 },
  { date: "2025-04-19", naps: 3, caffeine: 80, hoursSlept: 7 },
];

export const BubbleChart = () => {
  const dates = data.map((d) => new Date(d.date));
  const hoursSlept = data.map((d) => d.hoursSlept);
  const naps = data.map((d) => d.naps);
  const caffeine = data.map((d) => d.caffeine);

  const maxCaffeine = Math.max(...caffeine);
  
  // Scale caffeine values to fit in the 0-12 range for display
  const scaledCaffeineData = caffeine.map((y, index) => ({
    x: dates[index],
    y: (y / maxCaffeine) * 12,
    actualY: y,
  }));
  
  // Format date for x-axis
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      {/* Add a legend at the top */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>Sleep (hrs)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#2196F3" }]} />
          <Text style={styles.legendText}>Naps</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FF5733" }]} />
          <Text style={styles.legendText}>Caffeine (mg)</Text>
        </View>
      </View>
      
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 20 }}
        padding={{ top: 10, bottom: 50, left: 60, right: 60 }}
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

        {/* Y-Axis for Hours Slept and Naps (0-12) */}
        <VictoryAxis
          dependentAxis
          domain={[0, 12]}
          tickValues={[0, 2, 4, 6, 8, 10, 12]}
          style={{
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 5 },
            axis: { stroke: "#4CAF50" },
          }}
          label="Hours / Count"
          axisLabelComponent={<VictoryLabel dy={-40} />}
        />

        {/* Sleep Hours Line (green) */}
        <VictoryLine
          data={hoursSlept.map((y, index) => ({ x: dates[index], y }))}
          style={{ 
            data: { stroke: "#4CAF50", strokeWidth: 3 } 
          }}
        />
        
        {/* Sleep data points with labels */}
        <VictoryScatter
          data={hoursSlept.map((y, index) => ({ x: dates[index], y }))}
          size={4}
          style={{ data: { fill: "#4CAF50" } }}
          labels={({ datum }) => `${datum.y}`}
          labelComponent={
            <VictoryLabel
              style={{ fontSize: 8, fill: "#4CAF50" }}
              dy={-10}
            />
          }
        />

        {/* Nap Bars (blue) */}
        <VictoryBar
          data={naps.map((y, index) => ({ x: dates[index], y }))}
          style={{ 
            data: { fill: "#2196F3", opacity: 0.7 } 
          }}
          barWidth={8}
          labels={({ datum }) => `${datum.y}`}
          labelComponent={
            <VictoryLabel
              style={{ fontSize: 8, fill: "#2196F3" }}
              dy={-10}
            />
          }
        />

        {/* Caffeine Line (orange/red) - using the scaled values */}
        <VictoryLine
          data={scaledCaffeineData}
          style={{ 
            data: { stroke: "#FF5733", strokeWidth: 2, strokeDasharray: "5,5" } 
          }}
        />
        
        {/* Caffeine data points with actual values as labels */}
        <VictoryScatter
          data={scaledCaffeineData}
          size={4}
          style={{ data: { fill: "#FF5733" } }}
          labels={({ datum }) => `${datum.actualY}`}
          labelComponent={
            <VictoryLabel
              style={{ fontSize: 8, fill: "#FF5733" }}
              dy={10}
            />
          }
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    width: width - 32,
    margin: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 5,
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
    marginRight: 5,
  },
  legendText: {
    fontSize: 10,
  },
});
