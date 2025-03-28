import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Styles';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NavBar({ currentScreen = 'home' }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateTo = (screen) => {
    router.push(`/${screen}`);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Pressable
        style={styles.navItem}
        onPress={() => navigateTo('home')}
      >
        <Ionicons 
          name="sunny" 
          size={24} 
          color={currentScreen === 'home' ? Colors.dark.tint : Colors.dark.icon}
        />
        <Text 
          style={[
            styles.navText, 
            currentScreen === 'home' && styles.activeText
          ]}
        >
          Today
        </Text>
        {currentScreen === 'home' && <View style={styles.activeDot} />}
      </Pressable>
      <Pressable
        style={styles.navItem}
        onPress={() => navigateTo('nutrition')}
      >
        <MaterialCommunityIcons 
          name="leaf" 
          size={24} 
          color={currentScreen === 'nutrition' ? Colors.dark.tint : Colors.dark.icon}
        />
        <Text 
          style={[
            styles.navText, 
            currentScreen === 'nutrition' && styles.activeText
          ]}
        >
          Nutrition
        </Text>
        {currentScreen === 'nutrition' && <View style={styles.activeDot} />}
      </Pressable>
      <Pressable
        style={styles.navItem}
        onPress={() => navigateTo('vitals')}
      >
        <FontAwesome 
          name="heartbeat" 
          size={24} 
          color={currentScreen === 'vitals' ? Colors.dark.tint : Colors.dark.icon}
        />
        <Text 
          style={[
            styles.navText, 
            currentScreen === 'vitals' && styles.activeText
          ]}
        >
          Vitals
        </Text>
        {currentScreen === 'vitals' && <View style={styles.activeDot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 90,
    backgroundColor: 'rgba(12, 12, 12, 0.04)',
    borderTopWidth: 1,
    borderTopColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  activeDot: {
    width: 3,
    height: 3,
    borderRadius: 2.5,
    backgroundColor: Colors.dark.tint,
    marginTop: 3,
  },
  navText: {
    ...Typography.navLabel,
    color: Colors.dark.icon,
  },
  activeText: {
    color: Colors.dark.tint,
  }
}); 