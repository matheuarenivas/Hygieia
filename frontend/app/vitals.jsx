import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Pressable, FlatList  } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Layouts, Typography } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import AIFloatingButton from '../components/AIFloatingButton';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Svg, { Path, Line, Circle, G, Defs, Filter, FeGaussianBlur, FeComposite } from 'react-native-svg';


export default function VitalsScreen() {
  // Create animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

    // Day selection
    const dayScrollRef = useRef(null);
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const today = "Wednesday"; // Hardcoded for demo, in real app would be determined dynamically
    const [selectedDay, setSelectedDay] = useState(today);

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.mainContainer}>
        <Header scrollY={scrollY} title="Vitals" />
        
        <Animated.ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Day selector */}
          <View style={styles.dateContainer}>
            <FlatList
              ref={dayScrollRef}
              data={days}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayList}
              initialScrollIndex={days.indexOf(today)}
              getItemLayout={(data, index) => ({
                length: 100, 
                offset: 100 * index,
                index,
              })}
              renderItem={({item}) => (
                <Pressable 
                  style={[
                    styles.dayButton,
                    selectedDay === item && styles.selectedDayButton
                  ]}
                  onPress={() => setSelectedDay(item)}
                >
                  <Text 
                    style={[
                      styles.dayButtonText,
                      selectedDay === item && styles.selectedDayText
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedDay === item && <View style={styles.dayIndicator} />}
                  {item === today && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayText}>Today</Text>
                    </View>
                  )}
                </Pressable>
              )}
              keyExtractor={(item) => item}
            />
          </View>
          </Animated.ScrollView>
        <AIFloatingButton scrollY={scrollY} />
        <NavBar currentScreen="vitals" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingBottom: 90, // NavBar height
  },
  scrollView: {
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 120, // Space for header
    paddingBottom: 20,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dayList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dayButton: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    alignItems: 'center',
    position: 'relative',
    width: 100,
  },
  selectedDayButton: {
    // This is for styling the selected day button
  },
  dayButtonText: {
    fontFamily: 'ManropeMedium',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  selectedDayText: {
    color: 'white',
    fontFamily: 'ManropeBold',
  },
  dayIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginTop: 4,
  },
  todayBadge: {
    position: 'absolute',
    top: -6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', //clear white
    borderRadius: 10,
  },
  todayText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'ManropeBold',
  },
}); 