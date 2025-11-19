#!/usr/bin/env node

/**
 * Cross-platform development environment setup script
 * Automatically detects OS and runs appropriate setup commands
 */

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

const platform = os.platform();
const isWindows = platform === 'win32';

console.log(`🔧 Setting up development environment for ${platform}...`);

try {
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  console.log(`📋 Node.js version: ${nodeVersion}`);
  
  if (majorVersion < 18) {
    console.error('❌ Node.js 18+ is required. Please upgrade Node.js.');
    process.exit(1);
  }
  
  console.log('✅ Node.js version check passed');

  // Install dependencies (if not already done)
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    throw error;
  }

  // Husky setup (should already be done by prepare script, but ensure it's working)
  console.log('🪝 Setting up Git hooks with Husky...');
  try {
    execSync('npx husky', { stdio: 'inherit' });
    console.log('✅ Husky setup completed');
  } catch (error) {
    console.warn('⚠️  Husky setup had issues, but this might be normal if already configured');
  }

  // Test commitlint
  console.log('🧪 Testing commitlint configuration...');
  try {
    const testCommand = isWindows 
      ? 'echo "feat: EVO-1234 - test commit message" | npx commitlint'
      : 'echo "feat: EVO-1234 - test commit message" | npx commitlint';
    
    execSync(testCommand, { stdio: 'inherit' });
    console.log('✅ Commitlint test passed');
  } catch (error) {
    console.error('❌ Commitlint test failed');
    throw error;
  }

  // Verify Git hooks are active
  console.log('🔍 Verifying Git hooks are active...');
  try {
    const hookPath = path.join('.husky', 'commit-msg');
    const fs = require('fs');
    
    if (fs.existsSync(hookPath)) {
      console.log('✅ Git hooks are properly configured');
    } else {
      console.warn('⚠️  Git hooks may not be properly configured');
    }
  } catch (error) {
    console.warn('⚠️  Could not verify Git hooks configuration');
  }

  console.log('\n🎉 Development environment setup completed successfully!');
  console.log('\n📝 Next steps:');
  console.log('   1. Make a test commit to verify hooks are working');
  console.log('   2. Use format: "feat: JIRA-123 - your commit message"');
  console.log('   3. See DEVELOPMENT.md for more details');

} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Ensure Node.js 18+ is installed');
  console.log('   2. Check your internet connection');
  console.log('   3. Try running: npm install --verbose');
  console.log('   4. See DEVELOPMENT.md for more help');
  process.exit(1);
}
