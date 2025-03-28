import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Pressable, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Layouts, Typography } from '../constants/Styles';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import AIFloatingButton from '../components/AIFloatingButton';

export default function HomeScreen() {
  const router = useRouter();
  const dayScrollRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState('Wednesday'); // Assuming Wednesday is today
  
  // Create animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = "Wednesday"; // Hardcoded for demo, in real app would be determined dynamically
  
  const navigateToNutrition = () => {
    router.push('/nutrition');
  };
  
  const navigateToVitals = () => {
    router.push('/vitals');
  };

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0}}
    >
      <View style={styles.mainContainer}>
        <Header scrollY={scrollY} title="Home" />
        
        <Animated.ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
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
          
          <View style={styles.cardsContainer}>
            <View style={styles.row}>
              {/* Readiness Card */}
              <View style={[styles.card, styles.purpleCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="airplane" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>Readiness</Text>
                    <Text style={styles.cardSubtitle}>5 mins ago</Text>
                  </View>
                </View>
                
                <Text style={styles.bigMetric}>20<Text style={styles.unit}>bpm</Text></Text>
                <Text style={styles.metricLabel}>Respiratory rate</Text>
                
                <Text style={styles.bigMetric}>37°C</Text>
                <Text style={styles.metricLabel}>Body temperature</Text>
              </View>
              
              {/* Sleep Card */}
              <View style={[styles.card, styles.goldCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons name="moon" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>Sleep</Text>
                    <Text style={styles.cardSubtitle}>10 hours ago</Text>
                  </View>
                </View>
                
                <Text style={styles.bigMetric}>70</Text>
                <Text style={styles.metricLabel}>Sleep efficiency</Text>
                
                <Text style={styles.bigMetric}>8<Text style={styles.unit}>hr</Text> 12<Text style={styles.unit}>min</Text></Text>
                <Text style={styles.metricLabel}>Time in bed</Text>
                
                <Text style={styles.bigMetric}>80<Text style={styles.unit}>bpm</Text></Text>
                <Text style={styles.metricLabel}>Resting heart rate</Text>
              </View>
            </View>
            
            <View style={styles.row}>
              {/* Activity Card */}
              <View style={[styles.card, styles.pinkCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <FontAwesome5 name="fire" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>Activity</Text>
                    <Text style={styles.cardSubtitle}>3 mins ago</Text>
                  </View>
                </View>
                
                <Text style={styles.bigMetric}>84</Text>
                <Text style={styles.metricLabel}>Goal progress</Text>
                
                <Text style={styles.bigMetric}>8,400</Text>
                <Text style={styles.metricLabel}>Steps</Text>
              </View>
              
              {/* Nutrition Card */}
              <Pressable 
                style={[styles.card, styles.greenCard]} 
                onPress={navigateToNutrition}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="leaf" size={18} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>Nutrition</Text>
                    <Text style={styles.cardSubtitle}>5 mins ago</Text>
                  </View>
                </View>
                
                <Text style={styles.bigMetric}>1575<Text style={styles.unit}>cal</Text></Text>
                <Text style={styles.metricLabel}>Calorie intake</Text>
                
                <Text style={styles.bigMetric}>3000<Text style={styles.unit}>cal</Text></Text>
                <Text style={styles.metricLabel}>Daily goal</Text>
              </Pressable>
            </View>
          </View>
        </Animated.ScrollView>
        
        <AIFloatingButton scrollY={scrollY} />
        <NavBar currentScreen="home" />
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
  cardsContainer: {
    flex: 1,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  purpleCard: {
    backgroundColor: 'rgba(164, 158, 244, 0.4)',
  },
  goldCard: {
    backgroundColor: 'rgba(179, 168, 108, 0.4)',
  },
  pinkCard: {
    backgroundColor: 'rgba(195, 43, 43, 0.4)',
  },
  greenCard: {
    backgroundColor: 'rgba(58, 141, 71, 0.4)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 16,
    color: 'white',
  },
  cardSubtitle: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  bigMetric: {
    fontFamily: 'ManropeBold',
    fontSize: 24,
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  unit: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  metricLabel: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
}); 