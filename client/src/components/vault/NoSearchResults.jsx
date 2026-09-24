import React from 'react';
import { SearchX, X } from 'lucide-react';

export default function NoSearchResults({ searchQuery, onClearSearch }) {
  return (
    <div className="glass-card p-12 rounded-2xl border border-vault-border text-center max-w-lg mx-auto space-y-4 shadow-xl">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-glow-emerald">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white">
        No files found for "{searchQuery}"
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
        No vault files matched your query. Try searching by filename, extension (e.g. .pdf), or MIME type.
      </p>

      <div className="pt-2">
        <button
          onClick={onClearSearch}
          className="px-5 py-2.5 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan font-bold text-xs hover:bg-vault-cyan/20 transition-all inline-flex items-center gap-1.5 shadow-glow-cyan font-mono"
        >
          <X className="w-4 h-4" />
          <span>Clear Search</span>
        </button>
      </div>
    </div>
  );
}
