import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography, Layouts, Buttons } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

export default function UserInfoScreen() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);

  const goals = [
    { id: 'weight_gain', title: 'Muscle gain', icon: 'fitness-outline', color: '#4FD1C5' },
    { id: 'weight_loss', title: 'Weight loss', icon: 'body-outline', color: '#FBD38D' },
    { id: 'calorie_management', title: 'Calorie tracking', icon: 'calculator-outline', color: '#FBD38D' },
    { id: 'sleep_tracking', title: 'Sleep tracking', icon: 'bed-outline', color: '#4FD1C5' }
  ];

  const handleGoalSelect = (goalId) => {
    // Allow multiple selections but prevent weight_gain and weight_loss from being selected together
    setSelectedGoals(prev => {
      // If already selected, remove it
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } 
      
      // If adding weight_gain, remove weight_loss if it exists
      if (goalId === 'weight_gain' && prev.includes('weight_loss')) {
        return [...prev.filter(id => id !== 'weight_loss'), goalId];
      }
      
      // If adding weight_loss, remove weight_gain if it exists
      if (goalId === 'weight_loss' && prev.includes('weight_gain')) {
        return [...prev.filter(id => id !== 'weight_gain'), goalId];
      }
      
      // Otherwise just add to selections
      return [...prev, goalId];
    });
  };

  const handleSave = () => {
    // In the future, this would save to Supabase
    const heightInInches = (parseInt(feet || 0) * 12) + parseInt(inches || 0);
    console.log('Saving user info:', { name, age, height: heightInInches, weight, goals: selectedGoals });
    
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
        <View style={styles.content}>
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
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your name"
                  placeholderTextColor={Colors.dark.gray}
                />
              </View>
              
              <View style={[styles.inputGroup, styles.halfWidth]}>
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
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, {width: '30%'}]}>
                <Text style={styles.label}>Height (ft)</Text>
                <TextInput 
                  style={styles.input}
                  value={feet}
                  onChangeText={setFeet}
                  placeholder="5"
                  placeholderTextColor={Colors.dark.gray}
                  keyboardType="numeric"
                  maxLength={1}
                />
              </View>
              
              <View style={[styles.inputGroup, {width: '30%'}]}>
                <Text style={styles.label}>Inches</Text>
                <TextInput 
                  style={styles.input}
                  value={inches}
                  onChangeText={setInches}
                  placeholder="10"
                  placeholderTextColor={Colors.dark.gray}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={[styles.inputGroup, {width: '30%'}]}>
                <Text style={styles.label}>Weight (lbs)</Text>
                <TextInput 
                  style={styles.input}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="160"
                  placeholderTextColor={Colors.dark.gray}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.labelHeading}>Health Goals</Text>
              <View style={styles.goalsGrid}>
                {goals.map((goal) => (
                  <TouchableOpacity
                    key={goal.id}
                    style={[
                      styles.goalCard,
                      selectedGoals.includes(goal.id) && styles.selectedGoalCard
                    ]}
                    onPress={() => handleGoalSelect(goal.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconContainer, {backgroundColor: selectedGoals.includes(goal.id) ? goal.color : 'transparent'}]}>
                      <Ionicons name={goal.icon} size={28} color={selectedGoals.includes(goal.id) ? '#1A202C' : goal.color} />
                    </View>
                    <Text style={styles.goalTitle}>{goal.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save and Continue</Text>
            </Pressable>
            
            <Pressable onPress={() => router.push('/home')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    ...Typography.title,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    color: 'white',
  },
  subtitle: {
    ...Typography.subtitle,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  formContainer: {
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    ...Typography.label,
    fontSize: 13,
    marginBottom: 4,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 10,
    color: Colors.dark.text,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    height: 40,
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
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    ...Typography.buttonText,
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  skipText: {
    ...Typography.link,
    fontSize: 14,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    padding: 10,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  goalCard: {
    width: '48%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 120,
    justifyContent: 'center',
  },
  selectedGoalCard: {
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
  },
  iconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ManropeMedium',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
  },
  labelHeading: {
    ...Typography.label,
    fontSize: 18,
    marginBottom: 12,
    color: 'white',
    fontWeight: 'bold',
  },
}); 