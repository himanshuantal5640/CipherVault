import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  UploadCloud, 
  FileText, 
  Key, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  Trash2, 
  Eye, 
  Download, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import fileService from '../services/fileService';
import authService from '../services/authService';

export default function DashboardPage() {
  const [files, setFiles] = useState([]);
  const [healthStatus, setHealthStatus] = useState('Checking API...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fileList = await fileService.listFiles();
        setFiles(fileList);

        const health = await authService.checkHealth();
        setHealthStatus(health.message || 'API Online');
      } catch (err) {
        setHealthStatus('API Connection Error');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Zero-Trust File Vault Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan font-mono">
              Phase 1
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Client-Side Ciphertext Storage & Key Management Console
          </p>
        </div>

        {/* Security Telemetry Status Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vault-card border border-vault-border text-xs font-mono text-slate-300">
            <Cpu className="w-4 h-4 text-vault-cyan" />
            <span>WebCrypto API: Ready</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vault-card border border-vault-border text-xs font-mono text-slate-300">
            <RefreshCw className="w-3.5 h-3.5 text-vault-emerald" />
            <span>Backend: {healthStatus}</span>
          </div>
        </div>
      </div>

      {/* Upload Drop Zone Placeholder */}
      <div className="glass-card p-8 rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-vault-cyan/50 transition-all text-center relative overflow-hidden group">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-cyan">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Drag & Drop Encrypted Files (Phase 1 Placeholder)
        </h3>
        
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          Select files to encrypt in your browser memory before transferring ciphertext to storage.
        </p>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>AES-256-GCM client encryption engine will process uploads in Phase 2</span>
        </div>
      </div>

      {/* Vault Files Table */}
      <div className="glass-card rounded-2xl border border-vault-border overflow-hidden">
        
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-vault-cyan" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Encrypted Vault Items ({files.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Algorithm: AES-256-GCM
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-vault-bg/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Filename</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Cipher Algorithm</th>
                <th className="py-3.5 px-4">Security Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-800/30 transition-colors">
                  
                  <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-vault-cyan/10 text-vault-cyan border border-vault-cyan/20">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div>{file.filename}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {file.id}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-300">
                    {file.size}
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-vault-cyan font-mono text-[11px] border border-slate-700">
                      {file.algorithm}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {file.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button 
                        title="Decrypt & Download (Phase 2)" 
                        className="p-1.5 rounded hover:text-vault-cyan hover:bg-slate-800 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        title="Delete Encrypted Blob (Phase 4)" 
                        className="p-1.5 rounded hover:text-red-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
