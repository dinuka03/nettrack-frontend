import { NetworkDashboard } from './components/NetworkDashboard.jsx'
import { NetworkHistory } from './components/NetworkHistory.jsx'

export default function App() {
  return (
    <div className="app-container">
      <div className="app-layout">
        <NetworkDashboard />
        <NetworkHistory />
      </div>
    </div>
  )
}
