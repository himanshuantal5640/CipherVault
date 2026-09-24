import React from 'react';
import { Trash2, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

export default function DeleteFileModal({ file, isOpen, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card p-6 rounded-2xl border border-red-500/40 max-w-md w-full space-y-4 shadow-2xl">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Confirm Cloud File Deletion
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-slate-300 font-sans">
          <p>
            Are you sure you want to permanently delete this file?
          </p>
          <div className="p-3 rounded-xl bg-vault-bg border border-slate-800 font-mono text-xs space-y-1">
            <div className="text-white font-bold truncate">{file.originalName}</div>
            <div className="text-slate-400 text-[11px]">Size: {formatBytes(file.size)}</div>
            <div className="text-slate-500 text-[10px] truncate">S3 Key: {file.s3Key}</div>
          </div>
          <p className="text-red-400 text-[11px] font-mono">
            ⚠️ This action will issue an S3 DeleteObject request and permanently purge the metadata record from MongoDB.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-all font-mono"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isDeleting}
            onClick={() => onConfirm(file)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-xs shadow-lg hover:brightness-110 transition-all font-mono flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete File</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
