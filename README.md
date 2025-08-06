# League Skin Tracker

A Windows desktop application built with Electron, TypeScript, and React to track your League of Legends skin collection by champion.

## Features

### 🏆 Champion Management
- **Dynamic Champion Roster**: Automatically fetches the latest champion list from Riot's Data Dragon API
- **Real-time Updates**: Supports all 170+ champions including the newest additions
- **Automatic Refresh**: Detects new patches and updates champion roster without losing your data

### 📊 Skin Tracking
- **Individual Champion Tracking**: Mark each champion as:
  - ✅ "I own at least one skin"
  - 🎁 "I currently have a skin shard"
- **Quick Toggle Buttons**: Easy one-click status updates for each champion
- **Visual Status Indicators**: Clear visual feedback for owned skins and shards

### 🔧 Bulk Editing
- **Multi-Select Mode**: Select multiple champions for batch operations
- **Bulk Actions**: Apply "Own skin" or "Has shard" to all selected champions at once
- **Select All/Deselect All**: Quick selection controls for faster updates
- **Bulk Clear**: Remove ownership or shard status in bulk

### 🔍 Search & Filter
- **Real-time Search**: Search champions by name
- **Smart Filtering**: 
  - Show all champions
  - Show champions missing skins
  - Show champions with shards but no full skin
- **Live Count**: See how many champions match your current filter

### 💾 Data Management
- **Local SQLite Database**: All data stored locally for privacy
- **Export Functionality**: Export your collection data to JSON
- **Persistent Storage**: Your selections survive app restarts and updates

### 🎮 Additional Features
- **Patch Information**: Automatically detects current League patch version
- **Patch Notes Link**: Direct link to official patch notes
- **Champion Portraits**: Displays champion images from Data Dragon
- **Responsive Design**: Works on different screen sizes
- **Modern UI**: Clean, intuitive interface with smooth animations

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd LeagueSkinTracker
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Creating Executables

The project includes several options for creating executable files:

#### Option 1: Using Build Scripts (Recommended)

**Windows Batch File:**
```bash
build.bat
```

**PowerShell Script:**
```powershell
.\build.ps1
```

Both scripts will:
1. Install dependencies
2. Build the application
3. Let you choose between:
   - Portable executable (single .exe file)
   - Installer (.exe with setup wizard)
   - Both options

#### Option 2: Using npm Scripts Directly

**Portable Executable:**
```bash
npm run dist:portable
```
Creates `LeagueSkinTracker.exe` in the `dist-electron` folder.

**Installer:**
```bash
npm run dist
```
Creates `League Skin Tracker Setup.exe` with installation wizard.

**Development Build:**
```bash
npm run pack
```
Creates an unpacked version for testing.

#### Executable Types

1. **Portable (.exe)**: 
   - Single file that can be run anywhere
   - No installation required
   - Perfect for USB drives or sharing
   - File: `LeagueSkinTracker.exe`

2. **Installer (.exe)**:
   - Professional setup wizard
   - Creates Start Menu shortcuts
   - Creates Desktop shortcut
   - Allows custom installation directory
   - File: `League Skin Tracker Setup.exe`

#### Build Output

All executables are created in the `dist-electron` folder:
```
dist-electron/
├── LeagueSkinTracker.exe          # Portable version
├── League Skin Tracker Setup.exe  # Installer version
└── win-unpacked/                 # Unpacked files (for development)
```

## Project Structure

```
LeagueSkinTracker/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Main application entry
│   │   ├── preload.ts       # Preload script for IPC
│   │   ├── database.ts      # SQLite database manager
│   │   └── services/        # Business logic services
│   │       └── championService.ts
│   └── renderer/            # React renderer process
│       ├── index.tsx        # React entry point
│       ├── App.tsx          # Main React component
│       ├── styles.css       # Global styles
│       └── components/      # React components
│           ├── Header.tsx
│           ├── FilterPanel.tsx
│           ├── BulkEditPanel.tsx
│           ├── ChampionList.tsx
│           └── ChampionCard.tsx
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript config (renderer)
├── tsconfig.main.json      # TypeScript config (main)
├── webpack.config.js       # Webpack bundling config
└── README.md              # This file
```

## API Integration

The application integrates with Riot Games' Data Dragon API:

- **Versions Endpoint**: `https://ddragon.leagueoflegends.com/api/versions.json`
- **Champions Endpoint**: `https://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json`
- **Champion Images**: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion}.png`

## Data Storage

- **Database**: SQLite database stored in `%APPDATA%/LeagueSkinTracker/champions.db`
- **Schema**: 
  - `champions` table: Champion data and user selections
  - `patch_info` table: Current patch information

## Build Configuration

The application is configured for single-file distribution:

- **Electron Builder**: Configured for portable Windows executable
- **Dependencies**: All bundled into the final executable
- **No Runtime Required**: Users don't need Node.js or Python installed

## Development Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run dist`: Create installer
- `npm run dist:portable`: Create single portable executable

## Keyboard Shortcuts

- **Ctrl+F**: Focus search box
- **Ctrl+B**: Toggle bulk edit mode
- **Ctrl+R**: Refresh champions from API
- **Ctrl+E**: Export data

## Troubleshooting

### Common Issues

1. **Champions not loading**: Check internet connection and Data Dragon API status
2. **Build fails**: Ensure Node.js 18+ is installed
3. **Executable not working**: Check Windows Defender or antivirus settings

### Data Recovery

Your champion data is stored in:
```
%APPDATA%/LeagueSkinTracker/champions.db
```

You can backup this file to preserve your skin collection data.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- Riot Games for the Data Dragon API
- Electron team for the desktop framework
- React team for the UI library 