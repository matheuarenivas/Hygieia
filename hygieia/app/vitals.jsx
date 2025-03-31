import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import AIFloatingButton from '../components/AIFloatingButton';
import { BarChart, LineChart } from "react-native-gifted-charts";
import DateButton from '../components/DateButton';
import CalendarModal from '../components/CalendarModal';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Day Label Component
const DayLabel = ({ text }) => (
  <Text style={styles.dayLabel}>{text}</Text>
);

// Metric Card Component
const MetricCard = ({ icon, title, value, color = 'white', showHeartChart = false }) => (
  <TouchableOpacity activeOpacity={0.8} style={[styles.metricCard, showHeartChart && styles.expandedMetricCard]}>
    <View style={styles.metricHeader}>
      <Ionicons name={icon} size={20} color={color} style={styles.metricIcon} />
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    {!showHeartChart && <Text style={[styles.metricValue, {color: color}]}>{value}</Text>}
    {showHeartChart && <HeartRateChart />}
  </TouchableOpacity>
);

// Score Display Component
const ScoreDisplay = ({ score, label, status, color = '#4CAF50' }) => (
  <View style={styles.scoreContainer}>
    <Text style={styles.scoreLabel}>{label}</Text>
    <Text style={[styles.scoreValue, {color: color}]}>{score}</Text>
    <Text style={[styles.scoreStatus, {color: color}]}>{status}</Text>
  </View>
);

// Time Display Component
const TimeDisplay = ({ hours, minutes, subtitle }) => (
  <View style={styles.timeContainer}>
    <View style={styles.timeValueContainer}>
      <Text style={styles.timeValue}>{hours}</Text>
      <Text style={styles.timeUnit}>h</Text>
      <Text style={styles.timeValue}>{minutes}</Text>
      <Text style={styles.timeUnit}>min</Text>
    </View>
    <Text style={styles.timeSubtitle}>{subtitle}</Text>
  </View>
);

// Sleep Stage Bar Component
const SleepStageBar = ({ stage, duration, percentage, color }) => (
  <View style={styles.sleepStageContainer}>
    <View style={styles.sleepStageInfo}>
      <Text style={styles.sleepStageName}>{stage}</Text>
      <Text style={styles.sleepStageDuration}>{duration}</Text>
      <Text style={styles.sleepStagePercentage}>{percentage}%</Text>
    </View>
    <View style={styles.sleepStageBarBackground}>
      <View 
        style={[
          styles.sleepStageBarFill, 
          {width: `${percentage}%`, backgroundColor: color}
        ]} 
      />
    </View>
  </View>
);

// Sleep Chart Component (old bar chart version)
const SleepBarChart = ({ data }) => (
  <View style={styles.chartWrapper}>
    <BarChart
      data={data}
      width={screenWidth}
      height={140}
      barWidth={22}
      spacing={20}
      barBorderRadius={10}
      hideRules
      hideYAxisText
      hideAxesAndRules
      yAxisThickness={0}
      xAxisThickness={0}
      showXAxisIndices={false}
      showYAxisIndices={false}
      hideOrigin
      disableScroll
      renderTooltip={false}
      frontColor="#4CAF50"
      hideLabels
      initialSpacing={20}
    />
  </View>
);

// New Sleep Graph Component
const SleepGraph = () => {
  // Mock data for the sleep graph
  const sleepData = [
    { time: '12:20 AM', level: 1, stage: 'awake' },
    { time: '12:40 AM', level: 3, stage: 'deep' },
    { time: '1:00 AM', level: 2, stage: 'light' },
    { time: '1:30 AM', level: 3, stage: 'rem' },
    { time: '2:00 AM', level: 2, stage: 'light' },
    { time: '2:30 AM', level: 1, stage: 'awake' },
    { time: '3:00 AM', level: 2, stage: 'light' },
    { time: '3:30 AM', level: 3, stage: 'deep' },
    { time: '4:00 AM', level: 1, stage: 'awake' },
    { time: '4:30 AM', level: 2, stage: 'light' },
    { time: '5:00 AM', level: 3, stage: 'rem' },
    { time: '5:30 AM', level: 2, stage: 'light' },
    { time: '6:00 AM', level: 1, stage: 'awake' },
    { time: '6:30 AM', level: 2, stage: 'light' },
    { time: '7:00 AM', level: 1, stage: 'awake' },
    { time: '7:30 AM', level: 0, stage: 'awake' },
  ];

  // Color mapping for sleep stages
  const stageColors = {
    awake: '#E0E0E0',
    light: '#42A5F5',
    deep: '#1E88E5',
    rem: '#64B5F6'
  };

  const timeLabels = ['12:20 AM', '2 AM', '4 AM', '6 AM', '7:48 AM'];

  return (
    <View style={styles.sleepGraphContainer}>
      {/* Time Display */}
      <TimeDisplay hours="6" minutes="33" subtitle="Total duration 7 h 22 min" />
      
      {/* Sleep Graph */}
      <View style={styles.sleepGraphWrapper}>
        <View style={styles.sleepGraph}>
          {sleepData.map((data, index) => (
            <View 
              key={index} 
              style={[
                styles.sleepBar,
                { 
                  height: 20 * data.level,
                  backgroundColor: data.level === 0 ? 'transparent' : stageColors[data.stage]
                }
              ]}
            />
          ))}
        </View>
        
        {/* Time Labels */}
        <View style={styles.timeLabelsContainer}>
          {timeLabels.map((label, index) => (
            <Text key={index} style={styles.timeLabel}>{label}</Text>
          ))}
        </View>
        
        {/* Event Markers */}
        <View style={styles.eventMarkersContainer}>
          <View style={[styles.eventMarker, {left: '10%'}]} />
          <View style={[styles.eventMarker, {left: '30%'}]} />
          <View style={[styles.eventMarker, {left: '50%'}]} />
          <View style={[styles.eventMarker, {left: '65%'}]} />
          <View style={[styles.eventMarker, {left: '70%'}]} />
          <View style={[styles.eventMarker, {left: '90%'}]} />
        </View>
      </View>
      
      {/* Sleep Stages */}
      <View style={styles.sleepStagesContainer}>
        <SleepStageBar 
          stage="Awake" 
          duration="49 min" 
          percentage={8} 
          color={stageColors.awake} 
        />
        <SleepStageBar 
          stage="REM" 
          duration="1 h 26 min" 
          percentage={22} 
          color={stageColors.rem} 
        />
        <SleepStageBar 
          stage="Light" 
          duration="3 h 49 min" 
          percentage={58} 
          color={stageColors.light} 
        />
        <SleepStageBar 
          stage="Deep" 
          duration="1 h 17 min" 
          percentage={20} 
          color={stageColors.deep} 
        />
      </View>
    </View>
  );
};

// New Sleep Detail Card
const SleepDetailCard = () => (
  <View style={styles.cardContainer}>
    <Text style={styles.cardTitle}>Time asleep</Text>
    <SleepGraph />
  </View>
);

// Line Chart Component for future use
const VitalsLineChart = ({ data, color = '#FF6B6B' }) => (
  <View style={styles.chartWrapper}>
    <LineChart
      data={data}
      width={screenWidth - 80}
      height={140}
      hideDataPoints={false}
      spacing={10}
      color={color}
      thickness={2}
      dataPointsColor={color}
      dataPointsRadius={3}
      startFillColor={color}
      startOpacity={0.2}
      endOpacity={0.0}
      hideRules
      hideYAxisText
      hideAxesAndRules
      yAxisThickness={0}
      xAxisThickness={0}
      showXAxisIndices={false}
      showYAxisIndices={false}
      hideOrigin
      disableScroll
      initialSpacing={20}
    />
  </View>
);

// Heart Rate Chart Component
const HeartRateChart = () => {
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(0);
  
  // Time periods for heart rate data
  const timePeriods = [
    'Morning', 'Afternoon', 'Evening', 'Night'
  ];
  
  // Heart rate data sets for each time period
  const heartRateData = [
    // Morning data
    [
      {value: 68, label: '6 AM'},
      {value: 72, label: '7 AM'},
      {value: 76, label: '8 AM'},
      {value: 75, label: '9 AM'},
      {value: 74, label: '10 AM'},
      {value: 78, label: '11 AM'},
      {value: 76, label: '12 PM'},
    ],
    // Afternoon data
    [
      {value: 74, label: '12 PM'},
      {value: 78, label: '1 PM'},
      {value: 82, label: '2 PM'},
      {value: 85, label: '3 PM'},
      {value: 80, label: '4 PM'},
      {value: 76, label: '5 PM'},
      {value: 75, label: '6 PM'},
    ],
    // Evening data
    [
      {value: 76, label: '6 PM'},
      {value: 85, label: '7 PM'},
      {value: 92, label: '8 PM'},
      {value: 88, label: '9 PM'},
      {value: 78, label: '10 PM'},
      {value: 72, label: '11 PM'},
      {value: 70, label: '12 AM'},
    ],
    // Night data
    [
      {value: 65, label: '12 AM'},
      {value: 62, label: '1 AM'},
      {value: 10, label: '2 AM'},
      {value: 58, label: '3 AM'},
      {value: 62, label: '4 AM'},
      {value: 65, label: '5 AM'},
      {value: 68, label: '6 AM'},
    ]
  ];
  
  // Calculate average heart rate for selected time period
  const calculateAverage = (data) => {
    const sum = data.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / data.length);
  };
  
  // Get current heart rate data based on selected time period
  const currentData = heartRateData[selectedTimeIndex];
  const avgHeartRate = calculateAverage(currentData);

  return (
    <View style={styles.heartRateContainer}>
      {/* Time period selection */}
      <View style={styles.timePeriodSelector}>
        {timePeriods.map((period, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.timePeriodButton, 
              selectedTimeIndex === index && styles.selectedTimePeriod
            ]}
            onPress={() => setSelectedTimeIndex(index)}
          >
            <Text 
              style={[
                styles.timePeriodText, 
                selectedTimeIndex === index && styles.selectedTimePeriodText
              ]}
            >
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Heart rate value */}
      <View style={styles.heartRateValue}>
        <Text style={styles.heartRateNumber}>{avgHeartRate}</Text>
        <Text style={styles.heartRateUnit}>BPM</Text>
      </View>
      
      {/* Heart rate chart */}
      <View style={styles.heartRateChartContainer}>
        <LineChart
          data={currentData}
          width={screenWidth}
          height={70}
          hideDataPoints
          spacing={53}
          color="#FF5252"
          thickness={4}
          startFillColor="#FF5252"
          startOpacity={0.15}
          endOpacity={0.0}
          areaChart
          curved
          hideRules
          hideYAxisText
          hideAxesAndRules={false}
          yAxisThickness={0}
          xAxisThickness={0}
          showXAxisIndices={false}
          showYAxisIndices={false}
          hideOrigin
          disableScroll
          initialSpacing={0}
          endSpacing={0}
          hideXAxisText={false}
          xAxisLabelTextStyle={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 12,
            fontFamily: 'ManropeMedium',
            marginTop: 8,
          }}
          xAxisLabelsHeight={25}
          xAxisLabelsVerticalShift={3}
          xAxisLabelsOffset={-5}
          pointerConfig={{
            pointerStripHeight: 0,
            pointerStripWidth: 0,
            pointerStripColor: 'transparent',
            radius: 0,
            pointerLabelWidth: 0,
            pointerLabelHeight: 0,
          }}
        />
      </View>
    </View>
  );
};

// Sleep Metrics Card Section
const SleepMetricsSection = () => (
  <>
    <MetricCard
      icon="bed"
      title="Projected sleep score for tomorrow"
      value="70 Optimal"
      color="#4CAF50"
    />
    <MetricCard
      icon="heart"
      title="Average heart rate"
      value="92bpm"
      color="#FF5252"
      showHeartChart
    />
  </>
);

// Sleep Chart Card Section
const SleepChartCard = ({ data }) => (
  <View style={styles.cardContainer}>
    <ScoreDisplay 
      score="70" 
      label="Average sleep score" 
      status="Optimal" 
    />
    <SleepBarChart data={data} />
  </View>
);

export default function VitalsScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Example marked dates - you can customize this based on your data
  const markedDates = {
    '2024-03-15': {
      dots: [
        { color: '#FF6B6B' },
        { color: '#FF6B6B' },
        { color: '#FF6B6B' }
      ]
    },
    '2024-03-16': {
      dots: [
        { color: '#FF6B6B' },
        { color: '#FF6B6B' }
      ]
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  const barData = [
    {
      value: 70,
      label: 'Mon',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Mon" />,
      topLabelComponent: () => (
        <View style={styles.chartTopLabel}>
          <View style={[styles.legendDot, {backgroundColor: '#4CAF50'}]} />
          <View style={[styles.legendDot, {backgroundColor: '#FFA726'}]} />
          <View style={[styles.legendDot, {backgroundColor: '#EF5350'}]} />
        </View>
      )
    },
    {
      value: 65,
      label: 'Tue',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Tue" />,
    },
    {
      value: 70,
      label: 'Wed',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Wed" />,
    },
    {
      value: 80,
      label: 'Thu',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Thu" />,
    },
    {
      value: 65,
      label: 'Fri',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Fri" />,
    },
    {
      value: 70,
      label: 'Sat',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Sat" />,
    },
    {
      value: 65,
      label: 'Sun',
      frontColor: '#4CAF50',
      labelComponent: () => <DayLabel text="Sun" />,
    }
  ];

  // Example line chart data for future use
  const lineData = [
    {value: 70, dataPointText: 'Mon'},
    {value: 65, dataPointText: 'Tue'},
    {value: 70, dataPointText: 'Wed'},
    {value: 80, dataPointText: 'Thu'},
    {value: 65, dataPointText: 'Fri'},
    {value: 70, dataPointText: 'Sat'},
    {value: 65, dataPointText: 'Sun'},
  ];

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
          {/* Date Selector */}
          <View style={styles.dateContainer}>
            <DateButton onPress={() => setShowCalendar(true)} />
          </View>

          {/* Projected Sleep Score Card */}
          <MetricCard
            icon="bed"
            title="Projected sleep score for tomorrow"
            value="70 Optimal"
            color="#4CAF50"
          />

          {/* New Sleep Detail Card */}
          <SleepDetailCard />

          {/* Sleep Chart Card (original - now hidden) */}
          {/* <SleepChartCard data={barData} /> */}

          {/* Average Heart Rate Card */}
          <MetricCard
            icon="heart"
            title="Average heart rate"
            value="92bpm"
            color="#FF5252"
            showHeartChart
          />

          {/* Example of how to use the line chart (commented out) */}
          {/* <View style={styles.cardContainer}>
            <ScoreDisplay 
              score="78" 
              label="Weekly heart rate" 
              status="Normal" 
              color="#FF6B6B" 
            />
            <VitalsLineChart data={lineData} color="#FF6B6B" />
          </View> */}
          
        </Animated.ScrollView>
        <AIFloatingButton scrollY={scrollY} />
        <NavBar currentScreen="vitals" />

        <CalendarModal
          visible={showCalendar}
          onClose={() => setShowCalendar(false)}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          markedDates={markedDates}
        />
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
    paddingBottom: 90,
  },
  scrollView: {
    flex: 1, 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 20,
  },
  dateContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardContainer: {
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ManropeBold',
    marginBottom: 8,
  },
  chartWrapper: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontFamily: 'ManropeMedium',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#4CAF50',
    fontSize: 48,
    fontFamily: 'ManropeBold',
    marginBottom: 5,
  },
  scoreStatus: {
    color: '#4CAF50',
    fontSize: 16,
    fontFamily: 'ManropeMedium',
  },
  chartTopLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  dayLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontFamily: 'ManropeMedium',
    marginTop: 6,
    textAlign: 'center',
  },
  metricCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricIcon: {
    marginRight: 8,
  },
  metricTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'ManropeBold',
  },
  xAxisText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontFamily: 'ManropeMedium',
    marginTop: 8,
  },
  // Sleep Graph Styles
  sleepGraphContainer: {
    width: '100%',
  },
  timeContainer: {
    marginBottom: 15,
  },
  timeValueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeValue: {
    color: 'white',
    fontSize: 38,
    fontFamily: 'ManropeBold',
  },
  timeUnit: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ManropeMedium',
    marginBottom: 8,
    marginRight: 4,
  },
  timeSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    marginTop: 4,
  },
  sleepGraphWrapper: {
    height: 150,
    marginBottom: 20,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  sleepGraph: {
    flexDirection: 'row',
    height: 70,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sleepBar: {
    width: 5,
    marginHorizontal: 2,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  timeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: 'ManropeMedium',
  },
  eventMarkersContainer: {
    position: 'relative',
    height: 30,
    marginTop: 10,
  },
  eventMarker: {
    position: 'absolute',
    height: 15,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  sleepStagesContainer: {
    marginTop: 10,
  },
  sleepStageContainer: {
    marginBottom: 10,
  },
  sleepStageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sleepStageName: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    flex: 1,
  },
  sleepStageDuration: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    marginRight: 10,
  },
  sleepStagePercentage: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    width: 40,
    textAlign: 'right',
  },
  sleepStageBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
  },
  sleepStageBarFill: {
    height: 8,
    borderRadius: 4,
  },
  heartRateContainer: {
    width: '100%',
    marginTop: 4,
  },
  timePeriodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timePeriodButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  selectedTimePeriod: {
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  timePeriodText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontFamily: 'ManropeMedium',
  },
  selectedTimePeriodText: {
    color: '#FF5252',
  },
  heartRateValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  heartRateNumber: {
    color: '#FF5252',
    fontSize: 28,
    fontFamily: 'ManropeBold',
  },
  heartRateUnit: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'ManropeMedium',
    marginLeft: 4,
  },
  heartRateChartContainer: {
    height: 80,
    width: '100%',
    marginHorizontal: -8,
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  expandedMetricCard: {
    paddingBottom: 16,
  },
}); 