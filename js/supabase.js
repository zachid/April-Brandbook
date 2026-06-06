/**
 * Supabase Client Initialization
 *
 * Set SUPABASE_URL and SUPABASE_ANON_KEY as sessionStorage values
 * or define them here as window.SUPABASE_CONFIG
 */

const initSupabase = async () => {
  // Get config from sessionStorage or window.SUPABASE_CONFIG
  const config = {
    url: sessionStorage.getItem('sb_url') || window.SUPABASE_CONFIG?.url || 'https://crqjjjtpiocqddjrlquw.supabase.co',
    key: sessionStorage.getItem('sb_key') || window.SUPABASE_CONFIG?.key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNycWpqanRwaW9jcWRkanJscXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDcyMTMsImV4cCI6MjA5Mzk4MzIxM30.UVh_NTzn2Sg0QAXNv7N-Vt98VFonLfeRRS5myGDSVmo',
  };

  if (!config.url || !config.key) {
    console.warn('[Supabase] No config found. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
    return null;
  }

  // Load @supabase/supabase-js from CDN
  if (!window.supabase) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
      console.log('[Supabase] Library loaded');
    };
    document.head.appendChild(script);

    // Wait for library to load
    return new Promise((resolve) => {
      const checkLoaded = setInterval(() => {
        if (window.supabase) {
          clearInterval(checkLoaded);
          const client = window.supabase.createClient(config.url, config.key);
          window.sb = client;
          resolve(client);
        }
      }, 100);
    });
  }

  const client = window.supabase.createClient(config.url, config.key);
  window.sb = client;
  return client;
};

/**
 * Check if user is authenticated
 */
const getSession = async () => {
  if (!window.sb) return null;
  const { data } = await window.sb.auth.getSession();
  return data?.session || null;
};

/**
 * Get current user
 */
const getUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

/**
 * Redirect to login if not authenticated
 */
const requireAuth = async () => {
  const user = await getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
  await initSupabase();
  const session = await getSession();

  // Store user info in sessionStorage for quick access
  if (session?.user) {
    sessionStorage.setItem('bb_user', JSON.stringify(session.user));
  }
});
