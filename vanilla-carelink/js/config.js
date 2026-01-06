// API Configuration
// IMPORTANT: Never commit this file with real API keys to version control
// Add config.js to .gitignore

const CONFIG = {
  // Google Gemini Configuration
  gemini: {
    apiKey: 'AIzaSyAn9b4xYm0by8h9VEIEQ3K8-oqVEfaDDbI', // Replace with your actual Gemini API key from Google AI Studio
    model: 'gemini-2.5-flash-lite', // Options: gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash
    temperature: 0.7,
    maxTokens: 1000
  },
  
  // Feature flags
  features: {
    useMockAPI: false, // Set to false to use real Gemini API (temporarily enabled due to quota)
    enableRetry: true,
    maxRetries: 3
  }
};

// Export for use in other files
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
