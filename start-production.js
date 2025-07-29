#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting production server...\n');

// Check if build exists
if (!fs.existsSync('client/build')) {
  console.error('❌ Error: React build not found. Please run the build script first:');
  console.error('   node build.js');
  process.exit(1);
}

// Set production environment
process.env.NODE_ENV = 'production';

// Start the server
const server = spawn('node', ['server.js'], {
  cwd: 'server',
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n🛑 Server stopped with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
});
