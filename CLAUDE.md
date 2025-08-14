# LoL Skin Tracker v2.0 - Development Guide

## 🚀 Modern Build System (Updated August 2024)

This project has been **completely modernized** from Create React App to **Vite + TypeScript 5**:

### Key Changes:
- ✅ **Replaced react-scripts** with Vite 6 (much faster builds)
- ✅ **Updated to React 18** and TypeScript 5
- ✅ **Eliminated 100+ deprecated packages**
- ✅ **Node.js 20+ compatibility** (was 18.x)
- ✅ **Modern Electron 32** (was 37.x)

## 🛠️ Build Commands (Updated)

### Development:
```bash
# Install dependencies (skip problematic electron scripts)
npm install --ignore-scripts

# Start Vite dev server (port 5173, not 3000)
npm start

# Run Electron + React together
npm run electron-dev
```

### Production Build:
```bash
# Option 1: Use npm scripts
npm run build                    # Build React with Vite
npm run build-electron          # Build React + compile Electron main
npm run dist:portable           # Create Windows portable exe

# Option 2: Use PowerShell script (recommended)
powershell -ExecutionPolicy Bypass -File build-portable.ps1

# Option 3: Manual steps (if PATH issues)
./node_modules/.bin/vite build
./node_modules/.bin/tsc electron/main.ts --outDir build/electron --target es2020 --module commonjs --moduleResolution node --esModuleInterop
./node_modules/.bin/electron-builder --win portable
```

### Output:
- **React build**: `build/` directory
- **Portable executable**: `dist/LoL Skin Tracker-v2.0.0-x64.exe` (73MB)

## 🧪 MCP Server Configuration

This project includes an MCP server for automated Playwright testing.

### Available MCP Tools:
- `run_playwright_test` - Execute Playwright tests
- `interact_with_app` - Direct app interaction 
- `launch_app` - Start the Electron app
- `close_app` - Close the app

### To activate MCP tools:
```bash
npm run mcp:start
```

### MCP Server Details:
- **Server Name**: lol-skin-tracker-testing
- **Command**: `node mcp-server.js`
- **Working Directory**: Current project root
- **Port**: stdio (standard input/output)

## 🧪 Testing Commands:
```bash
npm run test:e2e              # Run all Playwright tests
npm run test:e2e:ui           # Run tests with UI
npm run test:e2e:debug        # Debug mode
npm run mcp:test              # Build and start MCP server
```

## 📁 Project Structure:
```
├── src/                      # React source (TypeScript)
│   ├── components/           # React components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API and data services
│   └── shared/              # Types and constants
├── electron/                # Electron main process
│   ├── main.ts              # Main process entry
│   └── dataStore.ts         # Data persistence
├── tests/                   # Playwright E2E tests
│   ├── electron/            # Electron-specific tests
│   └── utils/               # Test utilities and fixtures
├── public/                  # Static assets
├── build/                   # Vite build output
├── dist/                    # Electron-builder output
├── vite.config.ts           # Vite configuration
├── playwright.config.ts     # Playwright configuration
├── mcp-server.js           # MCP server for Claude integration
└── build-portable.ps1      # Reliable build script
```

## 🔧 Tech Stack (Updated):
- **Frontend**: React 18.3, TypeScript 5.7
- **Build Tool**: Vite 6.0 (replaces react-scripts)
- **Desktop**: Electron 32.2
- **Testing**: Playwright 1.54
- **Styling**: Tailwind CSS 3.4
- **Data**: Electron Store 8.2, Axios 1.11

## 🚨 Common Issues & Solutions:

### Node.js PATH Issues:
If you get `'node' is not recognized` errors during npm install:
```bash
# Use this instead of regular npm install:
npm install --ignore-scripts

# Then build manually:
./node_modules/.bin/vite build
```

### Windows Build Issues:
- **Icon errors**: Use 256x256+ icons only
- **Permission errors**: Run PowerShell as Administrator if needed
- **PATH issues**: Use the PowerShell build script

### Electron Store Compatibility:
- **Updated to v8.2.0** (was v10.x) for Node.js compatibility
- Data format remains the same

## 📝 Build Notes for Claude:

When building this project, always:
1. ✅ Use `npm install --ignore-scripts` first
2. ✅ Use direct node_modules paths if npm scripts fail
3. ✅ Update the dev server port (5173, not 3000)
4. ✅ Run `npm run dist:portable` for the final executable

The modernization eliminates the react-scripts bloat and makes builds much more reliable!