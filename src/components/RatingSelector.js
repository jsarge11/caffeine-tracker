import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, ratingConfig } from '../theme';

const RatingSelector = ({ selectedRating, onSelectRating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sleep Quality (1-10)</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.ratingContainer}
      >
        {[...Array(10)].map((_, index) => {
          const ratingValue = index + 1;
          const isSelected = selectedRating === ratingValue;
          const ratingInfo = ratingConfig[ratingValue];
          
          return (
            <TouchableOpacity
              key={ratingValue}
              style={[
                styles.ratingButton,
                { backgroundColor: ratingInfo.color },
                isSelected && styles.selectedRating
              ]}
              onPress={() => onSelectRating(ratingValue)}
            >
              <Text style={styles.ratingEmoji}>{ratingInfo.emoji}</Text>
              <Text style={styles.ratingText}>{ratingValue}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      <Text style={styles.selectedText}>
        {selectedRating ? `Selected: ${selectedRating}/10 ${ratingConfig[selectedRating].emoji}` : 'Select a rating'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.medium,
  },
  label: {
    fontSize: 16,
    marginBottom: spacing.small,
    color: colors.text,
    fontWeight: '600',
  },
  ratingContainer: {
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.small,
  },
  ratingButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    padding: 8,
  },
  selectedRating: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  ratingEmoji: {
    fontSize: 18,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  selectedText: {
    marginTop: spacing.small,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RatingSelector;
