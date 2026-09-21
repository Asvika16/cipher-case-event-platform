import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const Timer = ({ startTime, durationMinutes, serverTime, onTimeUp, submitted }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!startTime || !durationMinutes) return;

    const startMs = new Date(startTime).getTime();
    const durationMs = durationMinutes * 60 * 1000;
    const endMs = startMs + durationMs;

    const calculateRemaining = () => {
      const nowMs = Date.now(); // or offset by serverTime
      const remainingMs = endMs - nowMs;

      if (remainingMs <= 0) {
        setTimeLeft(0);
        if (!submitted && onTimeUp) {
          onTimeUp();
        }
      } else {
        setTimeLeft(Math.floor(remainingMs / 1000));
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, submitted]);

  if (timeLeft === null) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isUrgent = timeLeft < 180 && timeLeft > 0; // Less than 3 minutes

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold tracking-wider text-base sm:text-lg transition-all shadow-md ${
      submitted 
        ? 'bg-slate-900/80 border-slate-700 text-slate-400'
        : isUrgent
        ? 'bg-red-950/80 border-red-500/80 text-red-400 animate-pulse-slow shadow-red-900/50'
        : 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300 shadow-glow-purple'
    }`}>
      {isUrgent && !submitted ? (
        <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
      ) : (
        <Clock className="w-5 h-5 text-indigo-400" />
      )}
      
      {submitted ? (
        <span className="text-xs uppercase font-sans tracking-normal font-semibold text-emerald-400">
          ✓ SUBMITTED
        </span>
      ) : (
        <span>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      )}
    </div>
  );
};

export default Timer;
