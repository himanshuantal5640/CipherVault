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
  FileCode,
  Cloud,
  ArrowRight,
  Database,
  Server,
  UserCheck
} from 'lucide-react';
import CryptoTestSuite from '../components/CryptoTestSuite';

export default function SecurityPage() {
  const implementedFeatures = [
    { label: "Authenticated Encryption", status: "ACTIVE", value: "AES-256-GCM", active: true },
    { label: "Key Isolation", status: "ACTIVE", value: "Unique 256-bit DEK per file", active: true },
    { label: "Nonces / IVs", status: "ACTIVE", value: "Unique 96-bit File IV & Wrap IV", active: true },
    { label: "Key Derivation", status: "ACTIVE", value: "PBKDF2-SHA-256 (100,000 iterations)", active: true },
    { label: "Cloud Storage", status: "ACTIVE", value: "Private AWS S3 Bucket", active: true },
    { label: "Transfer Security", status: "ACTIVE", value: "Direct Presigned PUT/GET URLs", active: true },
    { label: "Session Security", status: "ACTIVE", value: "HTTP-Only Cookie (vaultx_token)", active: true },
    { label: "Ownership Scope", status: "ACTIVE", value: "ownerId === req.user.id Enforcement", active: true },
    { label: "Cryptographic Engine", status: "ACTIVE", value: "Browser Web Crypto API", active: true },
    { label: "Tamper Resistance", status: "ACTIVE", value: "AES-GCM Tag Verification", active: true }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan mb-4 shadow-glow-cyan">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          VaultX Security Center
        </h1>
        <p className="mt-4 text-slate-300 text-base leading-relaxed">
          Verifiable browser Web Crypto API implementation, zero-knowledge presigned AWS S3 cloud architecture, and strict owner authorization.
        </p>
      </div>

      {/* Visual Trust-Boundary Diagram */}
      <div className="glass-card p-8 rounded-2xl border border-vault-cyan/40 space-y-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <EyeOff className="w-5 h-5 text-vault-cyan" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Zero-Trust Boundary Flow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center items-center">
          
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-vault-bg border border-slate-800 flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-vault-cyan/10 text-vault-cyan flex items-center justify-center border border-vault-cyan/30">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white font-mono">1. React Browser</span>
            <span className="text-[11px] text-slate-400">Plaintext Memory Only</span>
          </div>

          <div className="hidden md:flex justify-center text-vault-cyan">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-vault-bg border border-vault-cyan/40 flex flex-col items-center space-y-2 shadow-glow-cyan">
            <div className="w-10 h-10 rounded-xl bg-vault-emerald/10 text-vault-emerald flex items-center justify-center border border-vault-emerald/30">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-vault-cyan font-mono">2. Web Crypto API</span>
            <span className="text-[11px] text-vault-emerald font-mono">AES-256-GCM / PBKDF2</span>
          </div>

          <div className="hidden md:flex justify-center text-vault-cyan">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-vault-bg border border-slate-800 flex flex-col items-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-vault-indigo/10 text-vault-indigo flex items-center justify-center border border-vault-indigo/30">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white font-mono">3. AWS S3 Storage</span>
            <span className="text-[11px] text-slate-400">Direct Presigned Ciphertext</span>
          </div>

        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Zero Server Plaintext Guarantee:</strong> File bytes are encrypted in browser memory prior to transmission. Node.js processes zero raw file bytes and holds zero encryption keys.
          </span>
        </div>
      </div>

      {/* Implemented Security Features Matrix */}
      <div className="glass-card p-6 rounded-2xl border border-vault-border space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Verified Security Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {implementedFeatures.map((feat, i) => (
            <div key={i} className="p-4 rounded-xl bg-vault-bg border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">{feat.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  {feat.status}
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{feat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embedded Automated WebCrypto Test Suite */}
      <CryptoTestSuite />

    </div>
  );
}
