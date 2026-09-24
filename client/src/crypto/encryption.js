/**
 * VaultX Client-Side AES-256-GCM Encryption Module (Phase 1 Placeholder)
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * Actual Web Crypto API AES-256-GCM encryption and chunk processing
 * will be implemented in Phase 2.
 */

/**
 * Encrypt a file buffer using client-side AES-256-GCM
 * @param {ArrayBuffer} fileBuffer Plaintext file bytes
 * @param {CryptoKey} key Per-file symmetric AES key
 * @returns {Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array, tag: Uint8Array }>}
 */
export async function encryptFileBuffer(fileBuffer, key) {
  console.warn('[VaultX Crypto] encryptFileBuffer called — encryption is a Phase 2 target feature.');
  throw new Error('Client-side AES-256-GCM encryption will be enabled in Phase 2.');
}

/**
 * Decrypt a ciphertext buffer using client-side AES-256-GCM
 * @param {ArrayBuffer} ciphertext Encrypted bytes
 * @param {CryptoKey} key Per-file symmetric AES key
 * @param {Uint8Array} iv Initialization vector
 * @returns {Promise<ArrayBuffer>} Plaintext file buffer
 */
export async function decryptFileBuffer(ciphertext, key, iv) {
  console.warn('[VaultX Crypto] decryptFileBuffer called — decryption is a Phase 2 target feature.');
  throw new Error('Client-side AES-256-GCM decryption will be enabled in Phase 2.');
}
