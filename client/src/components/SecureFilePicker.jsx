import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../utils/formatters';
import { MAX_FILE_SIZE_BYTES } from '../crypto/cryptoConstants';

export default function SecureFilePicker({ onFileSelected, onEncryptTriggered, isProcessing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${formatBytes(file.size)}) exceeds maximum limit of 100 MB.`);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    if (onFileSelected) onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${formatBytes(file.size)}) exceeds maximum limit of 100 MB.`);
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
    if (onFileSelected) onFileSelected(file);
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-vault-border space-y-4">
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Target */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-700/80 hover:border-vault-cyan/60 rounded-xl p-6 text-center cursor-pointer transition-all bg-vault-bg/40 hover:bg-vault-bg/70 group"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-cyan">
          <UploadCloud className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-white">
          Click or Drag & Drop File to Encrypt
        </p>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Supports any file type up to 100 MB • Zero Plaintext Upload
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected File Details */}
      {selectedFile && (
        <div className="p-4 rounded-xl bg-vault-bg border border-vault-cyan/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white max-w-xs truncate">
                {selectedFile.name}
              </div>
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>Size: {formatBytes(selectedFile.size)}</span>
                <span>•</span>
                <span>Type: {selectedFile.type || 'application/octet-stream'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onEncryptTriggered(selectedFile)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-emerald text-slate-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? 'Encrypting...' : 'Encrypt Locally'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
