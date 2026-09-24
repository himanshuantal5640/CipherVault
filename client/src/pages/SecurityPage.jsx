import React from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  EyeOff,
  AlertTriangle,
  FileCode
} from 'lucide-react';
import CryptoTestSuite from '../components/CryptoTestSuite';

export default function SecurityPage() {
  const activeFeatures = [
    { label: "Client-Side Encryption", status: "ACTIVE", value: "AES-256-GCM", active: true },
    { label: "Symmetric Key Size", status: "ACTIVE", value: "256-bit AES", active: true },
    { label: "Per-File DEK Isolation", status: "ACTIVE", value: "Unique DEK per file", active: true },
    { label: "Key Derivation Function", status: "ACTIVE", value: "PBKDF2-SHA-256 (100,000 iterations)", active: true },
    { label: "Authenticated Integrity", status: "ACTIVE", value: "AES-GCM Tag Verification", active: true },
    { label: "Server Plaintext Exposure", status: "DISABLED", value: "NO (Zero-Trust Guarantee)", active: true },
    { label: "Cloud S3 Storage", status: "FUTURE", value: "Phase 4 Presigned URL Router", active: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan mb-4 shadow-glow-cyan">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          VaultX Cryptographic Architecture
        </h1>
        <p className="mt-4 text-slate-300 text-base leading-relaxed">
          Verifiable browser Web Crypto API implementation powered by PBKDF2-SHA-256 key derivation and per-file AES-256-GCM authenticated encryption.
        </p>
      </div>

      {/* Active Crypto Status Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-vault-cyan/30">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
          <Shield className="w-5 h-5 text-vault-cyan" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Phase 3 Cryptographic Capabilities Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeFeatures.map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-vault-bg border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{feat.label}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  feat.active 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {feat.status}
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                {feat.active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span>{feat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Automated Verification Suite */}
      <CryptoTestSuite />

      {/* Key Hierarchy Diagram */}
      <div className="glass-card p-8 rounded-2xl border border-vault-border space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Key className="w-5 h-5 text-vault-cyan" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Two-Level Key Hierarchy & Wrapping Flow
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-vault-bg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto space-y-3">
          <div className="text-vault-cyan font-bold">USER MASTER SECRET</div>
          <div className="pl-4 text-slate-500">↓ (PBKDF2-SHA-256 with 100,000 iterations + 128-bit Salt)</div>
          <div className="text-vault-emerald font-bold">KEY ENCRYPTION KEY (KEK) [AES-256-GCM]</div>
          <div className="pl-4 text-slate-500">↓ (wraps raw DEK bytes using dedicated 96-bit wrapIV)</div>
          <div className="text-vault-indigo font-bold">FILE DATA ENCRYPTION KEY (DEK) [AES-256-GCM 256-bit]</div>
          <div className="pl-4 text-slate-500">↓ (encrypts raw file bytes using dedicated 96-bit fileIV)</div>
          <div className="text-vault-violet font-bold">ENCRYPTED FILE CIPHERTEXT</div>
        </div>

        <p className="text-xs text-slate-400">
          The Data Encryption Key (DEK) is generated uniquely per file using cryptographically secure random numbers (<code className="text-vault-cyan">crypto.getRandomValues()</code>).
        </p>
      </div>

    </div>
  );
}
