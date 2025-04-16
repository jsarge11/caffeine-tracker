import React from "react";
import ParallaxScrollView from "../../components/ParallaxScrollView";
import { BubbleChart } from "@/components/ui/BubbleChart";

export default function DashboardScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#008080", dark: "#1D3D47" }}
    >
      <BubbleChart />
    </ParallaxScrollView>
  );
}
