import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, Shield, ShieldAlert, ArrowRight, Sparkles, User, Lock } from 'lucide-react';

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Tab mode: 'team' | 'admin'
  const [activeTab, setActiveTab] = useState('team');
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('admin')) {
      setActiveTab('admin');
      setTeamId('ADMIN');
      setPassword('admin123');
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    if (tab === 'admin') {
      setTeamId('ADMIN');
      setPassword('admin123');
    } else {
      setTeamId('');
      setPassword('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const targetId = teamId.trim().toUpperCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: targetId, password })
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server API Error (${res.status}): Non-JSON response returned. Please verify Vercel /api rewrites & MONGO_URI in environment variables.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      login(data.user, data.token);

      // Auto route based on user role
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickTeam = (num) => {
    setActiveTab('team');
    const formatted = `TEAM${String(num).padStart(3, '0')}`;
    setTeamId(formatted);
    setPassword(`team${String(num).padStart(3, '0')}`);
  };

  const fillQuickAdmin = () => {
    setActiveTab('admin');
    setTeamId('ADMIN');
    setPassword('admin123');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 relative">
      
      <div className={`w-full max-w-md bg-mystery-card border rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 relative ${
        activeTab === 'admin' ? 'border-purple-900/80 shadow-glow-purple' : 'border-indigo-900/80 shadow-glow-blue'
      }`}>
        
        {/* Tab Toggle Header */}
        <div className="grid grid-cols-2 p-1.5 bg-mystery-950/90 rounded-2xl border border-indigo-950 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange('team')}
            className={`py-2.5 rounded-xl text-xs font-bold font-heading transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'team'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" /> TEAM LOGIN
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`py-2.5 rounded-xl text-xs font-bold font-heading transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> ADMIN LOGIN
          </button>
        </div>

        {/* Icon Header */}
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 shadow-lg ${
          activeTab === 'admin' 
            ? 'bg-purple-950 border-purple-500/40 text-purple-400' 
            : 'bg-indigo-950 border-indigo-500/40 text-indigo-400'
        }`}>
          {activeTab === 'admin' ? <Shield className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
        </div>

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            {activeTab === 'admin' ? 'ORGANIZER ADMIN' : 'DETECTIVE TEAM LOGIN'}
          </h2>
          <p className="text-xs text-indigo-300">
            {activeTab === 'admin' 
              ? 'Access live event controls & participant ranking' 
              : 'Enter Team ID & Password to access mystery hunt'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-600/50 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              {activeTab === 'admin' ? 'ADMIN USERNAME' : 'TEAM ID'}
            </label>
            <input
              type="text"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder={activeTab === 'admin' ? 'ADMIN' : 'e.g. TEAM001'}
              className={`w-full px-4 py-3 rounded-xl bg-mystery-950 border text-white placeholder-slate-500 text-sm font-mono focus:outline-none transition-colors uppercase ${
                activeTab === 'admin' ? 'border-purple-900/80 focus:border-purple-500' : 'border-indigo-900/80 focus:border-indigo-500'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={activeTab === 'admin' ? 'admin123' : 'e.g. team001'}
              className={`w-full px-4 py-3 rounded-xl bg-mystery-950 border text-white placeholder-slate-500 text-sm font-mono focus:outline-none transition-colors ${
                activeTab === 'admin' ? 'border-purple-900/80 focus:border-purple-500' : 'border-indigo-900/80 focus:border-indigo-500'
              }`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 rounded-xl text-white font-heading font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-purple'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-glow-blue'
            }`}
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{activeTab === 'admin' ? 'ACCESS ADMIN CONTROL' : 'ENTER MYSTERY HUNT'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Pre-fill Testing Buttons */}
        <div className="mt-8 pt-5 border-t border-indigo-900/50 text-center space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> QUICK LOGIN SHORTCUTS
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={fillQuickAdmin}
              className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-mono font-bold transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-purple-400" /> ADMIN
            </button>

            {[1, 2, 3, 5, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => fillQuickTeam(num)}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-800/40 text-indigo-300 text-xs font-mono transition-colors"
              >
                TEAM{String(num).padStart(3, '0')}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
