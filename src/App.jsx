import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import NavBar from './components/NavBar';
import EmergencyHelp from './components/EmergencyHelp';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CommunityForum from './pages/CommunityForum';
import SelfCareLibrary from './pages/SelfCareLibrary';
import ProfileSettings from './pages/ProfileSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none z-0"></div>
          
          <div className="relative z-10">
            <NavBar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/library" element={<SelfCareLibrary />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/forum" 
                element={
                  <ProtectedRoute>
                    <CommunityForum />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileSettings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <EmergencyHelp />
          </div>
        </div>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
}

export default App;
