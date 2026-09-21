import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, Unlock, ShieldCheck, AlertCircle, ArrowRight, UserCheck, Sparkles, CheckCircle2, Trophy } from 'lucide-react';

const TeamDashboardPage = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const [roundsStatus, setRoundsStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStatus = async () => {
      try {
        await fetchUser(); // Refresh user status
        const res = await fetch('/api/rounds/status');
        if (res.ok) {
          const data = await res.json();
          setRoundsStatus(data.rounds);
        }
      } catch (err) {
        console.error('Error loading round statuses:', err);
      } finally {
        setLoading(false);
      }
    };

    getStatus();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get status for each round
  const r1 = roundsStatus.find(r => r.roundNumber === 1);
  const r2 = roundsStatus.find(r => r.roundNumber === 2);
  const r3 = roundsStatus.find(r => r.roundNumber === 3);

  // Lock logic
  const r1Unlocked = r1 && r1.status !== 'not_started';
  const r2Unlocked = user.qualifiedRound2 && r2 && r2.status !== 'not_started';
  const r3Unlocked = user.qualifiedRound3 && r3 && r3.status !== 'not_started';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'qualified':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> QUALIFIED</span>;
      case 'eliminated':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-500/40 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> NOT QUALIFIED</span>;
      case 'WINNER':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> 🏆 EVENT WINNER</span>;
      case 'RUNNER UP':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-200 border border-slate-400 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> 🥈 RUNNER UP</span>;
      case 'SECOND RUNNER UP':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-400 border border-amber-700 flex items-center gap-1"><Trophy className="w-3.5 h-3.5" /> 🥉 2ND RUNNER UP</span>;
      case 'FINALIST':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-500/40 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> FINALIST</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/40 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-400" /> TEAM DASHBOARD
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            Welcome, <span className="text-indigo-300">{user.teamId}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user.teamName} • Members: {user.members.join(', ')}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">STATUS</span>
          {getStatusBadge(user.status)}
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-indigo-600/10 blur-2xl pointer-events-none" />
      </div>

      {/* Round Progression Header */}
      <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> MYSTERY HUNT STAGES
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Rounds unlock dynamically as the organizer starts them
        </span>
      </div>

      {/* Rounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ROUND 1 CARD */}
        <div className={`bg-mystery-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
          r1Unlocked ? 'border-indigo-500/50 shadow-glow-purple' : 'border-indigo-950 opacity-80'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400">ROUND 01</span>
              {r1Unlocked ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Available
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Locked
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-white">ROUND 1 – IDENTIFY</h3>
              <p className="text-xs text-indigo-300 font-semibold mt-0.5">Case: The Missing Event File</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                10 Questions • 15 Minutes limit • Top 10 Teams Qualify
              </p>
            </div>
          </div>

          <div>
            {r1Unlocked ? (
              <Link
                to="/round1"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-xs sm:text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
              >
                <span>ENTER ROUND 1</span>
                <ArrowRight className="w-4 h-4 text-indigo-200" />
              </Link>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold text-center">
                Round not started by organizer
              </div>
            )}
          </div>
        </div>

        {/* ROUND 2 CARD */}
        <div className={`bg-mystery-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
          r2Unlocked ? 'border-purple-500/50 shadow-glow-purple' : 'border-indigo-950 opacity-80'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400">ROUND 02</span>
              {r2Unlocked ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Available
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Locked
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-white">ROUND 2 – TRACE</h3>
              <p className="text-xs text-purple-300 font-semibold mt-0.5">Case: The Unknown Message</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                8 Questions • 20 Minutes limit • Hints Available (-2 marks penalty) • Top 5 Qualify
              </p>
            </div>
          </div>

          <div>
            {r2Unlocked ? (
              <Link
                to="/round2"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-bold text-xs sm:text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
              >
                <span>ENTER ROUND 2</span>
                <ArrowRight className="w-4 h-4 text-purple-200" />
              </Link>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold text-center">
                {!user.qualifiedRound2 ? 'Requires Round 1 Qualification' : 'Round not started by organizer'}
              </div>
            )}
          </div>
        </div>

        {/* ROUND 3 CARD */}
        <div className={`bg-mystery-card rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
          r3Unlocked ? 'border-amber-500/50 shadow-glow-gold' : 'border-indigo-950 opacity-80'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">ROUND 03</span>
              {r3Unlocked ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" /> Available
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" /> Locked
                </span>
              )}
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-white">ROUND 3 – CRACK THE CASE</h3>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">Case: The Final File</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                5 Major Tasks • 25 Minutes limit • Top 3 Winners Selected
              </p>
            </div>
          </div>

          <div>
            {r3Unlocked ? (
              <Link
                to="/round3"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-heading font-bold text-xs sm:text-sm shadow-glow-gold transition-all flex items-center justify-center gap-2"
              >
                <span>ENTER FINAL ROUND 3</span>
                <ArrowRight className="w-4 h-4 text-amber-200" />
              </Link>
            ) : (
              <div className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 text-xs font-semibold text-center">
                {!user.qualifiedRound3 ? 'Requires Round 2 Qualification' : 'Round not started by organizer'}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default TeamDashboardPage;
