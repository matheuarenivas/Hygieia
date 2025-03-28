import supabase from './supabaseClient';

// ======== AUTHENTICATION FUNCTIONS ========

/**
 * Sign in with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Auth response or error
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { error };
  }
};

/**
 * Sign up with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Auth response or error
 */
export const signUpWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { error };
  }
};

/**
 * Sign in with Google OAuth
 * @returns {Promise} - Auth response or error
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
    return { error };
  }
};

/**
 * Sign in with Apple OAuth
 * @returns {Promise} - Auth response or error
 */
export const signInWithApple = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
    });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error signing in with Apple:', error.message);
    return { error };
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Success or error
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { error };
  }
};

/**
 * Get the current user session
 * @returns {Promise} - Session data or error
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error getting session:', error.message);
    return { error };
  }
};

/**
 * Get the current user
 * @returns {Promise} - User data or error
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user };
  } catch (error) {
    console.error('Error getting user:', error.message);
    return { error };
  }
};

// ======== USER PROFILE FUNCTIONS ========

/**
 * Get a user's profile from the profiles table
 * @param {string} userId - The user's ID
 * @returns {Promise} - Profile data or error
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    return { error };
  }
};

/**
 * Update a user's profile
 * @param {string} userId - The user's ID
 * @param {Object} updates - The profile fields to update
 * @returns {Promise} - Updated data or error
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error updating user profile:', error.message);
    return { error };
  }
};

// ======== HEALTH DATA FUNCTIONS ========

/**
 * Get user's health metrics for a specific date
 * @param {string} userId - The user's ID
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Promise} - Health data or error
 */
export const getHealthMetrics = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching health metrics:', error.message);
    return { error };
  }
};

/**
 * Save new health metrics
 * @param {Object} metrics - The health metrics to save
 * @returns {Promise} - Inserted data or error
 */
export const saveHealthMetrics = async (metrics) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert([metrics])
      .select();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving health metrics:', error.message);
    return { error };
  }
};

/**
 * Get user's nutrition data for a specific date
 * @param {string} userId - The user's ID
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Promise} - Nutrition data or error
 */
export const getNutritionData = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('nutrition')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching nutrition data:', error.message);
    return { error };
  }
};

/**
 * Save new nutrition data
 * @param {Object} nutritionData - The nutrition data to save
 * @returns {Promise} - Inserted data or error
 */
export const saveNutritionData = async (nutritionData) => {
  try {
    const { data, error } = await supabase
      .from('nutrition')
      .insert([nutritionData])
      .select();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving nutrition data:', error.message);
    return { error };
  }
};

/**
 * Get user's activity data for a specific date
 * @param {string} userId - The user's ID
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Promise} - Activity data or error
 */
export const getActivityData = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching activity data:', error.message);
    return { error };
  }
};

/**
 * Save new activity data
 * @param {Object} activityData - The activity data to save
 * @returns {Promise} - Inserted data or error
 */
export const saveActivityData = async (activityData) => {
  try {
    const { data, error } = await supabase
      .from('activity')
      .insert([activityData])
      .select();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving activity data:', error.message);
    return { error };
  }
};

/**
 * Get user's sleep data for a specific date
 * @param {string} userId - The user's ID
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Promise} - Sleep data or error
 */
export const getSleepData = async (userId, date) => {
  try {
    const { data, error } = await supabase
      .from('sleep')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error fetching sleep data:', error.message);
    return { error };
  }
};

/**
 * Save new sleep data
 * @param {Object} sleepData - The sleep data to save
 * @returns {Promise} - Inserted data or error
 */
export const saveSleepData = async (sleepData) => {
  try {
    const { data, error } = await supabase
      .from('sleep')
      .insert([sleepData])
      .select();
    
    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving sleep data:', error.message);
    return { error };
  }
}; 