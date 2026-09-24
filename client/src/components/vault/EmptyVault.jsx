import React from 'react';
import { UploadCloud, Shield, Lock } from 'lucide-react';

export default function EmptyVault({ onUploadClick, isSearching }) {
  return (
    <div className="glass-card p-12 rounded-2xl border border-vault-border text-center max-w-lg mx-auto space-y-4 shadow-xl">
      
      <div className="w-16 h-16 mx-auto rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan flex items-center justify-center shadow-glow-cyan">
        {isSearching ? <Shield className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
      </div>

      <h3 className="text-lg font-bold text-white">
        {isSearching ? 'No Matching Files Found' : 'Your Vault is Empty'}
      </h3>

      <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm mx-auto">
        {isSearching 
          ? 'Try refining your search keywords or clear the search filter to display all encrypted vault files.'
          : 'Files are encrypted in your browser memory using AES-256-GCM before being stored in AWS S3.'
        }
      </p>

      {!isSearching && onUploadClick && (
        <div className="pt-2">
          <button
            onClick={onUploadClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-emerald text-slate-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 transition-all inline-flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Your First Secure File</span>
          </button>
        </div>
      )}

    </div>
  );
}
