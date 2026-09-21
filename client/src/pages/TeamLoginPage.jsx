import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { KeyRound, ShieldAlert, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

const TeamLoginPage = () => {
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please check Team ID and Password.');
      }

      login(data.user, data.token);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickCredentials = (num) => {
    const formatted = `TEAM${String(num).padStart(3, '0')}`;
    setTeamId(formatted);
    setPassword(`team${String(num).padStart(3, '0')}`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 relative">
      
      <div className="w-full max-w-md bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-glow-purple relative">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <KeyRound className="w-7 h-7 text-indigo-400" />
        </div>

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            TEAM LOGIN
          </h2>
          <p className="text-xs text-indigo-300">
            Enter your team credentials to access the mystery portal.
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
              TEAM ID
            </label>
            <input
              type="text"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="e.g. TEAM001"
              className="w-full px-4 py-3 rounded-xl bg-mystery-950 border border-indigo-900/80 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors uppercase"
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
              placeholder="e.g. team001"
              className="w-full px-4 py-3 rounded-xl bg-mystery-950 border border-indigo-900/80 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ENTER MYSTERY HUNT</span>
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </>
            )}
          </button>
        </form>

        {/* Demo / Quick Test Shortcuts */}
        <div className="mt-8 pt-5 border-t border-indigo-900/50 text-center space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> DEMO QUICK FILL (TESTING)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[1, 2, 3, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => fillQuickCredentials(num)}
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

export default TeamLoginPage;
