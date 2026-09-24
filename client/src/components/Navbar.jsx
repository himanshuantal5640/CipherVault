import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Lock, Cpu, Key, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-vault-border/80 bg-vault-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan group-hover:bg-vault-cyan/20 transition-all duration-300 shadow-glow-cyan">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Vault<span className="cyber-gradient-text font-black">X</span>
              </span>
              <span className="text-[10px] text-vault-muted font-mono tracking-widest uppercase -mt-1">
                Zero-Trust Vault
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-all ${
                isActive('/') 
                  ? 'text-vault-cyan bg-vault-cyan/10 border border-vault-cyan/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md transition-all flex items-center gap-1.5 ${
                isActive('/dashboard') 
                  ? 'text-vault-cyan bg-vault-cyan/10 border border-vault-cyan/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Vault Dashboard
            </Link>

            <Link
              to="/security"
              className={`px-3 py-2 rounded-md transition-all flex items-center gap-1.5 ${
                isActive('/security') 
                  ? 'text-vault-cyan bg-vault-cyan/10 border border-vault-cyan/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Architecture
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AES-256-GCM Ready
            </div>

            <Link
              to="/login"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-md border border-slate-700/60 hover:border-slate-500 transition-all"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="text-xs font-semibold px-4 py-2 rounded-md bg-gradient-to-r from-vault-cyan to-vault-indigo text-slate-950 hover:brightness-110 shadow-glow-cyan transition-all flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              Create Vault
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
