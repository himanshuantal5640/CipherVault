import React from 'react';
import { RefreshCw, CheckCircle2, Lock, CloudUpload, Database, Shield } from 'lucide-react';

export default function UploadProgress({ stage }) {
  if (!stage) return null;

  const steps = [
    { title: 'Encrypting Locally', keyword: 'Encrypting' },
    { title: 'Fetching S3 Presigned URL', keyword: 'Requesting' },
    { title: 'Direct Ciphertext Upload', keyword: 'Uploading' },
    { title: 'Storing Metadata', keyword: 'Storing' }
  ];

  return (
    <div className="glass-card p-5 rounded-xl border border-vault-cyan/40 bg-vault-cyan/5 space-y-3">
      
      <div className="flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-vault-cyan animate-spin shrink-0" />
        <div className="flex-1">
          <div className="text-xs font-bold text-vault-cyan font-mono uppercase tracking-wider">
            Zero-Trust Upload Pipeline Active
          </div>
          <div className="text-xs text-slate-300 font-mono mt-0.5">
            {stage}
          </div>
        </div>
      </div>

      {/* Stage indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {steps.map((step, idx) => {
          const isActive = stage.includes(step.keyword);
          return (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-[11px] font-mono flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-vault-cyan/20 border-vault-cyan text-vault-cyan font-bold shadow-glow-cyan'
                  : 'bg-vault-bg/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-vault-cyan animate-ping' : 'bg-slate-700'}`} />
              <span className="truncate">{step.title}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
