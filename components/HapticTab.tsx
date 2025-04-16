import React from "react";
import { Pressable, PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export function HapticTab(props: BottomTabBarButtonProps & PressableProps) {
  return (
    <Pressable
      {...props}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.(e);
      }}
    />
  );
}
