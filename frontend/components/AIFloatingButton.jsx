import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AIFloatingButton = ({ scrollY = new Animated.Value(0) }) => {
  const router = useRouter();
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const visibilityAnim = useRef(new Animated.Value(1)).current;
  const showButtonTimeout = useRef(null);

  // Start the glowing animation when component mounts
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Add button press animation
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Navigate to AI page
  const navigateToAI = () => {
    router.push('/ai');
  };

  // Hide button when scrolling, show when idle
  useEffect(() => {
    const hideButton = () => {
      Animated.timing(visibilityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Clear any existing timeout
      if (showButtonTimeout.current) {
        clearTimeout(showButtonTimeout.current);
      }
      
      // Set timeout to show button after scrolling stops
      showButtonTimeout.current = setTimeout(() => {
        Animated.timing(visibilityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 1500);
    };
    
    // Set up listener for scroll
    const scrollListener = scrollY.addListener(({ value }) => {
      if (value > 5) {
        hideButton();
      }
    });
    
    return () => {
      scrollY.removeListener(scrollListener);
      if (showButtonTimeout.current) {
        clearTimeout(showButtonTimeout.current);
      }
    };
  }, []);

  // Shadow glow animation
  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.8],
  });
  
  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 20],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: visibilityAnim,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: shadowOpacity,
            shadowRadius: shadowRadius,
          },
        ]}
      />
      <Pressable
        style={styles.button}
        onPress={navigateToAI}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <MaterialCommunityIcons name="brain" size={30} color="white" />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120, // Above the navbar
    right: 30,
    zIndex: 1000,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  glow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0C0C0C',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 0 },
    opacity: 0.5,
  },
});

export default AIFloatingButton; 