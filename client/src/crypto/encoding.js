/**
 * VaultX Safe Binary Encoding & Decoding Helpers
 * Avoids String.fromCharCode(...largeArray) stack overflow errors on large files
 * by processing byte arrays in bounded chunks.
 */

const CHUNK_SIZE = 8192; // 8KB chunks to prevent stack overflow

/**
 * Convert Uint8Array to Base64 string safely
 * @param {Uint8Array} bytes 
 * @returns {string} Base64 encoded string
 */
export function uint8ArrayToBase64(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += CHUNK_SIZE) {
    const chunk = bytes.subarray(i, Math.min(i + CHUNK_SIZE, len));
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array safely
 * @param {string} base64 
 * @returns {Uint8Array}
 */
export function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert ArrayBuffer to Base64 string
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
export function arrayBufferToBase64(buffer) {
  return uint8ArrayToBase64(new Uint8Array(buffer));
}

/**
 * Convert Base64 string to ArrayBuffer
 * @param {string} base64 
 * @returns {ArrayBuffer}
 */
export function base64ToArrayBuffer(base64) {
  const uint8 = base64ToUint8Array(base64);
  return uint8.buffer;
}
