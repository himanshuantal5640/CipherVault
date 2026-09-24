import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Shield, RefreshCw } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="glass-card p-8 rounded-2xl border border-vault-border flex flex-col items-center space-y-4 max-w-sm w-full text-center">
          <div className="p-3 rounded-2xl bg-vault-cyan/10 text-vault-cyan border border-vault-cyan/30 shadow-glow-cyan animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Verifying Session Token
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Checking HTTP-only cookie authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}
