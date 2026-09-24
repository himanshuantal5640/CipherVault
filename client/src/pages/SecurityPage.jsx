import React from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Cpu, 
  Server, 
  HardDrive, 
  CheckCircle2, 
  FileCode, 
  Layers, 
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function SecurityPage() {
  const securityPhases = [
    {
      phase: "Phase 1: Scaffolding (Current)",
      status: "ACTIVE",
      color: "border-vault-cyan text-vault-cyan",
      items: [
        "Monorepo foundation (/client and /server)",
        "Cybersecurity-themed React frontend UI",
        "Node.js Express router with Helmet, CORS, Rate Limiting",
        "Centralized error handler without production stack traces",
        "Axios client configuration & API health routes"
      ]
    },
    {
      phase: "Phase 2: Client-Side Cryptography",
      status: "UPCOMING",
      color: "border-vault-indigo text-vault-indigo",
      items: [
        "Web Crypto API window.crypto.subtle integration",
        "PBKDF2 key derivation (100,000 iterations)",
        "Per-file AES-256-GCM symmetric key generation",
        "In-memory stream chunk encryption/decryption"
      ]
    },
    {
      phase: "Phase 3: Auth & Metadata Directory",
      status: "UPCOMING",
      color: "border-vault-violet text-vault-violet",
      items: [
        "JWT Session authentication with bcrypt password hashing",
        "MongoDB / Mongoose user and file metadata schemas",
        "Protected endpoints for salt and initialization vector (IV) storage"
      ]
    },
    {
      phase: "Phase 4: AWS Cloud & Hardening",
      status: "UPCOMING",
      color: "border-vault-emerald text-vault-emerald",
      items: [
        "AWS S3 SDK v3 presigned upload/download URL router",
        "Direct client-to-S3 ciphertext upload pipeline",
        "Audit logs and zero-knowledge verification tests"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan mb-4 shadow-glow-cyan">
          <Cpu className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          VaultX Security Architecture
        </h1>
        <p className="mt-4 text-slate-300 text-base leading-relaxed">
          Detailed technical blueprint of our zero-trust cryptographic model, key isolation strategy, and phased implementation lifecycle.
        </p>
      </div>

      {/* Threat Model Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Traditional Cloud Vault */}
        <div className="glass-card p-6 rounded-2xl border border-red-500/30 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">Traditional Storage Architecture</h2>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Plaintext files sent directly over network to cloud server.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Server holds encryption keys and manages decryption at rest.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              Database breaches, compromised credentials, or server bugs expose raw file data.
            </li>
          </ul>
        </div>

        {/* VaultX Zero-Trust Model */}
        <div className="glass-card p-6 rounded-2xl border border-vault-cyan/40 relative overflow-hidden shadow-glow-cyan">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-vault-cyan" />
            <h2 className="text-lg font-bold text-white">VaultX Zero-Trust Model</h2>
          </div>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-vault-cyan font-bold">•</span>
              Client browser executes AES-256-GCM encryption before data leaves memory.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vault-cyan font-bold">•</span>
              Encryption keys are derived client-side and never sent to server.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vault-cyan font-bold">•</span>
              Backend router receives strictly encrypted ciphertext blobs.
            </li>
          </ul>
        </div>

      </div>

      {/* Phased Roadmap */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-6 h-6 text-vault-cyan" />
            Implementation Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Systematic multi-phase development strategy for hackathon execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPhases.map((phaseItem, index) => (
            <div 
              key={index} 
              className={`glass-card p-6 rounded-2xl border ${phaseItem.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white font-mono">
                    {phaseItem.phase}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${phaseItem.color}`}>
                    {phaseItem.status}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {phaseItem.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
