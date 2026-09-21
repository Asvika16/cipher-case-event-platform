import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Timer from '../components/Timer';
import EvidenceCard from '../components/EvidenceCard';
import EvidenceModal from '../components/EvidenceModal';
import QRCodeClue from '../components/QRCodeClue';
import { FileText, Send, CheckCircle2, ShieldAlert, Sparkles, Clock, AlertTriangle } from 'lucide-react';

const round1Evidences = [
  {
    id: 'E1',
    title: 'Incident Timeline',
    type: 'timeline',
    timestamp: '5:45 PM – 6:25 PM',
    preview: '5:45 PM Desk -> 5:55 PM Aarav leaves -> 6:05 PM Meera enters -> 6:10 PM Power off -> 6:14 PM Power returns -> 6:18 PM Karthik enters -> 6:25 PM File missing.',
    content: `5:45 PM – The event file is placed on the desk inside the organizing room.
5:55 PM – Aarav (Event Coordinator) leaves the room.
6:05 PM – Meera (Registration Volunteer) enters the room.
6:10 PM – Main campus power goes off.
6:14 PM – Power is restored.
6:18 PM – Karthik (Photography Team) enters the room.
6:25 PM – The event file is noticed missing from the desk.`,
    details: 'Key timeframe for disappearance is between 5:45 PM and 6:25 PM.'
  },
  {
    id: 'E2',
    title: 'Aarav\'s Statement',
    type: 'statement',
    timestamp: 'Event Coordinator',
    preview: 'Aarav: "I left the room before 6 PM and did not return."',
    content: `Statement from Aarav (Event Coordinator):
"I placed the file on the desk around 5:45 PM. I left the room before 6:00 PM to check on the main stage lighting and did not return to the organizing room after that."`,
    details: 'Verify if Aarav returned near the blackout timeframe.'
  },
  {
    id: 'E3',
    title: 'Meera\'s Statement',
    type: 'statement',
    timestamp: 'Registration Volunteer',
    preview: 'Meera: "I entered the room only to collect registration sheets."',
    content: `Statement from Meera (Registration Volunteer):
"I entered the organizing room at 6:05 PM only to collect the fresh participant registration sheets from the side table. The lights went out shortly after at 6:10 PM."`,
    details: 'Meera was inside when the lights went out.'
  },
  {
    id: 'E4',
    title: 'Karthik\'s Statement',
    type: 'statement',
    timestamp: 'Photography Team',
    preview: 'Karthik: "I was outside taking photographs when the power went off."',
    content: `Statement from Karthik (Photography Team):
"I was outside taking photographs of the stage crowd when the power went off at 6:10 PM. I only entered the organizing room at 6:18 PM after power returned."`,
    details: 'Claims he was outside during the entire power blackout.'
  },
  {
    id: 'E5',
    title: 'Photograph Evidence Clue',
    type: 'photo',
    timestamp: '6:12 PM Timestamp',
    preview: 'A camera photo timestamped 6:12 PM shows the interior of the organizing room during the blackout.',
    content: `EXIF Metadata Audit & Photo Record:
Timestamp: 6:12 PM (During the 6:10 PM - 6:14 PM power outage)
Location: Organizing Room Interior
Camera ID: DSLR-Karthik-02`,
    details: 'The photo shows someone inside the organizing room at 6:12 PM, conflicting with Karthik\'s statement.'
  }
];

const Round1Page = () => {
  const { token, user } = useContext(AuthContext);
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
      const res = await fetch('/api/rounds/1', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRoundData(data.round);
      setQuestions(data.questions);
      if (data.submission) {
        setSubmission(data.submission);
        if (data.submission.answers) {
          setAnswers(data.submission.answers);
        }
      }

      // Auto start timer if active & not started
      if (data.round && data.round.status === 'active' && !data.submission) {
        await fetch('/api/rounds/1/start', {
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
      const res = await fetch('/api/rounds/1/submit', {
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
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isSubmitted = submission && submission.submitted;
  const isRoundActive = roundData && roundData.status === 'active';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Evidence Modal */}
      <EvidenceModal 
        evidence={selectedEvidence} 
        onClose={() => setSelectedEvidence(null)} 
      />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystery-950/80 backdrop-blur-md">
          <div className="bg-mystery-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 text-center shadow-2xl shadow-glow-purple">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-heading font-extrabold text-white">SUBMIT ROUND 1 ANSWERS?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to submit? You <span className="text-amber-400 font-bold">CANNOT</span> change or re-edit your answers after final submission.
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
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-glow-purple"
              >
                CONFIRM SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header Banner */}
      <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" /> ROUND 1 • 50 MARKS TOTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
            ROUND 1 – IDENTIFY THE CASE
          </h1>
          <p className="text-xs sm:text-sm text-indigo-300 font-semibold">
            CASE: "THE MISSING EVENT FILE"
          </p>
        </div>

        {/* Timer */}
        {isRoundActive && (
          <div className="z-10">
            <Timer
              startTime={submission?.startTime || roundData?.startTime}
              durationMinutes={roundData?.duration || 15}
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
          <h3 className="text-xl font-heading font-bold text-white">ROUND HAS NOT STARTED YET</h3>
          <p className="text-sm text-slate-300">
            Please wait for the event organizer to start Round 1. Refresh when announced!
          </p>
        </div>
      )}

      {/* Case Story Briefing */}
      <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" /> CASE BRIEFING
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          During a college cultural event, an important event file disappears from the organizing room. 
          Three people were present around the relevant time: <span className="text-indigo-300 font-semibold">Aarav</span> (Event Coordinator), <span className="text-purple-300 font-semibold">Meera</span> (Registration Volunteer), and <span className="text-cyan-300 font-semibold">Karthik</span> (Photography Team). 
          Examine the evidence cards below and answer the 10 mystery questions.
        </p>
      </div>

      {/* Reusable Evidence Cards Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" /> EVIDENCE FILES (CLICK TO ENLARGE)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {round1Evidences.map(ev => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              onClick={(e) => setSelectedEvidence(e)}
            />
          ))}

          {/* QR Code Clue Widget */}
          <div className="flex flex-col justify-center">
            <QRCodeClue
              clueUrl="/clue/round1/hidden1"
              clueId="round1-hidden1"
              title="Round 1 Hidden Clue"
            />
          </div>
        </div>
      </div>

      {/* Questions Form */}
      {(isRoundActive || isSubmitted) && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2 border-b border-indigo-900/60 pb-3">
            <FileText className="w-5 h-5 text-indigo-400" /> INVESTIGATION QUESTIONS (10 QUESTIONS)
          </h3>

          <div className="space-y-6">
            {questions.map((q) => {
              const qNum = q.questionNumber.toString();
              const selectedOpt = answers[qNum] || '';

              return (
                <div 
                  key={q._id} 
                  className="bg-mystery-card border border-indigo-900/50 rounded-2xl p-6 space-y-4 shadow-lg hover:border-indigo-800/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-base sm:text-lg font-heading font-bold text-white flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                        Q{q.questionNumber}
                      </span>
                      <span>{q.questionText}</span>
                    </h4>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/40 shrink-0">
                      {q.marks} Marks
                    </span>
                  </div>

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
                              ? 'bg-indigo-900/80 border-indigo-500 text-white font-semibold shadow-glow-purple'
                              : 'bg-mystery-950 border-indigo-950 text-slate-300 hover:border-indigo-800/60 hover:bg-mystery-900/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'
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
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-mystery-card border border-indigo-900/60 rounded-3xl p-6">
            <div className="text-xs text-slate-400">
              {isSubmitted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Your Round 1 answers have been locked & submitted!
                </span>
              ) : (
                <span>Ensure all 10 questions are answered before submitting.</span>
              )}
            </div>

            {!isSubmitted && (
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-heading font-bold text-sm shadow-glow-purple transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-indigo-200" /> SUBMIT ROUND 1
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

export default Round1Page;
