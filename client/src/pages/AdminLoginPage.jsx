import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, ShieldAlert, ArrowRight, Lock } from 'lucide-react';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('ADMIN');
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
        body: JSON.stringify({ teamId: username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Admin login failed.');
      }

      login(data.user, data.token);
      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="w-full max-w-md bg-mystery-card border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-glow-purple relative">
        
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="w-7 h-7 text-purple-400" />
        </div>

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            ORGANIZER ADMIN PORTAL
          </h2>
          <p className="text-xs text-purple-300">
            Event Live Control & Participant Management
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
              ADMIN USERNAME
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full px-4 py-3 rounded-xl bg-mystery-950 border border-purple-900/80 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              ADMIN PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              className="w-full px-4 py-3 rounded-xl bg-mystery-950 border border-purple-900/80 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ACCESS ADMIN CONTROL</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Default Admin Password: <span className="font-mono text-purple-300">admin123</span>
        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
