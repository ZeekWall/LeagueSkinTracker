# LoL Skin Tracker v2.0 - MCP Testing Configuration

## MCP Server Configuration

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

## Testing Commands:
- `npm run test:e2e` - Run all Playwright tests
- `npm run test:e2e:ui` - Run tests with UI
- `npm run test:e2e:debug` - Debug mode
- `npm run mcp:test` - Build and start MCP server

## Project Structure:
- `/tests/electron/` - Electron-specific tests
- `/tests/utils/` - Test utilities and fixtures
- `playwright.config.ts` - Playwright configuration
- `mcp-server.js` - MCP server for Claude integration