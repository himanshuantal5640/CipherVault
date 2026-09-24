import React from 'react';
import { Code, X } from 'lucide-react';

export default function MetadataModal({ file, isOpen, onClose }) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-2xl border border-vault-cyan/40 max-w-lg w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-vault-cyan" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              MongoDB Encrypted File Document
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <pre className="bg-vault-bg p-4 rounded-xl text-xs font-mono text-vault-cyan overflow-x-auto border border-slate-800 max-h-96">
          {JSON.stringify(file, null, 2)}
        </pre>

        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
          <p className="text-emerald-400">• S3 Object Key: {file.s3Key}</p>
          <p>• Plaintext DEK, KEK, and passwords are NEVER stored in database.</p>
        </div>
      </div>
    </div>
  );
}
