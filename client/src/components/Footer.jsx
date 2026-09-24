import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Key, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-vault-border/80 bg-vault-bg py-12 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Logo & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan shadow-glow-cyan">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Vault<span className="text-vault-cyan">X</span>
              </span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Zero-Trust Secure File Vault — Encrypted client-side with AES-256-GCM before cloud upload.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap gap-6 text-slate-400">
            <a href="#how-it-works" className="hover:text-vault-cyan transition-colors">
              How It Works
            </a>
            <a href="#architecture" className="hover:text-vault-cyan transition-colors">
              Architecture
            </a>
            <a href="#security-features" className="hover:text-vault-cyan transition-colors">
              Security
            </a>
            <a href="#technology" className="hover:text-vault-cyan transition-colors">
              Technology
            </a>
            <Link to="/security" className="hover:text-vault-cyan transition-colors">
              Security Center
            </Link>
            <Link to="/login" className="hover:text-vault-cyan transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-vault-cyan transition-colors">
              Sign Up
            </Link>
          </div>

        </div>

        {/* Bottom Bar & Security Badge */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              Built with client-side AES-256-GCM encryption & Web Crypto API.
            </span>
          </div>

          <div>
            © {new Date().getFullYear()} VaultX Platform. Open Zero-Trust Architecture.
          </div>
        </div>

      </div>
    </footer>
  );
}
