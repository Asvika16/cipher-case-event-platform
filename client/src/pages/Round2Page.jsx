import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Timer from '../components/Timer';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceModal from '../components/EvidenceModal';
import QRCodeClue from '../components/QRCodeClue';
import { FileText, Send, CheckCircle2, ShieldAlert, Sparkles, Clock, HelpCircle, AlertTriangle, Key } from 'lucide-react';

const round2Evidences = [
  {
    id: 'E1',
    title: 'Anonymous Email Log',
    type: 'email',
    timestamp: '7:05 PM Log',
    preview: 'Subject: "Look beyond the obvious. The answer is hidden in the sequence."',
    content: `Incoming Server Protocol Audit:
Time Received: 7:05 PM
Recipient: Event Coordinator Laptop
Header Text: "Look beyond the obvious. The answer is hidden in the sequence."`,
    details: 'Received right after the main stage session concluded.'
  },
  {
    id: 'E2',
    title: 'Decryptable Cipher Note',
    type: 'clue',
    timestamp: 'Physical Evidence #02',
    preview: 'A scribbled paper note found on the podium: "3 – 1 – 20 – 5".',
    content: `Handwritten Note Found at Podium:
"3 – 1 – 20 – 5"

Standard Cipher Key Provided:
A = 1, B = 2, C = 3 ... Z = 26`,
    details: 'Sequence converts to: C = 3, A = 1, T = 20, E = 5 -> CATE.'
  },
  {
    id: 'E3',
    title: 'Organizer Laptop Audit',
    type: 'statement',
    timestamp: '7:08 PM Inspection',
    preview: 'Meera opened the laptop at 7:08 PM and discovered the popup message.',
    content: `Statement & Terminal Log:
7:08 PM – Meera unlocked the organizer laptop screen to check registration entries and reported seeing the mysterious popup window containing the decoded sequence hint.`,
    details: 'First human detection of the message on the machine.'
  },
  {
    id: 'E4',
    title: 'Wi-Fi Access Log (QR Clue)',
    type: 'locked',
    timestamp: '7:06 PM Timestamp',
    preview: 'Server MAC log #882: External remote access established at 7:06 PM.',
    content: `Server IP Log Entry #882:
Time: 7:06 PM (1 minute after email arrival)
Protocol: Local Wi-Fi Direct Sync
Source MAC Address: XX:XX:XX:XX:3F:A1
Status: Connection Authorized via photography backup script`,
    details: 'MAC address :3F:A1 belongs to Karthik\'s photography file transfer camera hub.'
  }
];

const Round2Page = () => {
  const { token, user } = useContext(AuthContext);
  const [roundData, setRoundData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [revealedHints, setRevealedHints] = useState({}); // { qNum: hintText }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchRoundDetails();
  }, []);

  const fetchRoundDetails = async () => {
    try {
      const res = await fetch('/api/rounds/2', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoundData(data.round);
      setQuestions(data.questions);
      if (data.submission) {
        setSubmission(data.submission);
        if (data.submission.answers) setAnswers(data.submission.answers);
        if (data.submission.hintsUsed) setHintsUsed(data.submission.hintsUsed);
      }

      if (data.round && data.round.status === 'active' && !data.submission) {
        await fetch('/api/rounds/2/start', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qNum, option) => {
    if (submission && submission.submitted) return;
    setAnswers(prev => ({ ...prev, [qNum]: option }));
  };

  const handleRequestHint = async (qNum) => {
    if (submission && submission.submitted) return;
    if (hintsUsed >= 2) {
      alert('Maximum limit of 2 hints reached for Round 2!');
      return;
    }

    try {
      const res = await fetch('/api/rounds/2/use-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionNumber: parseInt(qNum) })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setHintsUsed(data.hintsUsed);
      setRevealedHints(prev => ({ ...prev, [qNum]: data.hintText }));

    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmitRound = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/rounds/2/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSubmission({
        submitted: true,
        score: data.score,
        timeTaken: data.timeTaken,
        hintsUsed: data.hintsUsed
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isSubmitted = submission && submission.submitted;
  const isRoundActive = roundData && roundData.status === 'active';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      <EvidenceModal 
        evidence={selectedEvidence} 
        onClose={() => setSelectedEvidence(null)} 
      />

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystery-950/80 backdrop-blur-md">
          <div className="bg-mystery-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center shadow-2xl shadow-glow-purple">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-heading font-extrabold text-white">SUBMIT ROUND 2 ANSWERS?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure? Once submitted, your answers cannot be changed. ({hintsUsed} hints used: -{hintsUsed * 2} marks penalty).
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                KEEP EDITING
              </button>
              <button
                onClick={handleSubmitRound}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-purple"
              >
                CONFIRM SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-mystery-card border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" /> ROUND 2 • 50 MARKS TOTAL • TOP 10 TEAMS
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            ROUND 2 – TRACE THE CLUES
          </h1>
          <p className="text-xs sm:text-sm text-purple-300 font-semibold">
            CASE: "THE UNKNOWN MESSAGE"
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 z-10">
          {isRoundActive && (
            <Timer
              startTime={submission?.startTime || roundData?.startTime}
              durationMinutes={roundData?.duration || 20}
              serverTime={new Date()}
              onTimeUp={handleSubmitRound}
              submitted={isSubmitted}
            />
          )}

          {/* Hint Counter Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <HelpCircle className="w-4 h-4 text-purple-400" /> HINTS USED: {hintsUsed}/2 (-2 Marks each)
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-950/80 border border-red-600/50 text-red-300 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isRoundActive && !isSubmitted && (
        <div className="p-8 rounded-3xl bg-mystery-card border border-amber-900/50 text-center space-y-3">
          <Clock className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-xl font-heading font-bold text-white">ROUND 2 NOT STARTED YET</h3>
          <p className="text-sm text-slate-300">
            Please wait for the organizer to start Round 2 for qualified teams.
          </p>
        </div>
      )}

      {/* Case Briefing */}
      <div className="bg-mystery-card border border-purple-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" /> CASE BRIEFING & CIPHER
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          An anonymous message appears on the event organizer's laptop: <span className="text-purple-300 font-semibold font-mono">"Look beyond the obvious. The answer is hidden in the sequence."</span> 
          Decipher the sequence, examine the network MAC logs, and answer the 8 clues.
        </p>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> ROUND 2 EVIDENCE FILES
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {round2Evidences.map(ev => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              onClick={(e) => setSelectedEvidence(e)}
            />
          ))}

          <div className="flex flex-col justify-center">
            <QRCodeClue
              clueUrl="/clue/round2/hidden1"
              clueId="round2-hidden1"
              title="Round 2 QR Evidence #04"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      {(isRoundActive || isSubmitted) && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2 border-b border-purple-900/60 pb-3">
            <FileText className="w-5 h-5 text-purple-400" /> CLUE QUESTIONS (8 QUESTIONS)
          </h3>

          <div className="space-y-6">
            {questions.map((q) => {
              const qNum = q.questionNumber.toString();
              const selectedOpt = answers[qNum] || '';
              const revealedHint = revealedHints[qNum];

              return (
                <div 
                  key={q._id} 
                  className="bg-mystery-card border border-purple-900/50 rounded-2xl p-6 space-y-4 shadow-lg hover:border-purple-800/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-heading font-bold text-white flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q{q.questionNumber}
                      </span>
                      <span>{q.questionText}</span>
                    </h4>

                    <div className="flex items-center gap-2 shrink-0">
                      {!isSubmitted && (
                        <button
                          type="button"
                          onClick={() => handleRequestHint(qNum)}
                          disabled={hintsUsed >= 2 || revealedHint}
                          className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> HINT (-2)
                        </button>
                      )}
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800/40">
                        {q.marks} Marks
                      </span>
                    </div>
                  </div>

                  {/* Revealed Hint Box */}
                  {revealedHint && (
                    <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-start gap-2 animate-fadeIn">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">HINT: </span>{revealedHint}
                      </div>
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5 pl-0 sm:pl-10">
                    {q.options.map((opt, idx) => {
                      const isSelected = selectedOpt === opt;
                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleOptionSelect(qNum, opt)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-purple-900/80 border-purple-500 text-white font-semibold shadow-glow-purple'
                              : 'bg-mystery-950 border-purple-950 text-slate-300 hover:border-purple-800/60 hover:bg-mystery-900/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-purple-400 bg-purple-500' : 'border-slate-600'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-mystery-card border border-purple-900/60 rounded-3xl p-6">
            <div className="text-xs text-slate-400">
              {isSubmitted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Your Round 2 answers have been locked & submitted!
                </span>
              ) : (
                <span>Review all answers & hints used ({hintsUsed}/2) before submitting.</span>
              )}
            </div>

            {!isSubmitted && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-purple-200" /> SUBMIT ROUND 2
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default Round2Page;
