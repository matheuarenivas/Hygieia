import React from 'react';
import { Text } from 'react-native';
import { 
  useFonts, 
  Manrope_200ExtraLight,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold
} from '@expo-google-fonts/manrope';
import { SplashScreen } from 'expo-router';

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

export default function FontProvider({ children }) {
  const [fontsLoaded, fontError] = useFonts({
    ManropeExtraLight: Manrope_200ExtraLight,
    ManropeLight: Manrope_300Light,
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    ManropeExtraBold: Manrope_800ExtraBold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If the fonts aren't loaded and there's no error, return null
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Override Text component to use Manrope by default
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { 
    fontFamily: 'Manrope',
    ...(Text.defaultProps?.style || {})
  };

  return children;
} 