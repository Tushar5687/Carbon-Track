import React from "react";
import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#013220] dark:bg-[#013220] font-sans text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#013220]/80 dark:bg-[#013220]/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 border-b border-gray-300/20 dark:border-gray-300/20">
            <div className="flex items-center gap-3">
              <div className="text-white h-8 w-8">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-white">Carbon Neutrality</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <SignedIn>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-4 py-2 text-sm font-bold bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  My Profile
                </button>
                <UserButton />
                <SignOutButton>
                  <button className="px-4 py-2 text-sm font-bold bg-white text-[#013220] rounded-lg hover:bg-gray-100 transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAbvY45FuEgyCZSolW0uumh-B5B2FCARFj4XDUG2q-g2SavWQcrdM29VOfsY6T0KZIvrZ2IOhROH51gcNaEY9WARGGwJ_6fHAhZVpRWO1GYn-g0xwUA_klzOF8TrYCu5YEzCwf3JNd9Y8toOPfvUYbm6XoIirjAMfN0yOiZUECpH81Ok1P3OfK0nNonSek0bgQF1CycuTfyfMRqqnMJ1nr9R5z7x2Tu4UQlKXjJIfzDiwhQLTUHj-odZV1CWVVbS1qfKruKlmvToA")'
            }}
          ></div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <SignedOut>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                  Track. Analyze. Neutralize Carbon Emissions.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300">
                  Your carbon neutrality pathway platform for coal mines. We provide the tools and insights to help you achieve your sustainability goals.
                </p>
              </SignedOut>
              
              <SignedIn>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
                  Welcome Back to Carbon Neutrality
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300">
                  Continue your sustainability journey. Access your mine analytics, generate reports, and track your carbon reduction progress.
                </p>
              </SignedIn>
              
              <div className="mt-8 flex justify-center gap-4">
                <SignedOut>
                  <a href="/login" className="px-8 py-3 text-base font-bold bg-white text-[#013220] rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                    Get Started
                  </a>
                </SignedOut>
                <SignedIn>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => navigate('/profile')}
                      className="px-8 py-3 text-base font-bold bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors shadow-lg border border-white/30"
                    >
                      View My Mines
                    </button>
                    <button 
                      onClick={() => navigate('/documents')}
                      className="px-8 py-3 text-base font-bold bg-white text-[#013220] rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Analyze Documents
                    </button>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-[#013220]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Key Features</h2>
              <p className="mt-4 text-lg text-gray-300">
                Everything you need to manage and reduce your carbon footprint.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">Mine Portfolio Management</h3>
                <p className="text-gray-300 text-sm">
                  Organize and track all your mines in one place with individual analytics and reporting.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-white mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-300 text-sm">
                  Get intelligent emission insights and reduction recommendations using advanced AI algorithms.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col bg-white/10 p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-white mb-2">Carbon Reduction Tracking</h3>
                <p className="text-gray-300 text-sm">
                  Monitor your progress towards carbon neutrality with detailed metrics and trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#006400] py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SignedOut>
              <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
                Ready to start your journey towards carbon neutrality?
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Join us and take the first step towards a sustainable future for your coal mine.
              </p>
              <div className="mt-8">
                <a href="/login" className="px-8 py-3 text-base font-bold bg-white text-[#006400] rounded-lg hover:bg-gray-100 transition-colors shadow-lg">
                  Get Started
                </a>
              </div>
            </SignedOut>
            
            <SignedIn>
              <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
                Continue Your Carbon Neutrality Journey
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Access your mine analytics, generate new reports, and track your emission reduction progress.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-8 py-3 text-base font-bold bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors shadow-lg border border-white/30"
                >
                  View Mine Portfolio
                </button>
                <button 
                  onClick={() => navigate('/documents')}
                  className="px-8 py-3 text-base font-bold bg-white text-[#006400] rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Analyze New Document
                </button>
              </div>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#013220] border-t border-gray-300/20 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 Carbon Neutrality Platform. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Empowering coal mines towards sustainable operations
          </p>
        </div>
      </footer>
    </div>
  );
}