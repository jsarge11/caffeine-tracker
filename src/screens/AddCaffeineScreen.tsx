import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../theme";
import CaffeineInput from "../components/CaffeineInput";
import { saveCaffeineData } from "../storage/asyncStorage";
import { CaffeineData } from "../types/data.types";

interface AddCaffeineScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const AddCaffeineScreen: React.FC<AddCaffeineScreenProps> = ({
  navigation,
}) => {
  const handleSave = async (
    caffeineData: Omit<CaffeineData, "id">
  ): Promise<void> => {
    try {
      await saveCaffeineData(caffeineData);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving caffeine data:", error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CaffeineInput onSave={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});

export default AddCaffeineScreen;
