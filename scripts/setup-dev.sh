#!/bin/bash

# Development setup script for both Windows (Git Bash) and Unix systems

echo "🚀 Setting up development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Verify Husky setup
if [ -d ".husky" ]; then
    echo "✅ Husky hooks are set up"
else
    echo "⚠️  Husky directory not found, running setup..."
    npx husky install
fi

# Make hooks executable (important for Unix systems)
if [ -f ".husky/commit-msg" ]; then
    chmod +x .husky/commit-msg
    echo "✅ Commit hooks are executable"
fi

# Test commitlint
echo "🧪 Testing commitlint configuration..."
if echo "feat: EVO-1234 - test commit message" | npx commitlint > /dev/null 2>&1; then
    echo "✅ Commitlint is working correctly"
else
    echo "❌ Commitlint test failed"
    exit 1
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📝 Commit message format:"
echo "   <type>: <JIRA-TICKET> - <description>"
echo ""
echo "📖 See docs/development-setup.md for more details"
