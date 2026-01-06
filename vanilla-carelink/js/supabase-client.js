// Supabase Configuration and Setup
// This file initializes the Supabase client for authentication and database operations

// Supabase credentials - Add these to your config.js or use environment variables
// IMPORTANT: Use the LEGACY anon key, not the new publishable key!
// 1. Go to: https://app.supabase.com/project/ihjgrjgwznkpzxqtztxx/settings/api
// 2. Click on "Legacy anon, service_role API keys" tab
// 3. Copy the "anon" key (the long one starting with eyJ...)
const SUPABASE_CONFIG = {
  url: 'https://ihjgrjgwznkpzxqtztxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imloamdyamd3em5rcHp4cXR6dHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTU4MTMsImV4cCI6MjA4MzI5MTgxM30.Lpltf1F4kpfuv9YY8RrkfY3kgNZSJZuzXxwgCs6JTP0' // Should be ~200+ chars, starting with eyJ
};

// Initialize Supabase client
let supabaseClient = null;

// Initialize Supabase (called when library is loaded)
function initSupabase() {
  if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('Supabase initialized successfully');
    return true;
  } else {
    console.warn('Supabase not initialized. Please configure SUPABASE_CONFIG.');
    return false;
  }
}

// Authentication Functions
const Auth = {
  // Sign up a new user
  async signUp(email, password, userData = {}) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name || '',
          phone_number: userData.phone_number || ''
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(email, password) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  // Sign in with Google
  async signInWithGoogle() {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/index.html'
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with GitHub
  async signInWithGithub() {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin + '/index.html'
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    if (!supabaseClient) {
      return null;
    }

    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  },

  // Get current session
  async getSession() {
    if (!supabaseClient) {
      return null;
    }

    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  },

  // Send password reset email
  async resetPassword(email) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html'
    });

    if (error) throw error;
    return data;
  },

  // Update password
  async updatePassword(newPassword) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    return data;
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    if (!supabaseClient) {
      return null;
    }

    return supabaseClient.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};

// Database Functions
const Database = {
  // Create user profile (for OAuth users)
  async createProfile(profileData) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .insert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name || '',
        avatar_url: profileData.avatar_url || ''
      })
      .select()
      .single();

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error;
    }
    return data;
  },

  // Get user profile
  async getProfile(userId) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateProfile(userId, updates) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Create new chat session
  async createChatSession(userId, sessionType, title = null) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .insert({
        user_id: userId,
        session_type: sessionType,
        title: title || `${sessionType} - ${new Date().toLocaleDateString()}`
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get chat sessions
  async getChatSessions(userId, sessionType = null, limit = 10, offset = 0) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.rpc('get_chat_history', {
      p_user_id: userId,
      p_session_type: sessionType,
      p_limit: limit,
      p_offset: offset
    });

    if (error) throw error;
    return data;
  },

  // Add message to session
  async addMessage(sessionId, role, content, metadata = {}) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: role,
        content: content,
        tokens_used: metadata.tokens_used || null,
        model_used: metadata.model_used || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get conversation
  async getConversation(sessionId) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.rpc('get_conversation', {
      p_session_id: sessionId
    });

    if (error) throw error;
    return data;
  },

  // End chat session
  async endChatSession(sessionId) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .update({
        ended_at: new Date().toISOString(),
        is_active: false
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Admin Functions
const Admin = {
  // Check if current user is admin
  async isAdmin(userId = null) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const uid = userId || (await Auth.getCurrentUser())?.id;
    if (!uid) return false;

    const { data, error } = await supabaseClient.rpc('is_admin', {
      user_id: uid
    });

    if (error) return false;
    return data;
  },

  // Get all users (admin only)
  async getAllUsers(limit = 50, offset = 0) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.rpc('get_all_users', {
      p_limit: limit,
      p_offset: offset
    });

    if (error) throw error;
    return data;
  },

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.rpc('update_user_role', {
      p_user_id: userId,
      p_new_role: newRole
    });

    if (error) throw error;
    return data;
  },

  // Get platform statistics (admin only)
  async getPlatformStats() {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient.rpc('get_platform_stats');

    if (error) throw error;
    return data;
  },

  // Get all chat sessions (admin view)
  async getAllChatSessions(limit = 50, offset = 0) {
    if (!supabaseClient) {
      throw new Error('Supabase not initialized');
    }

    const { data, error } = await supabaseClient
      .from('chat_sessions')
      .select(`
        *,
        profiles:user_id (
          full_name,
          email
        )
      `)
      .order('started_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }
};

// Storage for user session
const UserSession = {
  set(user) {
    localStorage.setItem('care_link_user', JSON.stringify(user));
  },

  get() {
    const user = localStorage.getItem('care_link_user');
    return user ? JSON.parse(user) : null;
  },

  clear() {
    localStorage.removeItem('care_link_user');
  },

  isLoggedIn() {
    return this.get() !== null;
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.SupabaseAuth = Auth;
  window.SupabaseDB = Database;
  window.SupabaseAdmin = Admin;
  window.UserSession = UserSession;
  window.initSupabase = initSupabase;
  window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
