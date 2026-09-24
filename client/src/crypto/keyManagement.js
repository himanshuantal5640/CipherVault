/**
 * VaultX Key Management Module (Phase 1 Placeholder)
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * Master Key Derivation via PBKDF2-HMAC-SHA256 and AES-GCM 256-bit symmetric key 
 * generation will be implemented in Phase 2.
 */

/**
 * Derive Master Encryption Key from User Passphrase and Salt via PBKDF2
 * @param {string} passphrase User master secret
 * @param {Uint8Array} salt Cryptographic salt
 * @returns {Promise<CryptoKey>} Derived Master Key
 */
export async function deriveMasterKey(passphrase, salt) {
  console.warn('[VaultX Crypto] deriveMasterKey called — PBKDF2 derivation will be enabled in Phase 2.');
  throw new Error('Key derivation via PBKDF2 is scheduled for Phase 2.');
}

/**
 * Generate a random 256-bit AES-GCM per-file key
 * @returns {Promise<CryptoKey>} Symmetric File Key
 */
export async function generateFileKey() {
  console.warn('[VaultX Crypto] generateFileKey called — key generation will be enabled in Phase 2.');
  throw new Error('Per-file AES key generation is scheduled for Phase 2.');
}

/**
 * Generate cryptographically secure random IV (12 bytes for GCM)
 * @returns {Uint8Array}
 */
export function generateIV() {
  const iv = new Uint8Array(12);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(iv);
  }
  return iv;
}
