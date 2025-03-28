//Welcome Screen

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  // Animation value for the logo
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  
  useEffect(() => {
    // Start the animation when the component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
    
    // After 3 seconds, automatically navigate to the login screen
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={[
          styles.logoContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Hygieia</Text>
        <Text style={styles.tagline}>Your Personal Health Guardian</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    ...Typography.largeTitle,
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    ...Typography.subtitle,
    color: 'white',
    opacity: 0.8,
  },
}); 