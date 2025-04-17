import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
  ColorValue,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ParallelScrollViewProps {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: {
    light: ColorValue;
    dark: ColorValue;
  };
  headerHeight?: number;
}

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor = { light: "#A1CEDC", dark: "#1D3D47" },
  headerHeight = 80,
}: ParallelScrollViewProps) {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;

  const HEADER_HEIGHT = headerHeight;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT / 2],
    extrapolate: "clamp",
  });

  const backgroundColor = headerBackgroundColor[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            height: HEADER_HEIGHT,
            transform: [{ translateY: headerTranslateY }],
            backgroundColor,
            paddingTop: top,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.imageContainer,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
        >
          {headerImage}
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: HEADER_HEIGHT + top / 2 },
        ]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          }
        )}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    zIndex: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "hidden",
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
