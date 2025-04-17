import React from "react";
import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedViewProps } from "@/src/types";

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
