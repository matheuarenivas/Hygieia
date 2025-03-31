import React from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

// Create a context to hold the theme
export const ThemeContext = React.createContext({
  theme: 'dark',
  colors: Colors.dark,
});

export function ThemeProvider({ children }) {
  // Force dark theme regardless of system setting
  const colorScheme = 'dark';
  
  // Set the theme values
  const theme = {
    theme: colorScheme,
    colors: Colors[colorScheme],
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 