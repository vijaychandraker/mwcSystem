const https = require('https');

const AIO_EXCEL_DATA = [
  {
    serial_no: 'IN22I35001',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012501',
    specs: {
      cabinet_sn: 'CX90917212',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4874',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050043',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301300',
      processor_warr: 36,
      monitor_sn: '9I0072508000BC',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500001',
      mouse_warr: 12,
      keyboard_sn: '250001',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW01704',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35002',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012502',
    specs: {
      cabinet_sn: 'CX90918108',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4894',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050028',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301274',
      processor_warr: 36,
      monitor_sn: '9I00725100014A',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500002',
      mouse_warr: 12,
      keyboard_sn: '250002',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW01705',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35003',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012503',
    specs: {
      cabinet_sn: 'CX90918213',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4918',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050009',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301271',
      processor_warr: 36,
      monitor_sn: '9I007251000143',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500003',
      mouse_warr: 12,
      keyboard_sn: '250003',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW01707',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35004',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012504',
    specs: {
      cabinet_sn: 'CX90917187',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4728',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050022',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301268',
      processor_warr: 36,
      monitor_sn: '9I00725100014F',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500004',
      mouse_warr: 12,
      keyboard_sn: '250004',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02152',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35005',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012505',
    specs: {
      cabinet_sn: 'CX90950329',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4830',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050047',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF301200',
      processor_warr: 36,
      monitor_sn: '9I00725100014D',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500005',
      mouse_warr: 12,
      keyboard_sn: '250005',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02149',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35006',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012506',
    specs: {
      cabinet_sn: 'CX90949982',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4948',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050053',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF300015',
      processor_warr: 36,
      monitor_sn: '9I007251000121',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500006',
      mouse_warr: 12,
      keyboard_sn: '250006',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02150',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35007',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012507',
    specs: {
      cabinet_sn: 'CX90950341',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4953',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050027',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692PF306980',
      processor_warr: 36,
      monitor_sn: '9I00725100013E',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500007',
      mouse_warr: 12,
      keyboard_sn: '250007',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02153',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35008',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012508',
    specs: {
      cabinet_sn: 'CX90949991',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4903',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050056',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6692DG603198',
      processor_warr: 36,
      monitor_sn: '9I00725100013F',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500008',
      mouse_warr: 12,
      keyboard_sn: '250008',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02143',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35009',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012509',
    specs: {
      cabinet_sn: 'CX90949987',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4926',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050010',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6EG547805450',
      processor_warr: 36,
      monitor_sn: '9I007251000138',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500009',
      mouse_warr: 12,
      keyboard_sn: '250009',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02142',
      graphic_card_warr: 36
    }
  },
  {
    serial_no: 'IN22I35010',
    model_no: 'IN22-0125DS',
    product_name: 'INVO All In One PC 23.8" FHD i3',
    warranty_months: 36,
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR',
    invoice_date: '2026-11-06',
    invoice_no: 'INV-CG-012510',
    specs: {
      cabinet_sn: 'CX90949967',
      cabinet_warr: 12,
      motherboard_sn: 'H61M1112C09S4947',
      motherboard_warr: 36,
      ram_sn: '1.2E+07',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '12050042',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: 'U6EG547805982',
      processor_warr: 36,
      monitor_sn: '9I007251000133',
      screen_size: '23.8" FHD IPS',
      monitor_warr: 36,
      mouse_sn: '500010',
      mouse_warr: 12,
      keyboard_sn: '250010',
      keyboard_warr: 12,
      graphic_card_sn: 'ZAK11PW02157',
      graphic_card_warr: 36
    }
  }
];

function postUnit(item) {
  return new Promise((resolve) => {
    const payload = {
      category_id: 6,
      model_no: item.model_no,
      product_name: item.product_name,
      serial_no: item.serial_no,
      warranty_months: item.warranty_months,
      specs: item.specs,
      action: 'DIRECT_SALE',
      to_party_id: 1,
      dispatch_date: item.invoice_date,
      invoice_no: item.invoice_no,
      invoice_date: item.invoice_date,
      customer_name: item.customer_name,
      zila: item.zila
    };

    const body = JSON.stringify(payload);

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
          resolve({ serial: item.serial_no, status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ serial: item.serial_no, status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', err => resolve({ serial: item.serial_no, error: err.message }));
    req.write(body);
    req.end();
  });
}

async function uploadAll() {
  console.log(`🚀 Starting live sync of ${AIO_EXCEL_DATA.length} ALL IN ONE PC units to https://invo.co.in...\n`);

  for (let i = 0; i < AIO_EXCEL_DATA.length; i++) {
    const item = AIO_EXCEL_DATA[i];
    const res = await postUnit(item);
    if (res.body && res.body.success) {
      console.log(`✅ [${i + 1}/${AIO_EXCEL_DATA.length}] ${item.serial_no}: Synced! Unit ID: ${res.body.data?.unit_id}`);
    } else {
      console.log(`ℹ️ [${i + 1}/${AIO_EXCEL_DATA.length}] ${item.serial_no}: ${res.body?.message || res.status || res.error}`);
    }
  }

  console.log('\n--- VERIFYING LIVE WARRANTY LOOKUP FOR FIRST UNIT (IN22I35001) ---');
  https.get('https://invo.co.in/api/warranty/IN22I35001', res => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log('Live Lookup Status:', res.statusCode);
        console.log('Product:', json.productName);
        console.log('Customer:', json.customerName);
        console.log('Category:', json.category);
        console.log('Invoice:', json.invoiceNo, 'Date:', json.invoiceDate);
        console.log('Parts count:', json.partWarranties?.length);
      } catch (e) {
        console.log('Raw response:', data.substring(0, 300));
      }
    });
  });
}

uploadAll();
