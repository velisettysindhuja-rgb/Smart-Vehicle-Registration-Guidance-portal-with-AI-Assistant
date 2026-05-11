import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Mic, MicOff } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AIAssistantPage.css';

const AIAssistantPage = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your Synvora registration guide. Ask me anything about vehicle registration, ownership transfers, or road tax.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // Record query visually to Firestore database
      await addDoc(collection(db, 'chats'), {
        user: localStorage.getItem('username') || 'Unknown User',
        query: userMsg,
        timestamp: new Date().toISOString()
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || "Sorry, I had an error validating my intelligence feed." }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Lost connection to the AI processing core. Please ensure backend services are physically running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not natively support the Web Speech API.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setInput(transcript); 
    };
    
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="ai-page-container fade-in">
      <div className="ai-header">
        <div className="ai-header-icon-wrapper purple-glow">
          <Bot size={28} />
        </div>
        <div className="ai-header-text">
          <h1>Synvora Intelligence Platform</h1>
          <p>Real-time conversational agent dedicated to registration routing and data verification.</p>
        </div>
      </div>

      <div className="ai-chat-card glass-panel">
        <div className="ai-chat-body panel-scroll">
          {messages.map((msg, idx) => (
            <div key={idx} className={`ai-message-row ${msg.sender}`}>
              <div className="message-icon">
                {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="ai-message-row ai typing">
              <div className="message-icon">
                <Bot size={20} />
              </div>
              <div className="message-bubble">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>

        <div className="ai-chat-footer">
          <button 
            className={`mic-btn ${isListening ? 'listening' : ''}`} 
            onClick={startListening} 
            title={isListening ? "Listening..." : "Speak to AI"}
            disabled={isTyping}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input 
            type="text" 
            id="chatInput"
            placeholder="Type your question closely..." 
            className="ai-chat-input" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="ai-chat-send btn btn-primary" onClick={handleSend} disabled={isTyping || !input.trim()}>
            <Send size={18} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
