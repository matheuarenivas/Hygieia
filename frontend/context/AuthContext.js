import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import supabase from '../lib/supabaseClient';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithApple, 
  signOut as logOut,
  getCurrentUser
} from '../lib/supabaseService';

// Create the authentication context
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  googleSignIn: async () => {},
  appleSignIn: async () => {},
  signOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Listen for auth state changes when the component mounts
  useEffect(() => {
    setLoading(true);
    
    // Check if there's an active session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking session:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        setUser(newSession?.user || null);
        setLoading(false);
      }
    );
    
    // Cleanup the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        Alert.alert('Sign In Error', error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      Alert.alert('Sign In Error', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Sign Up Error', error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      Alert.alert('Sign Up Error', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with Google
  const googleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Google Sign In Error', error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      Alert.alert('Google Sign In Error', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in with Apple
  const appleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await signInWithApple();
      
      if (error) {
        Alert.alert('Apple Sign In Error', error.message);
        return { error };
      }
      
      return { data };
    } catch (error) {
      Alert.alert('Apple Sign In Error', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await logOut();
      
      if (error) {
        Alert.alert('Sign Out Error', error.message);
        return { error };
      }
      
      return { success: true };
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };
  
  // Value to be provided by the context
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    googleSignIn,
    appleSignIn,
    signOut,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 