import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Timer from '../components/Timer';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceModal from '../components/EvidenceModal';
import QRCodeClue from '../components/QRCodeClue';
import { FileText, Send, CheckCircle2, ShieldAlert, Sparkles, Clock, Trophy, AlertTriangle, Key } from 'lucide-react';

const round3Evidences = [
  {
    id: 'E1',
    title: 'Master Case Timeline',
    type: 'timeline',
    timestamp: '5:00 PM – 7:30 PM Audit',
    preview: '5:25 PM Key duplicated -> 5:45 PM File placed -> 5:55 PM Aarav leaves -> 6:10 PM Blackout -> 6:11 PM Card scan -> 6:12 PM Photo -> 7:06 PM Wi-Fi transfer.',
    content: `Master Case Timeline Summary:
5:25 PM – Emergency door master key duplicated at facility office.
5:45 PM – Confidential file placed on desk in organizing room.
5:55 PM – Aarav leaves room.
6:10 PM – Main campus blackout begins.
6:11 PM – Emergency door access sensor logs ID card scan #04.
6:12 PM – Karthik's DSLR camera captures indoor room frame.
6:14 PM – Power returns.
7:05 PM – Anonymous message email received on laptop.
7:06 PM – Wi-Fi Direct file payload transferred to remote device.`,
    details: 'The master key duplication before 5:30 PM is the initial point of vulnerability.'
  },
  {
    id: 'E2',
    title: 'Suspect Statement Matrix',
    type: 'statement',
    timestamp: '3 Suspect Testimonial Logs',
    preview: 'Aarav: "I never returned." Meera: "I only entered for sheets." Karthik: "I was outside."',
    content: `Suspect 01 (Aarav): Claimed he left before 6 PM and never returned.
Suspect 02 (Meera): Claimed she only entered at 6:05 PM to collect sheets.
Suspect 03 (Karthik): Claimed he was outside taking crowd photos during blackout.

Contradiction Audit:
- Door ID Card Scan #04 at 6:11 PM belongs to Aarav's badge.
- Photo taken at 6:12 PM inside the room belongs to Karthik's camera.`,
    details: 'Both Aarav and Karthik were inside the room during the blackout despite their denials.'
  },
  {
    id: 'E3',
    title: 'Chat Log Evidence',
    type: 'email',
    timestamp: '6:02 PM Message Thread',
    preview: 'Encrypted message between Aarav and Karthik: "Sync at blackout window."',
    content: `Recovered Chat Log:
[6:02 PM] Aarav: "Key is ready. Wait for the 6:10 lighting switch."
[6:03 PM] Karthik: "Understood. I will handle the file extraction."`,
    details: 'Conclusive evidence of premeditated coordination.'
  },
  {
    id: 'E4',
    title: 'Partition Code Log',
    type: 'clue',
    timestamp: 'System Partition Audit',
    preview: 'Coded string: "20 - 15 - 16 - 19 - 5 - 3 - 18 - 5 - 20".',
    content: `Partition Decryption Log:
Encoded String: "20 - 15 - 16 - 19 - 5 - 3 - 18 - 5 - 20"

A1Z26 Mapping:
20=T, 15=O, 16=P, 19=S, 5=E, 3=C, 18=R, 5=E, 20=T -> TOPSECRET`,
    details: 'Decodes to the master password passphrase TOPSECRET.'
  }
];

const Round3Page = () => {
  const { token } = useContext(AuthContext);
  const [roundData, setRoundData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submission, setSubmission] = useState(null);
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
      const res = await fetch('/api/rounds/3', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoundData(data.round);
      setQuestions(data.questions);
      if (data.submission) {
        setSubmission(data.submission);
        if (data.submission.answers) setAnswers(data.submission.answers);
      }

      if (data.round && data.round.status === 'active' && !data.submission) {
        await fetch('/api/rounds/3/start', {
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

  const handleSubmitRound = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/rounds/3/submit', {
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
        timeTaken: data.timeTaken
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
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
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
          <div className="bg-mystery-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center shadow-2xl shadow-glow-gold">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-heading font-extrabold text-white">SUBMIT FINAL ROUND 3?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure? This is your final case submission for Cipher Case Championship!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
              >
                REVIEW ANSWERS
              </button>
              <button
                onClick={handleSubmitRound}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 text-white font-bold text-xs shadow-glow-gold"
              >
                FINAL SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-mystery-card border border-amber-900/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> FINAL CHAMPIONSHIP ROUND • 100 MARKS TOTAL • TOP 5 FINALISTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            ROUND 3 – CRACK THE CASE
          </h1>
          <p className="text-xs sm:text-sm text-amber-300 font-semibold">
            CASE: "THE FINAL FILE"
          </p>
        </div>

        {isRoundActive && (
          <div className="z-10">
            <Timer
              startTime={submission?.startTime || roundData?.startTime}
              durationMinutes={roundData?.duration || 25}
              serverTime={new Date()}
              onTimeUp={handleSubmitRound}
              submitted={isSubmitted}
            />
          </div>
        )}
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
          <h3 className="text-xl font-heading font-bold text-white">ROUND 3 NOT STARTED YET</h3>
          <p className="text-sm text-slate-300">
            Please wait for the event organizer to launch the Grand Final for the Top 5 finalists!
          </p>
        </div>
      )}

      {/* Case Briefing */}
      <div className="bg-mystery-card border border-amber-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" /> FINAL CASE DOSSIER
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          The confidential college event file is missing. The finalists must synthesize the master timeline, door access sensors, chat logs, and encrypted partition keys to complete the 5 major tasks and crack the mystery.
        </p>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" /> MASTER EVIDENCE FILES
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {round3Evidences.map(ev => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              onClick={(e) => setSelectedEvidence(e)}
            />
          ))}

          <div className="flex flex-col justify-center">
            <QRCodeClue
              clueUrl="/clue/round3/hidden1"
              clueId="round3-hidden1"
              title="Round 3 Master Clue"
            />
          </div>
        </div>
      </div>

      {/* 5 Major Tasks Form */}
      {(isRoundActive || isSubmitted) && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2 border-b border-amber-900/60 pb-3">
            <Trophy className="w-5 h-5 text-amber-400" /> 5 MAJOR FINAL TASKS (20 MARKS EACH)
          </h3>

          <div className="space-y-6">
            {questions.map((q) => {
              const qNum = q.questionNumber.toString();
              const selectedOpt = answers[qNum] || '';

              return (
                <div 
                  key={q._id} 
                  className="bg-mystery-card border border-amber-900/50 rounded-2xl p-6 space-y-4 shadow-lg hover:border-amber-700/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-heading font-bold text-white flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        T{q.questionNumber}
                      </span>
                      <span>{q.questionText}</span>
                    </h4>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/40 shrink-0">
                      20 Marks
                    </span>
                  </div>

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
                              ? 'bg-amber-900/80 border-amber-500 text-white font-semibold shadow-glow-gold'
                              : 'bg-mystery-950 border-amber-950 text-slate-300 hover:border-amber-800/60 hover:bg-mystery-900/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-500' : 'border-slate-600'
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

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-mystery-card border border-amber-900/60 rounded-3xl p-6">
            <div className="text-xs text-slate-400">
              {isSubmitted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Your Final Round 3 answers have been locked & submitted!
                </span>
              ) : (
                <span>Verify all 5 tasks before submitting your final case file.</span>
              )}
            </div>

            {!isSubmitted && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-indigo-600 hover:from-amber-500 text-white font-heading font-bold text-sm shadow-glow-gold transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-200" /> SUBMIT FINAL ROUND 3
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

export default Round3Page;
