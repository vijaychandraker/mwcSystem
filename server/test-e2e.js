const http = require('http');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const reqOptions = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Full-Stack End-to-End Test for "ALL IN ONE PC"...\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, extra = '') {
    total++;
    if (condition) {
      console.log(`✅ TEST ${total} PASSED: ${testName}`);
      passed++;
    } else {
      console.error(`❌ TEST ${total} FAILED: ${testName} - ${extra}`);
    }
  }

  try {
    // Test 1: Frontend Homepage / Routing
    const home = await request('http://localhost:3000/');
    assert(home.status === 200, 'Frontend HTTP 200 on /');

    // Test 2: Categories API
    const catsRes = await request('http://localhost:3000/api/categories');
    assert(catsRes.status === 200, 'Categories API HTTP 200');
    const aioCat = catsRes.data.find(c => c.category_name === 'ALL IN ONE PC');
    assert(!!aioCat && aioCat.category_id === 6, 'Category "ALL IN ONE PC" exists with ID 6', JSON.stringify(aioCat));

    // Test 3: Models API
    const modelsRes = await request('http://localhost:3000/api/models');
    assert(modelsRes.status === 200, 'Models API HTTP 200');
    const aioModels = modelsRes.data.filter(m => m.category_id === 6 || m.category_name === 'ALL IN ONE PC');
    assert(aioModels.length > 0, `Models exist under ALL IN ONE PC (found ${aioModels.length} models)`);

    // Test 4: Warranty Check for Seeded Reference Sheet Serial IN22I35001
    const warrRes = await request('http://localhost:3000/api/warranty/IN22I35001');
    assert(warrRes.status === 200, 'Warranty Check API HTTP 200');
    assert(warrRes.data.found === true, 'Product serial IN22I35001 found in database');
    assert(warrRes.data.category === 'ALL IN ONE PC', `Category matches "ALL IN ONE PC" (actual: ${warrRes.data.category})`);
    assert(warrRes.data.customerName === 'AC TRIBLE DIPARTMENT', `Customer matches "AC TRIBLE DIPARTMENT" (actual: ${warrRes.data.customerName})`);
    assert(warrRes.data.partWarranties && warrRes.data.partWarranties.length === 9, `9 Component Warranties present (count: ${warrRes.data.partWarranties?.length})`);

    // Log the 9 components from reference image
    if (warrRes.data.partWarranties) {
      console.log('\n📦 Verified 9 Component Breakdown for IN22I35001:');
      warrRes.data.partWarranties.forEach((p, idx) => {
        console.log(`   ${idx + 1}. ${p.partName}: SN: ${p.serialNo} | ${p.warrantyMonths} Months | Status: ${p.status}`);
      });
      console.log('');
    }

    // Test 5: Post New ALL IN ONE PC Product via Admin Modal API
    const testSerial = `AIO-TEST-${Date.now().toString().slice(-5)}`;
    const newEntryPayload = {
      category_id: 6,
      model_no: 'IN22-0125DS',
      product_name: 'INVO All In One PC 23.8" FHD i3',
      serial_no: testSerial,
      warranty_months: 36,
      specs: {
        cabinet_sn: 'CX-AIO-999',
        cabinet_warr: 12,
        motherboard_sn: 'H61M-TEST-01',
        motherboard_warr: 36,
        ram_sn: 'RAM-16GB-SN01',
        ram_size: '16 GB',
        ram_warr: 36,
        ssd_sn: 'SSD-512GB-SN01',
        ssd_size: '512 GB',
        ssd_warr: 36,
        processor: 'i3 12th gen',
        processor_sn: 'CPU-I3-12-SN',
        processor_warr: 36,
        monitor_sn: 'MON-24-IPS-SN',
        screen_size: '23.8" FHD IPS',
        monitor_warr: 36,
        mouse_sn: 'MS-5555',
        mouse_warr: 12,
        keyboard_sn: 'KB-8888',
        keyboard_warr: 12,
        graphic_card_sn: 'GPU-ZAK-01',
        graphic_card_warr: 36
      },
      action: 'DIRECT_SALE',
      to_party_id: 1,
      dispatch_date: '2026-11-06',
      invoice_no: 'INV-TEST-0099',
      invoice_date: '2026-11-06',
      customer_name: 'AC TRIBLE DIPARTMENT',
      zila: 'BILASPUR'
    };

    const postRes = await request('http://localhost:3000/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, newEntryPayload);

    assert(postRes.status === 200, 'POST /api/inventory HTTP 200');
    assert(postRes.data && postRes.data.success === true, 'New ALL IN ONE PC unit recorded successfully');

    // Test 6: Verify New Unit in Warranty Checker
    const verifyRes = await request(`http://localhost:3000/api/warranty/${testSerial}`);
    assert(verifyRes.status === 200, 'Lookup of newly registered ALL IN ONE PC HTTP 200');
    assert(verifyRes.data.found === true, `Newly created serial ${testSerial} found`);
    assert(verifyRes.data.category === 'ALL IN ONE PC', 'Newly created category is "ALL IN ONE PC"');
    assert(verifyRes.data.partWarranties && verifyRes.data.partWarranties.length === 9, 'Newly created unit has all 9 part warranties');

    console.log(`\n========================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} / ${total} TESTS PASSED!`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
