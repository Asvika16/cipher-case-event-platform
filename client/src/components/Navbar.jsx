import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, Shield, Trophy, LogOut, User, KeyRound, Home, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-mystery-950/90 backdrop-blur-md border-b border-indigo-900/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-0.5 shadow-glow-purple flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-mystery-950 rounded-[10px] flex items-center justify-center">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                CIPHER CASE
              </span>
              <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-indigo-400 -mt-1">
                THE MYSTERY HUNT
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'bg-indigo-900/60 text-white border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>

            <Link
              to="/rules"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/rules') ? 'bg-indigo-900/60 text-white border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <FileText className="w-4 h-4" /> Rules
            </Link>

            {user && user.role === 'team' && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard') ? 'bg-indigo-900/60 text-white border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <KeyRound className="w-4 h-4 text-purple-400" /> Dashboard
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin/dashboard') ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40' : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-400" /> Admin Control
              </Link>
            )}

            <Link
              to="/results"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/results') ? 'bg-amber-900/50 text-amber-200 border border-amber-500/40' : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/40'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Results
            </Link>
          </div>

          {/* User Status / Login Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-300">
                    {user.role === 'admin' ? 'SYSTEM ADMIN' : user.teamId}
                  </span>
                  <span className="text-[11px] text-indigo-400">
                    {user.role === 'admin' ? 'Event Organizer' : user.teamName}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/50 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-glow-purple transition-all flex items-center gap-1.5"
                >
                  <User className="w-4 h-4" /> LOGIN PORTAL
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
