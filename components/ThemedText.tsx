import React from "react";
import { Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedTextProps } from "@/src/types";

export function ThemedText(props: ThemedTextProps) {
  const {
    style,
    type = "default",
    lightColor,
    darkColor,
    ...otherProps
  } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  let textStyle;
  switch (type) {
    case "title":
      textStyle = styles.title;
      break;
    case "subtitle":
      textStyle = styles.subtitle;
      break;
    case "defaultSemiBold":
      textStyle = styles.defaultSemiBold;
      break;
    case "link":
      textStyle = styles.link;
      break;
    default:
      textStyle = styles.default;
  }

  return <Text style={[textStyle, { color }, style]} {...otherProps} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
