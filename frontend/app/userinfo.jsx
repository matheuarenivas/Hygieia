import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, SafeAreaView, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography, Layouts, Buttons } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserInfoScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');

  const handleSave = () => {
    // In the future, this would save to Supabase
    console.log('Saving user info:', { name, age, height, weight, goal });
    
    // For now, just navigate to home
    router.push('/home');
  };

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Tell Us About Yourself</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience</Text>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.dark.gray}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput 
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Your age"
                placeholderTextColor={Colors.dark.gray}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Height (cm)</Text>
                <TextInput 
                  style={styles.input}
                  value={height}
                  onChangeText={setHeight}
                  placeholder="175"
                  placeholderTextColor={Colors.dark.gray}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Weight (kg)</Text>
                <TextInput 
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="70"
                  placeholderTextColor={Colors.dark.gray}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Health Goal</Text>
              <TextInput 
                style={[styles.input, styles.multilineInput]}
                value={goal}
                onChangeText={setGoal}
                placeholder="What would you like to achieve?"
                placeholderTextColor={Colors.dark.gray}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
          
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save and Continue</Text>
          </Pressable>
          
          <Pressable onPress={() => router.push('/home')}>
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    ...Typography.title,
    textAlign: 'center',
    marginTop: 10,
    color: 'white',
  },
  subtitle: {
    ...Typography.subtitle,
    textAlign: 'center',
    marginBottom: 30,
    color: 'rgba(255,255,255,0.7)',
  },
  formContainer: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    ...Typography.label,
    marginBottom: 8,
    color: 'white',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 15,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  saveButton: {
    ...Buttons.primary,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  saveButtonText: {
    ...Typography.buttonText,
    color: '#FFF',
  },
  skipText: {
    ...Typography.link,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
  }
}); 