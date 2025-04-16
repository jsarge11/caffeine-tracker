import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';

export default function TabBarBackground() {
  // On iOS, we can use the transparent background to let the blur effect show
  if (Platform.OS === 'ios') {
    return null;
  }

  // On Android and web, we provide a simple background with shadow
  return <View style={styles.background} />;
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
});
