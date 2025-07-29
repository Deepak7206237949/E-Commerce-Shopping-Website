#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build...\n');

// Check if we're in the right directory
if (!fs.existsSync('client') || !fs.existsSync('server')) {
  console.error('❌ Error: Please run this script from the project root directory');
  process.exit(1);
}

try {
  // Install server dependencies
  console.log('📦 Installing server dependencies...');
  execSync('npm install', { cwd: 'server', stdio: 'inherit' });

  // Install client dependencies
  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: 'client', stdio: 'inherit' });

  // Build React app
  console.log('🏗️  Building React application...');
  execSync('npm run build', { cwd: 'client', stdio: 'inherit' });

  // Check if build was successful
  if (!fs.existsSync('client/build')) {
    throw new Error('React build failed - build directory not found');
  }

  console.log('\n✅ Build completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Set NODE_ENV=production in your server environment');
  console.log('2. Update CORS origins in server/.env for your domain');
  console.log('3. Run: cd server && npm start');
  console.log('\n🌐 Your app will be available at the configured port (default: 5000)');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}
