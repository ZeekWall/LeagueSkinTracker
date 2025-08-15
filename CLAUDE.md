# LoL Skin Tracker v2.0 - Web Application

## 🌐 Modern Web Application (Updated August 2024)

This project has been **converted from Electron to a pure web application**:

### Key Changes:
- ✅ **Removed all Electron dependencies** (electron, electron-builder, etc.)
- ✅ **Pure React 18 + Vite 6** web application
- ✅ **Google Analytics 4** integration for user tracking
- ✅ **Vercel-ready deployment** configuration
- ✅ **localStorage-based data persistence** (no desktop storage needed)
- ✅ **Modern build system** optimized for web deployment

## 🛠️ Build Commands

### Development:
```bash
# Install dependencies
npm install

# Start development server (localhost:5173)
npm run dev

# Preview production build
npm run preview
```

### Production Build:
```bash
# Build for deployment
npm run build

# Deploy to Vercel (after connecting repository)
npm run deploy
```

### Output:
- **Web build**: `build/` directory
- **Ready for**: Vercel, Netlify, GitHub Pages, or any static hosting

## 🌐 Deployment

### Vercel Deployment:
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Vite configuration
3. Build command: `npm run build`
4. Output directory: `build`
5. Framework preset: Vite

### Manual Deployment:
```bash
npm run build
# Upload contents of build/ directory to your web server
```

## 📊 Analytics

### Google Analytics 4 Integration:
- **Tracking ID**: G-N22E7N1BGL
- **Events tracked**:
  - Skin toggles (champion name, new state)
  - Shard toggles (champion name, new state)
  - Search usage (search terms)
  - Filter changes (filter type)
  - Champion data updates
  - Collection milestones (10%, 25%, 50%, 75%, 90%, 95%, 100%)
  - App initialization stats

## 📁 Project Structure:
```
├── src/                      # React source (TypeScript)
│   ├── components/           # React components
│   ├── hooks/               # Custom hooks
│   ├── services/            # API, data, and analytics services
│   └── shared/              # Types and constants
├── public/                  # Static assets
├── build/                   # Vite build output
├── vite.config.ts           # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Web-only dependencies
```

## 🔧 Tech Stack:
- **Frontend**: React 18.3, TypeScript 5.7
- **Build Tool**: Vite 6.0
- **Styling**: Tailwind CSS 3.4
- **Data Storage**: Browser localStorage
- **API**: League of Legends DataDragon (public CDN)
- **Analytics**: Google Analytics 4
- **Deployment**: Vercel/Netlify/Static hosting

## 🚨 Common Issues & Solutions:

### Build Issues:
```bash
# If build fails, try cleaning first:
rm -rf build node_modules
npm install
npm run build
```

### Development Server:
- **Port**: 5173 (Vite default)
- **Host**: Accessible on network with `npm run dev`
- **Hot reload**: Automatic with Vite

### Analytics Testing:
- Visit Google Analytics → Reports → Realtime
- Interact with the app (toggle skins, search, filter)
- Events appear within 1-2 minutes

## 📝 Build Notes for Claude:

When working with this project:
1. ✅ Use `npm install` (no more --ignore-scripts needed)
2. ✅ Use `npm run dev` for development
3. ✅ Use `npm run build` for production builds
4. ✅ All data persists in browser localStorage
5. ✅ No desktop-specific code remains

The web conversion eliminates Electron complexity while maintaining all functionality!

## 🔄 Migration Notes:

**What was removed:**
- Electron main process
- Desktop window management
- File system dependencies
- Playwright E2E tests
- MCP server integration

**What was preserved:**
- All React components and UI
- Champion data fetching from DataDragon API
- User collection persistence (localStorage)
- Search and filter functionality
- Progress tracking and statistics

**What was added:**
- Google Analytics 4 tracking
- Vercel deployment configuration
- Web-optimized Vite build
- Modern chunk splitting for performance