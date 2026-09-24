/**
 * VaultX AES-256-GCM File Data Encryption Module
 * Authenticated encryption and decryption for file ArrayBuffer contents.
 */

/**
 * Encrypt raw file buffer using AES-256-GCM and per-file DEK
 * @param {ArrayBuffer} fileBuffer Plaintext file byte buffer
 * @param {CryptoKey} dek Per-file Data Encryption Key
 * @param {Uint8Array} fileIv 96-bit Initialization Vector
 * @returns {Promise<ArrayBuffer>} Encrypted ciphertext with appended GCM auth tag
 */
export async function encryptFileData(fileBuffer, dek, fileIv) {
  if (!fileBuffer || !dek || !fileIv) {
    throw new Error('File buffer, DEK, and fileIv are required for encryption.');
  }

  return await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: fileIv
    },
    dek,
    fileBuffer
  );
}

/**
 * Decrypt ciphertext buffer using AES-256-GCM and per-file DEK
 * @param {ArrayBuffer} ciphertext Encrypted byte buffer
 * @param {CryptoKey} dek Per-file Data Encryption Key
 * @param {Uint8Array} fileIv 96-bit Initialization Vector
 * @returns {Promise<ArrayBuffer>} Plaintext file byte buffer
 */
export async function decryptFileData(ciphertext, dek, fileIv) {
  if (!ciphertext || !dek || !fileIv) {
    throw new Error('Ciphertext, DEK, and fileIv are required for decryption.');
  }

  try {
    return await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: fileIv
      },
      dek,
      ciphertext
    );
  } catch (error) {
    // WebCrypto throws OperationError on GCM tag mismatches or invalid keys
    throw new Error('Integrity verification failed (AES-GCM authentication mismatch).');
  }
}
