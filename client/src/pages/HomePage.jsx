import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Compass, ShieldCheck, Trophy, Lock, KeyRound, FileText, Sparkles, Target, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background ambient glow circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
        
        {/* Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-glow-purple animate-pulse-slow">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Observe. Connect. Solve.</span>
        </div>

        {/* Main Header */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-7xl font-heading font-black tracking-tight text-white drop-shadow-lg">
            CIPHER CASE
          </h1>
          <p className="text-xl sm:text-3xl font-heading font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent uppercase tracking-wider">
            THE MYSTERY HUNT
          </p>
        </div>

        {/* Subtitle / Event Quick Stats */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold tracking-wide text-slate-300 bg-mystery-card px-6 py-3 rounded-2xl border border-indigo-900/60 shadow-lg">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Target className="w-4 h-4" /> 30 Teams
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <Compass className="w-4 h-4" /> 3 Rounds
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <Trophy className="w-4 h-4" /> 1 Final Case
          </span>
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans font-normal">
          Put your observation, logical thinking and detective skills to the test. 
          Follow the clues, connect the evidence and crack the case in this non-technical college mystery challenge.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-base shadow-glow-purple transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-5 h-5 text-indigo-200" /> TEAM LOGIN
          </Link>

          <Link
            to="/rules"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-heading font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:border-indigo-500/50"
          >
            <FileText className="w-5 h-5 text-indigo-400" /> EVENT RULES
          </Link>
        </div>

        {/* Round Progression Cards */}
        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          
          <div className="bg-mystery-card p-5 rounded-2xl border border-indigo-900/50 relative group hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-indigo-400">ROUND 01</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60">30 TEAMS</span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">Identify The Case</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">Reconstruct the missing event file timeline & suspect statements.</p>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Top 10 Teams Qualify
            </span>
          </div>

          <div className="bg-mystery-card p-5 rounded-2xl border border-purple-900/50 relative group hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-purple-400">ROUND 02</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">TOP 10 TEAMS</span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">Trace The Clues</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">Decode hidden ciphers, QR clues & network IP timestamps.</p>
            <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Top 5 Teams Qualify
            </span>
          </div>

          <div className="bg-mystery-card p-5 rounded-2xl border border-amber-900/50 relative group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-amber-400">ROUND 03</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60">TOP 5 TEAMS</span>
            </div>
            <h3 className="font-heading font-bold text-white text-base mb-1">Crack The Case</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">Solve the 5 major mystery tasks & unmask the mastermind.</p>
            <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" /> Top 3 Winners Crowned
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default HomePage;
