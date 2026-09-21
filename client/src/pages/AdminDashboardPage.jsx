import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import QRCodeClue from '../components/QRCodeClue';
import { Shield, Play, Square, CheckCircle2, RotateCcw, Trophy, Users, Clock, AlertTriangle, Eye, Sparkles, Download, KeyRound } from 'lucide-react';

const AdminDashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'teams' | 'qr' | 'dev'

  useEffect(() => {
    fetchAdminOverview();
  }, []);

  const fetchAdminOverview = async () => {
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOverview(data);
      }
    } catch (err) {
      console.error('Error fetching admin overview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRound = async (roundNumber) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/start-round', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roundNumber })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchAdminOverview();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEndRound = async (roundNumber) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/end-round', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roundNumber })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchAdminOverview();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalizeRound = async (roundNumber) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/finalize-round', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ roundNumber })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchAdminOverview();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleResults = async (publish) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/toggle-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ publish })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchAdminOverview();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDevReset = async (action, roundNumber = null) => {
    if (!window.confirm('TEST MODE ACTION: Are you sure you want to proceed with this reset?')) return;
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, roundNumber })
      });
      const data = await res.json();
      setMessage(data.message);
      await fetchAdminOverview();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const rounds = overview?.rounds || [];
  const teams = overview?.teams || [];

  const r1 = rounds.find(r => r.roundNumber === 1);
  const r2 = rounds.find(r => r.roundNumber === 2);
  const r3 = rounds.find(r => r.roundNumber === 3);

  const formatSeconds = (sec) => {
    if (!sec || sec === 999999) return 'N/A';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Admin Title Banner */}
      <div className="bg-mystery-card border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-purple-400" /> ORGANIZER CONTROL CENTER
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            CIPHER CASE ADMIN DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Live Event Control • Automatic Top 10 → Top 5 → Top 3 Qualification Engine
          </p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'live' ? 'bg-purple-600 text-white shadow-glow-purple' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            LIVE CONTROLS
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'teams' ? 'bg-purple-600 text-white shadow-glow-purple' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            30 TEAMS TABLE
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qr' ? 'bg-purple-600 text-white shadow-glow-purple' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            QR CLUES
          </button>

          <button
            onClick={() => setActiveTab('dev')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dev' ? 'bg-red-900/80 text-red-200 border border-red-500/40' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            DEV / TEST MODE
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-purple-950/90 border border-purple-500/40 text-purple-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-fadeIn">
          <span className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> {message}
          </span>
          <button onClick={() => setMessage('')} className="text-xs text-purple-400 font-bold hover:underline">Dismiss</button>
        </div>
      )}

      {/* TAB 1: LIVE EVENT CONTROL */}
      {activeTab === 'live' && (
        <div className="space-y-8">
          
          {/* Round Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Round 1 Controller */}
            <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">ROUND 01</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase ${
                  r1?.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}>
                  {r1?.status}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-white text-lg">ROUND 1 – IDENTIFY</h3>
                <p className="text-xs text-slate-400">30 Teams • 15 Mins • Top 10 Qualify</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-indigo-950">
                <button
                  onClick={() => handleStartRound(1)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> START ROUND 1
                </button>

                <button
                  onClick={() => handleEndRound(1)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-slate-400" /> END ROUND 1
                </button>

                <button
                  onClick={() => handleFinalizeRound(1)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> FINALIZE ROUND 1 (GENERATE TOP 10)
                </button>
              </div>
            </div>

            {/* Round 2 Controller */}
            <div className="bg-mystery-card border border-purple-900/60 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">ROUND 02</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase ${
                  r2?.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}>
                  {r2?.status}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-white text-lg">ROUND 2 – TRACE</h3>
                <p className="text-xs text-slate-400">Top 10 Teams • 20 Mins • Top 5 Qualify</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-purple-950">
                <button
                  onClick={() => handleStartRound(2)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> START ROUND 2
                </button>

                <button
                  onClick={() => handleEndRound(2)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-slate-400" /> END ROUND 2
                </button>

                <button
                  onClick={() => handleFinalizeRound(2)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-purple"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> FINALIZE ROUND 2 (GENERATE TOP 5)
                </button>
              </div>
            </div>

            {/* Round 3 Controller */}
            <div className="bg-mystery-card border border-amber-900/60 rounded-3xl p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">ROUND 03</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase ${
                  r3?.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-slate-900 text-slate-400'
                }`}>
                  {r3?.status}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-extrabold text-white text-lg">ROUND 3 – CRACK</h3>
                <p className="text-xs text-slate-400">Top 5 Finalists • 25 Mins • Top 3 Winners</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-amber-950">
                <button
                  onClick={() => handleStartRound(3)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> START ROUND 3
                </button>

                <button
                  onClick={() => handleEndRound(3)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-slate-400" /> END ROUND 3
                </button>

                <button
                  onClick={() => handleFinalizeRound(3)}
                  disabled={actionLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-gold"
                >
                  <Trophy className="w-3.5 h-3.5" /> FINALIZE ROUND 3 (GENERATE TOP 3)
                </button>
              </div>
            </div>

          </div>

          {/* Results Control Switch */}
          <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-heading font-bold text-white text-base">PUBLIC RESULTS PAGE PUBLISH CONTROL</h4>
              <p className="text-xs text-slate-400">Control whether the /results page displays the final podium winners to participants.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleResults(true)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-glow-gold"
              >
                <Trophy className="w-4 h-4" /> PUBLISH RESULTS PAGE
              </button>

              <button
                onClick={() => handleToggleResults(false)}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                HIDE RESULTS PAGE
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: ALL 30 TEAMS TABLE */}
      {activeTab === 'teams' && (
        <div className="bg-mystery-card border border-purple-900/60 rounded-3xl p-6 space-y-6 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-indigo-900/60 pb-4">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" /> REGISTERED TEAMS LEADERBOARD (30 TEAMS)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Sorted by Team ID</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-indigo-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 font-mono bg-mystery-950">
                  <th className="p-3">TEAM ID</th>
                  <th className="p-3">STATUS</th>
                  <th className="p-3">ROUND 1 SCORE</th>
                  <th className="p-3">ROUND 1 TIME</th>
                  <th className="p-3">ROUND 2 SCORE</th>
                  <th className="p-3">HINTS</th>
                  <th className="p-3">ROUND 3 SCORE</th>
                  <th className="p-3">R3 TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-950 text-xs text-slate-300 font-mono">
                {teams.map(t => (
                  <tr key={t.teamId} className="hover:bg-indigo-950/40 transition-colors">
                    <td className="p-3 font-bold text-white font-sans flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      {t.teamId}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        t.status === 'qualified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        t.status === 'eliminated' ? 'bg-red-950 text-red-400 border border-red-900' :
                        t.status === 'WINNER' ? 'bg-amber-950 text-amber-300 font-extrabold border border-amber-500' :
                        t.status === 'RUNNER UP' ? 'bg-slate-900 text-slate-200 border border-slate-500' :
                        t.status === 'SECOND RUNNER UP' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-indigo-950 text-indigo-300'
                      }`}>
                        {t.status}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-indigo-300">{t.round1.score}/50</td>
                    <td className="p-3">{formatSeconds(t.round1.timeTaken)}</td>
                    <td className="p-3 font-bold text-purple-300">{t.qualifiedRound2 ? `${t.round2.score}/50` : 'Locked'}</td>
                    <td className="p-3">{t.round2.hintsUsed || 0}</td>
                    <td className="p-3 font-bold text-amber-300">{t.qualifiedRound3 ? `${t.round3.score}/100` : 'Locked'}</td>
                    <td className="p-3">{formatSeconds(t.round3.timeTaken)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: QR CLUES MANAGEMENT */}
      {activeTab === 'qr' && (
        <div className="space-y-6">
          <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 space-y-2">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" /> QR CODE EVIDENCE CLUE GENERATOR
            </h3>
            <p className="text-xs text-slate-300">
              Print or download QR codes to place around the physical event venue!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QRCodeClue
              clueUrl="/clue/round1/hidden1"
              clueId="round1-hidden1"
              title="Round 1 Hidden Clue QR"
              showDownload={true}
            />

            <QRCodeClue
              clueUrl="/clue/round2/hidden1"
              clueId="round2-hidden1"
              title="Round 2 QR Evidence #04"
              showDownload={true}
            />

            <QRCodeClue
              clueUrl="/clue/round3/hidden1"
              clueId="round3-hidden1"
              title="Round 3 Master Clue QR"
              showDownload={true}
            />
          </div>
        </div>
      )}

      {/* TAB 4: DEVELOPMENT / TEST MODE */}
      {activeTab === 'dev' && (
        <div className="bg-mystery-card border border-red-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-red-900/60 pb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-xl font-heading font-extrabold text-white">DEVELOPMENT / TEST MODE CONTROLS</h3>
              <p className="text-xs text-slate-400">Use these controls during testing to reset teams, submissions, or restart rounds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl bg-red-950/40 border border-red-900/50 space-y-3">
              <h4 className="font-heading font-bold text-red-300 text-sm">COMPLETE EVENT RESET</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Resets all 30 teams, clears all submissions, and reverts all round statuses back to initial fresh state.
              </p>
              <button
                onClick={() => handleDevReset('reset_all')}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> RESET ALL TEAMS & SUBMISSIONS
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-mystery-950 border border-indigo-900/60 space-y-3">
              <h4 className="font-heading font-bold text-slate-200 text-sm">SPECIFIC ROUND RESET</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clears submissions for a single round to re-test timer & answers.
              </p>
              <div className="flex gap-2">
                {[1, 2, 3].map(rNum => (
                  <button
                    key={rNum}
                    onClick={() => handleDevReset('reset_round', rNum)}
                    disabled={actionLoading}
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold"
                  >
                    RESET R{rNum}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
