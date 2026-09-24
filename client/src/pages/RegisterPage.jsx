import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Key, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        <div className="glass-card p-8 rounded-2xl border border-vault-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vault-emerald/10 blur-3xl pointer-events-none rounded-full" />

          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-vault-emerald/10 border border-vault-emerald/30 text-vault-emerald mb-4 shadow-glow-emerald">
              <Key className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create Vault Identity
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Phase 1 Registration Foundation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Operator Alias
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="CipherSec"
                  className="w-full pl-10 pr-4 py-3 bg-vault-bg border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-vault-emerald focus:ring-1 focus:ring-vault-emerald transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="secops@vaultx.io"
                  className="w-full pl-10 pr-4 py-3 bg-vault-bg border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-vault-emerald focus:ring-1 focus:ring-vault-emerald transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Master Encryption Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-vault-bg border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-vault-emerald focus:ring-1 focus:ring-vault-emerald transition-all"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-vault-bg border border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
              <div className="flex items-center gap-1.5 text-vault-emerald">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PBKDF2 Key Derivation Target
              </div>
              <p className="text-slate-500">
                Your passphrase will derive a local 256-bit AES master key inside browser memory.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-vault-emerald to-teal-500 text-slate-950 font-bold text-sm shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2 group mt-2"
            >
              <span>Initialize Vault Security Profile</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-vault-emerald hover:underline font-semibold">
              Sign In to Existing Vault
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
