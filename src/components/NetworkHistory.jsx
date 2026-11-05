import React from 'react'
import { useNetworkHistory } from '../hooks/useNetworkHistory.js'
import { formatHistoryRecord } from '../utils/historyHelper.js'

export function NetworkHistory() {
  const { history, isLoading, isRefreshing, error, refresh } = useNetworkHistory(100)

  return (
    <section className="history-container" aria-label="Network Usage History">
      <header className="history-header">
        <div className="history-title-group">
          <h2 className="history-title">Network Usage History</h2>
          <span className="history-badge">
            {isLoading ? 'Loading...' : `${history.length} recent intervals`}
          </span>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={refresh}
          disabled={isRefreshing || isLoading}
          title="Refresh network usage history"
        >
          <span className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>↻</span>
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </header>

      {/* Warning banner when refresh fails but prior history is available */}
      {error && history.length > 0 && (
        <div className="history-alert history-alert-warning" role="alert">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <strong>Refresh Error:</strong> {error}. Showing previously fetched records.
          </div>
        </div>
      )}

      {/* Loading state when no data has loaded yet */}
      {isLoading && history.length === 0 && (
        <div className="history-state-box state-loading">
          <span className="state-spinner" />
          <p>Loading network usage history...</p>
        </div>
      )}

      {/* Error state when initial fetch fails */}
      {!isLoading && error && history.length === 0 && (
        <div className="history-state-box state-error" role="alert">
          <span className="state-icon">⚡</span>
          <div className="state-message">
            <strong>Unable to Load History</strong>
            <p>{error}</p>
          </div>
          <button type="button" className="retry-btn" onClick={refresh}>
            Retry Request
          </button>
        </div>
      )}

      {/* Empty state when request succeeds but table has 0 rows */}
      {!isLoading && !error && history.length === 0 && (
        <div className="history-state-box state-empty">
          <span className="state-icon">📋</span>
          <div className="state-message">
            <strong>No History Recorded Yet</strong>
            <p>
              Completed 1-second monitoring intervals will be saved to SQLite and listed here.
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {history.length > 0 && (
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th scope="col" className="col-time">Recorded Time</th>
                <th scope="col" className="col-number">Downloaded (rx)</th>
                <th scope="col" className="col-number">Uploaded (tx)</th>
                <th scope="col" className="col-number">Total Data</th>
                <th scope="col" className="col-duration">Duration</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, index) => {
                const formatted = formatHistoryRecord(record)
                // Use record.id as the React key as required
                return (
                  <tr key={record.id ?? `history-${index}`}>
                    <td className="cell-time">{formatted.recordedTime}</td>
                    <td className="cell-number text-download">{formatted.downloaded}</td>
                    <td className="cell-number text-upload">{formatted.uploaded}</td>
                    <td className="cell-number cell-total">{formatted.total}</td>
                    <td className="cell-duration">{formatted.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

