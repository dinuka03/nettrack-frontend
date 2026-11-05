# NetTrack Frontend

Frontend application for NetTrack — Ubuntu Internet Data Usage Monitor.

This application provides the web user interface for monitoring real-time network transfer rates and historical usage statistics on the physical Wi-Fi interface (`wlp3s0`).

## Stage 1: Foundation Overview

- **Framework**: React 19 (JavaScript, JSX)
- **Build Tool**: Vite
- **Development Server Port**: `5173`
- **Backend API Proxy**: Requests to `/api` are proxied to `http://localhost:8080` with `changeOrigin: true`

## Prerequisites

- **Node.js**: `v20.x` or `v22.x` (verified with `v22.22.1`)
- **npm**: `v9.x` or higher (verified with `9.2.0`)
- **Backend Service** (optional for static UI development): NetTrack Spring Boot backend running on `http://localhost:8080`

## Getting Started

### 1. Install Dependencies

From the `nettrack-frontend` repository root:

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The Vite development server will start at:

```
http://localhost:5173
```

During development, requests made by the frontend to relative paths like `/api/network/current` and `/api/network/history` will be automatically forwarded by Vite to the backend on `http://localhost:8080`.

### 3. Production Build

To build the optimized static assets:

```bash
npm run build
```

Build outputs are generated in the `dist/` directory.

### 4. Preview Production Build

To preview the built production bundle locally:

```bash
npm run preview
```

## Project Structure

```
nettrack-frontend/
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration and development proxy
├── README.md           # Setup and usage documentation
├── .gitignore          # Git ignore rules for node_modules, dist, etc.
└── src/
    ├── main.jsx        # React application bootstrap
    ├── App.jsx         # Root NetTrack placeholder component
    └── index.css       # Base styles and responsive layout
```

