import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  Cpu, 
  CheckCircle2, 
  Layers, 
  EyeOff, 
  Cloud, 
  Activity, 
  Zap, 
  UserCheck, 
  Database, 
  RefreshCw 
} from 'lucide-react';
import TrustBoundaryDiagram from '../components/security/TrustBoundaryDiagram';
import TamperDemo from '../components/security/TamperDemo';
import SecurityActivityTimeline from '../components/security/SecurityActivityTimeline';
import CryptoTestSuite from '../components/CryptoTestSuite';
import fileService from '../services/fileService';

export default function SecurityPage() {
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const files = await fileService.getFiles();
        setFileCount(files ? files.length : 0);
      } catch (err) {
        // Non-blocking fallback
      }
    };
    fetchMetrics();
  }, []);

  const implementedFeatures = [
    { label: "Authenticated Encryption", status: "ACTIVE", value: "AES-256-GCM" },
    { label: "Key Isolation", status: "ACTIVE", value: "Unique 256-bit DEK per file" },
    { label: "Nonces / IVs", status: "ACTIVE", value: "Unique 96-bit File IV & Wrap IV" },
    { label: "Key Derivation", status: "ACTIVE", value: "PBKDF2-SHA-256 (100k iterations)" },
    { label: "Cloud Storage", status: "ACTIVE", value: "Private AWS S3 Bucket" },
    { label: "Transfer Security", status: "ACTIVE", value: "Direct Presigned PUT/GET URLs" },
    { label: "Session Security", status: "ACTIVE", value: "HTTP-Only Cookie (vaultx_token)" },
    { label: "Ownership Scope", status: "ACTIVE", value: "ownerId === req.user.id Enforcement" },
    { label: "Cryptographic Engine", status: "ACTIVE", value: "Browser Web Crypto API" },
    { label: "Tamper Resistance", status: "ACTIVE", value: "AES-GCM Tag Verification" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* SECTION 1: Page Header & Security Metrics */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan shadow-glow-cyan">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          VaultX Security Center
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Verifiable browser Web Crypto API execution, zero-knowledge S3 architecture, real-time audit logging, and interactive AES-GCM tamper verification.
        </p>

        {/* Real Dynamic Security Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-left font-mono">
          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Protected Files</span>
            <span className="text-xl font-bold text-white">{fileCount}</span>
            <span className="text-[10px] text-emerald-400 block font-sans">100% Encrypted</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Encryption Standard</span>
            <span className="text-sm font-bold text-vault-cyan">AES-256-GCM</span>
            <span className="text-[10px] text-slate-400 block">Web Crypto API</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Key Derivation</span>
            <span className="text-xs font-bold text-vault-indigo">PBKDF2-SHA-256</span>
            <span className="text-[10px] text-slate-400 block">100,000 Iterations</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Storage Model</span>
            <span className="text-xs font-bold text-vault-emerald">Private S3</span>
            <span className="text-[10px] text-slate-400 block">Zero Server Plaintext</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Security Overview Controls Matrix */}
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
            Verified Security Architecture & Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {implementedFeatures.map((feat, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-vault-bg border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">{feat.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  {feat.status}
                </span>
              </div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{feat.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Zero-Trust Data Flow & Authorization Visualization */}
      <TrustBoundaryDiagram />

      {/* SECTION 4: Interactive AES-256-GCM Tamper Detection Demo */}
      <TamperDemo />

      {/* SECTION 5: Real-time Recent Security Audit Activity */}
      <SecurityActivityTimeline />

      {/* SECTION 6: Automated 12-Point Cryptographic Verification Suite */}
      <CryptoTestSuite />

    </div>
  );
}
