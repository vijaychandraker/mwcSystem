const https = require('https');
const http = require('http');

function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, headers: res.headers, bodySnippet: data.substring(0, 200) });
      });
    });
    req.on('error', (e) => resolve({ url, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, error: 'Timeout' }); });
  });
}

async function run() {
  console.log('Testing live HTTP endpoints...');
  const results = await Promise.all([
    testUrl('http://invo.co.in/api/categories'),
    testUrl('https://invo.co.in/api/categories'),
    testUrl('http://invo.co.in/admin'),
    testUrl('https://invo.co.in/admin')
  ]);
  console.log(JSON.stringify(results, null, 2));
}

run();
