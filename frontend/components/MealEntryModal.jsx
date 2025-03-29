import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

const MealEntryModal = ({ visible, onClose, onSave, selectedDate }) => {
  const [mealType, setMealType] = useState('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  
  // Sample food database - in a real app this would come from an API or local database
  const foodDatabase = [
    { id: 1, name: 'Oatmeal', calories: 150, protein: 6, carbs: 27, fat: 2.5 },
    { id: 2, name: 'Scrambled Eggs', calories: 140, protein: 12, carbs: 1, fat: 10 },
    { id: 3, name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { id: 4, name: 'Protein Shake', calories: 180, protein: 25, carbs: 8, fat: 3 },
    { id: 5, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { id: 6, name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
    { id: 7, name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6 },
    { id: 8, name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13 },
    { id: 9, name: 'Greek Yogurt', calories: 130, protein: 12, carbs: 8, fat: 4 },
    { id: 10, name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14 },
    { id: 11, name: 'Sweet Potato', calories: 114, protein: 2, carbs: 27, fat: 0.1 },
    { id: 12, name: 'Quinoa', calories: 222, protein: 8, carbs: 39, fat: 3.6 },
    { id: 13, name: 'Avocado', calories: 234, protein: 3, carbs: 12, fat: 21 },
    { id: 14, name: 'Whey Protein', calories: 113, protein: 25, carbs: 2, fat: 1 },
    { id: 15, name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  ];
  
  // Filter foods based on search query
  const filteredFoods = searchQuery 
    ? foodDatabase.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : foodDatabase;
  
  // Add food to selected foods
  const addFood = (food) => {
    setSelectedFoods([...selectedFoods, { ...food, quantity: 1 }]);
  };
  
  // Remove food from selected foods
  const removeFood = (foodId) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== foodId));
  };
  
  // Update food quantity
  const updateQuantity = (foodId, quantity) => {
    setSelectedFoods(selectedFoods.map(food => 
      food.id === foodId ? { ...food, quantity } : food
    ));
  };
  
  // Calculate total calories
  const totalCalories = selectedFoods.reduce(
    (sum, food) => sum + (food.calories * food.quantity), 0
  );
  
  // Calculate total macros
  const totalProtein = selectedFoods.reduce(
    (sum, food) => sum + (food.protein * food.quantity), 0
  );
  
  const totalCarbs = selectedFoods.reduce(
    (sum, food) => sum + (food.carbs * food.quantity), 0
  );
  
  const totalFat = selectedFoods.reduce(
    (sum, food) => sum + (food.fat * food.quantity), 0
  );
  
  // Save meal
  const handleSave = () => {
    // Create a meal object with all the selected foods
    const meal = {
      id: Date.now(), // use timestamp as unique ID
      type: mealType,
      foods: selectedFoods,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: selectedDate
    };
    
    onSave(meal);
    resetForm();
    onClose();
  };
  
  // Reset form
  const resetForm = () => {
    setMealType('Breakfast');
    setSearchQuery('');
    setSelectedFoods([]);
  };
  
  // Meal type options
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView 
          intensity={40} 
          tint="dark" 
          style={StyleSheet.absoluteFill} 
        />
        <LinearGradient
          colors={['rgba(195, 43, 43, 0.4)', "rgba(0, 0, 0, 0.5)", 'rgba(164, 158, 244, 0.4)']}
          style={styles.mealModalContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.mealModalHeader}>
            <Text style={styles.mealModalTitle}>Add Meal</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mealContent}>
            {/* Meal Type Selection */}
            <View style={styles.mealTypeContainer}>
              <Text style={styles.mealTypeLabel}>Meal Type:</Text>
              <View style={styles.mealTypeButtonsRow}>
                {mealTypes.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.mealTypeButton,
                      mealType === type && styles.mealTypeButtonActive
                    ]}
                    onPress={() => setMealType(type)}
                  >
                    <Text 
                      style={[
                        styles.mealTypeButtonText,
                        mealType === type && styles.mealTypeButtonTextActive
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search food..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            {/* Food Results */}
            <View style={styles.foodResultsContainer}>
              <Text style={styles.foodDatabaseLabel}>Food Database:</Text>
              <FlatList
                data={filteredFoods}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.foodItemRow}>
                    <View>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                      <Text style={styles.foodItemInfo}>
                        {item.calories} Cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addFoodButton}
                      onPress={() => addFood(item)}
                    >
                      <View style={styles.addFoodButtonInner}>
                        <Ionicons name="add" size={24} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                style={styles.foodList}
                showsVerticalScrollIndicator={false}
              />
            </View>
            
            {/* Selected Foods */}
            {selectedFoods.length > 0 && (
              <View style={styles.selectedFoodsSection}>
                <Text style={styles.selectedFoodsLabel}>Selected Foods:</Text>
                <View style={styles.selectedFoodsList}>
                  {selectedFoods.map((food, index) => (
                    <LinearGradient
                      key={food.id}
                      colors={['rgba(80, 30, 30, 0.4)', 'rgba(60, 25, 25, 0.5)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.selectedFoodCard, 
                        index === 0 ? { marginTop: 4 } : null,
                        index === selectedFoods.length - 1 ? { marginBottom: 4 } : null
                      ]}
                    >
                      <View style={styles.selectedFoodItem}>
                        <View style={styles.selectedFoodInfo}>
                          <Text style={styles.selectedFoodName}>{food.name}</Text>
                          <Text style={styles.selectedFoodCalories}>
                            {food.calories * food.quantity} Cal
                          </Text>
                        </View>
                        <View style={styles.quantityControls}>
                          <TouchableOpacity
                            onPress={() => updateQuantity(food.id, Math.max(1, food.quantity - 1))}
                            style={styles.quantityButton}
                          >
                            <Ionicons name="remove" size={18} color="white" />
                          </TouchableOpacity>
                          <Text style={styles.quantityText}>{food.quantity}</Text>
                          <TouchableOpacity
                            onPress={() => updateQuantity(food.id, food.quantity + 1)}
                            style={styles.quantityButton}
                          >
                            <Ionicons name="add" size={18} color="white" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => removeFood(food.id)}
                            style={styles.removeButton}
                          >
                            <Ionicons name="trash-outline" size={18} color="rgba(255,107,107,0.8)" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  ))}
                </View>
                
                <LinearGradient
                  colors={['rgba(80, 20, 20, 0.4)', 'rgba(60, 15, 15, 0.5)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.macroSummaryContainer}
                >
                  <Text style={styles.macroSummaryTitle}>Meal Summary</Text>
                  
                  <View style={styles.macroRow}>
                    <Text style={styles.macroLabel}>Calories:</Text>
                    <Text style={styles.macroValue}>{totalCalories} Cal</Text>
                  </View>
                  
                  <View style={styles.macroRow}>
                    <Text style={styles.macroLabel}>Protein:</Text>
                    <Text style={styles.macroValue}>{totalProtein.toFixed(1)}g</Text>
                  </View>
                  
                  <View style={styles.macroRow}>
                    <Text style={styles.macroLabel}>Carbs:</Text>
                    <Text style={styles.macroValue}>{totalCarbs.toFixed(1)}g</Text>
                  </View>
                  
                  <View style={styles.macroRow}>
                    <Text style={styles.macroLabel}>Fat:</Text>
                    <Text style={styles.macroValue}>{totalFat.toFixed(1)}g</Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>
          
          {/* Save Button */}
          <View style={styles.saveButtonContainer}>
            <LinearGradient
              colors={['rgba(195, 43, 43, 0.6)', 'rgba(120, 30, 30, 0.6)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.saveMealButton,
                !selectedFoods.length && styles.saveMealButtonDisabled
              ]}
            >
              <TouchableOpacity
                onPress={handleSave}
                disabled={!selectedFoods.length}
                style={styles.saveMealButtonTouch}
              >
                <Text style={styles.saveMealButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealModalContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  mealModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mealModalTitle: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  closeButton: {
    padding: 5,
  },
  mealContent: {
    flex: 1,
    padding: 16,
  },
  mealTypeContainer: {
    marginBottom: 16,
  },
  mealTypeLabel: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginBottom: 10,
  },
  mealTypeButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    minWidth: '22%',
    alignItems: 'center',
  },
  mealTypeButtonActive: {
    backgroundColor: 'rgba(195, 43, 43, 0.7)',
  },
  mealTypeButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'ManropeMedium',
    fontSize: 14,
  },
  mealTypeButtonTextActive: {
    color: 'white',
    fontFamily: 'ManropeSemiBold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: 'white',
    marginLeft: 10,
    fontFamily: 'Manrope',
    fontSize: 16,
  },
  foodResultsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  foodDatabaseLabel: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginBottom: 10,
  },
  foodList: {
    height: 200,
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  foodItemName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ManropeSemiBold',
  },
  foodItemInfo: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'Manrope',
    marginTop: 2,
  },
  addFoodButton: {
    padding: 4,
  },
  addFoodButtonInner: {
    backgroundColor: 'rgba(195, 43, 43, 0.7)',
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFoodsSection: {
    marginTop: 16,
  },
  selectedFoodsLabel: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    marginBottom: 10,
  },
  selectedFoodsList: {
    //backgroundColor: 'rgba(40, 20, 20, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 1,
    paddingVertical: 4,
    marginBottom: 12,
    //borderWidth: 1,
    //borderColor: 'rgba(195, 43, 43, 0.15)',
  },
  selectedFoodCard: {
    borderRadius: 12,
    marginVertical: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(195, 43, 43, 0.2)',
    shadowColor: "rgba(195, 43, 43, 0.3)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  selectedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  selectedFoodInfo: {
    flex: 1,
  },
  selectedFoodName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ManropeSemiBold',
  },
  selectedFoodCalories: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: 'Manrope',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityText: {
    color: 'white',
    fontFamily: 'ManropeMedium',
    marginHorizontal: 6,
    fontSize: 14,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Slightly more vivid
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  macroSummaryContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  macroSummaryTitle: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'ManropeSemiBold',
    marginBottom: 10,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  macroLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'ManropeMedium',
    fontSize: 14,
  },
  macroValue: {
    color: 'white',
    fontFamily: 'ManropeSemiBold',
    fontSize: 14,
  },
  saveButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  saveMealButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '50%',
    backgroundColor: 'rgba(195, 43, 43, 0.7)',
    shadowRadius: 5,
    elevation: 5,
  },
  saveMealButtonTouch: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveMealButtonDisabled: {
    opacity: 0.5
  },
  saveMealButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'ManropeSemiBold',
  },
});

export default MealEntryModal; 