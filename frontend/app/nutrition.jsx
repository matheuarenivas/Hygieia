import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Layouts, Typography } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import AIFloatingButton from '../components/AIFloatingButton';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Svg, { Path, Line, Circle, G, Defs, Filter, FeGaussianBlur, FeComposite } from 'react-native-svg';

// Improved chart with a single continuous line
const WeightChart = ({ data }) => {
  // Maximum and minimum values for scaling with padding
  const maxY = Math.max(...data.map(point => point.y)) + 2; 
  const minY = Math.min(...data.map(point => point.y)) - 2;
  const range = maxY - minY;
  
  // Chart dimensions
  const CHART_WIDTH = 280;
  const CHART_HEIGHT = 180;
  const PADDING_X = 10;
  const PADDING_Y = 10;
  
  // Calculate scaled points for SVG path
  const points = data.map((point, index) => {
    // X position based on index (evenly spaced)
    const x = PADDING_X + (index / (data.length - 1)) * (CHART_WIDTH - 2 * PADDING_X);
    
    // Y position scaled to chart height (inverted because SVG Y goes down)
    const y = CHART_HEIGHT - PADDING_Y - ((point.y - minY) / range) * (CHART_HEIGHT - 2 * PADDING_Y);
    
    return { x, y, value: point.y };
  });
  
  // Create path for the line
  const linePath = points.reduce((path, point, index) => {
    // For first point, just move to it
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    // For subsequent points, draw a line to it
    return `${path} L ${point.x} ${point.y}`;
  }, '');
  
  return (
    <View style={styles.chartContainer}>
      {/* Y-axis labels */}
      <View style={styles.yAxisLabels}>
        {[75, 80, 85, 90, 95, 100].map((value, index) => (
          <Text key={`y-label-${value}`} style={styles.axisLabel}>{value}</Text>
        ))}
      </View>
      
      {/* SVG Chart */}
      <View style={styles.svgContainer}>
        <LinearGradient
          colors={['rgba(6, 214, 160, 0)', 'rgba(6, 214, 160, 0.05)', 'rgba(6, 214, 160, 0)']}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 8,
          }}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <Svg width="100%" height="100%">
          {/* Grid Lines */}
          {[0, 20, 40, 60, 80, 100].map((percent, index) => {
            const y = (percent / 100) * CHART_HEIGHT;
            return (
              <Line
                key={`grid-${index}`}
                x1="0"
                y1={y}
                x2={CHART_WIDTH}
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Outer Glow Effect */}
          <Path
            d={linePath}
            fill="none"
            stroke="#06D6A0"
            strokeWidth="10"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeOpacity={0.25}
            filter="url(#outerGlow)"
          />
          
          {/* Inner Glow Effect */}
          <Path
            d={linePath}
            fill="none"
            stroke="#06D6A0"
            strokeWidth="6"
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeOpacity={0.6}
            filter="url(#innerGlow)"
          />
          
          {/* Shadow for Glow Effect */}
          <Defs>
            <Filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
              <FeGaussianBlur stdDeviation="6" result="blur" />
              <FeComposite in="SourceGraphic" in2="blur" operator="over" />
            </Filter>
            <Filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
              <FeGaussianBlur stdDeviation="3" result="blur" />
              <FeComposite in="SourceGraphic" in2="blur" operator="over" />
            </Filter>
            <Filter id="pointGlow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation="2" result="blur" />
              <FeComposite in="SourceGraphic" in2="blur" operator="over" />
            </Filter>
          </Defs>
          
          {/* Weight Line */}
          <Path
            d={linePath}
            fill="none"
            stroke="#06D6A0"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Glowing effect for the last data point */}
          {points.length > 0 && (
            <Circle
              key="last-point-glow"
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={12}
              fill="rgba(6, 214, 160, 0.2)"
              filter="url(#pointGlow)"
            />
          )}
          
          {/* Data Points */}
          {points.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r={index === points.length - 1 ? 6 : 3}
              fill={index === points.length - 1 ? "#06D6A0" : "transparent"}
              stroke="#06D6A0"
              strokeWidth={index === points.length - 1 ? 0 : 2}
              filter={index === points.length - 1 ? "url(#pointGlow)" : undefined}
            />
          ))}
        </Svg>
      </View>
      
      {/* X-axis labels */}
      <View style={styles.xAxisLabels}>
        <Text style={styles.axisLabel}>2022</Text>
        <Text style={styles.axisLabel}>2023</Text>
        <Text style={styles.axisLabel}>2024</Text>
      </View>
    </View>
  );
};

export default function NutritionScreen() {
  // Create animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Day selection
  const dayScrollRef = useRef(null);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = "Wednesday"; // Hardcoded for demo, in real app would be determined dynamically
  const [selectedDay, setSelectedDay] = useState(today);
  
  // Animated values for water bubbles
  const bubbleY1 = useRef(new Animated.Value(0)).current;
  const bubbleY2 = useRef(new Animated.Value(0)).current;
  const bubbleY3 = useRef(new Animated.Value(0)).current;
  const bubbleY4 = useRef(new Animated.Value(0)).current;
  const bubbleY5 = useRef(new Animated.Value(0)).current;
  const bubbleY6 = useRef(new Animated.Value(0)).current;
  
  // Water glow animation
  const waterGlow = useRef(new Animated.Value(0.3)).current;
  
  // Animate water bubbles
  useEffect(() => {
    const createBubbleAnimation = (value, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: -20,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          })
        ])
      );
    };
    
    // Start bubble animations with different timing
    const animations = [
      createBubbleAnimation(bubbleY1, 2000, 300),
      createBubbleAnimation(bubbleY2, 2500, 1200),
      createBubbleAnimation(bubbleY3, 1800, 600),
      createBubbleAnimation(bubbleY4, 2200, 900),
      createBubbleAnimation(bubbleY5, 2300, 1500),
      createBubbleAnimation(bubbleY6, 1900, 0)
    ];
    
    // Start water glow pulsing
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(waterGlow, {
          toValue: 0.7,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(waterGlow, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        })
      ])
    );
    
    // Start all animations
    animations.forEach(anim => anim.start());
    glowAnimation.start();
    
    return () => {
      animations.forEach(anim => anim.stop());
      glowAnimation.stop();
    };
  }, []);
  
  // Sample nutrient data
  const nutrientData = {
    proteins: { current: 150, target: 225, color: '#FF6B6B' },
    fats: { current: 30, target: 118, color: '#FFD166' },
    carbs: { current: 319, target: 340, color: '#06D6A0' },
    calories: { current: 2456, target: 3400, color: '#FFFFFF' }
  };
  
  // Sample water tracking data
  const waterData = {
    current: 1.9,
    target: 2.5,
    percentage: 78,
    lastTime: '10:45 AM'
  };
  
  // Sample meal data
  const meals = [
    { id: 1, type: 'Breakfast', calories: 531, time: '10:45 AM' },
    { id: 2, type: 'Lunch', calories: 1024, time: '03:45 PM' }
  ];
  
  // Sample weight data for chart
  const weightData = [
    { x: '2022', y: 82 },
    { x: '2022 Q2', y: 78 },
    { x: '2022 Q3', y: 81 },
    { x: '2023', y: 84 },
    { x: '2023 Q2', y: 85 },
    { x: '2023 Q3', y: 83 },
    { x: '2023 Q4', y: 88 },
    { x: '2024', y: 92 },
    { x: '2024 Q2', y: 89 },
    { x: 'Now', y: 93 },
  ];
  
  // Tabs for navigation
  // const [selectedTab, setSelectedTab] = useState('Today');

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.mainContainer}>
        <Header scrollY={scrollY} title="Nutrition" />
        
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
          
          {/* Nutrients Card with enhanced labeling */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>Macro Nutrients</Text>
            </View>
            
            {/* Proteins */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabelContainer}>
                <View style={[styles.nutrientIndicator, { backgroundColor: nutrientData.proteins.color }]} />
                <Text style={styles.nutrientLabel}>Proteins</Text>
              </View>
              <Text style={styles.nutrientValue}>{nutrientData.proteins.current} / {nutrientData.proteins.target}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${(nutrientData.proteins.current / nutrientData.proteins.target) * 100}%`,
                    backgroundColor: nutrientData.proteins.color
                  }
                ]} 
              />
            </View>
            
            {/* Fats */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabelContainer}>
                <View style={[styles.nutrientIndicator, { backgroundColor: nutrientData.fats.color }]} />
                <Text style={styles.nutrientLabel}>Fats</Text>
              </View>
              <Text style={styles.nutrientValue}>{nutrientData.fats.current} / {nutrientData.fats.target}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${(nutrientData.fats.current / nutrientData.fats.target) * 100}%`,
                    backgroundColor: nutrientData.fats.color
                  }
                ]} 
              />
            </View>
            
            {/* Carbs */}
            <View style={styles.nutrientRow}>
              <View style={styles.nutrientLabelContainer}>
                <View style={[styles.nutrientIndicator, { backgroundColor: nutrientData.carbs.color }]} />
                <Text style={styles.nutrientLabel}>Carbs</Text>
              </View>
              <Text style={styles.nutrientValue}>{nutrientData.carbs.current} / {nutrientData.carbs.target}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${(nutrientData.carbs.current / nutrientData.carbs.target) * 100}%`,
                    backgroundColor: nutrientData.carbs.color
                  }
                ]} 
              />
            </View>
            
            {/* Calories */}
            <View style={[styles.nutrientRow, { marginTop: 16 }]}>
              <View style={styles.nutrientLabelContainer}>
                <View style={[styles.nutrientIndicator, { backgroundColor: nutrientData.calories.color }]} />
                <Text style={styles.nutrientLabel}>Calories</Text>
              </View>
              <Text style={styles.nutrientValue}>{nutrientData.calories.current} / {nutrientData.calories.target}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${(nutrientData.calories.current / nutrientData.calories.target) * 100}%`,
                    backgroundColor: nutrientData.calories.color
                  }
                ]} 
              />
            </View>
          </View>
          
          {/* Water Tracking */}
          <View style={styles.waterCard}>
            <View style={styles.waterHeader}>
              <View style={styles.waterHeaderLeft}>
                <Text style={styles.waterTitle}>Water</Text>
                <View style={styles.waterLitersContainer}>
                  <Text style={styles.waterLiterValue}>{waterData.current}L</Text>
                  <Text style={styles.waterLiterSeparator}>/</Text>
                  <Text style={styles.waterLiterTarget}>{waterData.target}L</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="settings-outline" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.waterContent}>
              <View style={styles.waterControls}>
                <TouchableOpacity style={styles.waterButton}>
                  <LinearGradient
                    colors={['#4F9EFF', '#76B5FF', '#4F9EFF']}
                    style={styles.glowingButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="add" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.waterButton}>
                  <LinearGradient
                    colors={['#4F9EFF', '#76B5FF', '#4F9EFF']}
                    style={styles.glowingButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="remove" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <View style={styles.waterVisual}>
                <View style={styles.waterContainer}>
                  <LinearGradient
                    colors={['rgba(76, 181, 255, 0.1)', 'rgba(76, 181, 255, 0.05)']}
                    style={styles.waterBackground}
                  />
                  <Animated.View 
                    style={[
                      styles.waterGlow,
                      { opacity: waterGlow }
                    ]} 
                  />
                  <LinearGradient
                    colors={['#4F9EFF', '#76B5FF', '#A0CFFF']}
                    style={[
                      styles.waterFill, 
                      { height: `${waterData.percentage}%` }
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <View style={styles.waterBubbles}>
                      {[...Array(6)].map((_, i) => (
                        <Animated.View 
                          key={i} 
                          style={[
                            styles.bubble, 
                            styles[`bubble${i+1}`],
                            { 
                              transform: [
                                { translateY: i === 0 ? bubbleY1 : 
                                          i === 1 ? bubbleY2 : 
                                          i === 2 ? bubbleY3 : 
                                          i === 3 ? bubbleY4 : 
                                          i === 4 ? bubbleY5 : bubbleY6 }
                              ] 
                            }
                          ]} 
                        />
                      ))}
                    </View>
                  </LinearGradient>
                  <View style={styles.percentInWater}>
                    <Text style={styles.percentInWaterText}>{waterData.percentage}%</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.waterTimestamp}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.timestampText}>Last time {waterData.lastTime}</Text>
            </View>
          </View>
          
          {/* Meals section with add button */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meals</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => alert('Add food')}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* Meals list */}
          {meals.map(meal => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <View style={styles.mealTimestamp}>
                  <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.timestampText}>{meal.time}</Text>
                </View>
              </View>
              <Text style={styles.mealCalories}>{meal.calories} Cal</Text>
            </View>
          ))}
          
          {/* Weight Chart - Use the custom component */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weight</Text>
            <WeightChart data={weightData} />
          </View>
        </Animated.ScrollView>
        
        <AIFloatingButton scrollY={scrollY} />
        <NavBar currentScreen="nutrition" />
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
    //flex: 1,
    //alignItems: 'center',
    //justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 120, // Space for header
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  tabText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'ManropeMedium',
  },
  activeTabText: {
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  refreshButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutrientLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  nutrientLabel: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'ManropeMedium',
  },
  nutrientValue: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'ManropeMedium',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  waterCard: {
    backgroundColor: 'rgba(30, 41, 82, 0.7)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  waterHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginRight: 16,
  },
  waterLitersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 181, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  waterLiterValue: {
    fontSize: 14,
    color: '#76B5FF',
    fontFamily: 'ManropeSemiBold',
  },
  waterLiterSeparator: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: 'ManropeSemiBold',
    marginHorizontal: 4,
  },
  waterLiterTarget: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'ManropeSemiBold',
  },
  waterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  waterControls: {
    justifyContent: 'space-between',
    height: 120,
    marginRight: 15,
  },
  waterButton: {
    shadowColor: "#4F9EFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  waterVisual: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterContainer: {
    width: 55,
    height: 120,
    backgroundColor: 'rgba(20, 30, 70, 0.5)',
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 181, 255, 0.3)',
  },
  waterBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  waterGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: 'rgba(76, 181, 255, 0.2)',
    overflow: 'hidden',
  },
  waterFill: {
    width: '100%',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  waterBubbles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  percentInWater: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentInWaterText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  waterTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
    fontFamily: 'Manrope',
  },
  mealCard: {
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginBottom: 4,
  },
  mealTimestamp: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  chartCard: {
    backgroundColor: 'rgba(12, 12, 12, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginBottom: 16,
  },
  chartContainer: {
    height: 220,
    flexDirection: 'row',
    marginVertical: 10,
    paddingBottom: 30,
  },
  svgContainer: {
    flex: 1,
    height: '100%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  yAxisLabels: {
    width: 30,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 25,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  axisLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontFamily: 'Manrope',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bubble: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.8,
    bottom: 5,
  },
  bubble1: {
    backgroundColor: '#A0CFFF',
    left: '20%',
  },
  bubble2: {
    backgroundColor: '#76B5FF',
    left: '50%',
  },
  bubble3: {
    backgroundColor: '#4F9EFF',
    left: '70%',
  },
  bubble4: {
    backgroundColor: '#A0CFFF',
    left: '30%',
    bottom: 15,
  },
  bubble5: {
    backgroundColor: '#4F9EFF',
    left: '60%',
    bottom: 25,
  },
  bubble6: {
    backgroundColor: '#76B5FF',
    left: '40%',
    bottom: 35,
  },
  percentageContainer: {
    alignItems: 'center',
  },
  waterLabel: {
    fontSize: 12,
    color: 'white',
    fontFamily: 'ManropeMedium',
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