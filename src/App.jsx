import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import Home from "./components/Home.jsx";
import Documents from "./components/Documents.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={<SignIn path="/login" routing="path" signUpUrl="/register" />} 
      />
      <Route 
        path="/register" 
        element={<SignUp path="/register" routing="path" signInUrl="/login" />} 
      />

      {/* Home page - accessible to all */}
      <Route path="/" element={<Home />} />

      {/* Protected documents route */}
      <Route
        path="/documents"
        element={
          <>
            <SignedIn>
              <Documents />
            </SignedIn>
            <SignedOut>
              <SignIn path="/login" routing="path" />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
}