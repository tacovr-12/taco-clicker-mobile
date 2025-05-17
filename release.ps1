# Release script for mobile version
Write-Host "📱 Preparing mobile release..."

# Copy sensitive files from secure location (you'll need to specify this)
$secureFilesPath = "../taco-backup"  # Change this to your secure files location
Write-Host "📁 Copying game files from secure location..."

Copy-Item "$secureFilesPath/game.js" .
Copy-Item "$secureFilesPath/leaderboard.js" .
Copy-Item "$secureFilesPath/firebase-config.js" .
Copy-Item "$secureFilesPath/styles.css" .
Copy-Item "$secureFilesPath/sw.js" .
Copy-Item "$secureFilesPath/install.js" .
Copy-Item "$secureFilesPath/index.html" .

# Install dependencies
Write-Host "📦 Installing dependencies..."
npm install

# Deploy to GitHub Pages
Write-Host "🚀 Deploying to GitHub Pages..."
npm run deploy

# Clean up sensitive files
Write-Host "🧹 Cleaning up sensitive files..."
Remove-Item game.js
Remove-Item leaderboard.js
Remove-Item firebase-config.js
Remove-Item styles.css
Remove-Item sw.js
Remove-Item install.js
Remove-Item index.html

Write-Host "✅ Mobile release completed!" 