import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, Key, ArrowRight, AlertCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }
    try {
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Card Header */}
        <div className="glass-card p-8 rounded-2xl border border-vault-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vault-cyan/10 blur-3xl pointer-events-none rounded-full" />

          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan mb-4 shadow-glow-cyan">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Unlock Secure Vault
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Phase 1 Placeholder Auth Console
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Vault Identity (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@vaultx.io"
                  className="w-full pl-10 pr-4 py-3 bg-vault-bg border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-vault-cyan focus:ring-1 focus:ring-vault-cyan transition-all"
                  required
                />
              </div>
            </div>

            {/* Master Key Passphrase */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono uppercase tracking-wider">
                Master Secret Passphrase
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
                  className="w-full pl-10 pr-4 py-3 bg-vault-bg border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-vault-cyan focus:ring-1 focus:ring-vault-cyan transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-indigo text-slate-950 font-bold text-sm shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Enter Vault Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have a vault key?{' '}
            <Link to="/register" className="text-vault-cyan hover:underline font-semibold">
              Generate New Vault
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              Notice: Passphrases are never transmitted unhashed in Phase 3+.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
