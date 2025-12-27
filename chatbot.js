// Chatbot with Google Gemini API Integration - Natural & Conversational

const GEMINI_API_KEY = 'AIzaSyBgqa-rqhwr1Y9jvasfZxRS4irOoTlGx3U';

// Natural, conversational context for the chatbot
const WEBSITE_CONTEXT = `You are a warm, friendly, and supportive assistant for HappiMoM, a comprehensive women's health and motherhood tracking app. 

Your personality:
- You're like a caring friend who understands what women go through
- You're warm, empathetic, and never judgmental
- You use natural, conversational language - not robotic or formal
- You're enthusiastic but not overly excited
- You ask follow-up questions to be helpful
- You use contractions (I'm, you're, we've) to sound natural
- You occasionally use emojis but sparingly and naturally
- You're knowledgeable but explain things simply

HappiMoM helps women with:

1. **Period & Cycle Tracking**
   - Track menstrual cycles with a beautiful calendar
   - Predict ovulation and fertile windows
   - Smart period predictions
   - Log symptoms like cramps, mood changes, PMS
   - Get insights about cycle patterns

2. **Pregnancy Journey**
   - Week-by-week updates about baby's development
   - Calculate your due date
   - Trimester-specific guidance
   - Doctor visit reminders
   - Pregnancy journal for photos and memories

3. **Baby Health & Growth**
   - Track baby's growth (weight, height, head size)
   - Celebrate milestones (first smile, first steps)
   - Vaccination schedule with reminders
   - Feeding and sleep logs
   - Diaper tracking

4. **Mom's Health**
   - Track vital signs and symptoms
   - Postpartum recovery monitoring
   - Health trends and insights

5. **Safety & Support**
   - Emergency contacts
   - Find nearby hospitals
   - Symptom checklists

When answering questions:
- Be conversational and natural, like you're texting a friend
- Don't sound like a manual or FAQ
- Show empathy and understanding
- Give practical, actionable advice
- Be encouraging and supportive
- Use simple language, avoid jargon unless you explain it`;

let chatHistory = [];
let userName = null; // Store user's name if they share it

// Initialize chatbot - try multiple initialization methods
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
    initializeChatbot();
}

setTimeout(initializeChatbot, 500);

let chatbotInitialized = false;

function initializeChatbot() {
    if (chatbotInitialized) return;
    
    const chatButton = document.getElementById('chatbotButton');
    const chatWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');
    const sendButton = document.getElementById('sendMessage');
    const messageInput = document.getElementById('messageInput');

    if (!chatButton || !chatWindow) {
        return;
    }

    chatbotInitialized = true;

    if (chatButton) {
        chatButton.addEventListener('click', toggleChat);
    }

    if (closeChat) {
        closeChat.addEventListener('click', toggleChat);
    }

    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length === 0) {
        addMessage('bot', "Hey there! 👋 I'm here to help you with HappiMoM. Whether you need help tracking your period, navigating pregnancy, or keeping up with your little one's milestones - I've got you covered! What's on your mind?");
    }
}

function toggleChat() {
    const chatWindow = document.getElementById('chatbotWindow');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
        const messageInput = document.getElementById('messageInput');
        if (chatWindow.classList.contains('active') && messageInput) {
            setTimeout(() => messageInput.focus(), 100);
        }
    }
}

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const userMessage = messageInput?.value.trim();

    if (!userMessage) return;

    addMessage('user', userMessage);
    messageInput.value = '';

    const typingId = addTypingIndicator();

    try {
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), 15000)
        );
        
        const apiPromise = callGeminiAPI(userMessage);
        const response = await Promise.race([apiPromise, timeoutPromise]);
        
        removeTypingIndicator(typingId);
        addMessage('bot', response);
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator(typingId);
        
        const fallbackResponse = getNaturalFallbackResponse(userMessage);
        addMessage('bot', fallbackResponse);
    }
}

// Natural, conversational fallback responses
function getNaturalFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase().trim();
    const nameMatch = userMessage.match(/my name is (\w+)|i'm (\w+)|i am (\w+)|call me (\w+)/i);
    
    if (nameMatch) {
        userName = nameMatch[1] || nameMatch[2] || nameMatch[3] || nameMatch[4];
        return `Nice to meet you, ${userName}! 😊 I'm here to help you with HappiMoM. What would you like to know?`;
    }
    
    // Greetings - very natural
    if (lowerMessage.match(/^(hi|hello|hey|hii|hai|good morning|good afternoon|good evening|sup|what's up)/)) {
        const greetings = [
            "Hey! 👋 How can I help you today?",
            "Hi there! What do you need help with?",
            "Hello! What's on your mind?",
            "Hey! Ready to help you with HappiMoM. What's up?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Period questions - conversational
    if (lowerMessage.includes('period') || lowerMessage.includes('menstrual') || lowerMessage.includes('cycle') || 
        lowerMessage.includes('pms') || lowerMessage.includes('ovulation') || lowerMessage.includes('fertile') ||
        lowerMessage.includes('cramps') || lowerMessage.includes('bleeding')) {
        return "Oh, period tracking! That's super helpful to stay on top of. With HappiMoM, you can track your cycle on the calendar - just click 'Start Period' when it begins. The app will predict your next period and show you when you're most fertile. You can also log symptoms like cramps or mood changes. Want me to walk you through setting it up?";
    }
    
    // Pregnancy questions - warm and supportive
    if (lowerMessage.includes('pregnancy') || lowerMessage.includes('pregnant') || lowerMessage.includes('edd') || 
        lowerMessage.includes('due date') || lowerMessage.includes('trimester') || lowerMessage.includes('baby bump') ||
        lowerMessage.includes('weeks pregnant')) {
        return "Congratulations! 🎉 That's so exciting! HappiMoM's pregnancy tracker is really helpful - it gives you week-by-week updates about how your baby's growing, helps you calculate your due date, and reminds you about doctor visits. You can even keep a journal with photos. Have you set your due date yet? I can help you figure that out!";
    }
    
    // Baby questions - enthusiastic but natural
    if (lowerMessage.includes('baby') || lowerMessage.includes('infant') || lowerMessage.includes('newborn') || 
        lowerMessage.includes('vaccination') || lowerMessage.includes('milestone') || lowerMessage.includes('feeding') || 
        lowerMessage.includes('diaper') || lowerMessage.includes('growth') || lowerMessage.includes('weight')) {
        return "Aww, babies are amazing! 💕 HappiMoM makes it easy to track everything - their growth (weight, height), when they hit milestones like first smile or first steps, vaccination schedules, feeding times, sleep patterns, even diaper changes. It's like having a little digital baby book that helps you stay organized. What would you like to track first?";
    }
    
    // Health questions - caring tone
    if (lowerMessage.includes('health') || lowerMessage.includes('symptom') || lowerMessage.includes('postpartum') || 
        lowerMessage.includes('recovery') || lowerMessage.includes('weight') || lowerMessage.includes('blood pressure')) {
        return "Taking care of yourself is so important! HappiMoM lets you track your health too - things like weight, blood pressure, symptoms, and how you're feeling during recovery. It's not just about the baby, your wellbeing matters just as much. What would you like to keep track of?";
    }
    
    // Feature questions - casual and helpful
    if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('help') || 
        lowerMessage.includes('how does') || lowerMessage.includes('how do i') || lowerMessage.includes('tell me about')) {
        return "Sure! HappiMoM is basically your all-in-one companion. You can track your period and cycle, follow your pregnancy week by week, monitor your baby's growth and milestones, keep an eye on your own health, and even have quick access to emergency info. What part are you most curious about? I can give you more details!";
    }
    
    // Calendar questions
    if (lowerMessage.includes('calendar') || lowerMessage.includes('track period') || lowerMessage.includes('log period')) {
        return "The calendar's really easy to use! Just go to the Calendar page and click 'Start Period' when your period begins. The app will automatically predict your next one and show you your fertile window. You can also add symptoms on any day. Want me to explain anything specific about it?";
    }
    
    // Default - friendly and helpful
    const responses = [
        `I'd love to help! HappiMoM can help you track your period, follow your pregnancy journey, monitor your baby's growth, and keep tabs on your health. What are you most interested in?`,
        `Sure thing! HappiMoM is here to make your life easier. Whether it's period tracking, pregnancy updates, or baby milestones - I can help you figure it out. What do you want to know?`,
        `No problem! I'm here to help you get the most out of HappiMoM. You can track periods, follow pregnancies, monitor baby growth, and more. What would you like to explore?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

async function callGeminiAPI(userMessage) {
    const prompt = `${WEBSITE_CONTEXT}\n\nUser: ${userMessage}\n\nAssistant:`;

    try {
        const apiEndpoints = [
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`
        ];

        let lastError = null;
        
        for (const endpoint of apiEndpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`API Error (${endpoint}):`, response.status, errorText);
                    lastError = new Error(`API error: ${response.status}`);
                    continue;
                }

                const data = await response.json();
                
                let botResponse = null;
                
                if (data.candidates && data.candidates[0]) {
                    const candidate = data.candidates[0];
                    if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
                        botResponse = candidate.content.parts[0].text;
                    } else if (candidate.text) {
                        botResponse = candidate.text;
                    }
                } else if (data.text) {
                    botResponse = data.text;
                }
                
                if (botResponse) {
                    chatHistory.push({
                        role: 'user',
                        parts: [{ text: userMessage }]
                    });
                    chatHistory.push({
                        role: 'model',
                        parts: [{ text: botResponse }]
                    });

                    return botResponse;
                } else {
                    console.error('Unexpected API response format:', data);
                    lastError = new Error('Invalid response format');
                    continue;
                }
            } catch (fetchError) {
                console.error(`Fetch error for ${endpoint}:`, fetchError);
                lastError = fetchError;
                continue;
            }
        }
        
        if (lastError) {
            throw lastError;
        }
        
        throw new Error('All API endpoints failed');
        
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

function addMessage(role, text) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return null;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'message-content';
    typingContent.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(typingContent);
    chatMessages.appendChild(typingDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
    return 'typing-indicator';
}

function removeTypingIndicator(id) {
    const typingIndicator = document.getElementById(id);
    if (typingIndicator) {
        typingIndicator.remove();
    }
}
