import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      },
      emailRedirectTo: `${window.location.origin}/verify-email`
    }
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) throw error;
};

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
};

export const resendVerificationEmail = async () => {
  const user = await getCurrentUser();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: user.email
  });
  
  if (error) throw error;
};

// ============================================
// USER FUNCTIONS
// ============================================

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================
// TRANSACTION FUNCTIONS
// ============================================

export const getTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addTransaction = async (transaction) => {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ ...transaction, user_id: user.id }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const addMultipleTransactions = async (transactions) => {
  const user = await getCurrentUser();
  const transactionsWithUser = transactions.map(t => ({
    ...t,
    user_id: user.id
  }));
  
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionsWithUser)
    .select();
  
  if (error) throw error;
  return data;
};

export const updateTransaction = async (id, updates) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const deleteAllTransactions = async (userId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('user_id', userId);
  
  if (error) throw error;
};

// ============================================
// PREMIUM FUNCTIONS
// ============================================

export const checkPremiumStatus = async (userId) => {
  const { data, error } = await supabase
    .rpc('is_premium_active', { user_uuid: userId });
  
  if (error) throw error;
  return data;
};

export const recordPayment = async (userId, amount, paymentMethod, referenceNumber) => {
  const { data, error } = await supabase
    .from('payment_history')
    .insert([{
      user_id: userId,
      amount: amount,
      payment_method: paymentMethod,
      reference_number: referenceNumber,
      status: 'pending'
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================
// SOA/DOWNLOAD TRACKING
// ============================================

export const logSOADownload = async (userId, month, format) => {
  const { error } = await supabase
    .from('soa_downloads')
    .insert([{
      user_id: userId,
      month: month,
      format: format
    }]);
  
  if (error) throw error;
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
};
