import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw, 
  Lock, 
  Unlock, 
  Binary, 
  ShieldCheck 
} from 'lucide-react';
import cryptoService from '../../services/cryptoService';

export default function TamperDemo() {
  const [stage, setStage] = useState('idle'); // idle | encrypting | cipher_generated | corrupting | decrypting | tampered_detected | failed
  const [logs, setLogs] = useState([]);
  const [details, setDetails] = useState(null);

  const runTamperTest = async () => {
    setStage('encrypting');
    setLogs([]);
    setDetails(null);

    const logList = [];
    const addLog = (msg, status = 'info') => {
      logList.push({ message: msg, status, timestamp: new Date().toLocaleTimeString() });
      setLogs([...logList]);
    };

    try {
      // Step 1: Create local sample plaintext
      const sampleText = 'VaultX Security Demo Payload: Confidential Zero-Trust Data Stream';
      addLog('Step 1: Created sample payload in browser RAM (never leaves browser)', 'info');

      // Step 2: Encrypt in browser memory using AES-256-GCM
      const testSecret = 'DemoPassphrase123!';
      const sampleFile = new File([new TextEncoder().encode(sampleText)], 'tamper_test.txt', { type: 'text/plain' });
      
      addLog('Step 2: Encrypting sample with AES-256-GCM + PBKDF2 (100k iterations)...', 'info');
      const pkg = await cryptoService.encryptFile(sampleFile, testSecret);

      setStage('cipher_generated');
      addLog(`Step 3: Ciphertext generated (${pkg.ciphertext.byteLength} bytes). Nonce & 128-bit Auth Tag appended.`, 'success');

      // Step 4: Corrupt exactly 1 byte in ciphertext ArrayBuffer
      addLog('Step 4: Modifying exactly 1 byte in the ciphertext ArrayBuffer...', 'warning');
      const tamperedBuffer = pkg.ciphertext.slice(0); // Clone ArrayBuffer
      const view = new Uint8Array(tamperedBuffer);
      if (view.length > 0) {
        view[0] ^= 0xFF; // Flip all bits of the first byte
      }
      setStage('corrupting');

      // Step 5: Attempt authenticated decryption with original DEK/IV
      addLog('Step 5: Attempting authenticated AES-GCM decryption with tampered ciphertext...', 'info');
      setStage('decrypting');

      let tamperedFailed = false;
      let caughtErrorMessage = '';

      try {
        await cryptoService.decryptFile({ metadata: pkg.metadata, ciphertext: tamperedBuffer }, testSecret);
      } catch (err) {
        tamperedFailed = true;
        caughtErrorMessage = err.message || 'OperationError: Decryption failed';
      }

      if (tamperedFailed) {
        setStage('tamper_detected');
        addLog(`Step 6: SECURITY SUCCESS - AES-GCM tag verification rejected tampered ciphertext!`, 'success');
        addLog(`Cryptographic Proof: ${caughtErrorMessage}`, 'success');

        setDetails({
          status: 'TAMPER_DETECTED',
          message: 'AES-GCM authentication tag rejected the modified ciphertext.',
          error: caughtErrorMessage,
          byteFlipped: 'Byte 0 XOR 0xFF',
          payloadSize: `${pkg.ciphertext.byteLength} bytes`
        });
      } else {
        setStage('failed');
        addLog('Step 6: FAILED - Modified ciphertext was unexpectedly decrypted!', 'error');
        setDetails({
          status: 'FAILED',
          message: 'Security warning: Tampered ciphertext was decrypted without tag error.'
        });
      }
    } catch (err) {
      setStage('failed');
      addLog(`Test execution error: ${err.message}`, 'error');
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-2xl border border-vault-cyan/30 space-y-6 shadow-2xl">
      
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-glow-emerald">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
              AES-256-GCM Tamper Detection Interactive Demo
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              100% browser-only verification demonstrating authenticated encryption integrity rejection
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={stage === 'encrypting' || stage === 'corrupting' || stage === 'decrypting'}
          onClick={runTamperTest}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-vault-cyan text-slate-950 font-extrabold text-xs shadow-glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 font-mono"
        >
          {stage === 'encrypting' || stage === 'corrupting' || stage === 'decrypting' ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              Running Tamper Test...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-slate-950" />
              Run Tamper Test
            </>
          )}
        </button>
      </div>

      {/* Stage Progression Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
        <div className={`p-2.5 rounded-xl border ${stage !== 'idle' ? 'bg-vault-cyan/10 border-vault-cyan/40 text-vault-cyan' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          1. Encrypt Sample
        </div>
        <div className={`p-2.5 rounded-xl border ${['cipher_generated', 'corrupting', 'decrypting', 'tamper_detected'].includes(stage) ? 'bg-vault-cyan/10 border-vault-cyan/40 text-vault-cyan' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          2. Ciphertext Built
        </div>
        <div className={`p-2.5 rounded-xl border ${['corrupting', 'decrypting', 'tamper_detected'].includes(stage) ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          3. Flip 1 Byte
        </div>
        <div className={`p-2.5 rounded-xl border ${['decrypting', 'tamper_detected'].includes(stage) ? 'bg-vault-cyan/10 border-vault-cyan/40 text-vault-cyan' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          4. Authenticated Decrypt
        </div>
        <div className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border ${stage === 'tamper_detected' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold' : stage === 'failed' ? 'bg-red-500/20 border-red-500/50 text-red-300 font-bold' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          5. Tampering Detected
        </div>
      </div>

      {/* Result Outcome Display */}
      {details && (
        <div 
          className={`p-5 rounded-xl border font-mono text-xs space-y-2 ${
            details.status === 'TAMPER_DETECTED'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {details.status === 'TAMPER_DETECTED' ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Tampering Detected: AES-GCM Tag Verification Passed</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />
                <span>Tamper Test Failed</span>
              </>
            )}
          </div>
          <p className="text-slate-200">{details.message}</p>
          <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-800/80">
            <div>Corrupted Target: <span className="text-amber-300">{details.byteFlipped}</span></div>
            <div>Web Crypto Exception: <span className="text-emerald-400">{details.error}</span></div>
          </div>
        </div>
      )}

      {/* Real-time Test Execution Logs */}
      {logs.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2 max-h-56 overflow-y-auto">
          <div className="text-slate-500 pb-1 border-b border-slate-900 flex justify-between">
            <span>RAM SIMULATION LOG STREAM</span>
            <span>NO BACKEND / S3 IMPLICATED</span>
          </div>
          {logs.map((log, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-2 ${
                log.status === 'success' ? 'text-emerald-400' : log.status === 'warning' ? 'text-amber-300' : log.status === 'error' ? 'text-red-400' : 'text-slate-300'
              }`}
            >
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
