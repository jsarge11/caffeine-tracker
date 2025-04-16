import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../theme';
import SleepInput from '../components/SleepInput';
import { saveSleepData } from '../storage/asyncStorage';

const AddNapScreen = ({ navigation }) => {
  const handleSave = async (napData) => {
    try {
      // Make sure isNap is set to true
      const napDataWithFlag = {
        ...napData,
        isNap: true
      };
      
      await saveSleepData(napDataWithFlag);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving nap data:', error);
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
