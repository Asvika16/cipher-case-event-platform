import React from 'react';
import { FileText, Shield, CheckCircle2, Clock, Award, HelpCircle } from 'lucide-react';

const rulesList = [
  { id: 1, text: "Each team uses one Team ID to log in and participate." },
  { id: 2, text: "Each team must complete the round before the countdown timer ends." },
  { id: 3, text: "Once answers are submitted, they CANNOT be changed or re-edited." },
  { id: 4, text: "No refreshing the browser page or opening another team's account during gameplay." },
  { id: 5, text: "Teams must solve all clues using pure observation, timeline analysis, and logical reasoning." },
  { id: 6, text: "The highest scoring teams automatically qualify for the next round." },
  { id: 7, text: "TIEBREAKER RULE: If scores are tied, the team that completed the round in faster time gets the higher position." },
  { id: 8, text: "The event organizer's decision is final in all circumstances." }
];

const RulesPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-widest">
          <FileText className="w-4 h-4 text-indigo-400" /> OFFICIAL EVENT GUIDELINES
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white">
          RULES OF THE HUNT
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
          Please read these simple rules carefully before beginning your investigation.
        </p>
      </div>

      {/* Rules List Card */}
      <div className="bg-mystery-card border border-indigo-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-glow-purple space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {rulesList.map((rule) => (
            <div 
              key={rule.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-mystery-900/80 border border-indigo-950 hover:border-indigo-800/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-mono font-bold text-sm shrink-0">
                {rule.id}
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                  {rule.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-5 rounded-2xl bg-mystery-card border border-indigo-900/50">
          <Clock className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-white text-sm">Server-Synced Timer</h4>
          <p className="text-xs text-slate-400 mt-1">Automatic submission when time runs out.</p>
        </div>

        <div className="p-5 rounded-2xl bg-mystery-card border border-indigo-900/50">
          <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-white text-sm">Auto Qualification</h4>
          <p className="text-xs text-slate-400 mt-1">Scores and completion times rank teams automatically.</p>
        </div>

        <div className="p-5 rounded-2xl bg-mystery-card border border-indigo-900/50">
          <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-white text-sm">Fair Play</h4>
          <p className="text-xs text-slate-400 mt-1">Strict single active session per team ID.</p>
        </div>
      </div>

    </div>
  );
};

export default RulesPage;
