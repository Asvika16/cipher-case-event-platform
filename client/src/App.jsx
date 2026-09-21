import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RulesPage from './pages/RulesPage';
import LoginPage from './pages/LoginPage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import Round1Page from './pages/Round1Page';
import Round2Page from './pages/Round2Page';
import Round3Page from './pages/Round3Page';
import ResultsPage from './pages/ResultsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CluePage from './pages/CluePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-mystery-950 text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/clue/:roundId/:clueId" element={<CluePage />} />

              {/* Protected Team Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <TeamDashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/round1" 
                element={
                  <ProtectedRoute>
                    <Round1Page />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/round2" 
                element={
                  <ProtectedRoute>
                    <Round2Page />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/round3" 
                element={
                  <ProtectedRoute>
                    <Round3Page />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
