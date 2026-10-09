const http = require('http');
const https = require('https');

async function testPost(catId) {
  const payload = {
    category_id: catId,
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    serial_no: `TEST-AIO-CAT${catId}-${Date.now().toString().slice(-4)}`,
    warranty_months: 36,
    specs: {
      processor: 'i3 12th gen'
    },
    action: 'DIRECT_SALE',
    to_party_id: 1,
    dispatch_date: '2026-11-06',
    invoice_no: 'INV-TEST-CAT',
    invoice_date: '2026-11-06',
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR'
  };

  const body = JSON.stringify(payload);

  return new Promise((resolve) => {
    const req = https.request('https://invo.co.in/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', e => resolve({ error: e.message }));
    req.write(body);
    req.end();
  });
}

async function run() {
  console.log('Testing live server POST with category_id: 6...');
  const res6 = await testPost(6);
  console.log('Result for catId 6:', JSON.stringify(res6, null, 2));

  console.log('\nTesting live server POST with category_id: 1...');
  const res1 = await testPost(1);
  console.log('Result for catId 1:', JSON.stringify(res1, null, 2));
}

run();
