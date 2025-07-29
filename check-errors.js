#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for common errors and issues...\n');

const errors = [];
const warnings = [];

// Check if required directories exist
const requiredDirs = ['client', 'server', 'client/src', 'server/controllers'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    errors.push(`Missing required directory: ${dir}`);
  }
});

// Check if required files exist
const requiredFiles = [
  'client/package.json',
  'client/src/App.js',
  'client/src/index.js',
  'server/package.json',
  'server/server.js',
  'server/.env'
];

requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    errors.push(`Missing required file: ${file}`);
  }
});

// Check package.json files for required dependencies
try {
  const clientPkg = JSON.parse(fs.readFileSync('client/package.json', 'utf8'));
  const serverPkg = JSON.parse(fs.readFileSync('server/package.json', 'utf8'));

  // Check client dependencies
  const requiredClientDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
  requiredClientDeps.forEach(dep => {
    if (!clientPkg.dependencies[dep]) {
      errors.push(`Missing client dependency: ${dep}`);
    }
  });

  // Check server dependencies
  const requiredServerDeps = ['express', 'cors', 'dotenv', 'bcrypt', 'jsonwebtoken'];
  requiredServerDeps.forEach(dep => {
    if (!serverPkg.dependencies[dep]) {
      errors.push(`Missing server dependency: ${dep}`);
    }
  });

  // Check for react-scripts
  if (!clientPkg.dependencies['react-scripts'] && !clientPkg.devDependencies['react-scripts']) {
    errors.push('Missing react-scripts in client dependencies');
  }

} catch (error) {
  errors.push(`Error reading package.json files: ${error.message}`);
}

// Check .env file
try {
  const envContent = fs.readFileSync('server/.env', 'utf8');
  if (!envContent.includes('JWT_SECRET')) {
    errors.push('Missing JWT_SECRET in server/.env');
  }
  if (envContent.includes('your_jwt_secret_key_12345_secure')) {
    warnings.push('Using default JWT_SECRET - change this for production!');
  }
} catch (error) {
  errors.push(`Error reading .env file: ${error.message}`);
}

// Check for common file issues
const checkFileContent = (filePath, checks) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    checks.forEach(check => {
      if (check.type === 'contains' && !content.includes(check.text)) {
        errors.push(`${filePath}: Missing ${check.description}`);
      }
      if (check.type === 'not_contains' && content.includes(check.text)) {
        warnings.push(`${filePath}: ${check.description}`);
      }
    });
  } catch (error) {
    errors.push(`Error reading ${filePath}: ${error.message}`);
  }
};

// Check key files
if (fs.existsSync('client/src/App.js')) {
  checkFileContent('client/src/App.js', [
    { type: 'contains', text: 'BrowserRouter', description: 'React Router setup' },
    { type: 'contains', text: 'AuthProvider', description: 'Auth context provider' }
  ]);
}

if (fs.existsSync('server/server.js')) {
  checkFileContent('server/server.js', [
    { type: 'contains', text: 'express', description: 'Express framework' },
    { type: 'contains', text: 'cors', description: 'CORS middleware' },
    { type: 'contains', text: 'app.listen', description: 'Server listening setup' }
  ]);
}

// Check for build directory in production
if (process.env.NODE_ENV === 'production' && !fs.existsSync('client/build')) {
  errors.push('Production build not found. Run "npm run build" in client directory.');
}

// Report results
console.log('📊 Error Check Results:\n');

if (errors.length === 0) {
  console.log('✅ No critical errors found!');
} else {
  console.log('❌ Critical Errors Found:');
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
}

console.log('\n📋 Recommendations:');
console.log('1. Run "npm install" in both client and server directories');
console.log('2. Update JWT_SECRET in server/.env for production');
console.log('3. Update CORS origins in server/server.js for your domain');
console.log('4. Test the application locally before deploying');
console.log('5. Run "node build.js" to create production build');

if (errors.length > 0) {
  console.log('\n❌ Please fix the errors above before deploying to production.');
  process.exit(1);
} else {
  console.log('\n✅ Application appears ready for deployment!');
  process.exit(0);
}
