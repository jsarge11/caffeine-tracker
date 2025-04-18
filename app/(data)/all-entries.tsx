import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AllEntriesScreen from '@/src/screens/AllEntriesScreen';

export default function AllEntriesRoute() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "All Entries",
          headerTintColor: '#008080',
        }} 
      />
      <AllEntriesScreen 
        navigation={{
          goBack: () => router.back()
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
