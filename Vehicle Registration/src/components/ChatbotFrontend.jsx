import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import './ChatbotFrontend.css';

const ChatbotFrontend = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! Let me know if you need help with vehicle registration.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply || "Sorry, I had an error." }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Lost connection to the server. Please ensure backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {isOpen && (
        <div className="chatbot-window animate-fade-in">
          <div className="chatbot-header">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <Bot size={18} /> AI Assistant
            </h4>
            <button onClick={() => setIsOpen(false)} className="close-btn"><X size={18} /></button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble ai typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
          <div className="chatbot-footer">
            <input 
              type="text" 
              placeholder="Type your query..." 
              className="chat-input" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chat-send" onClick={handleSend} disabled={isTyping}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ask AI Assistant"
      >
        <Bot size={24} color="#fff" />
      </button>
    </div>
  );
};

export default ChatbotFrontend;
