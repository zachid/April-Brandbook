/**
 * Authentication Functions
 * Handles signup, login, logout, and session management
 */

/**
 * Sign up with email/password
 */
const signUp = async (email, password) => {
  if (!window.sb) throw new Error('Supabase not initialized');

  const { data, error } = await window.sb.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/brandbook.html`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Sign in with email/password
 */
const signIn = async (email, password) => {
  if (!window.sb) throw new Error('Supabase not initialized');

  const { data, error } = await window.sb.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  // Store user in sessionStorage
  sessionStorage.setItem('bb_user', JSON.stringify(data.user));

  return data;
};

/**
 * Sign in with Google OAuth
 */
const signInWithGoogle = async () => {
  if (!window.sb) throw new Error('Supabase not initialized');

  const { data, error } = await window.sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/index.html`,
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Sign out
 */
const signOut = async () => {
  if (!window.sb) throw new Error('Supabase not initialized');

  const { error } = await window.sb.auth.signOut();
  if (error) throw new Error(error.message);

  // Clear session storage
  sessionStorage.removeItem('bb_user');
  sessionStorage.removeItem('bb_last_brand');
  sessionStorage.removeItem('bb_pending_brand');

  return { success: true };
};

/**
 * Get current session
 */
const getAuthSession = async () => {
  if (!window.sb) return null;
  const { data } = await window.sb.auth.getSession();
  return data?.session || null;
};

/**
 * Get current user
 */
const getAuthUser = async () => {
  const session = await getAuthSession();
  return session?.user || null;
};

/**
 * Update user profile
 */
const updateProfile = async (displayName) => {
  if (!window.sb) throw new Error('Supabase not initialized');

  const { data, error } = await window.sb.auth.updateUser({
    data: { display_name: displayName },
  });

  if (error) throw new Error(error.message);
  return data;
};

/**
 * Listen for auth state changes
 */
const onAuthStateChange = (callback) => {
  if (!window.sb) {
    console.warn('[Auth] Supabase not initialized');
    return () => {};
  }

  return window.sb.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};
