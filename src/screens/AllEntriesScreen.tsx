import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getAllCaffeineData, 
  getAllSleepData, 
  getAllNapData, 
  deleteCaffeineEntry, 
  deleteSleepEntry 
} from '../storage/asyncStorage';
import { formatDate, formatTime, formatDuration } from '../utils/dateTime';
import { CaffeineEntryWithDate, SleepEntryWithDate, NapEntryWithDate } from '../types/data.types';

type EntryItem = {
  id: string;
  type: 'caffeine' | 'sleep' | 'nap';
  date: string;
  displayText: string;
  timestamp: number;
};

const AllEntriesScreen = ({ navigation }: any) => {
  const [entries, setEntries] = useState<EntryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllEntries = async () => {
    setLoading(true);
    try {
      // Get all data
      const caffeineData = await getAllCaffeineData();
      const sleepData = await getAllSleepData();
      const napData = await getAllNapData();

      // Format caffeine entries
      const caffeineEntries: EntryItem[] = caffeineData.map(entry => ({
        id: entry.id,
        type: 'caffeine',
        date: entry.date,
        displayText: `${entry.amount}mg - ${formatTime(entry.timestamp)}`,
        timestamp: new Date(entry.timestamp).getTime()
      }));

      // Format sleep entries
      const sleepEntries: EntryItem[] = sleepData.map(entry => ({
        id: entry.id,
        type: 'sleep',
        date: entry.date,
        displayText: `Sleep: ${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`,
        timestamp: new Date(entry.startTime).getTime()
      }));

      // Format nap entries
      const napEntries: EntryItem[] = napData.map(entry => ({
        id: entry.id,
        type: 'nap',
        date: entry.date,
        displayText: `Nap: ${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`,
        timestamp: new Date(entry.startTime).getTime()
      }));

      // Combine and sort all entries by date (newest first)
      const allEntries = [...caffeineEntries, ...sleepEntries, ...napEntries];
      allEntries.sort((a, b) => b.timestamp - a.timestamp);

      setEntries(allEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      Alert.alert('Error', 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEntries();
  }, []);

  const handleDelete = (item: EntryItem) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete this ${item.type} entry?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              let success = false;
              
              if (item.type === 'caffeine') {
                success = await deleteCaffeineEntry(item.id);
              } else if (item.type === 'sleep') {
                success = await deleteSleepEntry(item.id, false);
              } else if (item.type === 'nap') {
                success = await deleteSleepEntry(item.id, true);
              }
              
              if (success) {
                // Remove the deleted item from the list
                setEntries(entries.filter(entry => entry.id !== item.id));
              } else {
                Alert.alert('Error', 'Failed to delete entry');
              }
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          }
        }
      ]
    );
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'caffeine':
        return 'cafe';
      case 'sleep':
        return 'bed';
      case 'nap':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'caffeine':
        return '#FF5733';
      case 'sleep':
        return '#4CAF50';
      case 'nap':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups: {[key: string]: EntryItem[]}, item) => {
    const date = item.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  // Convert grouped entries to a format suitable for SectionList
  const sections = Object.keys(groupedEntries)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .map(date => ({
      title: date,
      data: groupedEntries[date]
    }));

  const renderItem = ({ item }: { item: EntryItem }) => (
    <View style={styles.entryItem}>
      <View style={styles.entryContent}>
        <View style={[styles.iconContainer, { backgroundColor: getEntryColor(item.type) }]}>
          <Ionicons name={getEntryIcon(item.type)} size={20} color="white" />
        </View>
        <Text style={styles.entryText}>{item.displayText}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={22} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string, data: EntryItem[] } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {new Date(section.title).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#008080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Entries</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={loadAllEntries}
        >
          <Ionicons name="refresh" size={24} color="#008080" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <Text>Loading entries...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text>No entries found</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#008080',
  },
  backButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    padding: 8,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
});

export default AllEntriesScreen;
