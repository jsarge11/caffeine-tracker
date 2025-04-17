import React from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
  IconSymbolProps,
  FontAwesomeIconName,
  MaterialIconsName,
} from "@/src/types";

export function IconSymbol({
  name,
  size = 24,
  color = "black",
  style,
}: IconSymbolProps) {
  // Map platform-independent icon names to FontAwesome or Material icon names
  const getIconName = (): FontAwesomeIconName | MaterialIconsName => {
    switch (name) {
      case "house.fill":
        return "home" as FontAwesomeIconName;
      case "paperplane.fill":
        return "send" as FontAwesomeIconName;
      case "chart.bar.fill":
        return "bar-chart" as FontAwesomeIconName;
      case "chevron.left.forwardslash.chevron.right":
        return "code" as FontAwesomeIconName;
      case "chart.xyaxis.line":
        return "timeline" as MaterialIconsName;
      default:
        return "circle" as MaterialIconsName;
    }
  };

  const iconName = getIconName();

  // Choose the appropriate icon set based on the icon name
  if (["home", "send", "bar-chart", "code"].includes(iconName as string)) {
    return (
      <FontAwesome
        name={iconName as FontAwesomeIconName}
        size={size}
        color={color}
        style={style}
      />
    );
  } else {
    return (
      <MaterialIcons
        name={iconName as MaterialIconsName}
        size={size}
        color={color}
        style={style}
      />
    );
  }
}
