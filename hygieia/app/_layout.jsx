import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../components/ThemeProvider';
import FontProvider from '../components/FontProvider';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { MenuProvider } from '../components/SideMenu';
// import { AuthProvider } from '../context/AuthContext';

export default function Layout() {
  return (
    <FontProvider>
      <ThemeProvider>
        {/* <AuthProvider> */}
          <MenuProvider>
            <View style={styles.container}>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: Colors.dark.background,
                  },
                  headerTintColor: Colors.dark.text,
                  headerTitleStyle: {
                    color: Colors.dark.text,
                    fontFamily: 'ManropeMedium',
                  },
                  contentStyle: {
                    backgroundColor: Colors.dark.background,
                  },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="userinfo" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
                <Stack.Screen name="nutrition" options={{ headerShown: false }} />
                <Stack.Screen name="vitals" options={{ headerShown: false }} />
                <Stack.Screen name="ai" options={{ headerShown: false }} />
              </Stack>
            </View>
          </MenuProvider>
        {/* </AuthProvider> */}
      </ThemeProvider>
    </FontProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
}); 