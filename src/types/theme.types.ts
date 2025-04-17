import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { ViewProps } from "react-native";
import { TextProps } from "react-native";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  lightText: string;
  white: string;
  error: string;
  success: string;
  grey: string;
  lightGrey: string;
  cardBackground: string;
}

export interface ThemeSpacing {
  xs: number;
  small: number;
  medium: number;
  large: number;
  xl: number;
  xxl: number;
}

export interface ButtonStyles {
  caffeine: {
    backgroundColor: string;
  };
  sleep: {
    backgroundColor: string;
  };
  nap: {
    backgroundColor: string;
  };
}

export type TextType =
  | "default"
  | "defaultSemiBold"
  | "title"
  | "subtitle"
  | "link";

export interface ThemedTextProps extends TextProps {
  type?: TextType;
  lightColor?: string;
  darkColor?: string;
}

export interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export type IconSymbolName =
  | "house.fill"
  | "paperplane.fill"
  | "chart.bar.fill"
  | "chevron.left.forwardslash.chevron.right"
  | "chart.xyaxis.line";

// Add types for the Font Awesome and Material Icons
export type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;
export type MaterialIconsName = keyof typeof MaterialIcons.glyphMap;

export interface IconSymbolProps {
  name: IconSymbolName;
  size?: number;
  color?: string;
  style?: any;
}
