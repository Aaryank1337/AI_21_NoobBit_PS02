import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("chatbot");
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/'); // Navigates to LandingPage
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col justify-between">
        <div>
          <div className="p-4 text-2xl font-bold">DOME</div>
          <nav>
            <ul>
              <li 
                className={`p-4 cursor-pointer hover:bg-gray-700 ${activeTab === 'chatbot' ? 'bg-gray-700' : ''}`}
                onClick={() => setActiveTab('chatbot')}
              >
                Chatbot
              </li>
              {user && user.role === "admin" && (
                <li 
                  className={`p-4 cursor-pointer hover:bg-gray-700 ${activeTab === 'analytics' ? 'bg-gray-700' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </li>
              )}
            </ul>
          </nav>
        </div>
        <div className="p-4">
          <button 
            onClick={handleSignOut} 
            className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          {activeTab === 'chatbot' && <ChatInterface />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
        </main>
      </div>
    </div>
  );
};

export default Home;
