import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Typography, Layouts, Buttons } from '../constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
// import { useAuth } from '../context/AuthContext';

// Custom Google SVG component for colorful logo
const GoogleColorfulLogo = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <Path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <Path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <Path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </Svg>
  );
};

export default function LoginScreen() {
  // const { googleSignIn, appleSignIn, user, loading } = useAuth();

  // // Redirect to home if user is already authenticated
  // useEffect(() => {
  //   if (user && !loading) {
  //     router.replace('/home');
  //   }
  // }, [user, loading]);

  const handleGoogleSignIn = () => {
    console.log('Google sign-in');
    // Uncomment when Supabase is set up
    // try {
    //   const { data, error } = await googleSignIn();
    //   if (!error && data) {
    //     router.replace('/home');
    //   }
    // } catch (error) {
    //   console.error('Error with Google sign-in:', error);
    // }
  };

  const handleAppleSignIn = () => {
    console.log('Apple sign-in');
    // Uncomment when Supabase is set up
    // try {
    //   const { data, error } = await appleSignIn();
    //   if (!error && data) {
    //     router.replace('/home');
    //   }
    // } catch (error) {
    //   console.error('Error with Apple sign-in:', error);
    // }
  };

  const navigateToUserInfo = () => {
    router.push('/userinfo');
  };

  // // Show loading state if auth is being checked
  // if (loading) {
  //   return (
  //     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
  //       <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
  //     </View>
  //   );
  // }

  return (
    <LinearGradient
      colors={['#C32B2B', "#000000", '#A49EF4']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.contentWrapper}>
        <View style={styles.blackBox}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.appName}>Hygieia</Text>
            </View>

            <View style={styles.quoteContainer}>
              <Text style={styles.quoteText}>
                The first wealth is health.
              </Text>
            </View>

            <Text style={styles.subtitle}>
              Create an account or try a demo to explore our app
            </Text>

            {/* Social Sign-in Buttons */}
            <Pressable style={styles.socialButton} onPress={handleGoogleSignIn}>
              <View style={styles.iconWrapper}>
                <GoogleColorfulLogo />
              </View>
              <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </Pressable>

            <Pressable style={styles.socialButton} onPress={handleAppleSignIn}>
              <View style={styles.iconWrapper}>
                <FontAwesome name="apple" size={20} color="#000" />
              </View>
              <Text style={styles.socialButtonText}>Sign in with Apple</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable style={styles.socialButton} onPress={navigateToUserInfo}>
              <View style={styles.iconWrapper}>
                <FontAwesome name="user" size={20} color="#000" />
              </View>
              <Text style={styles.socialButtonText}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blackBox: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  appName: {
    ...Typography.heading1,
    fontSize: 24,
    color: 'white',
  },
  quoteContainer: {
    marginBottom: 25,
  },
  quoteText: {
    ...Typography.heading2,
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: '#f1f1f1',
    textAlign: 'center',
    marginBottom: 30,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    width: '100%',
  },
  iconWrapper: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialButtonText: {
    ...Typography.button,
    color: '#111',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    ...Typography.body,
    color: 'white',
    marginHorizontal: 10,
  },

}); 