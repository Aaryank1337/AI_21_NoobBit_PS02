import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/axios'; // Import the axios instance

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your DOME: Dynamic Operational Management Engine , Your assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send message to backend using axios
      const response = await api.post('/api/query', { message: input });
      
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages, 
          { 
            type: 'bot', 
            text: response.data.response,
            source: response.data.source // 'knowledge_base' or 'llm'
          }
        ]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          type: 'bot', 
          text: 'Sorry, I encountered an error. Please try again or contact support.'
        }
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>DOME</h2>
      </div>
      
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.text}
              {message.source === 'knowledge_base' && (
                <span className="source-badge">FAQ</span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="loading-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask something about IDMS ERP..."
          disabled={isLoading}
        />
        <button 
          onClick={handleSendMessage}
          disabled={isLoading || input.trim() === ''}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;