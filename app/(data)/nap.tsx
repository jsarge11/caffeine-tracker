import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import SleepInput from "../../src/components/SleepInput";
import { saveNapData } from "../../src/storage/asyncStorage";
import { TimeData } from "../../src/types/data.types";

interface AddNapScreenProps {
  navigation: {
    goBack: () => void;
  };
}

export default function AddNapScreen({ navigation }: AddNapScreenProps) {
  const router = useRouter();

  const handleSave = async (napData: TimeData) => {
    try {
      await saveNapData(napData);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving nap data:", error);
      // Could add error handling UI here
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Add Nap",
          headerTintColor: '#008080',
        }} 
      />
      <View style={styles.content}>
        <SleepInput onSave={handleSave} isNap={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
  },
});
