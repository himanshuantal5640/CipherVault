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
  AlertTriangle,
  Zap,
  Activity,
  FileCode,
  Check,
  X,
  Layers,
  Database,
  Cloud,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Unlock
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden space-y-24 pb-20">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-vault-cyan/15 via-vault-indigo/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* ==================================================
          1. HERO SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12 sm:pt-16 space-y-8 relative">
        
        {/* Trust/Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vault-card border border-vault-cyan/40 text-xs font-mono text-vault-cyan shadow-glow-cyan"
        >
          <span className="w-2 h-2 rounded-full bg-vault-cyan animate-pulse"></span>
          <span>Client-side encryption • AES-256-GCM • Private S3 storage</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]"
        >
          Your files.<br />
          <span className="cyber-gradient-text">Encrypted before they leave your browser.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed font-sans"
        >
          VaultX is a zero-trust secure file vault that encrypts your files client-side with AES-256-GCM before they reach cloud storage.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-mono"
        >
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-vault-cyan via-teal-400 to-vault-emerald text-slate-950 font-extrabold text-base shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
          >
            <span>{isAuthenticated ? "Enter Vault Console" : "Secure Your Files"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vault-card border border-slate-700/80 hover:border-vault-cyan/50 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
          >
            <Cpu className="w-5 h-5 text-vault-cyan" />
            <span>See How It Works</span>
          </a>
        </motion.div>

        {/* ==================================================
            2. HERO VISUAL (ANIMATED SECURITY PIPELINE)
            ================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 max-w-5xl mx-auto"
        >
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-cyan/40 shadow-2xl relative">
            
            {/* Prominent Encryption Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-vault-cyan/20 border border-vault-cyan/50 text-vault-cyan font-mono text-xs font-bold shadow-glow-cyan flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Encryption happens locally</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center text-center font-mono text-xs pt-2">
              
              {/* Step 1: Plaintext */}
              <div className="md:col-span-2 p-4 rounded-xl bg-vault-bg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">INPUT DATA</span>
                <span className="font-bold text-white text-sm block">YOUR FILE</span>
                <span className="text-[10px] text-slate-400 block">Plaintext ArrayBuffer</span>
              </div>

              <div className="hidden md:flex justify-center text-vault-cyan font-bold">→</div>

              {/* Step 2: WebCrypto Browser Encryption */}
              <div className="md:col-span-2 p-4 rounded-xl bg-vault-bg border border-vault-cyan/50 space-y-1 shadow-glow-cyan">
                <span className="text-[10px] text-vault-cyan uppercase font-bold block">CLIENT BOUNDARY</span>
                <span className="font-bold text-vault-cyan text-sm block">YOUR BROWSER</span>
                <span className="text-[10px] text-vault-emerald block">Web Crypto API • AES-256-GCM</span>
              </div>

              <div className="hidden md:flex justify-center text-vault-cyan font-bold">→</div>

              {/* Step 3: Encrypted Object S3 */}
              <div className="md:col-span-2 p-4 rounded-xl bg-vault-bg border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">CLOUD DESTINATION</span>
                <span className="font-bold text-white text-sm block">AWS S3</span>
                <span className="text-[10px] text-emerald-400 font-bold block">🔒 Encrypted Object</span>
              </div>

            </div>
          </div>
        </motion.div>

      </section>

      {/* ==================================================
          3. SECURITY STATISTICS STRIP
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left font-mono">
          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Algorithm</span>
            <span className="text-base font-bold text-vault-cyan block">AES-256-GCM</span>
            <span className="text-[10px] text-slate-500 block">Client-side encryption</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Key Isolation</span>
            <span className="text-base font-bold text-vault-emerald block">Unique DEK</span>
            <span className="text-[10px] text-slate-500 block">Per-file random 256-bit</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Cloud Model</span>
            <span className="text-base font-bold text-vault-indigo block">Private S3</span>
            <span className="text-[10px] text-slate-500 block">Presigned direct transfer</span>
          </div>

          <div className="p-4 rounded-xl bg-vault-card border border-vault-border space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Server Exposure</span>
            <span className="text-base font-bold text-emerald-400 block">Zero Plaintext</span>
            <span className="text-[10px] text-slate-500 block">Normal upload flow</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          4. PROBLEM & MODEL COMPARISON SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cloud storage shouldn't require blind trust.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-sans">
            Traditional cloud vaults receive unencrypted plaintext files on their servers before storing them. VaultX changes the trust boundary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Traditional Model Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-950 border border-red-500/20 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">Traditional Storage Model</span>
              <X className="w-5 h-5 text-red-400" />
            </div>

            <div className="space-y-3 font-mono text-xs text-center">
              <div className="p-3 rounded-lg bg-slate-900 text-white">Your File (Plaintext)</div>
              <div className="text-slate-600">↓</div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">Application Server (Receives Plaintext)</div>
              <div className="text-slate-600">↓</div>
              <div className="p-3 rounded-lg bg-slate-900 text-slate-400">Cloud Storage</div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans pt-2">
              <strong>Risk:</strong> Plaintext may pass through application infrastructure, logs, and server memory where compromised backends or rogue admins could inspect contents.
            </p>
          </div>

          {/* VaultX Zero-Trust Model Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-vault-card border border-vault-cyan/40 space-y-6 shadow-glow-cyan">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-mono text-vault-cyan font-bold uppercase tracking-wider">VaultX Zero-Trust Model</span>
              <Check className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="space-y-3 font-mono text-xs text-center">
              <div className="p-3 rounded-lg bg-vault-bg text-white">Your File</div>
              <div className="text-vault-cyan">↓ WebCrypto Local Encryption</div>
              <div className="p-3 rounded-lg bg-vault-cyan/10 border border-vault-cyan/40 text-vault-cyan font-bold">Ciphertext ArrayBuffer</div>
              <div className="text-vault-cyan">↓ Direct Presigned Transfer</div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold">AWS S3 (Encrypted Object)</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans pt-2">
              <strong>Guarantee:</strong> File contents are encrypted in the browser before the encrypted object is uploaded. The Node backend processes zero raw file bytes.
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. HOW IT WORKS SECTION (#how-it-works)
          ================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Three steps. One encrypted vault.
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-mono">
            Cryptographic isolation made effortless for everyday secure storage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-4">
            <span className="text-3xl font-mono font-black text-vault-cyan">01</span>
            <h3 className="text-base font-bold text-white font-mono">Choose a file</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              User selects any document, image, or payload in the browser. The file remains strictly inside browser RAM.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-cyan/40 space-y-4 shadow-glow-cyan">
            <span className="text-3xl font-mono font-black text-vault-emerald">02</span>
            <h3 className="text-base font-bold text-white font-mono">Encrypt locally</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Browser Web Crypto API generates a unique 256-bit DEK and encrypts the payload using AES-256-GCM before upload.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-4">
            <span className="text-3xl font-mono font-black text-vault-indigo">03</span>
            <h3 className="text-base font-bold text-white font-mono">Store ciphertext</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Only encrypted file data is sent directly to AWS S3 using a short-lived presigned upload URL.
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          6. ZERO-TRUST ARCHITECTURE SECTION (#architecture)
          ================================================== */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="glass-card p-6 sm:p-10 rounded-2xl border border-vault-cyan/40 space-y-8 shadow-2xl">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 text-vault-cyan border border-vault-cyan/30 shadow-glow-cyan mb-2">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed around a smaller trust boundary.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-mono">
              Plaintext file contents stay on the client during the normal upload path.
            </p>
          </div>

          {/* Role Breakdown Table */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-mono text-xs">
            
            <div className="p-5 rounded-xl bg-vault-bg border border-vault-cyan/30 space-y-3">
              <div className="text-vault-cyan font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
                <Cpu className="w-4 h-4" /> Browser Handles
              </div>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> File encryption</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> File decryption</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Encryption secret</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-vault-bg border border-slate-800 space-y-3">
              <div className="text-vault-indigo font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
                <Server className="w-4 h-4" /> Backend Handles
              </div>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Authentication</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Authorization</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Metadata storage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Presigned URLs</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Security audit logs</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-vault-bg border border-slate-800 space-y-3">
              <div className="text-emerald-400 font-bold flex items-center gap-2 pb-2 border-b border-slate-800">
                <Cloud className="w-4 h-4" /> Storage Handles
              </div>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Encrypted objects</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Namespace isolation</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          7. SECURITY FEATURES SECTION (#security-features)
          ================================================== */}
      <section id="security-features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security isn't a checkbox.
          </h2>
          <p className="text-slate-400 text-sm">
            8 verified cryptographic and structural controls active in the application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">01. Client-side encryption</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              AES-256-GCM encryption happens in the browser via Web Crypto API.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">02. Per-file encryption</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Files use independently generated 256-bit DEK material.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">03. Authenticated encryption</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              AES-GCM detects unauthorized ciphertext modification automatically.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">04. Private object storage</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              S3 bucket objects remain private and scoped to user namespaces.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">05. Presigned transfers</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Browser communicates directly with S3 using short-lived signed URLs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">06. Ownership authorization</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Every file operation is strictly scoped to ownerId === req.user.id.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">07. Firebase Authentication</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Identity is managed securely through Firebase Authentication.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">08. Security audit trail</span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Important security-sensitive actions are recorded in user audit logs.
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          8. TAMPER DETECTION SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="glass-card p-6 sm:p-10 rounded-2xl border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold text-white font-mono">
                  What happens if encrypted data is modified?
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-sans">
                AES-GCM authenticated encryption detects ciphertext tampering during decryption.
              </p>
            </div>

            <Link
              to="/security"
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold hover:bg-amber-500/30 transition-all shrink-0 text-center"
            >
              Try the Security Demo →
            </Link>
          </div>

          {/* Tamper Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center font-mono text-xs">
            <div className="p-4 rounded-xl bg-vault-bg border border-slate-800">Original Ciphertext</div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">One Byte Changed</div>
            <div className="p-4 rounded-xl bg-vault-bg border border-slate-800">AES-GCM Tag Verification</div>
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold flex items-center justify-center gap-1">
              <X className="w-4 h-4" /> Authentication Failure
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          9. SECURITY CENTER PREVIEW SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 font-mono">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white uppercase">Security Center Interactive Preview</h3>
            </div>
            <Link to="/security" className="text-xs font-mono text-vault-cyan hover:underline">
              Explore Security Center →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 font-bold block">Active Protections:</span>
              <div className="space-y-1 text-slate-300">
                <div>✓ AES-256-GCM</div>
                <div>✓ Client-side encryption</div>
                <div>✓ Private S3 storage</div>
                <div>✓ Ownership authorization</div>
                <div>✓ Security audit logging</div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <span className="text-slate-400 font-bold block">Recent Audit Log Preview:</span>
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-vault-bg border border-slate-800 flex justify-between">
                  <span>FILE_UPLOAD</span>
                  <span className="text-emerald-400 font-bold">Success</span>
                </div>
                <div className="p-2 rounded bg-vault-bg border border-slate-800 flex justify-between">
                  <span>FILE_DOWNLOAD</span>
                  <span className="text-emerald-400 font-bold">Success</span>
                </div>
                <div className="p-2 rounded bg-vault-bg border border-slate-800 flex justify-between">
                  <span>ACCESS_DENIED</span>
                  <span className="text-red-400 font-bold">Blocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          10. TECHNOLOGY SECTION (#technology)
          ================================================== */}
      <section id="technology" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with modern web security primitives.
          </h2>
          <p className="text-slate-400 text-sm">
            Core stack technologies and their role in the VaultX architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">React + Vite</span>
            <h3 className="text-sm font-bold text-white font-mono">Frontend Interface</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Renders responsive UI and executes cryptographic algorithms in isolated browser RAM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-emerald font-bold">Web Crypto API</span>
            <h3 className="text-sm font-bold text-white font-mono">Browser Cryptography</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Native W3C standard cryptographic engine for AES-GCM and PBKDF2 key derivation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-indigo font-bold">Node.js + Express</span>
            <h3 className="text-sm font-bold text-white font-mono">Backend API</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Handles HTTP-only JWT cookies, presigned URL generation, and authorization checks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">MongoDB</span>
            <h3 className="text-sm font-bold text-white font-mono">Metadata & Audit Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Stores encrypted DEK parameters, IVs, salts, and security event logs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-amber-400 font-bold">Firebase Authentication</span>
            <h3 className="text-sm font-bold text-white font-mono">Identity Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Manages user registration, email verification, and authentication credentials.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-vault-card border border-vault-border space-y-2">
            <span className="text-xs font-mono text-vault-cyan font-bold">AWS S3</span>
            <h3 className="text-sm font-bold text-white font-mono">Encrypted Object Storage</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Private cloud bucket receiving ciphertext directly via presigned transfer URLs.
            </p>
          </div>

        </div>
      </section>

      {/* ==================================================
          11. SECURITY PRINCIPLES SECTION
          ================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security principles behind VaultX
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Minimize trust</span>
            <p className="text-slate-400 text-[11px] font-sans">Keep sensitive cryptographic operations in the browser.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Verify every request</span>
            <p className="text-slate-400 text-[11px] font-sans">Authentication and ownership checks happen at the API boundary.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Encrypt before storage</span>
            <p className="text-slate-400 text-[11px] font-sans">Cloud storage receives encrypted objects.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Separate identity from encryption</span>
            <p className="text-slate-400 text-[11px] font-sans">Authentication credentials are not used as the application's file encryption key.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Fail closed</span>
            <p className="text-slate-400 text-[11px] font-sans">Unauthorized file access is rejected.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-900 space-y-2">
            <span className="text-vault-cyan font-bold block">Audit sensitive actions</span>
            <p className="text-slate-400 text-[11px] font-sans">Security-relevant operations can be reviewed.</p>
          </div>

        </div>
      </section>

      {/* ==================================================
          12. FINAL CALL TO ACTION (CTA)
          ================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="glass-card p-8 sm:p-14 rounded-3xl border border-vault-cyan/50 text-center space-y-6 shadow-glow-cyan">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Take control of your files.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-sans max-w-xl mx-auto">
            Encrypt locally. Store privately. Access securely.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 font-mono">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-emerald text-slate-950 font-extrabold text-base shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
            >
              <span>{isAuthenticated ? "Go to Dashboard" : "Create Your Vault"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/security"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-vault-bg border border-slate-700 hover:border-vault-cyan text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <Cpu className="w-5 h-5 text-vault-cyan" />
              <span>Explore Security</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
