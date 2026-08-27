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

// Mount API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'MWC System API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 MWC System Backend API Server running at http://localhost:${PORT}`);
  console.log(`   - Warranty Check API: GET http://localhost:${PORT}/api/warranty/:serialNumber`);
  console.log(`   - Products API:       GET http://localhost:${PORT}/api/products\n`);
});
