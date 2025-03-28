import React, { useState, useRef, useEffect } from 'react';
import api from '../lib/axios'; // Import the axios instance
import { useAuth } from '../context/AuthContext';

const ChatInterface = () => {
  const { user } = useAuth();  
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm your DOME: Dynamic Operational Management Engine, Your assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Function to log events using the general log model
  const logEvent = async (logData) => {
    try {
      await api.post('/api/logs', logData);
    } catch (err) {
      console.error('Error logging event:', err);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userId = user ? user.email || user.id || "unknown" : "unknown";

    // Log the user's query
    const userLog = {
      timestamp: new Date().toISOString(),
      user_id: userId,
      category: "Chatbot",
      event: "User Query",
      details: {
        query: input
      }
    };
    logEvent(userLog);

    // Add user message to chat
    setMessages([...messages, { type: 'user', text: input }]);
    const userQuery = input; // Capture the query for further logging
    setInput('');
    setIsLoading(true);

    try {
      // Send the query to the backend
      const response = await api.post('/api/query', { message: userQuery });
      
      setTimeout(() => {
        // Create bot message
        const botMessage = { 
          type: 'bot', 
          text: response.data.response,
          source: response.data.source 
        };

        // Log the bot response along with the original query
        const botLog = {
          timestamp: new Date().toISOString(),
          user_id: userId,
          category: "Chatbot",
          event: "Bot Response",
          details: {
            query: userQuery,
            response: response.data.response,
            source: response.data.source
          }
        };
        logEvent(botLog);

        setMessages(prevMessages => [
          ...prevMessages, 
          botMessage
        ]);
        setIsLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error sending message:', error);

      // Log the error event along with the query
      const errorLog = {
        timestamp: new Date().toISOString(),
        user_id: userId,
        category: "Chatbot",
        event: "Error",
        details: {
          query: userQuery,
          error: error.message
        }
      };
      logEvent(errorLog);

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
    <div className="flex flex-col flex-1 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 text-white p-4 text-center font-semibold">
        DOME Chat Assistant
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div key={index} className={`flex mb-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg ${message.type === 'user' ? 'bg-gray-800 text-white rounded-br-none' : 'bg-blue-100 text-gray-900 rounded-bl-none'} max-w-md`}>
              {message.text}
              {message.source === 'knowledge_base' && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 ml-2 rounded-full">FAQ</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-blue-100 text-gray-900 animate-pulse">Typing...</div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      <div className="flex p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Ask something about IDMS ERP..."
          disabled={isLoading}
          className="flex-1 p-2 border rounded-full outline-none focus:ring-2 focus:ring-gray-600"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || input.trim() === ''}
          className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
