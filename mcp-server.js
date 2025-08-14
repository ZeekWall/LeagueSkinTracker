#!/usr/bin/env node

/**
 * MCP Server for LoL Skin Tracker Playwright Testing
 * Allows Claude to directly control and interact with the app through Playwright
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { spawn } = require('child_process');
const path = require('path');

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'lol-skin-tracker-testing',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'run_playwright_test',
            description: 'Run Playwright tests for the LoL Skin Tracker app',
            inputSchema: {
              type: 'object',
              properties: {
                testFile: {
                  type: 'string',
                  description: 'Specific test file to run (optional)',
                },
                testName: {
                  type: 'string',
                  description: 'Specific test name to run (optional)',
                },
                debug: {
                  type: 'boolean',
                  description: 'Run in debug mode',
                  default: false,
                },
                headless: {
                  type: 'boolean',
                  description: 'Run in headless mode',
                  default: true,
                },
              },
            },
          },
          {
            name: 'interact_with_app',
            description: 'Directly interact with the running Electron app',
            inputSchema: {
              type: 'object',
              properties: {
                action: {
                  type: 'string',
                  enum: ['click', 'type', 'screenshot', 'get_text', 'wait_for_element'],
                  description: 'Action to perform',
                },
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
                text: {
                  type: 'string',
                  description: 'Text to type (for type action)',
                },
                timeout: {
                  type: 'number',
                  description: 'Timeout in milliseconds',
                  default: 10000,
                },
              },
              required: ['action'],
            },
          },
          {
            name: 'launch_app',
            description: 'Launch the LoL Skin Tracker Electron app',
            inputSchema: {
              type: 'object',
              properties: {
                debug: {
                  type: 'boolean',
                  description: 'Launch with dev tools open',
                  default: false,
                },
              },
            },
          },
          {
            name: 'close_app',
            description: 'Close the running Electron app',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'run_playwright_test':
            return await this.runPlaywrightTest(args);
          case 'interact_with_app':
            return await this.interactWithApp(args);
          case 'launch_app':
            return await this.launchApp(args);
          case 'close_app':
            return await this.closeApp(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async runPlaywrightTest(args) {
    return new Promise((resolve, reject) => {
      const { testFile, testName, debug = false, headless = true } = args;
      
      let command = ['npx', 'playwright', 'test'];
      
      if (testFile) {
        command.push(testFile);
      }
      
      if (testName) {
        command.push('--grep', testName);
      }
      
      if (debug) {
        command.push('--debug');
      }
      
      if (!headless) {
        command.push('--headed');
      }

      // Add JSON reporter for structured output
      command.push('--reporter=json');

      const process = spawn(command[0], command.slice(1), {
        cwd: path.join(__dirname),
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        resolve({
          content: [
            {
              type: 'text',
              text: `Test execution completed with exit code: ${code}\n\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
            },
          ],
        });
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to run tests: ${error.message}`));
      });
    });
  }

  async interactWithApp(args) {
    // This would require a persistent Playwright connection
    // For now, return a placeholder
    return {
      content: [
        {
          type: 'text',
          text: `Interactive app control not yet implemented. Args: ${JSON.stringify(args)}`,
        },
      ],
    };
  }

  async launchApp(args) {
    return {
      content: [
        {
          type: 'text',
          text: `App launch functionality not yet implemented. Args: ${JSON.stringify(args)}`,
        },
      ],
    };
  }

  async closeApp(args) {
    return {
      content: [
        {
          type: 'text',
          text: 'App close functionality not yet implemented.',
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('LoL Skin Tracker MCP Server running on stdio');
  }
}

// Start the server
if (require.main === module) {
  const server = new PlaywrightMCPServer();
  server.run().catch(console.error);
}

module.exports = PlaywrightMCPServer;