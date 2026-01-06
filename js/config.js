// API Configuration
// IMPORTANT: Never commit this file with real API keys to version control
// Add config.js to .gitignore

const CONFIG = {
  // Google Gemini Configuration
  gemini: {
    apiKey: 'AIzaSyBK9P7kl6yocyL_5dCU3qVFm_cN2_eKy8E', // Replace with your actual Gemini API key from Google AI Studio
    model: 'gemini-2.5-flash', // Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
    temperature: 0.7,
    maxTokens: 1000
  },
  
  // Feature flags
  features: {
    useMockAPI: false, 
    enableRetry: true,
    maxRetries: 3
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
