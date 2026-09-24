import React, { useState, useEffect } from 'react';
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
  X,
  UploadCloud,
  Cloud
} from 'lucide-react';
import SecureFilePicker from '../components/SecureFilePicker';
import cryptoService from '../services/cryptoService';
import fileService from '../services/fileService';
import authService from '../services/authService';
import { formatBytes, formatDate } from '../utils/formatters';

export default function DashboardPage() {
  const [passphrase, setPassphrase] = useState('MyMasterPassphrase123!');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStage, setUploadStage] = useState(''); // Stage status message
  const [vaultFiles, setVaultFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [selectedMetaModal, setSelectedMetaModal] = useState(null);
  const [decryptModalFile, setDecryptModalFile] = useState(null);
  const [decryptPass, setDecryptPass] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [decryptSuccessMsg, setDecryptSuccessMsg] = useState('');
  const [statusAlert, setStatusAlert] = useState(null);

  // Load authenticated user's files from MongoDB
  const loadVaultFiles = async () => {
    try {
      setLoadingFiles(true);
      const files = await fileService.getFiles();
      setVaultFiles(files);
    } catch (err) {
      console.error('[VaultX] Error fetching vault files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadVaultFiles();
  }, []);

  // Complete Zero-Trust Cloud Upload Flow
  const handleUploadFile = async (file) => {
    if (!passphrase) {
      setStatusAlert({ type: 'error', message: 'Please enter a master passphrase for key derivation.' });
      return;
    }

    setIsProcessing(true);
    setStatusAlert(null);

    try {
      // STAGE 1: Encrypt locally in browser memory
      setUploadStage('Stage 1/4: Encrypting file locally with AES-256-GCM...');
      const pkg = await cryptoService.encryptFile(file, passphrase);

      // STAGE 2: Request presigned S3 upload URL from Node.js backend
      setUploadStage('Stage 2/4: Requesting secure presigned S3 upload URL...');
      const urlRes = await fileService.getUploadUrl(file.name, file.size, file.type);

      // STAGE 3: Direct browser-to-S3 ciphertext transfer
      setUploadStage('Stage 3/4: Uploading encrypted ciphertext directly to S3...');
      await fileService.uploadCiphertextToS3(urlRes.uploadUrl, pkg.ciphertext, file.type);

      // STAGE 4: Save encrypted metadata in MongoDB
      setUploadStage('Stage 4/4: Storing metadata in MongoDB...');
      const metadataPayload = {
        originalName: pkg.metadata.filename,
        s3Key: urlRes.s3Key,
        size: pkg.metadata.fileSize,
        mimeType: pkg.metadata.mimeType,
        encryptedDEK: pkg.metadata.encryptedDEK,
        fileIV: pkg.metadata.iv,
        wrapIV: pkg.metadata.wrapIv,
        salt: pkg.metadata.salt,
        algorithm: pkg.metadata.algorithm,
        keyDerivation: {
          algorithm: pkg.metadata.keyAlgorithm,
          iterations: pkg.metadata.pbkdf2Iterations
        }
      };

      await fileService.saveFileMetadata(metadataPayload);

      setStatusAlert({
        type: 'success',
        message: `Successfully encrypted "${file.name}" and uploaded ciphertext to S3!`
      });

      await loadVaultFiles();
    } catch (err) {
      setStatusAlert({
        type: 'error',
        message: err.message || 'File upload pipeline failed.'
      });
    } finally {
      setIsProcessing(false);
      setUploadStage('');
    }
  };

  // Complete Zero-Trust Cloud Download & Decryption Flow
  const handleExecuteDownload = async (fileRecord, passToUse, isTampered = false) => {
    setDecryptError('');
    setDecryptSuccessMsg('');

    try {
      // Step 1: Request presigned GET URL and metadata from backend
      const res = await fileService.getDownloadUrl(fileRecord.id || fileRecord._id);

      // Step 2: Fetch ciphertext directly from S3
      const ciphertextBuffer = await fileService.downloadCiphertextFromS3(res.downloadUrl);

      let ciphertextToDecrypt = ciphertextBuffer;

      // Simulate 1-byte corruption if requested
      if (isTampered) {
        const view = new Uint8Array(ciphertextBuffer.slice(0));
        if (view.length > 0) view[0] ^= 0xFF;
        ciphertextToDecrypt = view.buffer;
      }

      // Step 3: Reconstruct Phase 3 encrypted package
      const encryptedPackage = {
        metadata: res.metadata,
        ciphertext: ciphertextToDecrypt
      };

      // Step 4: Decrypt locally in browser memory
      const result = await cryptoService.decryptFile(encryptedPackage, passToUse);

      // Step 5: Trigger browser download Blob
      const blob = new Blob([result.fileBuffer], { type: result.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      a.click();
      URL.revokeObjectURL(url);

      setDecryptSuccessMsg(`Decrypted successfully! "${result.filename}" downloaded.`);
    } catch (err) {
      setDecryptError(err.message || 'Decryption failed.');
    }
  };

  // Delete File
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file from S3 cloud storage?')) return;
    try {
      await fileService.deleteFile(fileId);
      setStatusAlert({ type: 'success', message: 'File deleted from S3 and metadata removed.' });
      await loadVaultFiles();
    } catch (err) {
      setStatusAlert({ type: 'error', message: err.message || 'Failed to delete file.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Encrypted Cloud Storage Console
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
              AWS S3 + Presigned URLs Active
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browser → Direct Ciphertext → S3 • Node.js Backend Never Sees Plaintext
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

      {/* Global Status Banner */}
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

      {/* Pipeline Stage Progress Indicator */}
      {uploadStage && (
        <div className="p-4 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan text-xs font-mono flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{uploadStage}</span>
        </div>
      )}

      {/* Secure File Picker */}
      <SecureFilePicker
        onEncryptTriggered={handleUploadFile}
        isProcessing={isProcessing}
      />

      {/* Vault Files Table */}
      <div className="glass-card rounded-2xl border border-vault-border overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-vault-cyan" />
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Encrypted Cloud Storage Vault ({vaultFiles.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Direct S3 Presigned Transfers
          </span>
        </div>

        {loadingFiles ? (
          <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-vault-cyan" />
            Loading cloud vault metadata...
          </div>
        ) : vaultFiles.length === 0 ? (
          <div className="p-12 text-center">
            <UploadCloud className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm text-slate-400 font-medium">Your S3 vault is empty.</p>
            <p className="text-xs text-slate-500 font-mono mt-1">Select a file above to encrypt and upload to AWS S3.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-vault-bg/60 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Filename</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">S3 Object Key</th>
                  <th className="py-3.5 px-4">Uploaded</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {vaultFiles.map((f) => {
                  const fileId = f.id || f._id;
                  return (
                    <tr key={fileId} className="hover:bg-slate-800/30 transition-colors">
                      
                      <td className="py-4 px-4 font-medium text-white flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-vault-cyan/10 text-vault-cyan border border-vault-cyan/20">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div>{f.originalName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">MIME: {f.mimeType}</div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-slate-300">
                        {formatBytes(f.size)}
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded bg-slate-800 text-vault-cyan font-mono text-[11px] border border-slate-700">
                          {f.s3Key}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {formatDate(f.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Metadata Inspector */}
                          <button
                            onClick={() => setSelectedMetaModal(f)}
                            className="p-1.5 rounded text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-colors flex items-center gap-1 font-mono text-[11px]"
                            title="Inspect Encrypted Metadata"
                          >
                            <Code className="w-4 h-4" />
                            <span>Metadata</span>
                          </button>

                          {/* Download & Decrypt */}
                          <button
                            onClick={() => {
                              setDecryptModalFile(f);
                              setDecryptPass(passphrase);
                              setDecryptError('');
                              setDecryptSuccessMsg('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan hover:bg-vault-cyan/20 transition-all font-mono text-[11px] flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteFile(fileId)}
                            className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Delete from S3 and MongoDB"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
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
                  MongoDB Encrypted File Document
                </h3>
              </div>
              <button onClick={() => setSelectedMetaModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-vault-bg p-4 rounded-xl text-xs font-mono text-vault-cyan overflow-x-auto border border-slate-800">
              {JSON.stringify(selectedMetaModal, null, 2)}
            </pre>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <p className="text-emerald-400">• S3 Object Key: {selectedMetaModal.s3Key}</p>
              <p>• Plaintext DEK and passwords are NEVER stored in database.</p>
            </div>
          </div>
        </div>
      )}

      {/* Download & Decrypt Modal */}
      {decryptModalFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-2xl border border-vault-border max-w-md w-full space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-vault-cyan" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  S3 Presigned Download & Decrypt
                </h3>
              </div>
              <button onClick={() => setDecryptModalFile(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Target File: <strong className="text-white font-mono">{decryptModalFile.originalName}</strong>
            </p>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Enter Master Passphrase
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
                onClick={() => handleExecuteDownload(decryptModalFile, decryptPass, false)}
                className="py-2.5 px-3 rounded-xl bg-vault-cyan/20 border border-vault-cyan/40 text-vault-cyan font-bold text-xs hover:bg-vault-cyan/30 transition-all font-mono flex items-center justify-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Download & Decrypt
              </button>

              <button
                type="button"
                onClick={() => handleExecuteDownload(decryptModalFile, decryptPass, true)}
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
