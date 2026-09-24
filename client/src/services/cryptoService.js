import { MAX_FILE_SIZE_BYTES, PBKDF2_ITERATIONS, ALGORITHM_VERSION } from '../crypto/cryptoConstants';
import { deriveKeyEncryptionKey } from '../crypto/keyDerivation';
import { generateFileDEK, protectDEK, recoverDEK, generateRandomIV, generateRandomSalt } from '../crypto/keyManagement';
import { encryptFileData, decryptFileData } from '../crypto/encryption';
import { arrayBufferToBase64, base64ToArrayBuffer, base64ToUint8Array } from '../crypto/encoding';

/**
 * VaultX High-Level Cryptographic Service
 * Provides full end-to-end browser client-side file encryption and decryption.
 */
export const cryptoService = {
  /**
   * Encrypt a browser File object using client-side AES-256-GCM and PBKDF2 key wrapping
   * 
   * @param {File} file Standard browser File object
   * @param {string} userSecret User master passphrase
   * @returns {Promise<{ metadata: Object, ciphertext: ArrayBuffer }>} Encrypted package
   */
  encryptFile: async (file, userSecret) => {
    // 1. Validate File and Size
    if (!file || !(file instanceof File)) {
      throw new Error('Valid browser File object is required.');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed threshold of 100 MB.`);
    }
    if (!userSecret || typeof userSecret !== 'string') {
      throw new Error('User passphrase is required for file encryption.');
    }

    // 2. Read File bytes into ArrayBuffer memory
    const fileBuffer = await file.arrayBuffer();

    // 3. Generate random IVs and Salt using crypto.getRandomValues()
    const salt = generateRandomSalt();
    const fileIv = generateRandomIV();
    const wrapIv = generateRandomIV();

    // 4. Derive KEK (Key Encryption Key) from user secret
    const kek = await deriveKeyEncryptionKey(userSecret, salt);

    // 5. Generate random DEK (Data Encryption Key) for this file
    const dek = await generateFileDEK();

    // 6. Encrypt file bytes with DEK and fileIV
    const ciphertext = await encryptFileData(fileBuffer, dek, fileIv);

    // 7. Protect (wrap) DEK with KEK and wrapIV
    const encryptedDEKBuffer = await protectDEK(dek, kek, wrapIv);

    // 8. Construct clean metadata package
    const metadata = {
      version: ALGORITHM_VERSION,
      filename: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileSize: file.size,
      algorithm: 'AES-256-GCM',
      keyAlgorithm: 'PBKDF2-SHA-256',
      keyLength: 256,
      pbkdf2Iterations: PBKDF2_ITERATIONS,
      iv: arrayBufferToBase64(fileIv),
      wrapIv: arrayBufferToBase64(wrapIv),
      salt: arrayBufferToBase64(salt),
      encryptedDEK: arrayBufferToBase64(encryptedDEKBuffer)
    };

    return {
      metadata,
      ciphertext // ArrayBuffer
    };
  },

  /**
   * Decrypt an encrypted package using the user secret
   * 
   * @param {{ metadata: Object, ciphertext: ArrayBuffer }} encryptedPackage 
   * @param {string} userSecret 
   * @returns {Promise<{ fileBuffer: ArrayBuffer, filename: string, mimeType: string }>} Plaintext result
   */
  decryptFile: async (encryptedPackage, userSecret) => {
    if (!encryptedPackage || !encryptedPackage.metadata || !encryptedPackage.ciphertext) {
      throw new Error('Invalid encrypted package format.');
    }
    if (!userSecret || typeof userSecret !== 'string') {
      throw new Error('User passphrase is required for decryption.');
    }

    const { metadata, ciphertext } = encryptedPackage;

    try {
      // 1. Decode Base64 cryptographic parameters
      const salt = base64ToUint8Array(metadata.salt);
      const fileIv = base64ToUint8Array(metadata.iv);
      const wrapIv = base64ToUint8Array(metadata.wrapIv);
      const encryptedDEKBuffer = base64ToArrayBuffer(metadata.encryptedDEK);

      // 2. Derive KEK from user secret and stored salt
      const kek = await deriveKeyEncryptionKey(userSecret, salt);

      // 3. Recover DEK using KEK and stored wrapIv
      const dek = await recoverDEK(encryptedDEKBuffer, kek, wrapIv);

      // 4. Decrypt file ciphertext using DEK and stored fileIv
      const plaintextBuffer = await decryptFileData(ciphertext, dek, fileIv);

      return {
        fileBuffer: plaintextBuffer,
        filename: metadata.filename,
        mimeType: metadata.mimeType
      };
    } catch (error) {
      // Do not reveal whether failure was caused by password vs ciphertext tampering
      throw new Error('Unable to decrypt file. Invalid secret or corrupted data.');
    }
  }
};

export default cryptoService;
