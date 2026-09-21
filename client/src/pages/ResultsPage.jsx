import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Medal, Sparkles, Clock, ShieldCheck, UserCheck } from 'lucide-react';

const ResultsPage = () => {
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/teams/results');
      const data = await res.json();
      setResultsData(data);

      if (data.published) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error loading results:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!resultsData || !resultsData.published) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-mystery-card border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-glow-gold">
          <Clock className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white">
          OFFICIAL RESULTS PENDING
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
          {resultsData?.message || 'The official Cipher Case championship results have not been published yet. Check back soon after the organizers finalize Round 3!'}
        </p>
      </div>
    );
  }

  const { winner, runnerUp, secondRunnerUp, finalists } = resultsData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest shadow-glow-gold">
          <Trophy className="w-4 h-4 text-amber-400" /> EVENT CHAMPIONS CROWNED
        </div>
        <h1 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-white">
          CIPHER CASE – FINAL RESULTS
        </h1>
        <p className="text-sm text-slate-300">
          Congratulations to all detectives and finalists of the Cipher Case Mystery Hunt!
        </p>
      </div>

      {/* Podium Cards (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        
        {/* 2nd Place - Runner Up */}
        {runnerUp && (
          <div className="bg-mystery-card border border-slate-600/60 rounded-3xl p-6 text-center space-y-4 shadow-xl order-2 md:order-1 transform hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-400 text-slate-200 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
              🥈
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                RUNNER UP
              </span>
              <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                {runnerUp.teamId}
              </h3>
              <p className="text-xs text-indigo-300 mt-0.5">{runnerUp.teamName}</p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
              Final Score: <span className="text-white font-bold">{runnerUp.score}/100</span>
            </div>
          </div>
        )}

        {/* 1st Place - WINNER */}
        {winner && (
          <div className="bg-gradient-to-b from-amber-950/80 via-mystery-card to-mystery-card border-2 border-amber-500 rounded-3xl p-8 text-center space-y-5 shadow-2xl shadow-glow-gold order-1 md:order-2 transform hover:-translate-y-2 transition-transform relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-heading font-black text-xs uppercase tracking-widest shadow-lg">
              ★ GRAND CHAMPION ★
            </div>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 text-slate-950 flex items-center justify-center mx-auto text-3xl font-bold shadow-xl">
              🥇
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
                EVENT WINNER
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mt-1 tracking-tight">
                {winner.teamId}
              </h2>
              <p className="text-sm text-amber-200 font-semibold mt-1">{winner.teamName}</p>
            </div>
            <div className="pt-3 border-t border-amber-900/60 text-xs text-amber-300 font-mono">
              Winning Score: <span className="text-white font-bold text-sm">{winner.score}/100</span>
            </div>
          </div>
        )}

        {/* 3rd Place - 2nd Runner Up */}
        {secondRunnerUp && (
          <div className="bg-mystery-card border border-amber-800/60 rounded-3xl p-6 text-center space-y-4 shadow-xl order-3 md:order-3 transform hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-700 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold shadow-lg">
              🥉
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
                SECOND RUNNER UP
              </span>
              <h3 className="text-2xl font-heading font-extrabold text-white mt-1">
                {secondRunnerUp.teamId}
              </h3>
              <p className="text-xs text-indigo-300 mt-0.5">{secondRunnerUp.teamName}</p>
            </div>
            <div className="pt-2 border-t border-amber-950 text-xs text-slate-400 font-mono">
              Final Score: <span className="text-white font-bold">{secondRunnerUp.score}/100</span>
            </div>
          </div>
        )}

      </div>

      {/* FINALISTS Table */}
      {finalists && finalists.length > 0 && (
        <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-indigo-900/60 pb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
              FINALISTS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {finalists.map(team => (
              <div 
                key={team.teamId}
                className="p-4 rounded-2xl bg-mystery-900 border border-indigo-950 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center font-mono font-bold text-xs">
                    {team.teamId}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-white text-sm">{team.teamName}</h4>
                    <span className="text-[11px] text-slate-400">Finalist Detective Team</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                  {team.score}/100
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ResultsPage;
