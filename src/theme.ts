import { ThemeColors, ThemeSpacing, ButtonStyles } from "./types";

export const colors: ThemeColors = {
  primary: "#008080", // Teal
  secondary: "#1E90FF", // Dodger blue
  accent: "#20B2AA", // Light sea green
  background: "#F0F8FF", // Alice blue (light background)
  text: "#333333",
  lightText: "#666666",
  white: "#FFFFFF",
  error: "#FF6347", // Tomato red
  success: "#4BB543", // Green
  grey: "#D3D3D3",
  lightGrey: "#F5F5F5",
  cardBackground: "#E6F2F5", // Light blue/teal background
};

export const typography = {
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 30,
  },
  fontWeight: {
    normal: "400",
    semibold: "600",
    bold: "700",
  },
};

export const spacing: ThemeSpacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  circle: 9999,
};

export const shadows = {
  small: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
};

// Button styles for the main actions
export const buttonStyles: ButtonStyles = {
  caffeine: {
    backgroundColor: colors.primary,
  },
  sleep: {
    backgroundColor: colors.secondary,
  },
  nap: {
    backgroundColor: colors.accent,
  },
};
