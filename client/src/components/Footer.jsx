import React from 'react';
import { Shield, Lock, Terminal, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-vault-border/80 bg-vault-bg py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded bg-vault-card border border-vault-border text-vault-cyan">
              <Shield className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-mono">
              VaultX Phase 1 Foundation • Zero-Trust Client Encryption Platform
            </p>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-vault-emerald" />
              Zero Plaintext Logging
            </span>
            <span className="flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-vault-cyan" />
              Node.js + Express API
            </span>
          </div>

        </div>

        <div className="mt-6 pt-6 border-t border-slate-900/60 text-center">
          <p className="text-[11px] text-slate-500 font-sans">
            Phase 1 Objective: Infrastructure & Routing Foundation. Encryption & Cloud Storage modules planned for Phase 2+.
          </p>
        </div>
      </div>
    </footer>
  );
}
