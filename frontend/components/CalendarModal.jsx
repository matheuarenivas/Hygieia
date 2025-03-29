import React from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const CalendarModal = ({ visible, onClose, selectedDate, onDateSelect, markedDates = {} }) => {
  // Default marked dates with selected date
  const defaultMarkedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: 'rgba(255, 107, 107, 0.3)',
      dots: [
        { color: '#FF6B6B' },
        { color: '#FF6B6B' },
        { color: '#FF6B6B' }
      ]
    },
    ...markedDates
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
              <LinearGradient
                colors={['rgba(195, 43, 43, 0.4)', "rgba(0, 0, 0, 0.5)", 'rgba(164, 158, 244, 0.4)']}
                style={styles.calendarModal}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Calendar
                  style={styles.calendar}
                  theme={{
                    backgroundColor: 'transparent',
                    calendarBackground: 'transparent',
                    textSectionTitleColor: '#ffffff',
                    selectedDayBackgroundColor: '#FF6B6B',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#FF6B6B',
                    dayTextColor: '#ffffff',
                    textDisabledColor: 'rgba(255, 255, 255, 0.3)',
                    dotColor: '#FF6B6B',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#ffffff',
                    monthTextColor: '#ffffff',
                    textDayFontFamily: 'ManropeMedium',
                    textMonthFontFamily: 'ManropeBold',
                    textDayHeaderFontFamily: 'ManropeMedium',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                    selectedDayBackgroundColor: 'rgba(255,255,255,0.15)',
                    dotStyle: {
                      marginTop: 2,
                    }
                  }}
                  markingType={'dot'}
                  markedDates={defaultMarkedDates}
                  onDayPress={day => {
                    onDateSelect(day.dateString);
                    onClose();
                  }}
                  enableSwipeMonths={true}
                />
              </LinearGradient>
            </BlurView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContainer: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  calendarModal: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calendar: {
    borderRadius: 12,
  },
});

export default CalendarModal; 