import React from 'react';
import { X, ZoomIn, FileText, Camera, Mail, Clock, Lock, Search } from 'lucide-react';

const iconMap = {
  email: Mail,
  photo: Camera,
  statement: FileText,
  timeline: Clock,
  locked: Lock,
  clue: Search
};

const EvidenceModal = ({ evidence, onClose }) => {
  if (!evidence) return null;

  const Icon = iconMap[evidence.type] || FileText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystery-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-mystery-900 border border-indigo-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative shadow-glow-purple"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-indigo-900/60">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              EVIDENCE FILE #{evidence.id || '01'}
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              {evidence.title}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-slate-200">
          {evidence.image && (
            <div className="relative rounded-xl overflow-hidden border border-indigo-950 bg-black/40 group">
              <img
                src={evidence.image}
                alt={evidence.title}
                className="w-full h-auto max-h-64 object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mystery-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-indigo-300 flex items-center gap-1 font-semibold">
                  <ZoomIn className="w-4 h-4" /> Evidence Visual Record
                </span>
              </div>
            </div>
          )}

          {evidence.timestamp && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Timestamp: {evidence.timestamp}
            </div>
          )}

          <div className="p-4 rounded-xl bg-mystery-950/90 border border-indigo-900/40 text-slate-300 text-sm leading-relaxed whitespace-pre-line font-sans">
            {evidence.content}
          </div>

          {evidence.details && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                DETECTIVE NOTES & HIGHLIGHTS
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {evidence.details}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-indigo-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-glow-purple"
          >
            Close Inspection
          </button>
        </div>

      </div>
    </div>
  );
};

export default EvidenceModal;
