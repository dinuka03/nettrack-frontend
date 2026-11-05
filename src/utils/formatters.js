/**
 * Utility functions for formatting network transfer rates, byte quantities,
 * durations, and timestamps.
 */

const KIB = 1024
const MIB = KIB * 1024
const GIB = MIB * 1024

/**
 * Formats transfer rate in bytes per second into human-readable units.
 * Returns an object with value, unit, and full formatted string.
 *
 * @param {number|null|undefined} bytesPerSec - Raw rate in bytes/sec
 * @returns {{ value: string, unit: string, formatted: string }}
 */
export function formatRate(bytesPerSec) {
  if (
    bytesPerSec === null ||
    bytesPerSec === undefined ||
    typeof bytesPerSec !== 'number' ||
    Number.isNaN(bytesPerSec) ||
    !Number.isFinite(bytesPerSec) ||
    bytesPerSec < 0
  ) {
    return { value: '—', unit: '', formatted: '—' }
  }

  if (bytesPerSec === 0) {
    return { value: '0.0', unit: 'B/s', formatted: '0.0 B/s' }
  }

  if (bytesPerSec >= GIB) {
    const val = (bytesPerSec / GIB).toFixed(2)
    return { value: val, unit: 'GB/s', formatted: `${val} GB/s` }
  }
  if (bytesPerSec >= MIB) {
    const val = (bytesPerSec / MIB).toFixed(2)
    return { value: val, unit: 'MB/s', formatted: `${val} MB/s` }
  }
  if (bytesPerSec >= KIB) {
    const val = (bytesPerSec / KIB).toFixed(1)
    return { value: val, unit: 'KB/s', formatted: `${val} KB/s` }
  }

  const val = bytesPerSec.toFixed(1)
  return { value: val, unit: 'B/s', formatted: `${val} B/s` }
}

/**
 * Formats a byte quantity into a human-readable unit (e.g. 1024 -> "1.0 KB").
 *
 * @param {number|null|undefined} bytes - Total bytes
 * @returns {string} Formatted string or '—' if invalid
 */
export function formatBytes(bytes) {
  if (
    bytes === null ||
    bytes === undefined ||
    typeof bytes !== 'number' ||
    Number.isNaN(bytes) ||
    !Number.isFinite(bytes) ||
    bytes < 0
  ) {
    return '—'
  }

  if (bytes === 0) {
    return '0 B'
  }

  if (bytes >= GIB) {
    return `${(bytes / GIB).toFixed(2)} GB`
  }
  if (bytes >= MIB) {
    return `${(bytes / MIB).toFixed(2)} MB`
  }
  if (bytes >= KIB) {
    return `${(bytes / KIB).toFixed(1)} KB`
  }

  return `${bytes.toLocaleString()} B`
}

/**
 * Formats elapsed duration in seconds.
 *
 * @param {number|null|undefined} seconds
 * @returns {string} Formatted string or '—'
 */
export function formatDuration(seconds) {
  if (
    seconds === null ||
    seconds === undefined ||
    typeof seconds !== 'number' ||
    Number.isNaN(seconds) ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return '—'
  }

  return `${seconds.toFixed(2)}s`
}

/**
 * Formats an ISO-8601 UTC timestamp string for display (time only).
 *
 * @param {string|null|undefined} isoString
 * @returns {string} Formatted local time or '—'
 */
export function formatTimestamp(isoString) {
  if (!isoString || typeof isoString !== 'string') {
    return '—'
  }

  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

/**
 * Formats an ISO-8601 UTC timestamp string for display (date and time).
 *
 * @param {string|null|undefined} isoString
 * @returns {string} Formatted local date and time or '—'
 */
export function formatDateTime(isoString) {
  if (!isoString || typeof isoString !== 'string') {
    return '—'
  }

  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
