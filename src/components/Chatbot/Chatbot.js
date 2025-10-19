import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaTimes, FaPaperPlane, FaRobot, FaCheck } from 'react-icons/fa';
import './Chatbot.css';

// Initialize the Google Generative AI with the API key
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
let genAI;

// System instruction for the AI
const SYSTEM_INSTRUCTION = `You are a friendly and knowledgeable AI fitness assistant.  
Your role is to:  
1. Help users create personalized healthy habit plans (fitness, diet, sleep, mindfulness).  
2. Answer fitness-related queries clearly, scientifically, and in simple language.  
3. Motivate users with positive reinforcement and practical advice.  
4. Suggest small, achievable steps that encourage users to stay consistent.  
5. Keep answers engaging, concise, and easy to follow.  

Guidelines:  
- Always be encouraging and supportive, never judgmental.  
- Adapt responses to the user's fitness level (beginner, intermediate, advanced).  
- Provide clear explanations, actionable tips, and optional resources if needed.  
- Avoid medical advice; instead, recommend consulting professionals for serious health concerns.  
- Keep a conversational tone so users feel motivated to return.`;

const ChatbotIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2C7.37258 2 2 7.37258 2 14C2 20.6274 7.37258 26 14 26C20.6274 26 26 20.6274 26 14C26 7.37258 20.6274 2 14 2Z" fill="url(#chatbotGradient)" />
    <path d="M9 11C9 10.4477 9.44772 10 10 10H18C18.5523 10 19 10.4477 19 11V17C19 17.5523 18.5523 18 18 18H10C9.44772 18 9 17.5523 9 17V11Z" fill="white" />
    <path d="M12 14C12.5523 14 13 13.5523 13 13C13 12.4477 12.5523 12 12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14Z" fill="#4A6CF7" />
    <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="#4A6CF7" />
    <path d="M10 16H18V17C18 17.5523 17.5523 18 17 18H11C10.4477 18 10 17.5523 10 17V16Z" fill="#4A6CF7" />
    <defs>
      <linearGradient id="chatbotGradient" x1="14" y1="2" x2="14" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4A6CF7" />
        <stop offset="1" stopColor="#6A5ACD" />
      </linearGradient>
    </defs>
  </svg>
);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  }).toLowerCase();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  });
};

const Chatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello! I'm your fitness assistant. How can I help you today?\n\nI can help you with:\n• Creating workout plans\n• Tracking your habits\n• Nutrition advice\n• General fitness questions",
      sender: 'bot',
      timestamp: new Date().toISOString()
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [model, setModel] = useState(null);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  // Initialize the model
  useEffect(() => {
    const initializeAI = async () => {
      if (!API_KEY) {
        setMessages(prev => [...prev, {
          message: '⚠️ Error: No API key found. Please set REACT_APP_GEMINI_API_KEY in your .env file and restart the server.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
        setIsInitializing(false);
        return;
      }

    try {
        // Initialize the AI only once
        if (!genAI) {
          genAI = new GoogleGenerativeAI(API_KEY);
        }

        const newModel = genAI.getGenerativeModel({ 
          model: 'gemini-1.5-flash',
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        });

        // Do not make a network call here; just set the model for later use
        setModel(newModel);
        console.log('Gemini model initialized (no network call)');
        
      } catch (error) {
        console.error('Failed to initialize Gemini model:', error);
        setMessages(prev => [...prev, {
          message: '⚠️ Failed to set up the AI client. ' + 
                   (error.message?.includes('API key')
                     ? 'Please check your API key in the .env file and restart the server.'
                     : 'Please try again.'),
          sender: 'bot',
          timestamp: new Date().toISOString()
        }]);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAI();
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Focus input when opening chat
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = inputMessage.trim();
    if (!messageText || isTyping) return;

    // Add user message to chat
    const userMessage = { 
      message: messageText, 
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Focus input after message is sent
    setTimeout(() => inputRef.current?.focus(), 0);

    try {
      // Build conversation contents (system + short recent history + current message)
      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_INSTRUCTION }] },
        { role: 'model', parts: [{ text: 'I understand and will follow these guidelines.' }] },
        ...messages.slice(-4).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.message }]
        })),
        { role: 'user', parts: [{ text: messageText }] }
      ];

      console.log('Sending message to Gemini...');
      const result = await model.generateContent({ contents });
      const response = result.response;
      
      if (!response || typeof response.text !== 'function') {
        throw new Error('Invalid response from Gemini API');
      }
      
      // Get the response text
      let text = response.text();
      
      // Clean up the response text
      text = text
        .replace(/^[\s\n]*[-*]\s*/, '')  // Remove bullet points from start
        .replace(/\n\s*\n/g, '\n')        // Remove extra newlines
        .trim();
        
      console.log('Processed response:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
      
      // Add bot response to chat
      setMessages(prev => [
        ...prev,
        { 
          message: text, 
          sender: 'bot',
          timestamp: new Date().toISOString()
        },
      ]);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [
        ...prev,
        {
          message: 'Sorry, I encountered an error: ' + (error.message || 'Unknown error') + '. Please check the console for details.' +
                  '\n\nIf this persists, please ensure your API key is valid and has the correct permissions.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window open">
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-avatar">
                <ChatbotIcon />
              </div>
              <div className="chat-header-info">
                <h3>Fitness Assistant</h3>
                <p>{isTyping ? 'typing...' : 'online'}</p>
              </div>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          
          <div className="messages-container">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <React.Fragment key={date}>
                <div className="date-divider">
                  <span>{formatDate(date)}</span>
                </div>
                {dateMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`message ${msg.sender}`}
                  >
                    {msg.sender === 'user' && (
                      <div className="message-status">
                        <FaCheck size={10} />
                        <FaCheck size={10} style={{ marginLeft: -4 }} />
                      </div>
                    )}
                    <div className="message-content">
                      {msg.message.split('\n').map((line, i) => (
                        <div key={i}>{line || <br />}</div>
                      ))}
                    </div>
                    <div className="message-timestamp">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              disabled={isTyping || isInitializing}
              ref={inputRef}
              rows={1}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!inputMessage.trim() || isTyping || isInitializing}
              title="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
      <button 
        className={`chatbot-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        title={isOpen ? 'Close chat' : 'Chat with us'}
      >
        {isOpen ? (
          <FaTimes />
        ) : (
          <FaRobot />
        )}
      </button>
    </div>
  );
};

export default Chatbot;
