import React from 'react';
import { Search, Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-indigo-950/60 bg-mystery-950 py-8 px-4 text-center text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="font-heading font-bold text-white tracking-wide">CIPHER CASE</span>
          <span className="text-slate-500">•</span>
          <span className="text-indigo-400 text-xs uppercase tracking-widest font-semibold">Observe. Connect. Solve.</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>30 Teams</span>
          <span>•</span>
          <span>3 Rounds</span>
          <span>•</span>
          <span>1 Final Mystery</span>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-indigo-500" /> College Cultural Mystery Hunt Platform
        </div>
      </div>
    </footer>
  );
};

export default Footer;
