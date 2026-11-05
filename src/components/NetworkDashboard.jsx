import React from 'react'
import { useCurrentNetwork } from '../hooks/useCurrentNetwork.js'
import { formatRate, formatBytes, formatDuration, formatTimestamp } from '../utils/formatters.js'
import { getStatusConfig } from '../utils/statusHelper.js'

export function NetworkDashboard() {
  const { data, networkError, isRetainingPrevious } = useCurrentNetwork(1000)

  const status = data?.status || null
  const rateResult = data?.rateResult || null
  const lastAttemptTimestamp = data?.lastAttemptTimestamp || null

  const statusConfig = getStatusConfig(status, networkError, isRetainingPrevious, lastAttemptTimestamp)

  // Rate metrics (only shown when ready or retaining ready data)
  const isReady = (status === 'READY' || isRetainingPrevious) && rateResult !== null

  const downloadRate = isReady ? formatRate(rateResult.rxBytesPerSecond) : { value: '—', unit: '', formatted: '—' }
  const uploadRate = isReady ? formatRate(rateResult.txBytesPerSecond) : { value: '—', unit: '', formatted: '—' }

  const rxBytesFormatted = isReady ? formatBytes(rateResult.rxBytesDelta) : '—'
  const txBytesFormatted = isReady ? formatBytes(rateResult.txBytesDelta) : '—'
  const durationFormatted = isReady ? formatDuration(rateResult.durationSeconds) : '—'
  const interfaceName = rateResult?.interfaceName || 'wlp3s0'
  const timestampFormatted = formatTimestamp(lastAttemptTimestamp)

  // Calculate total interval bytes if ready
  const totalBytesFormatted = isReady
    ? formatBytes((rateResult.rxBytesDelta || 0) + (rateResult.txBytesDelta || 0))
    : '—'

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-meta">
          <span className="interface-badge">Interface: {interfaceName}</span>
          <span className="poll-badge">1s polling</span>
        </div>
        <h1 className="dashboard-title">NetTrack</h1>
        <p className="dashboard-subtitle">Ubuntu Internet Data Usage Monitor</p>

        <div className="status-container">
          <div className={`status-pill status-${statusConfig.tone}`}>
            <span className={`status-dot ${statusConfig.pulseDot ? 'pulse' : ''}`} />
            <span className="status-label">{statusConfig.label}</span>
          </div>
        </div>
      </header>

      {/* Alert and Warning Banners */}
      {networkError && (
        <div className={`alert-banner ${isRetainingPrevious ? 'alert-warning' : 'alert-error'}`}>
          <div className="alert-icon">{isRetainingPrevious ? '⚠️' : '⚡'}</div>
          <div className="alert-content">
            <strong>{isRetainingPrevious ? 'Connection Warning' : 'Backend Unreachable'}</strong>
            <p>{statusConfig.description}</p>
          </div>
        </div>
      )}

      {!networkError && status === 'BASELINE_ONLY' && (
        <div className="notice-banner notice-baseline">
          <span className="notice-icon">⏱️</span>
          <div className="notice-content">
            <strong>Establishing Baseline Sample</strong>
            <p>Baseline snapshot captured. Rates will appear once the next interval completes.</p>
          </div>
        </div>
      )}

      {!networkError && status === 'INITIAL' && (
        <div className="notice-banner notice-initial">
          <span className="notice-icon">🔄</span>
          <div className="notice-content">
            <strong>Initializing Monitoring</strong>
            <p>Waiting for the scheduler to complete its first sampling interval.</p>
          </div>
        </div>
      )}

      {!networkError && status === 'ERROR' && (
        <div className="alert-banner alert-error">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <strong>Sampling Error</strong>
            <p>Backend could not read counters for interface {interfaceName}. Ensure the Wi-Fi interface is active.</p>
          </div>
        </div>
      )}

      {/* Prominent Rate Cards */}
      <section className="rate-grid" aria-label="Transfer Rates">
        {/* Download Card */}
        <div className="rate-card rate-card-download">
          <div className="rate-card-header">
            <span className="rate-direction-icon download-icon">↓</span>
            <span className="rate-card-title">Download Rate</span>
          </div>
          <div className="rate-metric">
            <span className="rate-number">{downloadRate.value}</span>
            {downloadRate.unit && <span className="rate-unit">{downloadRate.unit}</span>}
          </div>
          <div className="rate-submetric">
            <span className="submetric-label">Interval Received:</span>
            <span className="submetric-value">{rxBytesFormatted}</span>
          </div>
        </div>

        {/* Upload Card */}
        <div className="rate-card rate-card-upload">
          <div className="rate-card-header">
            <span className="rate-direction-icon upload-icon">↑</span>
            <span className="rate-card-title">Upload Rate</span>
          </div>
          <div className="rate-metric">
            <span className="rate-number">{uploadRate.value}</span>
            {uploadRate.unit && <span className="rate-unit">{uploadRate.unit}</span>}
          </div>
          <div className="rate-submetric">
            <span className="submetric-label">Interval Sent:</span>
            <span className="submetric-value">{txBytesFormatted}</span>
          </div>
        </div>
      </section>

      {/* Interval Details & Telemetry */}
      <section className="details-panel" aria-label="Interval Telemetry">
        <h2 className="panel-title">Interval Metrics</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Network Interface</span>
            <span className="detail-value">{interfaceName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Interval Duration</span>
            <span className="detail-value">{durationFormatted}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Data in Interval</span>
            <span className="detail-value">{totalBytesFormatted}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Updated Time</span>
            <span className="detail-value">{timestampFormatted}</span>
          </div>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>Connected via relative <code>/api/network/current</code> proxy to NetTrack Spring Boot backend</p>
      </footer>
    </div>
  )
}

