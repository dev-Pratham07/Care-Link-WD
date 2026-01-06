// Chat Interface Component
// Integrates with Supabase Edge Functions

class ChatInterface {
  constructor(containerId, config) {
    this.container = document.getElementById(containerId);
    this.chatType = config.chatType; // 'diagnostic' or 'mental-health'
    this.systemPrompt = config.systemPrompt;
    this.placeholder = config.placeholder || 'Type your message...';
    this.messages = [];
    this.isLoading = false;
    
    // Supabase configuration
    this.supabaseUrl = 'https://bdkzyukynxxccvdkfimg.supabase.co'; // Replace with your Supabase URL
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka3p5dWt5bnh4Y2N2ZGtmaW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNzg2ODQsImV4cCI6MjA3OTY1NDY4NH0.KEuGyt5IinI5Kgh76CEfOAI2PgIj_7X5jN8M-uE7Oac'; // Replace with your Supabase anon key
    
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
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

    sendBtn.addEventListener('click', () => this.sendMessage());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // Add user message
    const userMessage = { role: 'user', content: message };
    this.messages.push(userMessage);
    input.value = '';
    
    this.updateMessagesDisplay();
    this.isLoading = true;
    this.updateLoadingState(true);

    try {
      const response = await this.callChatAPI(message);
      
      // Add assistant response - trim to remove extra whitespace
      const assistantMessage = { role: 'assistant', content: response.trim() };
      this.messages.push(assistantMessage);
      
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
    // REAL SUPABASE IMPLEMENTATION - Using Edge Function with AI
    
    console.log('Calling chat API...', {
      url: `${this.supabaseUrl}/functions/v1/chat`,
      chatType: this.chatType
    });
    
    let lastError;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.supabaseUrl}/functions/v1/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.supabaseKey}`
          },
          body: JSON.stringify({
            messages: this.messages,
            systemPrompt: this.systemPrompt,
            chatType: this.chatType
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
          
          throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data.message;
        
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          throw error;
        }
      }
    }
    
    throw lastError;
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
