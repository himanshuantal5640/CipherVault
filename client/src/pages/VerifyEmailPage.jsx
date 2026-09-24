import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function VerifyEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pendingRegistration, completeRegistration, resendVerificationEmail } = useAuth();

  const email = location.state?.email || pendingRegistration?.email || 'your email address';
  const password = location.state?.password || pendingRegistration?.password;

  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleAccountVerified = async () => {
    setVerifying(true);
    setError('');
    setInfoMsg('');

    try {
      await completeRegistration(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.message || 'Email not verified yet. Please click the link sent to your email inbox and try again.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResendLink = async () => {
    setResending(true);
    setError('');
    setInfoMsg('');
    try {
      await resendVerificationEmail(email, password);
      setInfoMsg(`Verification email sent to ${email}. Please check your inbox (and spam folder).`);
    } catch (err) {
      setError(err.message || 'Failed to resend verification link.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        <div className="glass-card p-8 rounded-2xl border border-vault-cyan/30 shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-vault-cyan/10 blur-3xl pointer-events-none rounded-full" />

          {/* Header Icon */}
          <div className="inline-flex p-4 rounded-2xl bg-vault-cyan/10 border border-vault-cyan/30 text-vault-cyan shadow-glow-cyan">
            <Mail className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Verify Your Email Address
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              We sent a Firebase verification link to:
            </p>
            <div className="mt-1 inline-block px-3 py-1 rounded-lg bg-vault-bg border border-vault-border text-vault-cyan font-mono text-xs font-bold">
              {email}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 text-left space-y-2">
            <div className="flex items-center gap-2 text-vault-emerald font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Instructions:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Open your email inbox (and check spam folder).</li>
              <li>Click the verification link provided in the Firebase email.</li>
              <li>Return here and click <strong>"Account Verified"</strong> below.</li>
            </ol>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {infoMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono text-left">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAccountVerified}
              disabled={verifying}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-vault-cyan to-vault-emerald text-slate-950 font-extrabold text-sm shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 font-mono disabled:opacity-50"
            >
              {verifying ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Checking Verification Status...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Account Verified</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendLink}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-xl bg-vault-bg border border-slate-700 text-slate-400 hover:text-white transition-all text-xs font-mono flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resending ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Resending...
                </span>
              ) : (
                <span>Resend Verification Link</span>
              )}
            </button>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            Wrong email address?{' '}
            <Link to="/register" className="text-vault-cyan hover:underline font-mono">
              Back to Registration
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
