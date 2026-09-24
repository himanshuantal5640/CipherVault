import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center glass-card p-10 rounded-2xl border border-vault-border max-w-md w-full shadow-2xl">
        
        <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6 shadow-lg">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-4xl font-extrabold text-white tracking-tight font-mono">
          404
        </h1>

        <h2 className="text-lg font-bold text-slate-200 mt-2">
          Route Access Denied / Not Found
        </h2>

        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          The requested resource path does not exist or has been revoked under zero-trust policy.
        </p>

        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan hover:bg-vault-cyan/20 font-semibold text-xs transition-all shadow-glow-cyan"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Vault Home
          </Link>
        </div>

      </div>
    </div>
  );
}
