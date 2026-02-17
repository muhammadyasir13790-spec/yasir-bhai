
document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');

    // Auto-resize input
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Update character count
        const chars = this.value.length;
        const words = this.value.trim() ? this.value.trim().split(/\s+/).length : 0;
        if (charCount) charCount.textContent = chars;
        if (wordCount) wordCount.textContent = words;
    });

    // Send message function
    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) {
            showToast('Kuch likho to sahi! 😅');
            return;
        }

        // Add user message
        addMessage(text, 'user');
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator
        showTyping(true);

        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();
            
            // Hide typing indicator
            showTyping(false);

            if (response.ok) {
                // Add bot response with animation
                setTimeout(() => {
                    addBotMessage(data);
                }, 500);
            } else {
                addMessage(data.error || 'Kuch error aa gaya!', 'bot');
            }
        } catch (error) {
            showTyping(false);
            addMessage('Network error! Server chal raha hai? 🤔', 'bot');
            console.error('Error:', error);
        }
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div>${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message with sentiment
    function addBotMessage(data) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content" style="border-left: 4px solid ${data.color || '#667eea'}">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <span style="font-size: 1.5em;">${data.emoji || '🤖'}</span>
                    <span class="sentiment-badge" style="background: ${data.color || '#667eea'}; color: white;">
                        ${data.sentiment || 'Neutral'}
                    </span>
                </div>
                <div style="font-size: 1.1em; margin-bottom: 10px;">${data.reply}</div>
                <div style="display: flex; gap: 15px; font-size: 0.85em; color: #666;">
                    <span>🎯 Polarity: ${data.polarity || 0}</span>
                    <span>📊 Subjectivity: ${data.subjectivity || 0}</span>
                    <span>📝 Words: ${data.words || 0}</span>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesDiv.appendChild(messageDiv);
        scrollToBottom();
    }

    // Show/hide typing indicator
    function showTyping(show) {
        if (typingIndicator) {
            typingIndicator.style.display = show ? 'block' : 'none';
        }
        scrollToBottom();
    }

    // Scroll to bottom
    function scrollToBottom() {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Show toast message
    function showToast(message) {
        // Simple alert for now - can be enhanced with a nice toast
        alert(message);
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Focus input on load
    userInput.focus();

    // Add welcome message with typing effect
    setTimeout(() => {
        const welcomeMsg = {
            emoji: '👋',
            sentiment: 'Welcome!',
            reply: 'Hi! Main hoon aapka sentiment bot. Batao aaj kaise ho?',
            color: '#667eea',
            polarity: 0,
            subjectivity: 0,
            words: 0
        };
        addBotMessage(welcomeMsg);
    }, 500);
});
