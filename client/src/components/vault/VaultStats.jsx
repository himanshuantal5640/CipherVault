import React from 'react';
import { Files, HardDrive, ShieldCheck, Lock } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

export default function VaultStats({ files = [] }) {
  const totalFiles = files.length;
  const totalSizeBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  
  // Calculate coverage: 100% if all items have AES-256-GCM algorithm, or 100% for valid files
  const encryptedCount = files.filter(f => f.algorithm?.includes('AES') || f.encryptedDEK).length;
  const coveragePercent = totalFiles > 0 ? Math.round((encryptedCount / totalFiles) * 100) : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      
      {/* Total Files Stat */}
      <div className="glass-card p-4 rounded-xl border border-vault-border flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            Total Vault Items
          </span>
          <div className="text-xl font-extrabold text-white font-mono mt-0.5">
            {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan">
          <Files className="w-5 h-5" />
        </div>
      </div>

      {/* Storage Used Stat */}
      <div className="glass-card p-4 rounded-xl border border-vault-border flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            Encrypted Storage Used
          </span>
          <div className="text-xl font-extrabold text-white font-mono mt-0.5">
            {formatBytes(totalSizeBytes)}
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-vault-indigo/10 border border-vault-indigo/30 text-vault-indigo">
          <HardDrive className="w-5 h-5" />
        </div>
      </div>

      {/* Encryption Coverage Stat */}
      <div className="glass-card p-4 rounded-xl border border-vault-border flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
            Encryption Coverage
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{coveragePercent}% Encrypted</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Lock className="w-5 h-5" />
        </div>
      </div>

    </div>
  );
}
