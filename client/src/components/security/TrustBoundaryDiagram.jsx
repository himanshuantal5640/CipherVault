import React from 'react';
import { 
  Cpu, 
  Lock, 
  Cloud, 
  Server, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  X, 
  Database, 
  EyeOff, 
  UserCheck 
} from 'lucide-react';

export default function TrustBoundaryDiagram() {
  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Zero-Trust Data Flow */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-cyan/40 space-y-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <EyeOff className="w-5 h-5 text-vault-cyan" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Zero-Trust End-to-End Data Flow
          </h2>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center items-center">
          
          <div className="p-4 rounded-xl bg-vault-bg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Input</span>
            <div className="text-xs font-bold text-white font-mono">Plaintext File</div>
            <div className="text-[10px] text-slate-400">User Device</div>
          </div>

          <div className="hidden md:flex justify-center text-vault-cyan">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-xl bg-vault-bg border border-vault-cyan/50 space-y-1 shadow-glow-cyan">
            <span className="text-[10px] font-mono text-vault-cyan uppercase font-bold">Client Engine</span>
            <div className="text-xs font-bold text-vault-cyan font-mono">Web Crypto API</div>
            <div className="text-[10px] text-vault-emerald font-mono">AES-256-GCM + PBKDF2</div>
          </div>

          <div className="hidden md:flex justify-center text-vault-cyan">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-xl bg-vault-bg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Destination</span>
            <div className="text-xs font-bold text-white font-mono">AWS S3 Cloud</div>
            <div className="text-[10px] text-slate-400">Direct Presigned Transfer</div>
          </div>

        </div>

        {/* Node API Role & Security Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-vault-cyan font-bold">
              <Server className="w-4 h-4" />
              <span>Node.js / Express Backend Role</span>
            </div>
            <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
              <li>Authenticates user session via HTTP-only JWT cookies</li>
              <li>Generates short-lived presigned S3 URLs</li>
              <li>Stores non-secret metadata & encrypted DEK in MongoDB</li>
              <li>Records audit events (FILE_UPLOAD, FILE_DOWNLOAD)</li>
              <li><strong className="text-emerald-400">NEVER receives plaintext file bytes or keys</strong></li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Trust Boundary Isolation</span>
            </div>
            <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
              Plaintext bytes and user secrets exist <strong>strictly within local browser RAM</strong> during encryption/decryption. The Node server and S3 bucket store ciphertext and key parameters wrapped using PBKDF2 key derivation.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Ownership Authorization Model */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Backend Authorization Model
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-mono text-xs">
          
          <div className="p-4 rounded-xl bg-vault-bg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">1. Request</span>
            <span className="font-bold text-white">Authenticated User</span>
            <span className="text-[10px] text-vault-cyan block">req.user.id</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-500">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-vault-border">
            <span className="text-slate-400 block text-[10px]">2. Scoped Lookup</span>
            <span className="font-bold text-emerald-400">File.findOne</span>
            <span className="text-[10px] text-slate-300 block">{`{ _id, ownerId: req.user.id }`}</span>
          </div>

          <div className="hidden md:flex justify-center text-slate-500">
            <ArrowRight className="w-4 h-4" />
          </div>

          <div className="p-4 rounded-xl bg-vault-bg border border-slate-800 space-y-2">
            <span className="text-slate-400 block text-[10px]">3. Authorization Outcome</span>
            <div className="flex items-center justify-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3 h-3" /> YES → Grant
              </span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-[10px] border border-red-500/30 flex items-center gap-1">
                <X className="w-3 h-3" /> NO → Deny 404
              </span>
            </div>
          </div>

        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed p-4 rounded-xl bg-slate-950 border border-slate-900">
          <strong>Resource Enumeration Prevention:</strong> Requesting a file ID that belongs to another user returns HTTP 404 instead of 403. Knowledge of a file ID alone never grants download authorization or metadata visibility.
        </p>
      </div>

    </div>
  );
}
