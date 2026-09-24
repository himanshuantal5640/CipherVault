import React from 'react';
import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileCode, 
  FileArchive, 
  File, 
  Lock, 
  Download, 
  Trash2, 
  Code,
  ShieldCheck 
} from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/formatters';

export default function FileCard({ file, onDownload, onInspect, onDelete }) {
  const getFileIcon = (mimeType = '', filename = '') => {
    const type = mimeType.toLowerCase();
    const name = filename.toLowerCase();

    if (type.includes('image') || name.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) {
      return <FileImage className="w-5 h-5 text-vault-cyan" />;
    }
    if (type.includes('video') || name.match(/\.(mp4|webm|avi|mkv)$/)) {
      return <FileVideo className="w-5 h-5 text-vault-indigo" />;
    }
    if (type.includes('json') || type.includes('javascript') || name.match(/\.(js|jsx|ts|tsx|html|css|py|json)$/)) {
      return <FileCode className="w-5 h-5 text-vault-violet" />;
    }
    if (type.includes('zip') || type.includes('tar') || name.match(/\.(zip|tar|gz|rar|7z)$/)) {
      return <FileArchive className="w-5 h-5 text-amber-400" />;
    }
    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-emerald-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const fileId = file.id || file._id;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl border border-vault-border flex flex-col justify-between space-y-4 group">
      
      {/* Top Details & Icon */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-3 rounded-xl bg-vault-bg border border-slate-800">
            {getFileIcon(file.mimeType, file.originalName)}
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px]">
            <Lock className="w-3 h-3" />
            AES-256-GCM
          </span>
        </div>

        <h3 className="text-sm font-bold text-white truncate max-w-full" title={file.originalName}>
          {file.originalName}
        </h3>

        <div className="text-[11px] text-slate-400 font-mono mt-1 space-y-0.5">
          <div className="flex items-center justify-between">
            <span>Size:</span>
            <span className="text-slate-200 font-semibold">{formatBytes(file.size)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Uploaded:</span>
            <span className="text-slate-300">{formatDate(file.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
        
        {/* Metadata Inspector */}
        <button
          type="button"
          onClick={() => onInspect(file)}
          className="p-2 rounded-lg text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-colors"
          title="Inspect Non-Secret Metadata"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Download & Decrypt */}
          <button
            type="button"
            onClick={() => onDownload(file)}
            className="px-3 py-1.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan hover:bg-vault-cyan/20 transition-all font-semibold flex items-center gap-1.5 shadow-glow-cyan"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(file)}
            className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
            title="Delete from S3 and MongoDB"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
