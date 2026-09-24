import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Download, 
  Zap, 
  RefreshCw 
} from 'lucide-react';
import VaultHeader from '../components/vault/VaultHeader';
import VaultStats from '../components/vault/VaultStats';
import FileUpload from '../components/vault/FileUpload';
import UploadProgress from '../components/vault/UploadProgress';
import FileGrid from '../components/vault/FileGrid';
import FileList from '../components/vault/FileList';
import EmptyVault from '../components/vault/EmptyVault';
import NoSearchResults from '../components/vault/NoSearchResults';
import DeleteFileModal from '../components/vault/DeleteFileModal';
import MetadataModal from '../components/vault/MetadataModal';
import cryptoService from '../services/cryptoService';
import fileService from '../services/fileService';

export default function DashboardPage() {
  const [passphrase, setPassphrase] = useState('MyMasterPassphrase123!');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  const [vaultFiles, setVaultFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStage, setUploadStage] = useState('');

  const [selectedMetaModal, setSelectedMetaModal] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [decryptModalFile, setDecryptModalFile] = useState(null);
  const [decryptPass, setDecryptPass] = useState('');
  const [decryptError, setDecryptError] = useState('');
  const [decryptSuccessMsg, setDecryptSuccessMsg] = useState('');
  const [statusAlert, setStatusAlert] = useState(null);

  // Load authenticated user's file list from MongoDB
  const loadVaultFiles = async () => {
    try {
      setLoadingFiles(true);
      const files = await fileService.getFiles();
      setVaultFiles(files || []);
    } catch (err) {
      console.error('[VaultX] Error fetching files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    loadVaultFiles();
  }, []);

  // Robust client-side search filtering over authorized file list (originalName, filename, mimeType & s3Key)
  const filteredFiles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return vaultFiles;

    return vaultFiles.filter((file) => {
      const name = (file.originalName || file.filename || file.name || '').toLowerCase();
      const mime = (file.mimeType || '').toLowerCase();
      const s3Key = (file.s3Key || '').toLowerCase();

      return (
        name.includes(normalizedQuery) ||
        mime.includes(normalizedQuery) ||
        s3Key.includes(normalizedQuery)
      );
    });
  }, [vaultFiles, searchQuery]);

  // Complete Zero-Trust Upload Pipeline
  const handleUploadFile = async (file) => {
    if (!passphrase) {
      setStatusAlert({ type: 'error', message: 'Please enter a master passphrase for key derivation.' });
      return;
    }

    setIsProcessing(true);
    setStatusAlert(null);

    try {
      setUploadStage('Stage 1/4: Encrypting file locally with AES-256-GCM...');
      const pkg = await cryptoService.encryptFile(file, passphrase);

      setUploadStage('Stage 2/4: Requesting secure presigned S3 upload URL...');
      const urlRes = await fileService.getUploadUrl(file.name, file.size, file.type);

      setUploadStage('Stage 3/4: Uploading encrypted ciphertext directly to S3...');
      await fileService.uploadCiphertextToS3(urlRes.uploadUrl, pkg.ciphertext, file.type);

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
        message: `Successfully encrypted "${file.name}" and stored in S3 vault!`
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

  // Complete Zero-Trust Download & Decryption Pipeline
  const handleExecuteDownload = async (fileRecord, passToUse, isTampered = false) => {
    setDecryptError('');
    setDecryptSuccessMsg('');

    try {
      const fileId = fileRecord.id || fileRecord._id;
      const res = await fileService.getDownloadUrl(fileId);

      const ciphertextBuffer = await fileService.downloadCiphertextFromS3(res.downloadUrl);

      let ciphertextToDecrypt = ciphertextBuffer;
      if (isTampered) {
        const view = new Uint8Array(ciphertextBuffer.slice(0));
        if (view.length > 0) view[0] ^= 0xFF;
        ciphertextToDecrypt = view.buffer;
      }

      const encryptedPackage = {
        metadata: res.metadata,
        ciphertext: ciphertextToDecrypt
      };

      const result = await cryptoService.decryptFile(encryptedPackage, passToUse);

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

  // Confirm and Execute Deletion
  const handleConfirmDelete = async (file) => {
    setIsDeleting(true);
    try {
      const fileId = file.id || file._id;
      await fileService.deleteFile(fileId);
      setStatusAlert({ type: 'success', message: `Deleted "${file.originalName}" from S3 and MongoDB.` });
      setFileToDelete(null);
      await loadVaultFiles();
    } catch (err) {
      setStatusAlert({ type: 'error', message: err.message || 'Failed to delete file.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Search & Passphrase Input */}
      <VaultHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        passphrase={passphrase}
        setPassphrase={setPassphrase}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={loadVaultFiles}
      />

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

      {/* Dashboard Statistics */}
      <VaultStats files={vaultFiles} />

      {/* Stage Progress Bar */}
      <UploadProgress stage={uploadStage} />

      {/* File Upload Dropzone */}
      <FileUpload
        onUploadTriggered={handleUploadFile}
        isProcessing={isProcessing}
      />

      {/* Vault Content Area */}
      {loadingFiles ? (
        <div className="p-12 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2 glass-card rounded-2xl border border-vault-border">
          <RefreshCw className="w-4 h-4 animate-spin text-vault-cyan" />
          Loading user vault...
        </div>
      ) : vaultFiles.length === 0 ? (
        <EmptyVault
          onUploadClick={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
        />
      ) : filteredFiles.length === 0 ? (
        <NoSearchResults
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
        />
      ) : viewMode === 'grid' ? (
        <FileGrid
          files={filteredFiles}
          onDownload={(f) => {
            setDecryptModalFile(f);
            setDecryptPass(passphrase);
            setDecryptError('');
            setDecryptSuccessMsg('');
          }}
          onInspect={(f) => setSelectedMetaModal(f)}
          onDelete={(f) => setFileToDelete(f)}
        />
      ) : (
        <FileList
          files={filteredFiles}
          onDownload={(f) => {
            setDecryptModalFile(f);
            setDecryptPass(passphrase);
            setDecryptError('');
            setDecryptSuccessMsg('');
          }}
          onInspect={(f) => setSelectedMetaModal(f)}
          onDelete={(f) => setFileToDelete(f)}
        />
      )}

      {/* Modals */}
      <MetadataModal
        file={selectedMetaModal}
        isOpen={!!selectedMetaModal}
        onClose={() => setSelectedMetaModal(null)}
      />

      <DeleteFileModal
        file={fileToDelete}
        isOpen={!!fileToDelete}
        isDeleting={isDeleting}
        onClose={() => setFileToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

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
