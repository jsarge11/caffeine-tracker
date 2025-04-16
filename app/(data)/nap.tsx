import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import SleepInput from '../../src/components/SleepInput';
import { saveNapData } from '../../src/storage/asyncStorage';

// Define interface for nap data
interface NapData {
  startTime: number;
  endTime: number;
  rating: number;
}

export default function AddNapScreen() {
  const router = useRouter();

  const handleSave = async (napData: NapData) => {
    try {
      console.log('Saving nap data:', JSON.stringify(napData));
      await saveNapData(napData);
      console.log('Successfully saved nap data!');
      router.back();
    } catch (error) {
      console.error('Error saving nap data:', error);
      // Could add error handling UI here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "Add Nap",
        headerStyle: {
          backgroundColor: '#FFA500',
        },
        headerTintColor: '#fff',
      }} />
      <View style={styles.content}>
        <SleepInput onSave={handleSave} isNap={true} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
  },
});
