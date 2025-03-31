import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';

// Create a global variable to control the menu visibility
let menuVisible = false;
let setMenuVisibleCallback = null;

// Function to show the menu - can be called from any component
export const showMenu = () => {
  if (setMenuVisibleCallback) {
    setMenuVisibleCallback(true);
  } else {
    menuVisible = true;
  }
};

// Function to hide the menu - can be called from any component
export const hideMenu = () => {
  if (setMenuVisibleCallback) {
    setMenuVisibleCallback(false);
  } else {
    menuVisible = false;
  }
};

const SideMenu = ({ isVisible = false, onClose }) => {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width } = Dimensions.get('window');
  
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);
  
  const menuItems = [
    { id: 'profile', title: 'Profile', icon: 'person-outline', route: '/userinfo' },
    { id: 'nutrition', title: 'Nutrition', icon: 'leaf-outline', route: '/nutrition' },
    { id: 'vitals', title: 'Vitals', icon: 'fitness-outline', route: '/vitals' },
    { id: 'workout', title: 'Workout', icon: 'barbell-outline', route: '/workout' },
    { id: 'sleep', title: 'Sleep', icon: 'moon-outline', route: '/sleep' },
    { id: 'stats', title: 'Statistics', icon: 'stats-chart-outline', route: '/stats' },
    { id: 'settings', title: 'Settings', icon: 'settings-outline', route: '/settings' },
    { id: 'logout', title: 'Logout', icon: 'log-out-outline' }
  ];

  const handleNavigation = (item) => {
    onClose();
    if (item.id === 'logout') {
      // Handle logout logic
      console.log('Logging out...');
      // Example: auth.signOut();
    } else if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalBackground,
            { opacity: fadeAnim }
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={{ width: '100%', height: '100%' }} />
          </TouchableWithoutFeedback>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          <View style={styles.menuHeader}>
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.menuLogo}
              resizeMode="contain"
            />
            <Text style={styles.menuTitle}>Hygieia</Text>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.menuDivider} />
          
          <View style={styles.menuContent}>
            {menuItems.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                onPress={() => handleNavigation(item)}
              >
                <Ionicons name={item.icon} size={22} color="white" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// MenuProvider component that will wrap the app
export const MenuProvider = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(menuVisible);
  
  // Register the setIsVisible callback with the global setter
  React.useEffect(() => {
    setMenuVisibleCallback = setIsVisible;
    return () => {
      setMenuVisibleCallback = null;
    };
  }, []);
  
  return (
    <>
      {children}
      <SideMenu isVisible={isVisible} onClose={() => setIsVisible(false)} />
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50, // Extra padding for status bar
    position: 'relative',
  },
  menuLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 24,
    fontFamily: 'ManropeBold',
    color: 'white',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
  },
  menuContent: {
    paddingVertical: 20,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'ManropeMedium',
    color: 'white',
    marginLeft: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SideMenu; 