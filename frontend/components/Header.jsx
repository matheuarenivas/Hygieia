import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { showMenu } from './SideMenu';

export default function Header({ scrollY = new Animated.Value(0), title, showMenuButton = true }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  
  // Convert the current path to a title if not provided
  const screenTitle = title || 
                      (pathname === '/home' ? 'Home' : 
                       pathname === '/nutrition' ? 'Nutrition' : 
                       pathname === '/vitals' ? 'Vitals' :
                       pathname === '/userinfo' ? 'Profile' :
                       pathname === '/ai' ? 'AI Assistant' : 'Hygieia');

  // Animated values for header background opacity and title opacity
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleOpenMenu = () => {
    // Use the global showMenu function
    showMenu();
  };

  return (
    <Animated.View 
      style={[
        styles.headerContainer, 
        { paddingTop: insets.top },
        { backgroundColor: headerBgOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: ['transparent', '#000000']
        })}
      ]}
    >
      <View style={styles.headerContent}>
        {showMenuButton && (
          <Pressable style={styles.menuButton} onPress={handleOpenMenu}>
            <Ionicons name="menu" size={24} color="white" />
          </Pressable>
        )}
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.titleText}>{screenTitle}</Text>
        </View>
        
        <View style={styles.rightPlaceholder} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  titleText: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    color: 'white',
  },
  rightPlaceholder: {
    width: 40,
  }
}); 