import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../theme';
import SleepInput from '../components/SleepInput';
import { saveSleepData } from '../storage/asyncStorage';

const AddSleepScreen = ({ navigation }) => {
  const handleSave = async (sleepData) => {
    try {
      await saveSleepData(sleepData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving sleep data:', error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SleepInput onSave={handleSave} isNap={false} />
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

export default AddSleepScreen;
