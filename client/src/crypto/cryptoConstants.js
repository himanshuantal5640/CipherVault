/**
 * VaultX Centralized Cryptographic Constants
 * Single source of truth for browser Web Crypto API algorithms & parameters.
 */

// AES Algorithm configuration
export const AES_KEY_LENGTH = 256; // 256-bit symmetric keys
export const AES_GCM_IV_LENGTH = 12; // 12 bytes = 96 bits (NIST recommendation for GCM)

// Key Derivation (PBKDF2) configuration
export const PBKDF2_SALT_LENGTH = 16; // 16 bytes = 128-bit salt
export const PBKDF2_ITERATIONS = 100000; // 100,000 PBKDF2 iterations
export const PBKDF2_HASH = 'SHA-256';

// MVP File Constraints
export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB max file size limit for MVP

// VaultX Spec Version
export const ALGORITHM_VERSION = 1;
