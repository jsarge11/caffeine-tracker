import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { colors } from "../theme";
import SleepInput from "../components/SleepInput";
import { saveNapData } from "../storage/asyncStorage";
import { TimeData } from "../types/data.types";

interface AddNapScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const AddNapScreen: React.FC<AddNapScreenProps> = ({ navigation }) => {
  const handleSave = async (napData: Omit<TimeData, "id">): Promise<void> => {
    try {
      // Make sure isNap is set to true
      const napDataWithFlag = {
        ...napData,
        isNap: true,
      };

      await saveNapData(napDataWithFlag);
      navigation.goBack();
    } catch (error) {
      console.error("Error saving nap data:", error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SleepInput onSave={handleSave} isNap={true} />
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

export default AddNapScreen;
