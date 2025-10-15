// components/Home.jsx
import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Simulate loading between pages
  const navigateWithLoading = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {loading && <LoadingScreen />}
      
      <div className="min-h-screen bg-gradient-to-br from-[#013220] via-[#006400] to-[#004d00] font-sans text-white">
        {/* Navigation */}
        <header className="sticky top-0 z-50 bg-[#013220]/90 backdrop-blur-sm border-b border-emerald-500/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-3">
                <div className="text-white h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                  Carbon Track
                </h2>
              </div>
              
              <nav className="hidden md:flex items-center gap-6">
                <SignedIn>
                <button 
                  onClick={() => navigateWithLoading('/')}
                  className="text-emerald-200 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Home
                </button>
                
                  <button 
                    onClick={() => navigateWithLoading('/profile')}
                    className="text-emerald-200 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                  >
                    Mines
                  </button>
                </SignedIn>
              </nav>
              
              <div className="flex items-center gap-3">
                <SignedIn>
                  <UserButton />
                 
                </SignedIn>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow">
          <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#013220]/80 to-[#006400]/80"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-400/10 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-ping"></div>

            <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-4xl mx-auto">
                <SignedOut>
                  {/* Hero Content for Signed Out Users */}
                  <div className="space-y-8">
                    <div className="animate-fade-in-up">
                      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                        <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                          Track. Analyze. 
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                          Neutralize.
                        </span>
                      </h1>
                    </div>
                    
                    <div className="animate-fade-in-up animation-delay-200">
                      <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                        Your comprehensive carbon neutrality platform for coal mines. 
                        AI-powered insights to help you achieve sustainability goals.
                      </p>
                    </div>

                    <div className="animate-fade-in-up animation-delay-400 pt-8">
                      <a 
                        href="/login" 
                        className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 transform"
                      >
                        Get Started
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  {/* Hero Content for Signed In Users */}
                  <div className="space-y-8">
                    <div className="animate-fade-in-up">
                      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight">
                        <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
                          Welcome Back
                        </span>
                      </h1>
                    </div>
                    
                    <div className="animate-fade-in-up animation-delay-200">
                      <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                        Continue your journey towards carbon neutrality. 
                        Access your mine analytics and generate insightful reports.
                      </p>
                    </div>

                    <div className="animate-fade-in-up animation-delay-400 pt-8">
                      <button 
                        onClick={() => navigateWithLoading('/profile')}
                        className="inline-flex items-center px-8 py-4 text-lg font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105 transform"
                      >
                        View Mines
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </SignedIn>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 md:py-28 bg-gradient-to-b from-transparent to-[#013220]/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent mb-6">
                  Powerful Features
                </h2>
                <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                  Everything you need to manage and reduce your carbon footprint effectively.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🏭",
                    title: "Operational Mines Management",
                    description: "Organize and track all your mines with individual analytics and comprehensive reporting."
                  },
                  {
                    icon: "🤖",
                    title: "AI-Powered Analysis",
                    description: "Get intelligent emission insights and actionable recommendations using advanced AI algorithms."
                  },
                  {
                    icon: "📊",
                    title: "Real-time Dashboards",
                    description: "Monitor your carbon reduction progress with interactive charts and real-time metrics."
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105 hover:bg-white/15"
                  >
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-emerald-100 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#013220] border-t border-emerald-500/20 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-emerald-200">
              © 2024 Carbon Neutrality Platform. Empowering sustainable mining operations.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}