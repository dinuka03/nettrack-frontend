import { formatBytes, formatDuration, formatDateTime, formatTimestamp } from './formatters.js'

/**
 * Safely calculates the total byte sum from rx and tx byte counts.
 * Returns null if neither count is a valid non-negative number.
 *
 * @param {number|null|undefined} rxBytes - Received bytes delta
 * @param {number|null|undefined} txBytes - Transmitted bytes delta
 * @returns {number|null} Total byte sum or null
 */
export function calculateTotalBytes(rxBytes, txBytes) {
  const rxValid = typeof rxBytes === 'number' && !Number.isNaN(rxBytes) && Number.isFinite(rxBytes) && rxBytes >= 0
  const txValid = typeof txBytes === 'number' && !Number.isNaN(txBytes) && Number.isFinite(txBytes) && txBytes >= 0

  if (!rxValid && !txValid) {
    return null
  }

  return (rxValid ? rxBytes : 0) + (txValid ? txBytes : 0)
}

/**
 * Formats a raw network interval history record into safe, human-readable strings for table presentation.
 * Safely handles null, undefined, or missing values without throwing or producing NaN.
 *
 * @param {object} record - Raw record from /api/network/history
 * @returns {object} Formatted record object
 */
export function formatHistoryRecord(record) {
  if (!record || typeof record !== 'object') {
    return {
      id: null,
      recordedTime: '—',
      timeOnly: '—',
      downloaded: '—',
      uploaded: '—',
      total: '—',
      duration: '—',
      interfaceName: 'wlp3s0',
    }
  }

  const totalBytes = calculateTotalBytes(record.rxBytesDelta, record.txBytesDelta)

  return {
    id: record.id ?? null,
    recordedTime: formatDateTime(record.recordedAt),
    timeOnly: formatTimestamp(record.recordedAt),
    downloaded: formatBytes(record.rxBytesDelta),
    uploaded: formatBytes(record.txBytesDelta),
    total: formatBytes(totalBytes),
    duration: formatDuration(record.durationSeconds),
    interfaceName: record.interfaceName || 'wlp3s0',
  }
}

