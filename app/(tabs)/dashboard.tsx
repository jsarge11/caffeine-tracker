import React, { useMemo, useCallback } from "react";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { BubbleChart } from "@/components/ui/BubbleChart";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  normalizeDataForDashboard,
  processDataForDashboard,
} from "@/src/storage/dataService";
import { CaffeineData, DailyData, TimeData } from "@/src/types";
import { useFocusEffect } from "@react-navigation/native";

// Custom animated header component for the dashboard
const DashboardHeader = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Animation for the coffee cup
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Animated.View
          style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}
        >
          <Ionicons
            name="cafe"
            size={28}
            color={isDark ? "#8ECAEF" : "#008080"}
          />
        </Animated.View>

        <Text style={[styles.title, { color: isDark ? "#FFFFFF" : "#008080" }]}>
          Caffeine Insights
        </Text>

        <Animated.View
          style={[styles.iconContainer, { transform: [{ rotate: spin }] }]}
        >
          <Ionicons
            name="analytics"
            size={28}
            color={isDark ? "#8ECAEF" : "#008080"}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const [data, setData] = React.useState<DailyData>({
    caffeine: [],
    sleep: [],
    naps: [],
  });

  const fetchData = async () => {
    console.log("Dashboard: Fetching data...");
    const { caffeine, sleep, naps } = await processDataForDashboard();
    console.log("Dashboard: Data fetched:", {
      caffeineCount: caffeine.length,
      sleepCount: sleep.length,
      napsCount: naps.length,
    });
    setData({ caffeine, sleep, naps });
  };

  // Use useFocusEffect to refresh data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // Initial data load
  React.useEffect(() => {
    fetchData();
  }, []);

  const bubbleChartData = useMemo(() => {
    console.log("Dashboard: Normalizing data for bubble chart");
    const normalizedData = normalizeDataForDashboard(data);
    console.log("Dashboard: Normalized data length:", normalizedData.length);
    return normalizedData;
  }, [data]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#008080", dark: "#1D3D47" }}
      headerImage={<DashboardHeader />}
      headerHeight={60}
    >
      <BubbleChart data={bubbleChartData} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 10,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
