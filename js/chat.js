// Chat Interface Component
// Integrates with Google Gemini AI and Supabase for chat history

class ChatInterface {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.chatType = config.chatType; // 'diagnostic' or 'mental-health'
    this.systemPrompt = config.systemPrompt;
    this.placeholder = config.placeholder || 'Type your message...';
    this.messages = [];
    this.isLoading = false;
    
    // Google Gemini configuration (from config.js)
    this.config = window.CONFIG || {};
    this.geminiApiKey = this.config.gemini?.apiKey || 'AIzaSyBEqk2xMHt5XLJRFyuYr5xQOxgc_LOGunc';
    this.geminiModel = this.config.gemini?.model || 'gemini-1.5-flash';
    this.temperature = this.config.gemini?.temperature || 0.7;
    this.maxTokens = this.config.gemini?.maxTokens || 1000;
    this.useMockAPI = this.config.features?.useMockAPI || false;
    
    // Supabase session management
    this.currentSessionId = null;
    this.userId = null;
    this.userProfile = null;
    this.chatHistory = [];
    this.isHistorySidebarOpen = false;
    
    this.init();
  }

  async init() {
    await this.checkUserSession();
    this.render();
    this.attachEventListeners();
    await this.loadChatSession();
  }

  render() {
    this.container.innerHTML = `
      <div class="chat-wrapper">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="chat-header-title">
            ${Icons.getHTML('bot', 'icon')}
            <span>AI Assistant</span>
          </div>
          <div class="chat-header-actions">
            <button id="newChatBtn" class="btn-icon" title="Start New Chat">
              ${Icons.getHTML('plus', 'icon')}
              <span>New Chat</span>
            </button>
            <button id="historyBtn" class="btn-icon" title="Chat History">
              ${Icons.getHTML('clock', 'icon')}
              <span>History</span>
            </button>
          </div>
        </div>

        <!-- History Sidebar -->
        <div class="chat-history-sidebar" id="historySidebar">
          <div class="history-sidebar-header">
            <h3>Chat History</h3>
            <button id="closeHistoryBtn" class="btn-icon-sm">
              ${Icons.getHTML('x', 'icon')}
            </button>
          </div>
          <div class="history-sidebar-content" id="historyList">
            <p class="text-muted">Loading history...</p>
          </div>
        </div>

        <!-- Chat Container -->
        <div class="chat-container animate-fade-in">
          <div class="chat-messages" id="chatMessages">
            ${this.renderEmptyState()}
          </div>
          <div class="chat-input-area">
            <div class="chat-input-container">
              <textarea 
                id="chatInput"
                class="chat-textarea" 
                rows="3" 
                placeholder="${this.placeholder}"
              ></textarea>
              <button id="chatSendBtn" class="btn btn-primary chat-send-btn">
                ${Icons.getHTML('send', 'icon')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderEmptyState() {
    return `
      <div class="chat-empty animate-fade-in-up">
        ${Icons.getHTML('bot', 'icon-xl text-primary animate-float')}
        <p class="text-lg font-semibold">Start a conversation to get help.</p>
        <p class="text-sm" style="margin-top: 0.5rem;">I'm here to listen and assist you.</p>
      </div>
    `;
  }

  renderMessage(message, isNew = false) {
    const isUser = message.role === 'user';
    const messageClass = isNew ? 'chat-message animate-scale-in' : 'chat-message';
    
    return `
      <div class="${messageClass} ${isUser ? 'user' : ''}">
        ${!isUser ? `
          <div class="chat-avatar assistant">
            ${Icons.getHTML('bot', 'icon')}
          </div>
        ` : ''}
        <div class="chat-bubble ${isUser ? 'user' : 'assistant'}">${this.formatMarkdown(message.content.trim())}</div>
        ${isUser ? `
          <div class="chat-avatar user">
            ${Icons.getHTML('user', 'icon')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderLoadingIndicator() {
    return `
      <div class="chat-message animate-scale-in">
        <div class="chat-avatar assistant">
          ${Icons.getHTML('bot', 'icon')}
        </div>
        <div class="chat-bubble assistant">
          <div class="spinner"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    const historyBtn = document.getElementById('historyBtn');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');

    sendBtn.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // New chat button
    newChatBtn.addEventListener('click', () => this.startNewChat());

    // History button
    historyBtn.addEventListener('click', () => this.toggleHistorySidebar());

    // Close history sidebar
    closeHistoryBtn.addEventListener('click', () => this.closeHistorySidebar());
  }

  async checkUserSession() {
    // Check if user is logged in
    if (typeof SupabaseAuth !== 'undefined') {
      const user = await SupabaseAuth.getCurrentUser();
      if (user) {
        this.userId = user.id;
        
        // Load user profile for medical context
        if (typeof SupabaseDB !== 'undefined') {
          try {
            this.userProfile = await SupabaseDB.getProfile(user.id);
            console.log('User profile loaded for medical context');
          } catch (error) {
            console.warn('Could not load user profile:', error);
          }
        }
      }
    }
  }

  async loadChatSession() {
    // If user is logged in, try to load or create active session
    if (this.userId && typeof SupabaseDB !== 'undefined') {
      try {
        // Get active session for this chat type
        const sessions = await SupabaseDB.getChatSessions(this.userId, this.chatType, 1, 0);
        
        if (sessions && sessions.length > 0 && sessions[0].is_active) {
          // Load existing session
          this.currentSessionId = sessions[0].session_id;
          const conversation = await SupabaseDB.getConversation(this.currentSessionId);
          
          // Load messages into chat
          if (conversation && conversation.length > 0) {
            this.messages = conversation.map(msg => ({
              role: msg.role,
              content: msg.content
            }));
            this.updateMessagesDisplay();
          }
        }
      } catch (error) {
        console.error('Error loading chat session:', error);
      }
    }
  }

  async createNewSession() {
    if (this.userId && typeof SupabaseDB !== 'undefined') {
      try {
        const session = await SupabaseDB.createChatSession(
          this.userId,
          this.chatType
        );
        this.currentSessionId = session.id;
        return session;
      } catch (error) {
        console.error('Error creating session:', error);
      }
    }
    return null;
  }

  async saveMessage(role, content) {
    if (this.currentSessionId && typeof SupabaseDB !== 'undefined') {
      try {
        await SupabaseDB.addMessage(this.currentSessionId, role, content, {
          model_used: this.geminiModel
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  }

  async startNewChat() {
    if (!this.userId) {
      alert('Please login to start a new chat session.');
      return;
    }

    // Confirm if there's an active conversation
    if (this.messages.length > 0) {
      if (!confirm('Start a new chat? This will save your current conversation.')) {
        return;
      }
    }

    // Create new session
    this.messages = [];
    this.currentSessionId = null;
    await this.createNewSession();
    
    // Clear and reset UI
    this.updateMessagesDisplay();
    document.getElementById('chatInput').value = '';
    document.getElementById('chatInput').focus();
  }

  async toggleHistorySidebar() {
    const sidebar = document.getElementById('historySidebar');
    this.isHistorySidebarOpen = !this.isHistorySidebarOpen;
    
    if (this.isHistorySidebarOpen) {
      sidebar.classList.add('open');
      await this.loadChatHistory();
    } else {
      sidebar.classList.remove('open');
    }
  }

  closeHistorySidebar() {
    const sidebar = document.getElementById('historySidebar');
    this.isHistorySidebarOpen = false;
    sidebar.classList.remove('open');
  }

  async loadChatHistory() {
    if (!this.userId || typeof SupabaseDB === 'undefined') {
      document.getElementById('historyList').innerHTML = 
        '<p class="text-muted">Please login to view chat history.</p>';
      return;
    }

    try {
      const sessions = await SupabaseDB.getChatSessions(this.userId, this.chatType, 20, 0);
      
      if (!sessions || sessions.length === 0) {
        document.getElementById('historyList').innerHTML = 
          '<p class="text-muted">No chat history yet. Start a conversation!</p>';
        return;
      }

      this.chatHistory = sessions;
      this.renderChatHistory(sessions);
    } catch (error) {
      console.error('Error loading chat history:', error);
      document.getElementById('historyList').innerHTML = 
        '<p class="text-muted text-error">Failed to load history.</p>';
    }
  }

  renderChatHistory(sessions) {
    const historyHTML = sessions.map(session => {
      const date = new Date(session.started_at);
      const isActive = session.session_id === this.currentSessionId;
      const title = session.title || `Chat - ${date.toLocaleDateString()}`;
      const timeAgo = this.getTimeAgo(date);

      return `
        <div class="history-item ${isActive ? 'active' : ''}" data-session-id="${session.session_id}">
          <div class="history-item-header">
            <span class="history-item-title">${title}</span>
            ${isActive ? '<span class="history-item-badge">Current</span>' : ''}
          </div>
          <div class="history-item-meta">
            <span class="history-item-time">${timeAgo}</span>
            <span class="history-item-count">${session.message_count || 0} messages</span>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('historyList').innerHTML = historyHTML;

    // Attach click handlers
    document.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const sessionId = item.getAttribute('data-session-id');
        this.loadSessionById(sessionId);
      });
    });
  }

  async loadSessionById(sessionId) {
    if (sessionId === this.currentSessionId) {
      this.closeHistorySidebar();
      return;
    }

    try {
      const conversation = await SupabaseDB.getConversation(sessionId);
      
      if (conversation && conversation.length > 0) {
        this.currentSessionId = sessionId;
        this.messages = conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        this.updateMessagesDisplay();
        this.closeHistorySidebar();
      }
    } catch (error) {
      console.error('Error loading session:', error);
      alert('Failed to load chat session.');
    }
  }

  getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  }

  async saveMessage(role, content) {
    if (this.currentSessionId && typeof SupabaseDB !== 'undefined') {
      try {
        await SupabaseDB.addMessage(this.currentSessionId, role, content, {
          model_used: this.geminiModel
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // Create session if doesn't exist and user is logged in
    if (this.userId && !this.currentSessionId) {
      await this.createNewSession();
    }

    // Add user message
    const userMessage = { role: 'user', content: message };
    this.messages.push(userMessage);
    input.value = '';
    
    // Save user message to database
    await this.saveMessage('user', message);
    
    this.updateMessagesDisplay();
    this.isLoading = true;
    this.updateLoadingState(true);

    try {
      // Use OpenAI API or mock based on configuration
      const response = this.useMockAPI 
        ? await this.callMockChatAPI(message)
        : await this.callChatAPI(message);
      
      // Add assistant response - trim to remove extra whitespace
      const assistantMessage = { role: 'assistant', content: response.trim() };
      this.messages.push(assistantMessage);
      
      // Save assistant message to database
      await this.saveMessage('assistant', response.trim());
      
      this.updateMessagesDisplay();
    } catch (error) {
      console.error('Chat error:', error);
      
      // Show user-friendly error messages
      if (error.message.includes('Rate limit exceeded')) {
        this.showError('You\'re sending messages too quickly. Please wait a moment and try again.');
      } else if (error.message.includes('API Error: 429')) {
        this.showError('Rate limit exceeded. Please wait a minute before trying again.');
      } else if (error.message.includes('400')) {
        this.showError('There was a problem with the request. Please try again.');
      } else {
        this.showError('Sorry, I encountered an error. Please try again in a moment.');
      }
    } finally {
      this.isLoading = false;
      this.updateLoadingState(false);
    }
  }

  async callChatAPI(message) {
    // Google Gemini API Integration
    
    console.log('Calling Gemini API...', {
      model: this.geminiModel,
      chatType: this.chatType,
      messageCount: this.messages.length
    });
    
    let lastError;
    const maxRetries = 3;
    
    // Build conversation history for Gemini
    const contents = [];
    
    // Add all messages to contents
    this.messages.forEach(msg => {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Build enhanced system prompt with user medical context
    let enhancedSystemPrompt = this.systemPrompt;
    if (this.userProfile) {
      const medicalContext = this.buildMedicalContext();
      if (medicalContext) {
        enhancedSystemPrompt = `${this.systemPrompt}\n\n${medicalContext}`;
      }
    }
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
        
        console.log('Request payload:', {
          url: url.replace(this.geminiApiKey, 'API_KEY_HIDDEN'),
          contents: contents,
          hasMedicalContext: !!this.userProfile
        });
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: enhancedSystemPrompt ? {
              parts: [{ text: enhancedSystemPrompt }]
            } : undefined,
            generationConfig: {
              temperature: this.temperature,
              maxOutputTokens: this.maxTokens,
              topP: 0.95,
              topK: 40
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_ONLY_HIGH'
              }
            ]
          })
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          
          // If rate limit, wait and retry
          if (response.status === 429 && attempt < maxRetries) {
            const waitTime = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`Rate limited. Waiting ${waitTime/1000}s before retry ${attempt + 1}/${maxRetries}...`);
            await this.delay(waitTime);
            continue;
          }
          
          throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        // Extract message from Gemini response
        const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!assistantMessage) {
          throw new Error('No response from AI');
        }
        
        return assistantMessage;
        
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          throw error;
        }
        // Wait before retry for non-429 errors
        if (attempt < maxRetries) {
          await this.delay(1000);
        }
      }
    }
    
    throw lastError;
  }

  async callMockChatAPI(message) {
    // Simulate API delay
    await this.delay(1000 + Math.random() * 500);
    return this.getMockResponse(message);
  }

  getMockResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (this.chatType === 'diagnostic') {
      if (lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
        return `I understand you're experiencing headache or pain. Let me ask a few questions to better understand your symptoms:

1. Where exactly is the pain located?
2. How long have you been experiencing this?
3. On a scale of 1-10, how would you rate the pain intensity?
4. Have you taken any medication for it?

Please note: I'm an AI assistant and cannot provide medical diagnoses. For persistent or severe symptoms, please consult a healthcare professional.`;
      } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        return `Fever can be a sign of various conditions. Can you tell me:

1. What is your current temperature?
2. How long have you had the fever?
3. Are you experiencing any other symptoms (cough, sore throat, body aches)?
4. Have you been in contact with anyone who was sick?

If your fever is above 103°F (39.4°C) or persists for more than 3 days, please seek medical attention promptly.`;
      } else {
        return `Thank you for sharing your symptoms. To provide better assistance, could you please describe:

1. What symptoms are you experiencing?
2. When did they start?
3. Have they gotten better, worse, or stayed the same?
4. Is there anything that makes them better or worse?

Remember, while I can provide general health information, I cannot replace professional medical advice. For serious concerns, please consult a healthcare provider.`;
      }
    } else if (this.chatType === 'mental-health') {
      if (lowerMessage.includes('anxiety') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
        return `I hear that you're feeling anxious. It's brave of you to reach out. Anxiety is very common and there are many ways to manage it.

Some techniques that might help:
• Deep breathing exercises (try 4-7-8 breathing)
• Grounding techniques (5-4-3-2-1 method)
• Regular physical activity
• Talking to someone you trust

Would you like to talk more about what's making you feel anxious? I'm here to listen without judgment.

If you're experiencing severe anxiety or panic attacks, please consider reaching out to a mental health professional.`;
      } else if (lowerMessage.includes('depres') || lowerMessage.includes('sad')) {
        return `I'm sorry you're going through a difficult time. Feeling sad or depressed is a real and valid experience, and it takes courage to talk about it.

Some things that might help:
• Maintain a regular sleep schedule
• Stay connected with friends and family
• Engage in activities you used to enjoy
• Practice self-compassion

Remember:
• You're not alone in this
• These feelings can improve
• Professional help is available and effective

If you're having thoughts of self-harm, please call the National Suicide Prevention Lifeline at 988 immediately.

Would you like to share more about how you've been feeling?`;
      } else {
        return `Thank you for reaching out. I'm here to provide support and a listening ear. Mental health is just as important as physical health, and it's okay to ask for help.

How are you feeling today? What brought you here? Take your time—there's no rush.

Remember:
• This is a safe, confidential space
• Your feelings are valid
• Help is available 24/7

If you're in crisis:
• National Suicide Prevention Lifeline: 988
• Crisis Text Line: Text HOME to 741741
• Emergency: 911`;
      }
    }
    
    return 'Thank you for your message. How can I help you today?';
  }

  updateMessagesDisplay() {
    const messagesContainer = document.getElementById('chatMessages');
    
    if (this.messages.length === 0) {
      messagesContainer.innerHTML = this.renderEmptyState();
    } else {
      messagesContainer.innerHTML = this.messages.map(msg => this.renderMessage(msg)).join('');
    }
    
    this.scrollToBottom();
  }

  updateLoadingState(isLoading) {
    const messagesContainer = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSendBtn');
    
    input.disabled = isLoading;
    sendBtn.disabled = isLoading;
    
    if (isLoading) {
      const loadingHTML = this.renderLoadingIndicator();
      messagesContainer.insertAdjacentHTML('beforeend', loadingHTML);
      sendBtn.innerHTML = Icons.getHTML('loader', 'icon spinner');
    } else {
      const loadingIndicator = messagesContainer.querySelector('.chat-message:last-child .spinner');
      if (loadingIndicator) {
        loadingIndicator.closest('.chat-message').remove();
      }
      sendBtn.innerHTML = Icons.getHTML('send', 'icon');
    }
    
    this.scrollToBottom();
  }

  showError(errorMessage) {
    const assistantMessage = { 
      role: 'assistant', 
      content: `⚠️ ${errorMessage}` 
    };
    this.messages.push(assistantMessage);
    this.updateMessagesDisplay();
  }

  buildMedicalContext() {
    if (!this.userProfile) return '';

    const contextParts = [];
    
    // Add patient information header
    contextParts.push('=== PATIENT MEDICAL CONTEXT ===');
    contextParts.push('Use this information to provide personalized and safer health recommendations.');
    
    // Basic demographics
    if (this.userProfile.date_of_birth) {
      const age = Math.floor((new Date() - new Date(this.userProfile.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000));
      contextParts.push(`Age: ${age} years old`);
    }
    
    if (this.userProfile.gender) {
      contextParts.push(`Gender: ${this.userProfile.gender}`);
    }
    
    if (this.userProfile.blood_group) {
      contextParts.push(`Blood Group: ${this.userProfile.blood_group}`);
    }
    
    // Critical medical information
    if (this.userProfile.allergies && this.userProfile.allergies.length > 0) {
      contextParts.push(`\n⚠️ ALLERGIES: ${this.userProfile.allergies.join(', ')}`);
      contextParts.push('IMPORTANT: Avoid recommending medications or treatments that may contain these allergens.');
    }
    
    if (this.userProfile.chronic_conditions && this.userProfile.chronic_conditions.length > 0) {
      contextParts.push(`\nChronic Conditions: ${this.userProfile.chronic_conditions.join(', ')}`);
      contextParts.push('Consider these conditions when providing health advice.');
    }
    
    contextParts.push('\n=== END MEDICAL CONTEXT ===');
    
    return contextParts.join('\n');
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    // Trim and replace multiple newlines with double newlines for paragraph spacing
    const cleanedText = text.trim().replace(/\n\s*\n\s*\n+/g, '\n\n');
    div.textContent = cleanedText;
    return div.innerHTML;
  }

  formatMarkdown(text) {
    // First escape HTML
    const escaped = this.escapeHTML(text);
    
    // Convert Markdown formatting to HTML
    return escaped
      // Bold: **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      // Italic: *text* or _text_
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      // Code: `code`
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br>');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Make ChatInterface available globally
window.ChatInterface = ChatInterface;
