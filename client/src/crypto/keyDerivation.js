import { PBKDF2_ITERATIONS, PBKDF2_HASH, AES_KEY_LENGTH } from './cryptoConstants';

/**
 * Derive an AES-GCM Key Encryption Key (KEK) from a user secret and salt using PBKDF2
 * 
 * @param {string} userSecret User master passphrase
 * @param {Uint8Array} salt Cryptographically random salt (16 bytes)
 * @returns {Promise<CryptoKey>} Derived KEK (AES-GCM 256-bit)
 */
export async function deriveKeyEncryptionKey(userSecret, salt) {
  if (!userSecret || typeof userSecret !== 'string') {
    throw new Error('User secret must be a non-empty string for key derivation.');
  }
  if (!salt || !(salt instanceof Uint8Array)) {
    throw new Error('Valid Uint8Array salt is required for key derivation.');
  }

  const encoder = new TextEncoder();
  const passphraseBytes = encoder.encode(userSecret);

  // 1. Import raw user secret as PBKDF2 key material
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passphraseBytes,
    { name: 'PBKDF2' },
    false, // Non-extractable
    ['deriveKey']
  );

  // 2. Derive AES-GCM 256-bit Key Encryption Key (KEK)
  const kek = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    false, // Non-extractable for security
    ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
  );

  return kek;
}
