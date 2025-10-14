// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  useAuth
} from '@clerk/clerk-react';
import Home from './components/Home.jsx';
import Documents from './components/Documents.jsx';
import ProfileSetup from './components/ProfileSetup.jsx';
import Profile from './components/Profile.jsx';
import MineAnalytics from './components/MineAnalytics.jsx';
import DashboardPage from './components/DashboardPage.jsx';
import InsightsPage from './components/InsightsPage.jsx';
import { useUserProfile } from './context/UserContext';

function ProfileCheck({ children }) {
  const { isLoaded, user } = useAuth();
  const { userProfile } = useUserProfile();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (user && !userProfile) {
    if (window.location.pathname !== '/profile-setup') {
      return <ProfileSetup />;
    }
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <SignedOut>
            <SignIn 
              routing="path" 
              path="/login"
              signUpUrl="/register"
            />
          </SignedOut>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <SignedOut>
            <SignUp 
              routing="path" 
              path="/register"
              signInUrl="/login"
            />
          </SignedOut>
        } 
      />

      <Route path="/" element={<Home />} />

      <Route
        path="/documents"
        element={
          <SignedIn>
            <ProfileCheck>
              <Documents />
            </ProfileCheck>
          </SignedIn>
        }
      />

      <Route
        path="/dashboard"
        element={
          <SignedIn>
            <ProfileCheck>
              <DashboardPage />
            </ProfileCheck>
          </SignedIn>
        }
      />

      {/* ADD INSIGHTS ROUTE */}
      <Route
        path="/insights"
        element={
          <SignedIn>
            <ProfileCheck>
              <InsightsPage />
            </ProfileCheck>
          </SignedIn>
        }
      />

      <Route
        path="/profile"
        element={
          <SignedIn>
            <ProfileCheck>
              <Profile />
            </ProfileCheck>
          </SignedIn>
        }
      />

      <Route
        path="/mine-analytics/:mineId"
        element={
          <SignedIn>
            <ProfileCheck>
              <MineAnalytics />
            </ProfileCheck>
          </SignedIn>
        }
      />

      <Route
        path="/profile-setup"
        element={
          <SignedIn>
            <ProfileSetup />
          </SignedIn>
        }
      />

      <Route
        path="*"
        element={
          <SignedOut>
            <SignIn routing="path" />
          </SignedOut>
        }
      />
    </Routes>
  );
}