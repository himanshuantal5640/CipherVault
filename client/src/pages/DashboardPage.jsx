import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Key, 
  CheckCircle2, 
  Cpu, 
  Trash2, 
  Download, 
  AlertTriangle,
  FileText,
  Eye,
  Zap,
  Code,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import SecureFilePicker from '../components/SecureFilePicker';
import cryptoService from '../services/cryptoService';
import { formatBytes } from '../utils/formatters';

export default function DashboardPage() {
  const [passphrase, setPassphrase] = useState('MyMasterPassphrase123!');
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptedPackages, setEncryptedPackages] = useState([]);
  const [selectedMetaModal, setSelectedMetaModal] = useState(null);
  const [decryptModalPkg, setDecryptModalPkg] = useState(null);
  const [decryptPass, setDecryptPass] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [decryptSuccessMsg, setDecryptSuccessMsg] = useState('');
  const [statusAlert, setStatusAlert] = useState(null);

  // Handle local file encryption trigger
  const handleEncryptFile = async (file) => {
    if (!passphrase) {
      setStatusAlert({ type: 'error', message: 'Please provide a master passphrase to derive the KEK.' });
      return;
    }

    setIsProcessing(true);
    setStatusAlert(null);

    try {
      const pkg = await cryptoService.encryptFile(file, passphrase);
      const pkgId = 'enc_' + Date.now();
      const newPackage = {
        id: pkgId,
        metadata: pkg.metadata,
        ciphertext: pkg.ciphertext, // In-memory ArrayBuffer
        encryptedAt: new Date().toISOString()
      };

      setEncryptedPackages([newPackage, ...encryptedPackages]);
      setStatusAlert({
        type: 'success',
        message: `Successfully encrypted "${file.name}" locally using AES-256-GCM!`
      });
    } catch (err) {
      setStatusAlert({
        type: 'error',
        message: err.message || 'Local encryption failed.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle decryption
  const handleExecuteDecrypt = async (pkgToDecrypt, passToUse, isTampered = false) => {
    setDecryptError('');
    setDecryptSuccessMsg('');

    try {
      let targetPkg = pkgToDecrypt;

      // If simulate tamper flag is set, corrupt 1 byte of ciphertext
      if (isTampered) {
        const corruptedCiphertext = pkgToDecrypt.ciphertext.slice(0);
        const view = new Uint8Array(corruptedCiphertext);
        if (view.length > 0) view[0] ^= 0xFF; // Flip first byte
        targetPkg = { ...pkgToDecrypt, ciphertext: corruptedCiphertext };
      }

      const result = await cryptoService.decryptFile(targetPkg, passToUse);

      // Create browser blob download URL
      const blob = new Blob([result.fileBuffer], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);

      setDecryptSuccessMsg(`Decryption successful! Reconstructed "${result.filename}" downloaded.`);
    } catch (err) {
      setDecryptError(err.message || 'Decryption failed.');
    }
  };

  const removePackage = (id) => {
    setEncryptedPackages(encryptedPackages.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Zero-Trust Local Encryption Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              WebCrypto AES-256-GCM Active
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browser Memory Encryption Engine • Zero Network Transmission
          </p>
        </div>

        {/* Master Passphrase Input for KEK Derivation */}
        <div className="flex items-center gap-2 bg-vault-card p-2 rounded-xl border border-vault-border">
          <Key className="w-4 h-4 text-vault-cyan pl-1" />
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="Master Passphrase..."
            className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono w-48"
          />
          <span className="text-[10px] text-vault-muted font-mono px-2 py-0.5 rounded bg-slate-800">
            PBKDF2 KEK
          </span>
        </div>
      </div>

      {/* Global Status Alert Banner */}
      {statusAlert && (
        <div 
          className={`p-4 rounded-xl border text-xs flex items-center justify-between font-mono ${
            statusAlert.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusAlert.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusAlert.message}</span>
          </div>
          <button onClick={() => setStatusAlert(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* File Picker Component */}
      <SecureFilePicker
        onEncryptTriggered={handleEncryptFile}
        isProcessing={isProcessing}
      />

      {/* Local Encrypted Packages Table */}
      <div className="glass-card rounded-2xl border border-vault-border overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-vault-cyan" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              In-Memory Encrypted Items ({encryptedPackages.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Zero Backend Upload • Isolated DEK / KEK
          </span>
        </div>

        {encryptedPackages.length === 0 ? (
          <div className="p-12 text-center">
            <Lock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-slate-400 font-medium">No files encrypted in this session yet.</p>
            <p className="text-xs text-slate-500 font-mono mt-1">Select a file above and click "Encrypt Locally".</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-vault-bg/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Filename</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Ciphertext IV</th>
                  <th className="py-3.5 px-4">Security Envelope</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {encryptedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-800/30 transition-colors">
                    
                    <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-vault-cyan/10 text-vault-cyan border border-vault-cyan/20">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div>{pkg.metadata.filename}</div>
                        <div className="text-[10px] text-slate-500 font-mono">MIME: {pkg.metadata.mimeType}</div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {formatBytes(pkg.metadata.fileSize)}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded bg-slate-800 text-vault-cyan font-mono text-[11px] border border-slate-700">
                        {pkg.metadata.iv.substring(0, 10)}...
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        AES-256-GCM / PBKDF2
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* View Non-Secret Metadata */}
                        <button
                          onClick={() => setSelectedMetaModal(pkg.metadata)}
                          className="p-1.5 rounded text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-colors flex items-center gap-1 font-mono text-[11px]"
                          title="Inspect Metadata Package"
                        >
                          <Code className="w-4 h-4" />
                          <span>Inspect</span>
                        </button>

                        {/* Test Decryption Trigger */}
                        <button
                          onClick={() => {
                            setDecryptModalPkg(pkg);
                            setDecryptPass(passphrase);
                            setDecryptError('');
                            setDecryptSuccessMsg('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan hover:bg-vault-cyan/20 transition-all font-mono text-[11px] flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Decrypt</span>
                        </button>

                        {/* Remove from memory */}
                        <button
                          onClick={() => removePackage(pkg.id)}
                          className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                          title="Remove from memory"
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
        )}
      </div>

      {/* Metadata Inspector Modal */}
      {selectedMetaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-2xl border border-vault-cyan/40 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-vault-cyan" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Non-Secret Cryptographic Envelope
                </h3>
              </div>
              <button onClick={() => setSelectedMetaModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-vault-bg p-4 rounded-xl text-xs font-mono text-vault-cyan overflow-x-auto border border-slate-800">
              {JSON.stringify(selectedMetaModal, null, 2)}
            </pre>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <p>• Plaintext DEK and KEK are non-extractable and never exposed in metadata.</p>
              <p>• Wrap IV and File IV are cryptographically distinct.</p>
            </div>
          </div>
        </div>
      )}

      {/* Decryption Test Modal */}
      {decryptModalPkg && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-2xl border border-vault-border max-w-md w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-vault-cyan" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Decrypt & Verify File
                </h3>
              </div>
              <button onClick={() => setDecryptModalPkg(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Target File: <strong className="text-white font-mono">{decryptModalPkg.metadata.filename}</strong>
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Enter Master Passphrase (KEK Derivation)
              </label>
              <input
                type="password"
                value={decryptPass}
                onChange={(e) => setDecryptPass(e.target.value)}
                className="w-full px-3 py-2 bg-vault-bg border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-vault-cyan"
              />
            </div>

            {decryptError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{decryptError}</span>
              </div>
            )}

            {decryptSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{decryptSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleExecuteDecrypt(decryptModalPkg, decryptPass, false)}
                className="py-2.5 px-3 rounded-xl bg-vault-cyan/20 border border-vault-cyan/40 text-vault-cyan font-bold text-xs hover:bg-vault-cyan/30 transition-all font-mono"
              >
                Decrypt File
              </button>

              <button
                type="button"
                onClick={() => handleExecuteDecrypt(decryptModalPkg, decryptPass, true)}
                className="py-2.5 px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all font-mono flex items-center justify-center gap-1"
                title="Simulate 1-byte ciphertext corruption"
              >
                <Zap className="w-3.5 h-3.5" />
                Tamper Test
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
