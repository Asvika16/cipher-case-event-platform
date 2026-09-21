import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, Sparkles, ArrowLeft, Clock, HelpCircle, ShieldAlert } from 'lucide-react';

const CluePage = () => {
  const { roundId, clueId } = useParams();
  const [clue, setClue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fullKey = `${roundId}-${clueId}`;

  useEffect(() => {
    fetchClue();
  }, [fullKey]);

  const fetchClue = async () => {
    try {
      const res = await fetch(`/api/clues/${fullKey}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Clue not found.');
      setClue(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !clue) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-2xl font-heading font-bold text-white">INVALID QR CLUE CODE</h2>
        <p className="text-xs text-slate-400">{error || 'This QR clue link is invalid or expired.'}</p>
        <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      
      <Link 
        to="/dashboard" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-mystery-card border border-cyan-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-glow-purple relative overflow-hidden">
        
        {/* Header Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest">
          <Search className="w-4 h-4 text-cyan-400" /> {clue.title}
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          DISCOVERED QR EVIDENCE CLUE
        </h1>

        <div className="p-5 rounded-2xl bg-mystery-950 border border-cyan-900/60 text-slate-200 text-sm leading-relaxed font-sans font-medium space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block font-mono">
            VERIFIED CLUE TEXT:
          </span>
          <p>{clue.clue}</p>
        </div>

        {clue.hint && (
          <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 text-xs space-y-1">
            <span className="font-bold flex items-center gap-1 text-indigo-400">
              <HelpCircle className="w-3.5 h-3.5" /> INVESTIGATION TIP:
            </span>
            <p className="text-slate-300">{clue.hint}</p>
          </div>
        )}

        <div className="text-[11px] text-slate-500 text-center font-mono">
          Cipher Case Digital Evidence Portal • Verified Server Clue Token
        </div>

      </div>
    </div>
  );
};

export default CluePage;
