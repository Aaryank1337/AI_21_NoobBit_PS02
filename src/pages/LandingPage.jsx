import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">DOME</h1>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              AI CHATBOT for companies
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              OneStop to all the data in ERP.
            </p>

            <button 
            onClick={() => navigate("/auth")} 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Get Started
          </button>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png" alt="mockup" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">AI Chatbot</h3>
          <p className="text-gray-600 mt-2">Interact with our AI for seamless support and automation.</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">Database Integration</h3>
          <p className="text-gray-600 mt-2">Retrieve real-time ERP data with smart AI queries.</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800">FAQ processing</h3>
          <p className="text-gray-600 mt-2">Use AI-powered chatbot to answer FAQ.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-800 text-white mt-12">
        <p>&copy; 2025 AI Chatbot. All Rights Reserved.</p>
      </footer>
    </div>
  );
}