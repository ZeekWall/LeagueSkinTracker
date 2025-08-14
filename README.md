# LoL Skin Tracker v2.0

A modern Electron application for tracking your League of Legends champion skins. Built with React, TypeScript, and Vite for optimal performance.

## 📥 Download

**[Download Latest Release](https://github.com/ZeekWall/LeagueSkinTracker/releases/latest)** - Get the portable executable for Windows

Or download directly: [`LoL Skin Tracker-v2.0.0-x64.exe`](dist/LoL%20Skin%20Tracker-v2.0.0-x64.exe)

## ✨ Features

- Track owned champion skins
- Filter and search champions
- Progress tracking and statistics
- Modern, responsive UI with Tailwind CSS
- Offline data persistence with Electron Store
- Portable executable - no installation required

## 🛠️ Development

### Prerequisites

- **Node.js 20+** (Required for modern dependencies)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ZeekWall/LeagueSkinTracker.git
cd LeagueSkinTracker

# Install dependencies (skip problematic scripts)
npm install --ignore-scripts

# Start development server
npm start
# Opens Vite dev server at http://localhost:5173

# Run Electron in development
npm run electron-dev
```

### Building

```bash
# Build React app
npm run build

# Build portable executable
npm run dist:portable

# The executable will be created in: dist/LoL Skin Tracker-v2.0.0-x64.exe
```

### Build Script (Recommended)

For reliable building, use the included PowerShell script:
```bash
powershell -ExecutionPolicy Bypass -File build-portable.ps1
```

## 🧪 Testing

```bash
# Run end-to-end tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Debug tests
npm run test:e2e:debug
```

## 🏗️ Project Structure

```
├── src/                    # React source code
│   ├── components/         # React components
│   ├── hooks/             # Custom hooks
│   ├── services/          # API and data services
│   └── shared/            # Types and constants
├── electron/              # Electron main process
├── tests/                 # Playwright E2E tests
├── public/                # Static assets
└── dist/                  # Built executable
```

## 🔧 Tech Stack

- **Frontend**: React 18, TypeScript 5, Tailwind CSS
- **Build Tool**: Vite 6 (fast development and building)
- **Desktop**: Electron 32
- **Testing**: Playwright
- **Data**: Electron Store, Axios for API calls

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Vite dev server |
| `npm run build` | Build React app for production |
| `npm run electron` | Run Electron (requires dev server) |
| `npm run electron-dev` | Run both dev server and Electron |
| `npm run dist:portable` | Build portable Windows executable |
| `npm run test:e2e` | Run Playwright tests |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run test:e2e`
5. Build to ensure it works: `npm run dist:portable`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/ZeekWall/LeagueSkinTracker/issues/new).

## 📊 MCP Integration

This project includes Model Context Protocol (MCP) server integration for automated testing. See [CLAUDE.md](CLAUDE.md) for details.