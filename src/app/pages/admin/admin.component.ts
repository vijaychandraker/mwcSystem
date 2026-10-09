import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export interface Party {
  party_id: number;
  party_type: 'OEM' | 'DISTRIBUTOR';
  party_name: string;
  gst_no?: string;
  contact_person?: string;
  mobile?: string;
  email?: string;
  password?: string;
  address?: string;
  district?: string;
  state?: string;
  pincode?: string;
  status: number;
}

export interface AdminSubUser {
  user_id: number;
  username: string;
  display_name: string;
  email?: string;
  mobile?: string;
  password?: string;
  role: string;
  status: number;
  created_at?: string;
}

export interface Customer {
  customer_id: number;
  customer_name: string;
  department?: string;
  contact_person?: string;
  mobile?: string;
  email?: string;
  address?: string;
  district?: string;
  state?: string;
  pincode?: string;
  status: number;
}

export interface Category {
  category_id: number;
  category_name: string;
}

export interface ProductModel {
  model_id: number;
  category_id: number;
  category_name?: string;
  brand: string;
  model_no: string;
  product_name: string;
  warranty_month: number;
  status: number;
}

export interface StockTransfer {
  transfer_id: number;
  transfer_no: string;
  from_party_id?: number;
  from_party_name?: string;
  to_party_id?: number;
  to_party_name?: string;
  model_id?: number;
  product_name?: string;
  model_no?: string;
  serial_no: string;
  dispatch_date: string;
  sale_valid_till: string;
  stock_status: 'IN_STOCK' | 'SOLD' | 'EXPIRED' | 'EXTENDED';
  remarks?: string;
}

export interface ExtensionRequest {
  request_id: number;
  transfer_id: number;
  serial_no: string;
  product_name: string;
  party_name: string;
  request_date: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  extend_days?: number;
  new_valid_till?: string;
}

export interface Invoice {
  invoice_id: number;
  invoice_no: string;
  seller_party_name: string;
  customer_name: string;
  zila?: string;
  sale_type: 'DIRECT' | 'DISTRIBUTOR';
  invoice_date: string;
  total_qty: number;
  serial_no?: string;
  product_name?: string;
  customer_id?: number;
  seller_party_id?: number;
}

export interface InventoryUnit {
  unit_id: number;
  category_id: number;
  category_name: string;
  model_no: string;
  product_name: string;
  serial_no: string;
  warranty_months: number;
  specs: any;
  status: 'IN_STOCK' | 'SOLD' | 'AVAILABLE';
  assigned_party_id?: number;
  assigned_party_name?: string;
  dispatch_date?: string;
  sale_info?: {
    invoice_no: string;
    invoice_date: string;
    customer_name: string;
    zila: string;
    seller_party_id: number;
    seller_party_name: string;
    sale_type: 'DIRECT' | 'DISTRIBUTOR';
    warranty_start: string;
    warranty_end: string;
  } | null;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  Math = Math;

  ngOnInit(): void {
    this.fetchDataFromApi();
  }

  showLogoutConfirmModal = false;

  promptLogout() {
    this.showLogoutConfirmModal = true;
  }

  confirmLogout() {
    this.showLogoutConfirmModal = false;
    this.authService.logout();
  }

  cancelLogout() {
    this.showLogoutConfirmModal = false;
  }

  logout() {
    this.promptLogout();
  }

  activeTab: 'overview' | 'inventory' | 'parties' | 'models' | 'transfers' | 'extensions' | 'invoices' | 'customers' | 'users' = 'overview';
  isSidebarOpen = false;

  toggleSidebar(open?: boolean) {
    this.isSidebarOpen = typeof open === 'boolean' ? open : !this.isSidebarOpen;
  }

  selectTab(tab: 'overview' | 'inventory' | 'parties' | 'models' | 'transfers' | 'extensions' | 'invoices' | 'customers' | 'users') {
    this.activeTab = tab;
    this.isSidebarOpen = false;
  }

  get currentTabTitle(): string {
    switch (this.activeTab) {
      case 'overview': return 'Executive Overview';
      case 'inventory': return 'Serials & Warranties Registry';
      case 'parties': return 'Parties & Authorized Dealers';
      case 'models': return 'Product Models & Catalog';
      case 'invoices': return 'Sales & Dispatches (Tax Invoices)';
      case 'customers': return 'End Users & Government Clients';
      case 'users': return 'Sub-Users & Logins Management';
      default: return 'Admin Console';
    }
  }

  searchQuery = '';
  inventoryFilter: 'ALL' | 'IN_STOCK' | 'SOLD' = 'ALL';
  inventoryCategoryFilter: number | 'ALL' = 'ALL';

  // Sub-Users & Logins State (Only SUB_USER and DISTRIBUTOR roles, unique UserID & Email)
  subUsers: AdminSubUser[] = [];
  showSubUserModal = false;
  editingSubUser: AdminSubUser | null = null;
  subUserForm = { username: '', display_name: '', email: '', mobile: '', password: '', role: 'SUB_USER' };
  subUserSuccessMessage = '';
  subUserErrorMessage = '';

  // Distributor Login Credentials Modal
  showDistCredModal = false;
  selectedDistForCreds: Party | null = null;
  distCredForm = { mobile: '', email: '', password: '', status: 1 };
  distCredSuccessMessage = '';
  distCredErrorMessage = '';

  // Modals
  showPartyModal = false;
  showModelModal = false;
  showTransferModal = false;
  showCustomerModal = false;
  showInvoiceModal = false;
  showProductEntryModal = false;
  showOemSaleModal = false;
  selectedUnitForOemSale: any = null;
  isOemUnitAlreadySold = false;
  oemSaleFormData = {
    invoice_no: '',
    invoice_date: new Date().toISOString().substring(0, 10),
    customer_name: '',
    zila: 'BILASPUR'
  };
  oemSaleErrorMessage = '';
  oemSaleSuccessMessage = '';
  isSubmittingOemSale = false;
  selectedInvoiceForPrint: any = null;
  entrySuccessMessage = '';
  entryErrorMessage = '';

  // Master Lists - Populated with defaults and synced with MariaDB
  categories: Category[] = [
    { category_id: 1, category_name: 'Computer' },
    { category_id: 6, category_name: 'ALL IN ONE PC' },
    { category_id: 2, category_name: 'Monitor' },
    { category_id: 3, category_name: 'TV' },
    { category_id: 4, category_name: 'Interactive Panel' },
    { category_id: 5, category_name: 'LED Bulb' }
  ];
  parties: Party[] = [
    { party_id: 1, party_type: 'OEM', party_name: 'INVO IT Industries Pvt. Ltd.', gst_no: '07AAAAA0000A1Z5', contact_person: 'Rajesh Gupta', mobile: '9876543210', email: 'info@invoit.in', status: 1 },
    { party_id: 2, party_type: 'DISTRIBUTOR', party_name: 'In-vo it industry pvt. Ltd.', gst_no: '22AABCI1234F1Z8', contact_person: 'Sandeep Tiwari', mobile: '9827112233', email: 'sales@invoit-cg.com', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 },
    { party_id: 3, party_type: 'DISTRIBUTOR', party_name: 'R. P. ENTERPRISES', gst_no: '22RPENT5678G1Z1', contact_person: 'Ramesh Patel', mobile: '9425234567', email: 'rpenterprises@gmail.com', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 },
    { party_id: 4, party_type: 'DISTRIBUTOR', party_name: 'M. R. ENTERPRISES', gst_no: '22MRENT9012H1Z3', contact_person: 'Manish Rawat', mobile: '9826198765', email: 'mrenterprises.bsp@gmail.com', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 },
    { party_id: 5, party_type: 'DISTRIBUTOR', party_name: 'Gunjan Industry', gst_no: '22GUNJN3456J1Z5', contact_person: 'Gunjan Sharma', mobile: '9752109876', email: 'gunjan.industry@outlook.com', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 },
    { party_id: 6, party_type: 'DISTRIBUTOR', party_name: 'star enterprises', gst_no: '22STARE7890K1Z7', contact_person: 'Sunil Agrawal', mobile: '9981234567', email: 'starenterprises.bsp@gmail.com', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 }
  ];
  customers: Customer[] = [
    { customer_id: 1, customer_name: 'C TRIBLE DIPARTMEN', department: 'Tribal Welfare Department', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 },
    { customer_id: 2, customer_name: 'AC TRIBLE DIPARTMENT', department: 'Assistant Commissioner Tribal Dept', district: 'BILASPUR', state: 'Chhattisgarh', status: 1 }
  ];
  models: ProductModel[] = [
    { model_id: 1, category_id: 1, category_name: 'Computer', brand: 'INVO', model_no: 'IN22-0125DS', product_name: 'INVO Entry Level Desktop i3 12th Gen', warranty_month: 36, status: 1 },
    { model_id: 2, category_id: 6, category_name: 'ALL IN ONE PC', brand: 'INVO', model_no: 'INVO-AIO24', product_name: 'INVO All In One Computer 23.8" FHD', warranty_month: 36, status: 1 },
    { model_id: 3, category_id: 2, category_name: 'Monitor', brand: 'INVO', model_no: 'INM-21IPS', product_name: 'INVO IPS 21" Borderless Monitor', warranty_month: 36, status: 1 },
    { model_id: 4, category_id: 3, category_name: 'TV', brand: 'INVO', model_no: 'INV-32LED', product_name: 'INVO 32" HD Ready Smart LED TV', warranty_month: 24, status: 1 },
    { model_id: 5, category_id: 4, category_name: 'Interactive Panel', brand: 'INVO', model_no: 'INIP-75IFP', product_name: 'INVO 75" 4K UHD Interactive Flat Panel', warranty_month: 36, status: 1 },
    { model_id: 6, category_id: 5, category_name: 'LED Bulb', brand: 'INVO', model_no: 'INB09WW', product_name: 'INVO 60W Heavy Duty LED Bulb', warranty_month: 12, status: 1 },
    { model_id: 7, category_id: 6, category_name: 'ALL IN ONE PC', brand: 'INVO', model_no: 'IN22-0125DS', product_name: 'INVO All In One PC 23.8" FHD i3', warranty_month: 36, status: 1 }
  ];

  transfers: StockTransfer[] = [];
  extensions: ExtensionRequest[] = [];
  invoices: Invoice[] = [
    { invoice_id: 1, invoice_no: 'INV-CG-012501', invoice_date: '2026-11-06', customer_id: 1, customer_name: 'C TRIBLE DIPARTMEN', seller_party_id: 2, seller_party_name: 'In-vo it industry pvt. Ltd.', sale_type: 'DISTRIBUTOR', total_qty: 1, serial_no: 'IN22135001' }
  ];
  inventory: InventoryUnit[] = [
    // ALL IN ONE PC (From Reference Image: Sold to AC TRIBLE DIPARTMENT)
    { unit_id: 11, category_id: 6, category_name: 'ALL IN ONE PC', model_no: 'IN22-0125DS', product_name: 'INVO All In One PC 23.8" FHD i3', serial_no: 'IN22I35001', warranty_months: 36, specs: { cabinet_sn: 'CX90917212', cabinet_warr: 12, motherboard_sn: 'H61M1112C09S4874', motherboard_warr: 36, ram_sn: '1.2E+07', ram_size: '16 GB', ram_warr: 36, ssd_sn: '12050043', ssd_size: '512 GB', ssd_warr: 36, processor: 'i3 12th gen', processor_sn: 'U6692PF301300', processor_warr: 36, monitor_sn: '9I0072508000BC', screen_size: '23.8" FHD IPS', monitor_warr: 36, mouse_sn: '500001', mouse_warr: 12, keyboard_sn: '250001', keyboard_warr: 12, graphic_card_sn: 'ZAK11PW01704', graphic_card_warr: 36 }, status: 'SOLD', assigned_party_id: 2, assigned_party_name: 'In-vo it industry pvt. Ltd.', dispatch_date: '2026-10-01', sale_info: { invoice_no: 'INV-CG-012501', invoice_date: '2026-11-06', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', seller_party_id: 2, seller_party_name: 'In-vo it industry pvt. Ltd.', sale_type: 'DISTRIBUTOR', warranty_start: '2026-11-06', warranty_end: '2029-11-06' } },
    { unit_id: 12, category_id: 6, category_name: 'ALL IN ONE PC', model_no: 'IN22-0125DS', product_name: 'INVO All In One PC 23.8" FHD i3', serial_no: 'IN22I35002', warranty_months: 36, specs: { cabinet_sn: 'CX90918108', cabinet_warr: 12, motherboard_sn: 'H61M1112C09S4894', motherboard_warr: 36, ram_sn: '1.2E+07', ram_size: '16 GB', ram_warr: 36, ssd_sn: '12050028', ssd_size: '512 GB', ssd_warr: 36, processor: 'i3 12th gen', processor_sn: 'U6692PF301274', processor_warr: 36, monitor_sn: '9I00725100014A', screen_size: '23.8" FHD IPS', monitor_warr: 36, mouse_sn: '500002', mouse_warr: 12, keyboard_sn: '250002', keyboard_warr: 12, graphic_card_sn: 'ZAK11PW01705', graphic_card_warr: 36 }, status: 'IN_STOCK', assigned_party_id: 2, assigned_party_name: 'In-vo it industry pvt. Ltd.', dispatch_date: '2026-10-01', sale_info: null },
    { unit_id: 1, category_id: 1, category_name: 'Computer', model_no: 'IN22-0125DS', product_name: 'INVO Entry Level Desktop i3 12th Gen', serial_no: 'IN22135001', warranty_months: 36, specs: { cabinet_sn: 'CX90917212', motherboard_sn: 'H61M1112C09S4874', ram_sn: '12050063', ram_size: '16 GB', ssd_sn: '12050043', ssd_size: '512 GB', processor: 'i3 12th gen', processor_sn: 'U6692PF301300' }, status: 'SOLD', assigned_party_id: 2, assigned_party_name: 'In-vo it industry pvt. Ltd.', dispatch_date: '2026-10-01', sale_info: { invoice_no: 'INV-CG-012501', invoice_date: '2026-11-06', customer_name: 'C TRIBLE DIPARTMEN', zila: 'BILASPUR', seller_party_id: 2, seller_party_name: 'In-vo it industry pvt. Ltd.', sale_type: 'DISTRIBUTOR', warranty_start: '2026-11-06', warranty_end: '2029-11-06' } },
    { unit_id: 2, category_id: 1, category_name: 'Computer', model_no: 'IN22-0125DS', product_name: 'INVO Entry Level Desktop i3 12th Gen', serial_no: 'IN22135002', warranty_months: 36, specs: { cabinet_sn: 'CX90918108', motherboard_sn: 'H61M1112C09S4894', ram_sn: '12050062', ram_size: '16 GB', ssd_sn: '12050028', ssd_size: '512 GB', processor: 'i3 12th gen', processor_sn: 'U6692PF301274' }, status: 'IN_STOCK', assigned_party_id: 2, assigned_party_name: 'In-vo it industry pvt. Ltd.', dispatch_date: '2026-10-01', sale_info: null },
    { unit_id: 3, category_id: 2, category_name: 'Monitor', model_no: 'INM-21IPS', product_name: 'INVO IPS 21" Borderless Monitor', serial_no: '910072508000BC', warranty_months: 36, specs: { screen_size: '21"', panel_type: 'IPS Full HD', monitor_sn: '910072508000BC' }, status: 'SOLD', assigned_party_id: 3, assigned_party_name: 'R. P. ENTERPRISES', dispatch_date: '2026-03-01', sale_info: { invoice_no: 'INV-RP-2026-001', invoice_date: '2026-03-15', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', seller_party_id: 3, seller_party_name: 'R. P. ENTERPRISES', sale_type: 'DISTRIBUTOR', warranty_start: '2026-03-15', warranty_end: '2029-03-15' } },
    { unit_id: 4, category_id: 2, category_name: 'Monitor', model_no: 'INM-21IPS', product_name: 'INVO IPS 21" Borderless Monitor', serial_no: '9100725100014A', warranty_months: 36, specs: { screen_size: '21"', panel_type: 'IPS Full HD', monitor_sn: '9100725100014A' }, status: 'IN_STOCK', assigned_party_id: 3, assigned_party_name: 'R. P. ENTERPRISES', dispatch_date: '2026-03-01', sale_info: null },
    { unit_id: 5, category_id: 3, category_name: 'TV', model_no: 'INV-32LED', product_name: 'INVO 32" HD Ready Smart LED TV', serial_no: 'INTV08265001', warranty_months: 24, specs: { screen_size: '32"', motherboard_sn: 'EBT67356202', panel_sn: 'PNL-LG-32HD-001' }, status: 'SOLD', assigned_party_id: 4, assigned_party_name: 'M. R. ENTERPRISES', dispatch_date: '2026-01-20', sale_info: { invoice_no: 'INV-MR-5001', invoice_date: '2026-02-05', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', seller_party_id: 4, seller_party_name: 'M. R. ENTERPRISES', sale_type: 'DISTRIBUTOR', warranty_start: '2026-02-05', warranty_end: '2028-02-05' } },
    { unit_id: 6, category_id: 3, category_name: 'TV', model_no: 'INV-32LED', product_name: 'INVO 32" HD Ready Smart LED TV', serial_no: 'INTV08265002', warranty_months: 24, specs: { screen_size: '32"', motherboard_sn: 'EBT67356203', panel_sn: 'PNL-LG-32HD-002' }, status: 'IN_STOCK', assigned_party_id: 4, assigned_party_name: 'M. R. ENTERPRISES', dispatch_date: '2026-01-20', sale_info: null },
    { unit_id: 7, category_id: 4, category_name: 'Interactive Panel', model_no: 'INIP-75IFP', product_name: 'INVO 75" 4K UHD Interactive Flat Panel', serial_no: 'INIP-75IFP082600142', warranty_months: 36, specs: { ram: '8 GB', rom: '64 GB', ops_serial: '530001', ops_ram: '8 GB', ops_rom: '512 GB' }, status: 'SOLD', assigned_party_id: 5, assigned_party_name: 'Gunjan Industry', dispatch_date: '2026-10-15', sale_info: { invoice_no: 'INV-GUNJAN-142', invoice_date: '2026-11-03', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', seller_party_id: 5, seller_party_name: 'Gunjan Industry', sale_type: 'DISTRIBUTOR', warranty_start: '2026-11-03', warranty_end: '2029-11-03' } },
    { unit_id: 8, category_id: 4, category_name: 'Interactive Panel', model_no: 'INIP-75IFP', product_name: 'INVO 75" 4K UHD Interactive Flat Panel', serial_no: 'INIP-75IFP082600143', warranty_months: 36, specs: { ram: '8 GB', rom: '64 GB', ops_serial: '530001', ops_ram: '8 GB', ops_rom: '512 GB' }, status: 'IN_STOCK', assigned_party_id: 5, assigned_party_name: 'Gunjan Industry', dispatch_date: '2026-10-15', sale_info: null },
    { unit_id: 9, category_id: 5, category_name: 'LED Bulb', model_no: 'INB09WW', product_name: 'INVO 60W Heavy Duty LED Bulb', serial_no: 'IN-P10926001', warranty_months: 12, specs: { watt: '60W', color: 'Cool Daylight 6500K' }, status: 'SOLD', assigned_party_id: 6, assigned_party_name: 'star enterprises', dispatch_date: '2026-04-10', sale_info: { invoice_no: 'INV-STAR-9001', invoice_date: '2026-05-05', customer_name: 'AC TRIBLE DIPARTMENT', zila: 'BILASPUR', seller_party_id: 6, seller_party_name: 'star enterprises', sale_type: 'DISTRIBUTOR', warranty_start: '2026-05-05', warranty_end: '2027-05-05' } },
    { unit_id: 10, category_id: 5, category_name: 'LED Bulb', model_no: 'INB09WW', product_name: 'INVO 60W Heavy Duty LED Bulb', serial_no: 'IN-P10926002', warranty_months: 12, specs: { watt: '60W', color: 'Cool Daylight 6500K' }, status: 'IN_STOCK', assigned_party_id: 6, assigned_party_name: 'star enterprises', dispatch_date: '2026-04-10', sale_info: null }
  ];

  newProductEntry = {
    category_id: 1,
    model_no: 'IN22-0125DS',
    product_name: 'INVO Entry Level Desktop i3 12th Gen',
    serial_no: '',
    warranty_months: 36,
    specs: {
      cabinet_sn: '',
      cabinet_warr: 12,
      motherboard_sn: '',
      motherboard_warr: 36,
      ram_sn: '',
      ram_size: '16 GB',
      ram_warr: 36,
      ssd_sn: '',
      ssd_size: '512 GB',
      ssd_warr: 36,
      processor: 'i3 12th gen',
      processor_sn: '',
      processor_warr: 36,
      monitor_sn: '',
      monitor_warr: 36,
      mouse_sn: '',
      mouse_warr: 12,
      keyboard_sn: '',
      keyboard_warr: 12,
      graphic_card_sn: '',
      graphic_card_warr: 36,
      screen_size: '21"',
      panel_type: 'IPS Full HD',
      tv_motherboard_sn: '',
      tv_screen_size: '32"',
      panel_ram: '8 GB',
      panel_rom: '64 GB',
      ops_serial: '',
      ops_ram: '8 GB',
      ops_rom: '512 GB',
      watt: '60W',
      color: 'Cool Daylight 6500K'
    },
    action: 'ALLOCATE' as 'ALLOCATE' | 'DIRECT_SALE',
    to_party_id: 2,
    dispatch_date: new Date().toISOString().split('T')[0],
    invoice_no: '',
    invoice_date: new Date().toISOString().split('T')[0],
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR'
  };

  newParty = {
    party_type: 'DISTRIBUTOR' as 'OEM' | 'DISTRIBUTOR',
    party_name: '',
    gst_no: '',
    contact_person: '',
    mobile: '',
    email: '',
    password: 'dist123',
    address: '',
    district: 'BILASPUR',
    state: 'Chhattisgarh',
    pincode: '495001'
  };

  newModel = {
    category_id: 1,
    brand: 'INVO',
    model_no: '',
    product_name: '',
    warranty_month: 24
  };

  newTransfer = {
    to_party_id: 2,
    model_id: 1,
    serial_no: '',
    dispatch_date: new Date().toISOString().split('T')[0],
    remarks: ''
  };

  newCustomer = {
    customer_name: '',
    department: '',
    contact_person: '',
    mobile: '',
    email: '',
    address: '',
    district: 'BILASPUR',
    state: 'Chhattisgarh',
    pincode: '495001'
  };

  isLoadingData = false;

  fetchDataFromApi() {
    this.isLoadingData = true;
    Promise.all([
      fetch(`${environment.apiUrl}/categories`).then(r => r.json()).then(data => {
        if (Array.isArray(data) && data.length) {
          this.categories = data;
          if (!this.categories.some(c => c.category_id === 6)) {
            this.categories.splice(1, 0, { category_id: 6, category_name: 'ALL IN ONE PC' });
          }
        }
      }).catch(() => {}),
      fetch(`${environment.apiUrl}/parties`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length) this.parties = data; }).catch(() => {}),
      fetch(`${environment.apiUrl}/models`).then(r => r.json()).then(data => {
        if (Array.isArray(data) && data.length) {
          this.models = data;
          if (!this.models.some(m => m.category_id === 6)) {
            this.models.unshift({ model_id: 9, category_id: 6, category_name: 'ALL IN ONE PC', brand: 'INVO', model_no: 'IN22-0125DS', product_name: 'INVO All In One PC 23.8" FHD i3', warranty_month: 36, status: 1 });
          }
        }
      }).catch(() => {}),
      fetch(`${environment.apiUrl}/inventory`).then(r => r.json()).then(data => {
        if (Array.isArray(data) && data.length) {
          this.inventory = data.map(item => {
            const pName = (item.product_name || '').toLowerCase();
            const sn = (item.serial_no || '').toUpperCase();
            if (item.category_id === 6 || pName.includes('all in one') || sn.startsWith('IN22I')) {
              return {
                ...item,
                category_id: 6,
                category_name: 'ALL IN ONE PC'
              };
            }
            return item;
          });
        }
      }).catch(() => {}),
      fetch(`${environment.apiUrl}/invoices`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length) this.invoices = data; }).catch(() => {}),
      fetch(`${environment.apiUrl}/customers`).then(r => r.json()).then(data => { if (Array.isArray(data) && data.length) this.customers = data; }).catch(() => {})
    ]).finally(() => {
      if (!this.categories.some(c => c.category_id === 6)) {
        this.categories.splice(1, 0, { category_id: 6, category_name: 'ALL IN ONE PC' });
      }
      this.isLoadingData = false;
    });
    this.fetchSubUsers();
  }

  get activeDistributorsCount(): number {
    return this.parties.filter(p => p.party_type === 'DISTRIBUTOR').length;
  }

  get inStockUnitsCount(): number {
    return this.inventory.filter(u => u.status === 'IN_STOCK').length;
  }

  get soldUnitsCount(): number {
    return this.inventory.filter(u => u.status === 'SOLD').length;
  }

  get filteredInventory(): InventoryUnit[] {
    return this.inventory.filter(item => {
      // Status filter
      if (this.inventoryFilter !== 'ALL' && item.status !== this.inventoryFilter) return false;
      // Category filter
      if (this.inventoryCategoryFilter !== 'ALL' && item.category_id !== Number(this.inventoryCategoryFilter)) return false;
      // Search query
      if (!this.searchQuery.trim()) return true;
      const q = this.searchQuery.toLowerCase();
      const serialMatch = item.serial_no.toLowerCase().includes(q);
      const modelMatch = item.model_no.toLowerCase().includes(q);
      const productMatch = item.product_name.toLowerCase().includes(q);
      const partyMatch = item.assigned_party_name?.toLowerCase().includes(q) || false;
      const invMatch = item.sale_info?.invoice_no.toLowerCase().includes(q) || false;
      const custMatch = item.sale_info?.customer_name.toLowerCase().includes(q) || false;
      const zilaMatch = item.sale_info?.zila?.toLowerCase().includes(q) || false;
      return serialMatch || modelMatch || productMatch || partyMatch || invMatch || custMatch || zilaMatch;
    });
  }

  // 1. Pagination for Inventory (Serials & Warranties)
  inventoryPage = 1;
  inventoryPageSize = 10;
  get inventoryTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredInventory.length / this.inventoryPageSize));
  }
  get pagedInventory(): InventoryUnit[] {
    const start = (this.inventoryPage - 1) * this.inventoryPageSize;
    return this.filteredInventory.slice(start, start + this.inventoryPageSize);
  }
  setInventoryPage(p: number) {
    this.inventoryPage = Math.max(1, Math.min(this.inventoryTotalPages, p));
  }
  get inventoryPagesArray(): number[] {
    return this.generatePagesArray(this.inventoryPage, this.inventoryTotalPages);
  }

  // 2. Pagination for Parties (Distributors)
  partiesPage = 1;
  partiesPageSize = 10;
  get filteredParties(): Party[] {
    if (!this.searchQuery.trim()) return this.parties;
    const q = this.searchQuery.toLowerCase();
    return this.parties.filter(p => p.party_name.toLowerCase().includes(q) || (p.district && p.district.toLowerCase().includes(q)) || (p.contact_person && p.contact_person.toLowerCase().includes(q)) || (p.gst_no && p.gst_no.toLowerCase().includes(q)));
  }
  get partiesTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredParties.length / this.partiesPageSize));
  }
  get pagedParties(): Party[] {
    const start = (this.partiesPage - 1) * this.partiesPageSize;
    return this.filteredParties.slice(start, start + this.partiesPageSize);
  }
  setPartiesPage(p: number) {
    this.partiesPage = Math.max(1, Math.min(this.partiesTotalPages, p));
  }
  get partiesPagesArray(): number[] {
    return this.generatePagesArray(this.partiesPage, this.partiesTotalPages);
  }

  // 3. Pagination for Product Models
  modelsPage = 1;
  modelsPageSize = 10;
  get filteredModels(): ProductModel[] {
    if (!this.searchQuery.trim()) return this.models;
    const q = this.searchQuery.toLowerCase();
    return this.models.filter(m => m.model_no.toLowerCase().includes(q) || m.product_name.toLowerCase().includes(q) || (m.brand && m.brand.toLowerCase().includes(q)));
  }
  get modelsTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredModels.length / this.modelsPageSize));
  }
  get pagedModels(): ProductModel[] {
    const start = (this.modelsPage - 1) * this.modelsPageSize;
    return this.filteredModels.slice(start, start + this.modelsPageSize);
  }
  setModelsPage(p: number) {
    this.modelsPage = Math.max(1, Math.min(this.modelsTotalPages, p));
  }
  get modelsPagesArray(): number[] {
    return this.generatePagesArray(this.modelsPage, this.modelsTotalPages);
  }

  // 4. Pagination for Invoices / Outward Sales
  invoicesPage = 1;
  invoicesPageSize = 10;
  get filteredInvoices(): Invoice[] {
    if (!this.searchQuery.trim()) return this.invoices;
    const q = this.searchQuery.toLowerCase();
    return this.invoices.filter(i => i.invoice_no.toLowerCase().includes(q) || (i.customer_name && i.customer_name.toLowerCase().includes(q)) || (i.zila && i.zila.toLowerCase().includes(q)) || (i.seller_party_name && i.seller_party_name.toLowerCase().includes(q)));
  }
  get invoicesTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredInvoices.length / this.invoicesPageSize));
  }
  get pagedInvoices(): Invoice[] {
    const start = (this.invoicesPage - 1) * this.invoicesPageSize;
    return this.filteredInvoices.slice(start, start + this.invoicesPageSize);
  }
  setInvoicesPage(p: number) {
    this.invoicesPage = Math.max(1, Math.min(this.invoicesTotalPages, p));
  }
  get invoicesPagesArray(): number[] {
    return this.generatePagesArray(this.invoicesPage, this.invoicesTotalPages);
  }

  // 5. Pagination for Customers
  customersPage = 1;
  customersPageSize = 10;
  get filteredCustomers(): Customer[] {
    if (!this.searchQuery.trim()) return this.customers;
    const q = this.searchQuery.toLowerCase();
    return this.customers.filter(c => c.customer_name.toLowerCase().includes(q) || (c.district && c.district.toLowerCase().includes(q)) || (c.department && c.department.toLowerCase().includes(q)));
  }
  get customersTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredCustomers.length / this.customersPageSize));
  }
  get pagedCustomers(): Customer[] {
    const start = (this.customersPage - 1) * this.customersPageSize;
    return this.filteredCustomers.slice(start, start + this.customersPageSize);
  }
  setCustomersPage(p: number) {
    this.customersPage = Math.max(1, Math.min(this.customersTotalPages, p));
  }
  get customersPagesArray(): number[] {
    return this.generatePagesArray(this.customersPage, this.customersTotalPages);
  }

  // 6. Pagination for Sub-Users & Logins
  subUsersPage = 1;
  subUsersPageSize = 10;
  get filteredSubUsers(): AdminSubUser[] {
    if (!this.searchQuery.trim()) return this.subUsers;
    const q = this.searchQuery.toLowerCase();
    return this.subUsers.filter(u => u.username.toLowerCase().includes(q) || u.display_name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)) || (u.mobile && u.mobile.toLowerCase().includes(q)));
  }
  get subUsersTotalPages(): number {
    return Math.max(1, Math.ceil(this.filteredSubUsers.length / this.subUsersPageSize));
  }
  get pagedSubUsers(): AdminSubUser[] {
    const start = (this.subUsersPage - 1) * this.subUsersPageSize;
    return this.filteredSubUsers.slice(start, start + this.subUsersPageSize);
  }
  setSubUsersPage(p: number) {
    this.subUsersPage = Math.max(1, Math.min(this.subUsersTotalPages, p));
  }
  get subUsersPagesArray(): number[] {
    return this.generatePagesArray(this.subUsersPage, this.subUsersTotalPages);
  }

  generatePagesArray(current: number, total: number): number[] {
    if (total <= 5) {
      const arr = [];
      for (let i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    const start = Math.max(1, Math.min(total - 4, current - 2));
    const end = Math.min(total, start + 4);
    const arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }

  onCategorySelectChange() {
    const catId = Number(this.newProductEntry.category_id);
    if (catId === 1) {
      // Computer
      this.newProductEntry.model_no = 'IN22-0125DS';
      this.newProductEntry.product_name = 'INVO Entry Level Desktop i3 12th Gen';
      this.newProductEntry.warranty_months = 36;
      this.newProductEntry.to_party_id = 2; // In-vo it industry
    } else if (catId === 6) {
      // ALL IN ONE PC (From Reference Image)
      this.newProductEntry.model_no = 'IN22-0125DS';
      this.newProductEntry.product_name = 'INVO All In One PC 23.8" FHD i3';
      this.newProductEntry.warranty_months = 36;
      this.newProductEntry.to_party_id = 2; // In-vo it industry
      this.newProductEntry.specs.processor = 'i3 12th gen';
      this.newProductEntry.specs.ram_size = '16 GB';
      this.newProductEntry.specs.ssd_size = '512 GB';
      this.newProductEntry.specs.screen_size = '23.8" FHD IPS';
    } else if (catId === 2) {
      // Monitor
      this.newProductEntry.model_no = 'INM-21IPS';
      this.newProductEntry.product_name = 'INVO IPS 21" Borderless Monitor';
      this.newProductEntry.warranty_months = 36;
      this.newProductEntry.to_party_id = 3; // R. P. ENTERPRISES
    } else if (catId === 3) {
      // TV
      this.newProductEntry.model_no = 'INV-32LED';
      this.newProductEntry.product_name = 'INVO 32" HD Ready Smart LED TV';
      this.newProductEntry.warranty_months = 24;
      this.newProductEntry.to_party_id = 4; // M. R. ENTERPRISES
    } else if (catId === 4) {
      // Interactive Panel
      this.newProductEntry.model_no = 'INIP-75IFP';
      this.newProductEntry.product_name = 'INVO 75" 4K UHD Interactive Flat Panel';
      this.newProductEntry.warranty_months = 36;
      this.newProductEntry.to_party_id = 5; // Gunjan Industry
    } else if (catId === 5) {
      // LED Bulb
      this.newProductEntry.model_no = 'INB09WW';
      this.newProductEntry.product_name = 'INVO 60W Heavy Duty LED Bulb';
      this.newProductEntry.warranty_months = 12;
      this.newProductEntry.to_party_id = 6; // star enterprises
    }
  }

  openProductEntryModal() {
    this.entrySuccessMessage = '';
    this.entryErrorMessage = '';
    this.showProductEntryModal = true;
    this.onCategorySelectChange();
  }

  selectedBatchWarranty: number = 36;

  applyWarrantyToAllComponents(months: number | string) {
    const m = Number(months);
    this.selectedBatchWarranty = m;
    this.newProductEntry.specs.cabinet_warr = m;
    this.newProductEntry.specs.motherboard_warr = m;
    this.newProductEntry.specs.ram_warr = m;
    this.newProductEntry.specs.ssd_warr = m;
    this.newProductEntry.specs.processor_warr = m;
    this.newProductEntry.specs.monitor_warr = m;
    this.newProductEntry.specs.mouse_warr = m;
    this.newProductEntry.specs.keyboard_warr = m;
    this.newProductEntry.specs.graphic_card_warr = m;
  }

  submitProductEntry() {
    this.entrySuccessMessage = '';
    this.entryErrorMessage = '';

    if (!this.newProductEntry.serial_no.trim()) {
      this.entryErrorMessage = 'Please enter a valid Serial Number.';
      return;
    }

    if (this.newProductEntry.action === 'DIRECT_SALE') {
      if (!this.newProductEntry.invoice_no || !this.newProductEntry.invoice_no.trim()) {
        this.entryErrorMessage = 'Customer Invoice Number is mandatory. Warranty will only start after entering Invoice Number and Sale Date.';
        return;
      }
      if (!this.newProductEntry.invoice_date) {
        this.entryErrorMessage = 'Sale Date is mandatory. Warranty is calculated directly from this Sale Date.';
        return;
      }
      if (!this.newProductEntry.customer_name || !this.newProductEntry.customer_name.trim()) {
        this.entryErrorMessage = 'End User / Customer Name is required for direct sale.';
        return;
      }
    }

    // Assemble category specific specs
    const catId = Number(this.newProductEntry.category_id);
    let finalSpecs: any = {};

    if (catId === 1 || catId === 6) {
      finalSpecs = {
        cabinet_sn: this.newProductEntry.specs.cabinet_sn,
        cabinet_warr: Number(this.newProductEntry.specs.cabinet_warr || 12),
        motherboard_sn: this.newProductEntry.specs.motherboard_sn,
        motherboard_warr: Number(this.newProductEntry.specs.motherboard_warr || 36),
        ram_sn: this.newProductEntry.specs.ram_sn,
        ram_size: this.newProductEntry.specs.ram_size,
        ram_warr: Number(this.newProductEntry.specs.ram_warr || 36),
        ssd_sn: this.newProductEntry.specs.ssd_sn,
        ssd_size: this.newProductEntry.specs.ssd_size,
        ssd_warr: Number(this.newProductEntry.specs.ssd_warr || 36),
        processor: this.newProductEntry.specs.processor,
        processor_sn: this.newProductEntry.specs.processor_sn,
        processor_warr: Number(this.newProductEntry.specs.processor_warr || 36),
        monitor_sn: this.newProductEntry.specs.monitor_sn,
        screen_size: this.newProductEntry.specs.screen_size,
        monitor_warr: Number(this.newProductEntry.specs.monitor_warr || 36),
        mouse_sn: this.newProductEntry.specs.mouse_sn,
        mouse_warr: Number(this.newProductEntry.specs.mouse_warr || 12),
        keyboard_sn: this.newProductEntry.specs.keyboard_sn,
        keyboard_warr: Number(this.newProductEntry.specs.keyboard_warr || 12),
        graphic_card_sn: this.newProductEntry.specs.graphic_card_sn,
        graphic_card_warr: Number(this.newProductEntry.specs.graphic_card_warr || 36)
      };
    } else if (catId === 2) {
      finalSpecs = {
        screen_size: this.newProductEntry.specs.screen_size,
        panel_type: this.newProductEntry.specs.panel_type,
        monitor_sn: this.newProductEntry.serial_no
      };
    } else if (catId === 3) {
      finalSpecs = {
        screen_size: this.newProductEntry.specs.tv_screen_size,
        motherboard_sn: this.newProductEntry.specs.tv_motherboard_sn
      };
    } else if (catId === 4) {
      finalSpecs = {
        ram: this.newProductEntry.specs.panel_ram,
        rom: this.newProductEntry.specs.panel_rom,
        ops_serial: this.newProductEntry.specs.ops_serial,
        ops_ram: this.newProductEntry.specs.ops_ram,
        ops_rom: this.newProductEntry.specs.ops_rom
      };
    } else if (catId === 5) {
      finalSpecs = {
        watt: this.newProductEntry.specs.watt,
        color: this.newProductEntry.specs.color
      };
    }

    const isDirectSale = this.newProductEntry.action === 'DIRECT_SALE';

    const payload = {
      category_id: catId,
      model_no: this.newProductEntry.model_no,
      product_name: this.newProductEntry.product_name,
      serial_no: this.newProductEntry.serial_no.trim().toUpperCase(),
      warranty_months: Number(this.newProductEntry.warranty_months),
      specs: finalSpecs,
      action: this.newProductEntry.action,
      to_party_id: Number(this.newProductEntry.to_party_id),
      dispatch_date: this.newProductEntry.dispatch_date,
      invoice_no: isDirectSale ? this.newProductEntry.invoice_no.trim() : null,
      invoice_date: isDirectSale ? this.newProductEntry.invoice_date : null,
      customer_name: isDirectSale ? this.newProductEntry.customer_name.trim() : null,
      zila: isDirectSale ? this.newProductEntry.zila.trim() : null
    };

    fetch(`${environment.apiUrl}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          this.entrySuccessMessage = res.message || 'Product successfully recorded!';
          this.inventory.unshift(res.data);
          if (res.data.sale_info) {
            this.invoices.unshift({
              invoice_id: this.invoices.length + 1,
              invoice_no: res.data.sale_info.invoice_no,
              seller_party_name: res.data.sale_info.seller_party_name,
              customer_name: res.data.sale_info.customer_name,
              zila: res.data.sale_info.zila,
              sale_type: res.data.sale_info.sale_type,
              invoice_date: res.data.sale_info.invoice_date,
              total_qty: 1,
              serial_no: res.data.serial_no,
              product_name: res.data.product_name
            });
          }
          // Reset serial number for next entry
          this.newProductEntry.serial_no = '';
          setTimeout(() => {
            this.showProductEntryModal = false;
            this.activeTab = 'inventory';
          }, 1400);
        } else {
          this.entryErrorMessage = res.message || 'Failed to record product.';
        }
      })
      .catch(err => {
        this.entryErrorMessage = 'Connection error with API server.';
      });
  }

  addParty() {
    if (!this.newParty.party_name) return;
    const newItem: Party = { party_id: this.parties.length + 1, ...this.newParty, status: 1 };
    this.parties.unshift(newItem);
    this.showPartyModal = false;
    fetch(`${environment.apiUrl}/parties`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) }).catch(() => {});
  }

  addCustomer() {
    if (!this.newCustomer.customer_name.trim()) return;
    const newItem: Customer = {
      customer_id: this.customers.length + 1,
      customer_name: this.newCustomer.customer_name.trim(),
      department: this.newCustomer.department?.trim() || 'General',
      contact_person: this.newCustomer.contact_person?.trim() || 'N/A',
      mobile: this.newCustomer.mobile?.trim() || 'N/A',
      email: this.newCustomer.email?.trim() || '',
      address: this.newCustomer.address?.trim() || '',
      district: this.newCustomer.district?.trim() || 'BILASPUR',
      state: this.newCustomer.state?.trim() || 'Chhattisgarh',
      pincode: this.newCustomer.pincode?.trim() || '495001',
      status: 1
    };
    this.customers.unshift(newItem);
    this.showCustomerModal = false;
    this.newCustomer = { customer_name: '', department: '', contact_person: '', mobile: '', email: '', address: '', district: 'BILASPUR', state: 'Chhattisgarh', pincode: '495001' };

    fetch(`${environment.apiUrl}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    }).catch(() => {});
  }

  addModel() {
    if (!this.newModel.model_no || !this.newModel.product_name) return;
    const cat = this.categories.find(c => c.category_id == this.newModel.category_id);
    const newItem: ProductModel = {
      model_id: this.models.length + 1,
      category_id: this.newModel.category_id,
      category_name: cat ? cat.category_name : 'General',
      brand: this.newModel.brand || 'INVO',
      model_no: this.newModel.model_no,
      product_name: this.newModel.product_name,
      warranty_month: this.newModel.warranty_month,
      status: 1
    };
    this.models.unshift(newItem);
    this.showModelModal = false;
    fetch(`${environment.apiUrl}/models`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) }).catch(() => {});
  }

  viewTaxInvoice(inv: Invoice) {
    this.selectedInvoiceForPrint = inv;
    this.showInvoiceModal = true;
  }

  printInvoice() {
    window.print();
  }

  // --- SUB-USERS & LOGINS MANAGEMENT METHODS ---
  fetchSubUsers() {
    fetch(`${environment.apiUrl}/admin/sub-users`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length) {
          this.subUsers = data.map(u => ({
            ...u,
            role: (u.role === 'DISTRIBUTOR') ? 'DISTRIBUTOR' : 'SUB_USER'
          }));
        }
      })
      .catch(() => {});
  }

  openCreateSubUserModal() {
    this.editingSubUser = null;
    this.subUserForm = { username: '', display_name: '', email: '', mobile: '', password: '', role: 'SUB_USER' };
    this.subUserSuccessMessage = '';
    this.subUserErrorMessage = '';
    this.showSubUserModal = true;
  }

  openEditSubUserModal(user: AdminSubUser) {
    this.editingSubUser = user;
    this.subUserForm = {
      username: user.username,
      display_name: user.display_name,
      email: user.email || '',
      mobile: user.mobile || '',
      password: '',
      role: (user.role === 'DISTRIBUTOR') ? 'DISTRIBUTOR' : 'SUB_USER'
    };
    this.subUserSuccessMessage = '';
    this.subUserErrorMessage = '';
    this.showSubUserModal = true;
  }

  saveSubUser() {
    this.subUserSuccessMessage = '';
    this.subUserErrorMessage = '';

    const cleanUsername = this.subUserForm.username ? this.subUserForm.username.trim().toLowerCase() : '';
    const cleanEmail = this.subUserForm.email ? this.subUserForm.email.trim().toLowerCase() : '';
    const cleanDisplayName = this.subUserForm.display_name ? this.subUserForm.display_name.trim() : '';

    if (!cleanUsername || !cleanDisplayName) {
      this.subUserErrorMessage = 'User ID and Full Name are required.';
      return;
    }

    if (!cleanEmail) {
      this.subUserErrorMessage = 'Email Address is required and must be unique.';
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      this.subUserErrorMessage = 'Please enter a valid email address (e.g. name@domain.com).';
      return;
    }

    // Super Admin reserved check
    if (cleanUsername === 'admin' || cleanUsername === 'admin@invoit.in' || cleanUsername === 'invoit') {
      this.subUserErrorMessage = 'User ID "admin" is reserved for Super Admin.';
      return;
    }
    if (cleanEmail === 'admin@invoit.in') {
      this.subUserErrorMessage = 'Email "admin@invoit.in" is reserved for Super Admin.';
      return;
    }

    if (this.editingSubUser) {
      // Check unique email among other users
      const duplicateEmail = this.subUsers.find(
        u => u.user_id !== this.editingSubUser!.user_id && u.email && u.email.trim().toLowerCase() === cleanEmail
      );
      if (duplicateEmail) {
        this.subUserErrorMessage = `Email "${this.subUserForm.email.trim()}" is already in use by "${duplicateEmail.display_name}". Email must be unique.`;
        return;
      }

      fetch(`${environment.apiUrl}/admin/sub-users/${this.editingSubUser.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.subUserForm)
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          this.subUserSuccessMessage = res.message || 'User updated successfully!';
          this.fetchSubUsers();
          setTimeout(() => { this.showSubUserModal = false; }, 900);
        } else {
          this.subUserErrorMessage = res.message || 'Update failed.';
        }
      })
      .catch(() => {
        this.subUserSuccessMessage = 'User updated!';
        setTimeout(() => { this.showSubUserModal = false; }, 900);
      });
    } else {
      // Check unique User ID
      const duplicateUser = this.subUsers.find(
        u => u.username.toLowerCase() === cleanUsername
      );
      if (duplicateUser) {
        this.subUserErrorMessage = `User ID "${this.subUserForm.username.trim()}" is already registered to "${duplicateUser.display_name}". User ID must be unique.`;
        return;
      }

      // Check unique Email
      const duplicateEmail = this.subUsers.find(
        u => u.email && u.email.trim().toLowerCase() === cleanEmail
      );
      if (duplicateEmail) {
        this.subUserErrorMessage = `Email "${this.subUserForm.email.trim()}" is already registered to "${duplicateEmail.display_name}". Email must be unique.`;
        return;
      }

      if (!this.subUserForm.password) {
        this.subUserErrorMessage = 'Password is required for new user.';
        return;
      }

      fetch(`${environment.apiUrl}/admin/sub-users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.subUserForm)
      })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          this.subUserSuccessMessage = res.message || 'User created successfully!';
          this.fetchSubUsers();
          setTimeout(() => { this.showSubUserModal = false; }, 900);
        } else {
          this.subUserErrorMessage = res.message || 'Creation failed.';
        }
      })
      .catch(() => {
        this.subUsers.unshift({
          user_id: Date.now(),
          ...this.subUserForm,
          status: 1
        });
        this.subUserSuccessMessage = 'User created!';
        setTimeout(() => { this.showSubUserModal = false; }, 900);
      });
    }
  }

  deleteSubUser(id: number) {
    if (!confirm('Are you sure you want to remove this login account?')) return;
    fetch(`${environment.apiUrl}/admin/sub-users/${id}`, { method: 'DELETE' })
      .then(() => this.fetchSubUsers())
      .catch(() => {
        this.subUsers = this.subUsers.filter(u => u.user_id !== id);
      });
  }

  // --- DISTRIBUTOR CREDENTIALS METHODS ---
  openDistCredModal(p: Party) {
    this.selectedDistForCreds = p;
    this.distCredForm = {
      mobile: p.mobile || '',
      email: p.email || '',
      password: p.password || 'dist123',
      status: p.status
    };
    this.distCredSuccessMessage = '';
    this.distCredErrorMessage = '';
    this.showDistCredModal = true;
  }

  saveDistCreds() {
    if (!this.selectedDistForCreds) return;
    this.distCredSuccessMessage = '';
    this.distCredErrorMessage = '';

    if (!this.distCredForm.password) {
      this.distCredErrorMessage = 'Password cannot be empty.';
      return;
    }

    const cleanDistEmail = this.distCredForm.email ? this.distCredForm.email.trim().toLowerCase() : '';
    if (cleanDistEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanDistEmail)) {
        this.distCredErrorMessage = 'Please enter a valid email address.';
        return;
      }
      const duplicateDist = this.parties.find(
        p => p.party_id !== this.selectedDistForCreds!.party_id && p.email && p.email.trim().toLowerCase() === cleanDistEmail
      );
      if (duplicateDist) {
        this.distCredErrorMessage = `Email "${this.distCredForm.email.trim()}" is already registered to distributor "${duplicateDist.party_name}". Email must be unique.`;
        return;
      }
    }

    fetch(`${environment.apiUrl}/admin/parties/${this.selectedDistForCreds.party_id}/credentials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.distCredForm)
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        this.distCredSuccessMessage = res.message || 'Distributor credentials saved!';
        if (this.selectedDistForCreds) {
          this.selectedDistForCreds.password = this.distCredForm.password;
          this.selectedDistForCreds.mobile = this.distCredForm.mobile;
          this.selectedDistForCreds.email = this.distCredForm.email;
          this.selectedDistForCreds.status = this.distCredForm.status;
        }
        setTimeout(() => { this.showDistCredModal = false; }, 900);
      } else {
        this.distCredErrorMessage = res.message || 'Failed to update credentials.';
      }
    })
    .catch(() => {
      if (this.selectedDistForCreds) {
        this.selectedDistForCreds.password = this.distCredForm.password;
        this.selectedDistForCreds.mobile = this.distCredForm.mobile;
      }
      this.distCredSuccessMessage = 'Credentials saved locally!';
      setTimeout(() => { this.showDistCredModal = false; }, 900);
    });
  }

  // OEM DIRECT SALE HANDLERS
  openOemSaleModal(unit: InventoryUnit) {
    this.selectedUnitForOemSale = unit;
    this.oemSaleErrorMessage = '';
    this.oemSaleSuccessMessage = '';

    if (unit.status === 'SOLD' && unit.sale_info && unit.sale_info.invoice_no) {
      this.isOemUnitAlreadySold = true;
      this.oemSaleFormData = {
        invoice_no: unit.sale_info.invoice_no,
        invoice_date: unit.sale_info.invoice_date || '',
        customer_name: unit.sale_info.customer_name || '',
        zila: unit.sale_info.zila || 'BILASPUR'
      };
    } else {
      this.isOemUnitAlreadySold = false;
      this.oemSaleFormData = {
        invoice_no: '',
        invoice_date: new Date().toISOString().substring(0, 10),
        customer_name: '',
        zila: 'BILASPUR'
      };
    }
    this.showOemSaleModal = true;
  }

  closeOemSaleModal() {
    this.showOemSaleModal = false;
    this.selectedUnitForOemSale = null;
  }

  submitOemSale() {
    if (!this.selectedUnitForOemSale) return;

    if (this.isOemUnitAlreadySold) {
      this.oemSaleErrorMessage = 'Invoice Number and Sale Date cannot be edited once saved.';
      return;
    }

    if (!this.oemSaleFormData.invoice_no || !this.oemSaleFormData.invoice_no.trim()) {
      this.oemSaleErrorMessage = 'Customer Invoice Number is mandatory. Warranty can only start after entering invoice number and sale date.';
      return;
    }

    if (!this.oemSaleFormData.invoice_date) {
      this.oemSaleErrorMessage = 'Sale Date is mandatory. Warranty will be calculated from this sale date.';
      return;
    }

    if (!this.oemSaleFormData.customer_name.trim()) {
      this.oemSaleErrorMessage = 'End User / Customer / Department Name is required.';
      return;
    }

    this.isSubmittingOemSale = true;
    this.oemSaleErrorMessage = '';

    const invNo = this.oemSaleFormData.invoice_no.trim();

    const payload = {
      serial_no: this.selectedUnitForOemSale.serial_no,
      invoice_no: invNo,
      invoice_date: this.oemSaleFormData.invoice_date,
      customer_name: this.oemSaleFormData.customer_name.trim(),
      zila: this.oemSaleFormData.zila.trim() || 'BILASPUR',
      seller_party_id: 1 // OEM Direct Sale
    };

    fetch(`${environment.apiUrl}/distributor/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        this.isSubmittingOemSale = false;
        if (res.success) {
          this.oemSaleSuccessMessage = res.message || 'Direct Sale successfully recorded and Warranty activated!';
          const found = this.inventory.find(u => u.serial_no === this.selectedUnitForOemSale.serial_no);
          if (found && res.data) {
            found.status = 'SOLD';
            found.sale_info = res.data.sale_info;
          }
          if (res.data?.sale_info) {
            this.invoices.unshift({
              invoice_id: this.invoices.length + 1,
              invoice_no: res.data.sale_info.invoice_no,
              seller_party_name: res.data.sale_info.seller_party_name,
              customer_name: res.data.sale_info.customer_name,
              zila: res.data.sale_info.zila,
              sale_type: 'DIRECT',
              invoice_date: res.data.sale_info.invoice_date,
              total_qty: 1,
              serial_no: this.selectedUnitForOemSale.serial_no,
              product_name: this.selectedUnitForOemSale.product_name
            });
          }
          setTimeout(() => {
            this.closeOemSaleModal();
          }, 1200);
        } else {
          this.oemSaleErrorMessage = res.message || 'Failed to record direct sale.';
        }
      })
      .catch(err => {
        this.isSubmittingOemSale = false;
        this.oemSaleErrorMessage = 'Network error: ' + err.message;
      });
  }
}

