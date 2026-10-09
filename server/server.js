const express = require('express');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: Enable CORS & JSON Body Parsing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

const path = require('path');
const fs = require('fs');

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'INVO IT API', timestamp: new Date() });
});

// Production: Serve Angular static build if present
const distPath = path.join(__dirname, '../dist/mwc-portal/browser');
const parentPath = path.join(__dirname, '..');
let staticFolder = null;

if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  staticFolder = __dirname;
} else if (fs.existsSync(path.join(distPath, 'index.html'))) {
  staticFolder = distPath;
} else if (fs.existsSync(path.join(parentPath, 'index.html'))) {
  staticFolder = parentPath;
}

if (staticFolder) {
  app.use(express.static(staticFolder));
  // Any route not caught by /api or static files returns Angular's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticFolder, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 INVO IT Backend API & Web Server running at http://localhost:${PORT}`);
  console.log(`   - Frontend Portal:    http://localhost:${PORT}`);
  console.log(`   - Warranty Check API: GET http://localhost:${PORT}/api/warranty/:serialNumber`);
  console.log(`   - Products API:       GET http://localhost:${PORT}/api/products\n`);
});
