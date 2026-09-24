import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  HardDrive, 
  Server, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  EyeOff,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  const securityHighlights = [
    {
      icon: <Lock className="w-6 h-6 text-vault-cyan" />,
      title: "Client-Side Encryption",
      desc: "Files are converted to ciphertext inside your browser before transmitting over network boundaries.",
      badge: "Target Architecture"
    },
    {
      icon: <Key className="w-6 h-6 text-vault-emerald" />,
      title: "AES-256-GCM Cipher",
      desc: "Authenticated encryption with 256-bit symmetric keys derived from your passphrase using PBKDF2.",
      badge: "Cryptographic Standard"
    },
    {
      icon: <Shield className="w-6 h-6 text-vault-indigo" />,
      title: "Zero-Trust Architecture",
      desc: "The backend router and cloud storage provider never receive or store unencrypted plaintext contents.",
      badge: "Core Model"
    },
    {
      icon: <HardDrive className="w-6 h-6 text-vault-violet" />,
      title: "Encrypted Cloud Storage",
      desc: "Protected storage of encrypted ciphertext chunks with isolation between metadata and key pairs.",
      badge: "Cloud Isolation"
    }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-vault-cyan/15 via-vault-indigo/15 to-vault-emerald/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 pb-16">
        
        {/* Security Phase Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vault-card border border-vault-cyan/30 text-xs font-mono text-vault-cyan mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-vault-cyan animate-pulse"></span>
          VaultX Phase 1 Foundation Active
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Your files. Your keys.<br />
          <span className="cyber-gradient-text">Zero implicit trust.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
        >
          VaultX is a zero-trust secure file vault designed to guarantee that cloud servers and third-party infrastructure never gain access to your unencrypted plaintext data.
        </motion.p>

        {/* Call To Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-vault-cyan via-teal-400 to-vault-emerald text-slate-950 font-bold text-base shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
          >
            Enter Secure Vault
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/security"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vault-card border border-slate-700/80 hover:border-vault-cyan/50 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-5 h-5 text-vault-cyan" />
            Explore Architecture
          </Link>
        </motion.div>

        {/* Phase Disclaimer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left max-w-xl mx-auto font-mono"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            <strong>Phase 1 Note:</strong> Project scaffolding and routing setup complete. Client-side WebCrypto encryption and AWS S3 storage pipeline will be enabled in Phase 2+.
          </span>
        </motion.div>

      </section>

      {/* Architecture Flow Diagram Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-vault-cyan" />
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Target Zero-Trust Pipeline
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Browser → Ciphertext → Router → S3</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center items-center">
            
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-vault-bg border border-slate-800 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-vault-cyan/10 text-vault-cyan flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Browser Client</span>
              <span className="text-[11px] text-slate-400 mt-1">Plaintext Input</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">→</div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-vault-bg border border-vault-cyan/30 flex flex-col items-center shadow-glow-cyan">
              <div className="w-10 h-10 rounded-lg bg-vault-emerald/10 text-vault-emerald flex items-center justify-center mb-2">
                <Key className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-vault-cyan">AES-256-GCM</span>
              <span className="text-[11px] text-vault-emerald mt-1 font-mono">Client Ciphertext</span>
            </div>

            <div className="hidden md:flex justify-center text-slate-600">→</div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-vault-bg border border-slate-800 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-vault-indigo/10 text-vault-indigo flex items-center justify-center mb-2">
                <Server className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-white">Node.js Express</span>
              <span className="text-[11px] text-slate-400 mt-1">Ciphertext Router</span>
            </div>

          </div>
        </div>
      </section>

      {/* Security Highlights Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Core Security Architecture Principles
          </h2>
          <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
            Engineered around verifiable cryptographic boundaries to eliminate centralized points of compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityHighlights.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-vault-bg border border-slate-800">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800/80 text-slate-300">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1 text-[11px] text-vault-cyan font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Product Target Goal
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
