import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Image, Keyboard } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../constants/Styles';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock AI responses for demo purposes
const mockResponses = [
  "Based on your recent health data, I recommend increasing your water intake to at least 8 glasses per day.",
  "Your sleep patterns show improvement over the last week. Keep maintaining a consistent sleep schedule.",
  "I notice your step count has decreased. Try to aim for at least 8,000 steps daily for cardiovascular health.",
  "Your nutritional data shows you could benefit from adding more leafy greens to your diet.",
  "Your heart rate readings are within normal range. Keep up the good work with your exercise routine!"
];

export default function AIScreen() {
  const router = useRouter();
  // Create animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your health AI assistant. Ask me anything about your health data or for personalized recommendations.", sender: 'ai', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const textInputRef = useRef(null);

  // Add state to track if user has sent at least one message
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);

  // Focus the input field when component mounts
  useEffect(() => {
    // Short delay to ensure the keyboard shows after animation
    const timer = setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    // Set flag that user has sent at least one message (to hide prompt)
    setHasUserSentMessage(true);
    
    setMessages([...messages, userMessage]);
    setInputText('');
    
    // Dismiss keyboard after sending
    Keyboard.dismiss();
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderMessage = (message) => {
    const isAI = message.sender === 'ai';
    
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageBubble,
          isAI ? styles.aiMessage : styles.userMessage
        ]}
      >
        {isAI && (
          <View style={styles.aiIconContainer}>
            <MaterialCommunityIcons name="brain" size={20} color="white" />
          </View>
        )}
        <View style={[
          styles.messageContent,
          isAI ? styles.aiMessageContent : styles.userMessageContent
        ]}>
          <Text style={[
            styles.messageText,
            !isAI && styles.userMessageText
          ]}>{message.text}</Text>
        </View>
      </View>
    );
  };

  // Add animated value for header background opacity
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.mainContainer}>
        {/* Add animated header background */}
        <Animated.View
          style={[
            styles.headerBackground,
            {
              opacity: headerBgOpacity,
            },
          ]}
        />
        <View style={styles.customHeader}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.headerLogoContainer}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>Hygieia</Text>
            </View>
            <Text style={styles.openaiTextHeader}>Powered by OpenAI</Text>
          </View>
          <View style={{width: 40}} key="spacer" />
        </View>
        
        {/* Only show this prompt if user hasn't sent any messages */}
        {!hasUserSentMessage && (
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="star-four-points" size={32} color="white" style={styles.starIcon} />
            <Text style={styles.askTitle}>Ask our AI anything</Text>
          </View>
        )}
        
        <Animated.ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            !hasUserSentMessage && { 
              justifyContent: 'flex-end',
              paddingTop: 180 // Less padding when no messages
            }
          ]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={[
            styles.messagesContainer,
            !hasUserSentMessage && { flex: 1, justifyContent: 'flex-end' }
          ]}>
            {messages.map(message => renderMessage(message))}
            
            {isTyping && (
              <View style={[styles.messageBubble, styles.aiMessage]}>
                <View style={styles.aiIconContainer}>
                  <MaterialCommunityIcons name="brain" size={20} color="white" />
                </View>
                <View style={[styles.messageContent, styles.aiMessageContent]}>
                  <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.typingText}>Thinking...</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </Animated.ScrollView>
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? -25 : -25}
          style={styles.inputArea}
        >
          <View style={[
            styles.inputContainer, 
            { marginBottom: insets.bottom > 0 ? insets.bottom : 16 }
          ]}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Ask me anything about your health"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
              maxLength={500}
              autoFocus={true}
              blurOnSubmit={false}
            />
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={handleSend}
              disabled={inputText.trim() === ''}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={inputText.trim() === '' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.9)'} 
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 170, // Default padding for all states
    paddingBottom: 120,
  },
  centerContent: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  starIcon: {
    marginBottom: 8,
  },
  askTitle: {
    ...Typography.heading2,
    color: 'white',
    textAlign: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 100, // Ensure there's always scrollable area
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  aiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(12, 12, 12, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '90%',
    overflow: 'hidden',
  },
  aiMessageContent: {
    backgroundColor: 'rgba(12, 12, 12, 0.7)',
    borderTopLeftRadius: 4,
  },
  userMessageContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Manrope',
    color: 'white',
  },
  userMessageText: {
    color: '#000000',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Manrope',
    color: 'white',
    opacity: 0.8,
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(12, 12, 12, 0.5)', // Add slight background to ensure contrast
    paddingTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    color: 'white',
    fontFamily: 'Manrope',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 25,
    paddingHorizontal: 16,
    paddingBottom: 10,
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(12, 12, 12, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerTitle: {
    ...Typography.heading3,
    fontFamily: 'ManropeBold',
    color: 'white',
  },
  openaiTextHeader: {
    fontSize: 10,
    fontFamily: 'Manrope',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 110 : 85,
    backgroundColor: Colors.dark.background,
    zIndex: 5,
  },
}); 