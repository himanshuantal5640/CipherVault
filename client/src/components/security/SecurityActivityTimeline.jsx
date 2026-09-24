import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Upload, 
  Download, 
  Trash2, 
  Lock, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity 
} from 'lucide-react';
import auditService from '../../services/auditService';
import { formatDate } from '../../utils/formatters';

export default function SecurityActivityTimeline() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await auditService.getAuditLogs();
      setLogs(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch security audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getActionBadge = (action, status) => {
    switch (action) {
      case 'FILE_UPLOAD':
        return {
          icon: <Upload className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          label: 'FILE UPLOAD'
        };
      case 'FILE_DOWNLOAD':
        return {
          icon: <Download className="w-4 h-4 text-vault-cyan" />,
          bg: 'bg-vault-cyan/10 border-vault-cyan/30 text-vault-cyan',
          label: 'FILE DOWNLOAD'
        };
      case 'FILE_DELETE':
        return {
          icon: <Trash2 className="w-4 h-4 text-amber-400" />,
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          label: 'FILE DELETE'
        };
      case 'LOGIN_SUCCESS':
        return {
          icon: <Lock className="w-4 h-4 text-emerald-400" />,
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          label: 'LOGIN SUCCESS'
        };
      case 'LOGIN_FAILED':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
          bg: 'bg-red-500/10 border-red-500/30 text-red-300',
          label: 'LOGIN FAILED'
        };
      case 'ACCESS_DENIED':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-red-400" />,
          bg: 'bg-red-500/10 border-red-500/30 text-red-300',
          label: 'ACCESS DENIED'
        };
      default:
        return {
          icon: <Activity className="w-4 h-4 text-slate-400" />,
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          label: action
        };
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-border space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan shadow-glow-cyan">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              Recent Security Audit Activity
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Real authenticated user security event timeline (fetched live from GET /api/audit)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="p-2.5 rounded-xl bg-vault-bg border border-slate-800 text-slate-400 hover:text-vault-cyan hover:bg-slate-800 transition-all text-xs font-mono flex items-center gap-1.5 shrink-0"
          title="Refresh Audit Logs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-vault-cyan' : ''}`} />
          <span className="hidden sm:inline">Refresh Logs</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-vault-cyan" />
          <span>Fetching live security audit logs...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <Shield className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400 font-mono">No security events recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => {
            const badge = getActionBadge(log.action, log.status);
            const detailText =
              log.details?.filename ||
              log.details?.email ||
              log.details?.reason ||
              'User authenticated operation';

            return (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-vault-bg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${badge.bg} shrink-0`}>
                    {badge.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{badge.label}</span>
                      <span 
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/10 border border-red-500/30 text-red-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans truncate max-w-sm sm:max-w-md">
                      {detailText}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between text-[10px] text-slate-500 shrink-0">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(log.createdAt)}</span>
                  </div>
                  <span className="text-[9px] text-slate-600">IP: {log.ipAddress}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
