import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { colors, spacing, buttonStyles } from '../theme';

const PRESET_AMOUNTS = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

const CaffeineInput = ({ onSave, initialData = null }) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date().getTime());

  // If initialData is provided, set the values for editing
  useEffect(() => {
    if (initialData) {
      const currentAmount = initialData.amount.toString();
      setAmount(currentAmount);
      
      // Check if the amount is a preset or custom
      if (PRESET_AMOUNTS.includes(initialData.amount)) {
        setShowCustomInput(false);
      } else {
        setShowCustomInput(true);
        setCustomAmount(currentAmount);
      }
      
      // Set the timestamp for editing
      if (initialData.timestamp) {
        setTimestamp(initialData.timestamp);
      }
    }
  }, [initialData]);

  const handlePresetSelect = (value) => {
    setAmount(value.toString());
    setShowCustomInput(false);
  };

  const handleCustomAmountChange = (text) => {
    // Only allow numeric input
    const numericValue = text.replace(/[^0-9]/g, '');
    setCustomAmount(numericValue);
    setAmount(numericValue);
  };

  const handleSave = () => {
    if (!amount || parseInt(amount) <= 0) {
      return; // Don't save invalid amounts
    }
    
    const caffeineData = {
      amount: parseInt(amount),
      timestamp: timestamp,
    };
    
    // If editing, pass the id along
    if (initialData && initialData.id) {
      caffeineData.id = initialData.id;
    }
    
    onSave(caffeineData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {initialData ? 'Edit Caffeine' : 'Add Caffeine'}
      </Text>
      
      <Text style={styles.label}>Amount (mg)</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetContainer}
      >
        {PRESET_AMOUNTS.map((preset) => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.presetButton,
              amount === preset.toString() && styles.selectedPreset
            ]}
            onPress={() => handlePresetSelect(preset)}
          >
            <Text style={[
              styles.presetText,
              amount === preset.toString() && styles.selectedPresetText
            ]}>
              {preset}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[
            styles.presetButton,
            showCustomInput && styles.selectedPreset
          ]}
          onPress={() => {
            setShowCustomInput(true);
            setAmount(customAmount);
          }}
        >
          <Text style={[
            styles.presetText,
            showCustomInput && styles.selectedPresetText
          ]}>
            Custom
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {showCustomInput && (
        <Input
          placeholder="Enter amount in mg"
          keyboardType="number-pad"
          value={customAmount}
          onChangeText={handleCustomAmountChange}
          containerStyle={styles.customInputContainer}
          inputContainerStyle={styles.customInputField}
          maxLength={4}
        />
      )}
      
      <View style={styles.selectedAmount}>
        <Text style={styles.selectedAmountText}>
          {amount ? `${amount} mg of caffeine` : 'Select an amount'}
        </Text>
      </View>
      
      <Button
        title={initialData ? "Update Caffeine Intake" : "Save Caffeine Intake"}
        disabled={!amount || parseInt(amount) <= 0}
        onPress={handleSave}
        buttonStyle={[styles.saveButton, buttonStyles.caffeine]}
        titleStyle={styles.saveButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.medium,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.large,
    textAlign: 'center',
    color: colors.primary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.small,
    color: colors.text,
  },
  presetContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
    paddingHorizontal: spacing.small,
  },
  presetButton: {
    padding: spacing.medium,
    marginRight: spacing.small,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetText: {
    fontWeight: '600',
    color: colors.text,
  },
  selectedPreset: {
    backgroundColor: colors.primary,
  },
  selectedPresetText: {
    color: colors.white,
  },
  customInputContainer: {
    paddingHorizontal: 0,
    marginBottom: spacing.medium,
  },
  customInputField: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.small,
  },
  selectedAmount: {
    backgroundColor: colors.cardBackground,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  selectedAmountText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  saveButton: {
    padding: spacing.medium,
    borderRadius: 8,
  },
  saveButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});

export default CaffeineInput;
