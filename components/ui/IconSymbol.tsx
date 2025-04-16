import React from "react";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

export type IconSymbolName =
  | "house.fill"
  | "paperplane.fill"
  | "chart.bar.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chart.xyaxis.line";

// Add types for the Font Awesome and Material Icons
type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;
type MaterialIconsName = keyof typeof MaterialIcons.glyphMap;

export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: any;
}

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
