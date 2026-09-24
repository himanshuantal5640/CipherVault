import React from 'react';
import { Search, Key, LayoutGrid, List, Shield, RefreshCw } from 'lucide-react';

export default function VaultHeader({
  searchQuery,
  setSearchQuery,
  passphrase,
  setPassphrase,
  viewMode,
  setViewMode,
  onRefresh
}) {
  return (
    <div className="space-y-4 pb-6 border-b border-slate-800">
      
      {/* Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Encrypted Vault Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              AES-256-GCM + S3
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browser Encryption • Direct S3 Ciphertext Transfer • Zero-Trust Access
          </p>
        </div>

        {/* Master Passphrase Bar */}
        <div className="flex items-center gap-2 bg-vault-card p-2 rounded-xl border border-vault-border">
          <Key className="w-4 h-4 text-vault-cyan pl-1 shrink-0" />
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Master Passphrase for KEK..."
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono w-48 sm:w-56"
          />
          <span className="text-[10px] text-vault-muted font-mono px-2 py-0.5 rounded bg-slate-800 shrink-0">
            PBKDF2 KEK
          </span>
        </div>
      </div>

      {/* Controls Bar: Search & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault files by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-vault-card border border-vault-border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-vault-cyan transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* View Mode & Refresh */}
        <div className="flex items-center gap-2">
          
          <button
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-vault-card border border-vault-border text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Refresh Vault List"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="flex items-center p-1 bg-vault-card rounded-xl border border-vault-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-vault-cyan/20 text-vault-cyan font-semibold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-vault-cyan/20 text-vault-cyan font-semibold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
