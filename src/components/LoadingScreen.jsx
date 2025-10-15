// components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-[#013220] z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Animated Logo */}
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
            <svg 
              className="w-10 h-10 text-white animate-spin" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          
          {/* Loading Text */}
          <h3 className="text-xl font-bold text-emerald-300 mb-2">
            Carbon Neutrality
          </h3>
          <p className="text-emerald-200 text-sm">
            Loading...
          </p>
          
          {/* Progress Bar */}
          <div className="w-48 h-1 bg-emerald-800 rounded-full mt-4 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-progress"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;