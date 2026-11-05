export default function App() {
  return (
    <div className="app-container">
      <main className="card">
        <div className="badge">Stage 1 Foundation</div>
        <h1 className="title">NetTrack</h1>
        <p className="subtitle">Ubuntu Internet Data Usage Monitor</p>
        <div className="status-indicator">
          <span className="dot"></span>
          <span>Frontend foundation is ready</span>
        </div>
        <p className="description">
          The React and Vite development foundation has been initialized with the local
          development proxy configured to forward <code>/api</code> requests to the Spring Boot
          backend on port 8080.
        </p>
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Development Server</span>
            <span className="detail-value">Port 5173</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Backend Proxy</span>
            <span className="detail-value">/api &rarr; :8080</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Monitored Interface</span>
            <span className="detail-value">wlp3s0</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Stack</span>
            <span className="detail-value">React + Vite (JS/JSX)</span>
          </div>
        </div>
      </main>
    </div>
  )
}

