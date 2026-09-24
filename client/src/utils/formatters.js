/**
 * Format bytes into human readable string (KB, MB, GB)
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format ISO timestamp into clean date string
 */
export function formatDate(isoString) {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate key fingerprint string for UI display
 */
export function truncateHash(hashStr, start = 6, end = 6) {
  if (!hashStr) return '';
  if (hashStr.length <= start + end) return hashStr;
  return `${hashStr.substring(0, start)}...${hashStr.substring(hashStr.length - end)}`;
}
