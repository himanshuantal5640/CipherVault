import { AES_KEY_LENGTH, AES_GCM_IV_LENGTH, PBKDF2_SALT_LENGTH } from './cryptoConstants';

/**
 * VaultX Key Management Module
 * 
 * Cryptographic Distinction:
 * - DEK (Data Encryption Key): Per-file 256-bit AES-GCM symmetric key encrypting raw file bytes.
 * - KEK (Key Encryption Key): 256-bit AES-GCM key derived from user passphrase via PBKDF2 to wrap/encrypt the DEK.
 * - File IV (Initialization Vector): 96-bit random IV used exclusively for encrypting file contents.
 * - Wrap IV (Initialization Vector): 96-bit random IV used exclusively for protecting the DEK.
 * - Salt: 128-bit random salt used for PBKDF2 key derivation.
 */

/**
 * Generate a new cryptographically random 256-bit AES-GCM Data Encryption Key (DEK)
 * @returns {Promise<CryptoKey>} Extractable symmetric file key
 */
export async function generateFileDEK() {
  return await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    true, // Extractable so it can be wrapped/exported
    ['encrypt', 'decrypt']
  );
}

/**
 * Protect (wrap) a file DEK using the derived KEK and a dedicated wrapIV
 * @param {CryptoKey} dek Plaintext Data Encryption Key
 * @param {CryptoKey} kek Derived Key Encryption Key
 * @param {Uint8Array} wrapIv Dedicated 96-bit IV for key wrapping
 * @returns {Promise<ArrayBuffer>} Encrypted DEK bytes
 */
export async function protectDEK(dek, kek, wrapIv) {
  if (!dek || !kek || !wrapIv) {
    throw new Error('DEK, KEK, and wrapIv are required for key wrapping.');
  }

  // Wrap DEK using AES-GCM key wrapping
  return await window.crypto.subtle.wrapKey(
    'raw',
    dek,
    kek,
    {
      name: 'AES-GCM',
      iv: wrapIv
    }
  );
}

/**
 * Recover (unwrap) a file DEK using the derived KEK and wrapIV
 * @param {ArrayBuffer} encryptedDEKBuffer Encrypted DEK bytes
 * @param {CryptoKey} kek Derived Key Encryption Key
 * @param {Uint8Array} wrapIv Dedicated 96-bit IV used during key wrapping
 * @returns {Promise<CryptoKey>} Recovered plaintext CryptoKey DEK
 */
export async function recoverDEK(encryptedDEKBuffer, kek, wrapIv) {
  if (!encryptedDEKBuffer || !kek || !wrapIv) {
    throw new Error('Encrypted DEK, KEK, and wrapIv are required for key recovery.');
  }

  return await window.crypto.subtle.unwrapKey(
    'raw',
    encryptedDEKBuffer,
    kek,
    {
      name: 'AES-GCM',
      iv: wrapIv
    },
    {
      name: 'AES-GCM',
      length: AES_KEY_LENGTH
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a cryptographically secure random Initialization Vector (IV)
 * @param {number} length Default 12 bytes (96 bits) for AES-GCM
 * @returns {Uint8Array}
 */
export function generateRandomIV(length = AES_GCM_IV_LENGTH) {
  const iv = new Uint8Array(length);
  window.crypto.getRandomValues(iv);
  return iv;
}

/**
 * Generate a cryptographically secure random Salt
 * @param {number} length Default 16 bytes (128 bits)
 * @returns {Uint8Array}
 */
export function generateRandomSalt(length = PBKDF2_SALT_LENGTH) {
  const salt = new Uint8Array(length);
  window.crypto.getRandomValues(salt);
  return salt;
}
