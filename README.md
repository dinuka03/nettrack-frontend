# NetTrack Frontend

Frontend web application for **NetTrack — Ubuntu Internet Data Usage Monitor**.

This application provides a real-time responsive dashboard and historical monitoring table for tracking network transfer rates and data usage on the physical Wi-Fi interface (`wlp3s0`).

## Features

### 1. Real-Time Network Monitoring Dashboard
- **Real-Time Polling**: Automatically polls `GET /api/network/current` on mount and refreshes every 1 second.
- **Concurrency & Resource Protection**: Uses an in-flight guard to prevent overlapping HTTP requests and cleans up timers and pending `fetch` calls via `AbortController` when unmounted.
- **Prominent Rate Cards**: Displays current download and upload rates with adaptive unit formatting (`B/s`, `KB/s`, `MB/s`, `GB/s`).
- **Comprehensive Lifecycle Handling**:
  - `INITIAL`: Shows initializing status while waiting for the first sampling attempt.
  - `BASELINE_ONLY`: Shows baseline captured status without displaying misleading zero rates.
  - `READY`: Prominently renders live download/upload rates, byte deltas, interval duration, and update timestamps.
  - `ERROR`: Flags backend sampling errors for interface `wlp3s0`.
  - **Network Interruption Resilience**: Automatically retains the last successful `READY` reading with a clear warning notice if network connectivity to the backend is temporarily interrupted.

### 2. Network Usage History Section
- **Recent Intervals Feed**: Fetches recent 100 intervals on page open from `GET /api/network/history?limit=100` via the Vite proxy.
- **Responsive Table**: Displays recorded time, downloaded bytes (rx), uploaded bytes (tx), total interval data, and interval duration with tabular numerical alignment.
- **Independent Loading & Error Handling**: Displays clean loading, error (with retry button), and empty states without hiding or disrupting the real-time dashboard.
- **Preserved Backend Ordering**: Renders records in the backend's deterministic newest-first order (`ORDER BY recorded_at_epoch_ms DESC, id DESC`) using the unique record `id` as React keys.
- **Manual Refresh**: Includes an on-demand Refresh button with in-flight protection and animated loading indicator.

### 3. Automated Test Suite
- **Zero-Dependency Tests**: 19 unit tests running on Node's native test runner (`node:test`) verifying rate formatting, byte scaling, timestamp conversions, status mappings, and history calculations.

## Technology Stack

- **Framework**: React 19 (JavaScript, JSX)
- **Build Tool**: Vite 6
- **Styling**: Pure CSS with CSS variables, modern dark theme, and mobile responsiveness
- **Test Runner**: Node.js built-in test runner (`node:test`)

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (tested with `v22.22.1`)
- **npm**: `v9.x` or higher (tested with `9.2.0`)
- **Backend Service**: NetTrack Spring Boot backend running on `http://localhost:8080` (proxy configured in Vite)

## Getting Started

### 1. Install Dependencies

From the `nettrack-frontend` repository root:

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

The Vite development server will start at:

```
http://localhost:5173
```

Vite proxies all relative `/api/*` requests (such as `/api/network/current` and `/api/network/history?limit=100`) to `http://localhost:8080` without requiring CORS configuration on the backend.

### 3. Run Automated Tests

Run the focused test suite covering rate formatting, status handling, and history data processing:

```bash
npm test
```

### 4. Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled assets will be placed in the `dist/` directory.

### 5. Preview Production Build

To preview the built production bundle locally:

```bash
npm run preview
```

## Dashboard & History Behavior

| Section | State | Presentation | Behavior |
|---|---|---|---|
| **Dashboard** | `INITIAL` | Blue badge, placeholder `—` rates | Waiting for first sampling attempt. |
| **Dashboard** | `BASELINE_ONLY` | Amber badge, placeholder `—` rates | Baseline captured; awaits second snapshot. |
| **Dashboard** | `READY` | Green pulse badge, live rate cards | Live rates, deltas, duration, and timestamp. |
| **Dashboard** | `ERROR` | Red badge, sampling error banner | Interface counters unavailable. |
| **Dashboard** | `Network Error` | Reconnecting / Offline banner | Retains last valid reading if available. |
| **History** | `Loading` | Centered spinner with message | Displays while fetching initial 100 records. |
| **History** | `Empty` | Empty state box | Notice indicating no intervals saved to database yet. |
| **History** | `Error` | Error box with Retry button | Explains network failure; preserves current dashboard. |
| **History** | `Populated` | Scrollable responsive table | Newest-first records with rx/tx/total bytes and duration. |

## Project Structure

```
nettrack-frontend/
├── index.html                   # HTML entry point
├── package.json                 # Dependencies, scripts, and type config
├── vite.config.js               # Vite configuration with /api proxy
├── README.md                    # Setup and behavior documentation
├── .gitignore                   # Git ignore rules for node_modules, dist, etc.
├── src/
│   ├── main.jsx                 # React application bootstrap
│   ├── App.jsx                  # Root component hosting dashboard & history
│   ├── index.css                # Responsive dark-theme dashboard styles
│   ├── components/
│   │   ├── NetworkDashboard.jsx # Real-time current metrics & rate cards
│   │   └── NetworkHistory.jsx   # Recent interval usage table & refresh
│   ├── hooks/
│   │   ├── useCurrentNetwork.js # 1s polling hook with overlap protection
│   │   └── useNetworkHistory.js # History fetcher with manual refresh
│   └── utils/
│       ├── formatters.js        # Rate, byte, duration, and date formatters
│       ├── statusHelper.js      # Status configurations and error mapping
│       └── historyHelper.js     # History record formatting and total calculations
└── test/
    ├── formatters.test.js       # Unit tests for rate & metric formatting
    ├── statusHelper.test.js     # Unit tests for status & failure mappings
    └── historyHelper.test.js    # Unit tests for history record processing
```
