import React from 'react';
import { Mail, Camera, FileText, Clock, Lock, Search, Eye } from 'lucide-react';

const iconMap = {
  email: { icon: Mail, label: '📧 EMAIL EVIDENCE', color: 'border-blue-500/40 text-blue-400 bg-blue-950/40' },
  photo: { icon: Camera, label: '📷 PHOTO EVIDENCE', color: 'border-purple-500/40 text-purple-400 bg-purple-950/40' },
  statement: { icon: FileText, label: '📝 STATEMENT EVIDENCE', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' },
  timeline: { icon: Clock, label: '🕐 TIMELINE EVIDENCE', color: 'border-amber-500/40 text-amber-400 bg-amber-950/40' },
  locked: { icon: Lock, label: '🔐 LOCKED EVIDENCE', color: 'border-slate-600/40 text-slate-400 bg-slate-900/40' },
  clue: { icon: Search, label: '🔎 HIDDEN CLUE', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40' }
};

const EvidenceCard = ({ evidence, onClick }) => {
  const config = iconMap[evidence.type] || iconMap.statement;
  const Icon = config.icon;

  return (
    <div 
      onClick={() => onClick(evidence)}
      className="bg-mystery-card bg-mystery-card-hover rounded-2xl p-5 border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative group overflow-hidden"
    >
      {/* Top accent badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold tracking-wider ${config.color}`}>
          <Icon className="w-3.5 h-3.5" />
          {config.label}
        </span>
        <span className="text-xs font-mono font-semibold text-slate-400">
          #{evidence.id || '01'}
        </span>
      </div>

      {/* Card Title */}
      <h4 className="text-base font-heading font-extrabold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {evidence.title}
      </h4>

      {/* Snippet / Content Preview */}
      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
        {evidence.preview || evidence.content}
      </p>

      {/* Footer link to view details */}
      <div className="flex items-center justify-between pt-3 border-t border-indigo-900/40 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" /> Inspect Evidence
        </span>
        {evidence.timestamp && (
          <span className="text-[11px] font-mono text-slate-400 font-normal">
            {evidence.timestamp}
          </span>
        )}
      </div>

      {/* Hover glow highlight line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default EvidenceCard;
