import { formatTimestamp } from './formatters.js'

/**
 * Maps backend monitoring status and network error state to UI presentation details.
 *
 * @param {string|null} status - 'INITIAL' | 'BASELINE_ONLY' | 'READY' | 'ERROR' | null
 * @param {string|null} networkError - Network error message if fetch failed
 * @param {boolean} isRetainingPrevious - True if showing cached previous reading
 * @param {string|null} lastAttemptTimestamp - Timestamp of the current or retained reading
 * @returns {object} UI presentation configuration
 */
export function getStatusConfig(status, networkError, isRetainingPrevious, lastAttemptTimestamp) {
  // If there is an active network error
  if (networkError) {
    if (isRetainingPrevious) {
      return {
        label: 'Reconnecting',
        tone: 'warning',
        description: `Backend connection interrupted. Retaining last reading from ${formatTimestamp(lastAttemptTimestamp)}.`,
        hasRates: true,
        pulseDot: true,
      }
    }
    return {
      label: 'Offline',
      tone: 'offline',
      description: 'Unable to reach backend service at /api/network/current. Ensure the Spring Boot backend is running.',
      hasRates: false,
      pulseDot: false,
    }
  }

  switch (status) {
    case 'READY':
      return {
        label: 'Active Monitoring',
        tone: 'ready',
        description: 'Real-time network transfer rates are being calculated for wlp3s0.',
        hasRates: true,
        pulseDot: true,
      }

    case 'BASELINE_ONLY':
      return {
        label: 'Establishing Baseline',
        tone: 'baseline',
        description: 'Initial snapshot recorded. Measuring byte deltas for the next interval.',
        hasRates: false,
        pulseDot: true,
      }

    case 'INITIAL':
      return {
        label: 'Initializing',
        tone: 'initial',
        description: 'Monitoring service is starting up. Waiting for first sampling attempt.',
        hasRates: false,
        pulseDot: false,
      }

    case 'ERROR':
      return {
        label: 'Sampling Error',
        tone: 'error',
        description: 'Backend sampling error. Interface wlp3s0 may be unavailable or counters could not be read.',
        hasRates: false,
        pulseDot: false,
      }

    default:
      return {
        label: 'Connecting...',
        tone: 'initial',
        description: 'Connecting to NetTrack monitoring backend...',
        hasRates: false,
        pulseDot: false,
      }
  }
}
