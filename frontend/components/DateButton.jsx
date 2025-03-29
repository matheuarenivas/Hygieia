import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DateButton = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.dateButton}
      onPress={onPress}
    >
      <Text style={styles.dateText}>Today</Text>
      <Ionicons name="calendar" size={16} color="white" style={styles.calendarIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  dateText: {
    color: 'white',
    fontFamily: 'ManropeBold',
    fontSize: 16,
    lineHeight: 16,
  },
  calendarIcon: {
    marginLeft: 4,
  },
});

export default DateButton; 