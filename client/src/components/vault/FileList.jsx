import React from 'react';
import { FileText, Lock, Download, Trash2, Code, CheckCircle2 } from 'lucide-react';
import { formatBytes, formatDate } from '../../utils/formatters';

export default function FileList({ files, onDownload, onInspect, onDelete }) {
  return (
    <div className="glass-card rounded-2xl border border-vault-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-vault-bg/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Filename</th>
              <th className="py-3.5 px-4">Size</th>
              <th className="py-3.5 px-4">S3 Key</th>
              <th className="py-3.5 px-4">Uploaded</th>
              <th className="py-3.5 px-4">Security Badge</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {files.map((f) => {
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
                      {f.s3Key ? `${f.s3Key.substring(0, 20)}...` : 'S3 Object'}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                    {formatDate(f.createdAt)}
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                      <CheckCircle2 className="w-3 h-3" />
                      AES-256-GCM
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-mono">
                      
                      {/* Metadata Inspector */}
                      <button
                        onClick={() => onInspect(f)}
                        className="p-1.5 rounded text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
                        title="Inspect Encrypted Metadata"
                      >
                        <Code className="w-4 h-4" />
                      </button>

                      {/* Download */}
                      <button
                        onClick={() => onDownload(f)}
                        className="px-3 py-1.5 rounded-lg bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan hover:bg-vault-cyan/20 transition-all text-[11px] flex items-center gap-1 font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(f)}
                        className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete File"
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
    </div>
  );
}
