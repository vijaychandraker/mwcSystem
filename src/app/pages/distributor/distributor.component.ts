import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export interface DistributorInventoryItem {
  unit_id: number;
  category_id: number;
  category_name: string;
  model_no: string;
  product_name: string;
  serial_no: string;
  warranty_months: number;
  specs: any;
  status: 'IN_STOCK' | 'SOLD';
  assigned_party_id: number;
  assigned_party_name: string;
  dispatch_date: string;
  sale_info?: {
    invoice_no: string;
    invoice_date: string;
    customer_name: string;
    zila: string;
    seller_party_id: number;
    seller_party_name: string;
    sale_type: string;
    warranty_start: string;
    warranty_end: string;
  };
}

export interface DistributorParty {
  party_id: number;
  party_name: string;
  contact_person: string;
  mobile: string;
  gst_no: string;
  district: string;
}

@Component({
  selector: 'app-distributor',
  imports: [CommonModule, FormsModule],
  templateUrl: './distributor.component.html',
  styleUrl: './distributor.component.css'
})
export class DistributorComponent implements OnInit {
  authService = inject(AuthService);
  Math = Math;

  activeTab: 'registered' = 'registered';

  // Available Distributors in system - Loaded from MariaDB mst_party
  distributors: DistributorParty[] = [];

  selectedDistributorId = 2;
  inventory: DistributorInventoryItem[] = [];

  // Logout confirmation state
  showLogoutConfirmModal = false;

  // Sale Modal State
  showSaleModal = false;
  selectedUnitForSale: DistributorInventoryItem | null = null;
  saleFormData = {
    invoice_no: '',
    invoice_date: new Date().toISOString().split('T')[0],
    customer_name: 'AC TRIBLE DIPARTMENT',
    zila: 'BILASPUR'
  };

  saleSuccessMessage = '';
  saleErrorMessage = '';
  isSubmittingSale = false;

  // Search filter
  searchQuery = '';

  ngOnInit() {
    this.fetchDistributors();
  }

  fetchDistributors() {
    const loggedIn = this.authService.getDistributor();
    fetch(`${environment.apiUrl}/parties`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.distributors = data.filter((p: any) => p.party_type === 'DISTRIBUTOR');
          if (loggedIn && loggedIn.party_id) {
            this.selectedDistributorId = loggedIn.party_id;
          } else if (this.distributors.length > 0) {
            this.selectedDistributorId = this.distributors[0].party_id;
          }
          this.fetchDistributorInventory();
        }
      })
      .catch(() => {
        this.fetchDistributorInventory();
      });
  }

  promptLogout() {
    this.showLogoutConfirmModal = true;
  }

  confirmLogout() {
    this.showLogoutConfirmModal = false;
    this.authService.logoutDistributor();
  }

  cancelLogout() {
    this.showLogoutConfirmModal = false;
  }

  get isSelfDistributor(): boolean {
    return this.authService.isDistributorLoggedIn();
  }

  get currentDistributor(): DistributorParty {
    const loggedIn = this.authService.getDistributor();
    if (loggedIn && loggedIn.party_id) {
      return {
        party_id: loggedIn.party_id,
        party_name: loggedIn.party_name,
        contact_person: loggedIn.contact_person,
        mobile: loggedIn.mobile,
        gst_no: loggedIn.gst_no,
        district: loggedIn.district
      };
    }
    const found = this.distributors.find(d => d.party_id === Number(this.selectedDistributorId));
    if (found) return found;
    if (this.distributors.length > 0) return this.distributors[0];
    return {
      party_id: 2,
      party_name: 'Authorized Dealer',
      contact_person: '',
      mobile: '',
      gst_no: '',
      district: 'BILASPUR'
    };
  }

  onDistributorChange() {
    this.fetchDistributorInventory();
  }

  fetchDistributorInventory() {
    const loggedIn = this.authService.getDistributor();
    const partyId = (loggedIn && loggedIn.party_id) ? loggedIn.party_id : this.selectedDistributorId;
    fetch(`${environment.apiUrl}/distributor/inventory/${partyId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.inventory = data;
        }
      })
      .catch(() => {
        // Fallback in-memory filter if backend offline
        fetch(`${environment.apiUrl}/inventory`)
          .then(r => r.json())
          .then(all => {
            if (Array.isArray(all)) {
              this.inventory = all.filter((u: any) => u.assigned_party_id === Number(partyId));
            }
          })
          .catch(() => {});
      });
  }

  get registeredList(): DistributorInventoryItem[] {
    return this.inventory.filter(u => this.matchesSearch(u));
  }

  // Pagination
  distPage = 1;
  distPageSize = 10;

  get distTotalPages(): number {
    return Math.max(1, Math.ceil(this.registeredList.length / this.distPageSize));
  }

  get pagedRegisteredList(): DistributorInventoryItem[] {
    const start = (this.distPage - 1) * this.distPageSize;
    return this.registeredList.slice(start, start + this.distPageSize);
  }

  setDistPage(p: number) {
    this.distPage = Math.max(1, Math.min(this.distTotalPages, p));
  }

  get distPagesArray(): number[] {
    const total = this.distTotalPages;
    const current = this.distPage;
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

  matchesSearch(item: DistributorInventoryItem): boolean {
    if (!this.searchQuery.trim()) return true;
    const q = this.searchQuery.toLowerCase();
    const serialMatch = item.serial_no.toLowerCase().includes(q);
    const modelMatch = item.model_no.toLowerCase().includes(q);
    const nameMatch = item.product_name.toLowerCase().includes(q);
    const custMatch = item.sale_info?.customer_name.toLowerCase().includes(q) || false;
    const invMatch = item.sale_info?.invoice_no.toLowerCase().includes(q) || false;
    return serialMatch || modelMatch || nameMatch || custMatch || invMatch;
  }

  get isUnitAlreadySold(): boolean {
    if (!this.selectedUnitForSale) return false;
    return Boolean(
      this.selectedUnitForSale.status === 'SOLD' ||
      (this.selectedUnitForSale.sale_info &&
       this.selectedUnitForSale.sale_info.invoice_no &&
       this.selectedUnitForSale.sale_info.invoice_no !== 'N/A' &&
       this.selectedUnitForSale.sale_info.invoice_date)
    );
  }

  openRegisterModal(unit?: DistributorInventoryItem) {
    if (unit) {
      this.selectedUnitForSale = unit;
      this.saleFormData.invoice_no = unit.sale_info?.invoice_no || '';
      this.saleFormData.invoice_date = unit.sale_info?.invoice_date || new Date().toISOString().split('T')[0];
      this.saleFormData.customer_name = unit.sale_info?.customer_name || 'AC TRIBLE DIPARTMENT';
      this.saleFormData.zila = unit.sale_info?.zila || this.currentDistributor.district || 'BILASPUR';
    } else if (this.inventory.length) {
      this.selectedUnitForSale = this.inventory[0];
      this.saleFormData.invoice_no = '';
      this.saleFormData.invoice_date = new Date().toISOString().split('T')[0];
      this.saleFormData.customer_name = 'AC TRIBLE DIPARTMENT';
      this.saleFormData.zila = this.currentDistributor.district || 'BILASPUR';
    }
    this.saleErrorMessage = '';
    this.saleSuccessMessage = '';
    this.showSaleModal = true;
  }

  openSaleModal(unit: DistributorInventoryItem) {
    this.openRegisterModal(unit);
  }

  closeSaleModal() {
    this.showSaleModal = false;
    this.selectedUnitForSale = null;
  }

  submitSale() {
    if (!this.selectedUnitForSale) return;

    if (this.isUnitAlreadySold) {
      this.saleErrorMessage = 'Invoice Number and Sale Date cannot be edited once saved.';
      return;
    }

    if (!this.saleFormData.invoice_no || !this.saleFormData.invoice_no.trim()) {
      this.saleErrorMessage = 'Customer Invoice Number is mandatory. Warranty can only start after entering invoice number and sale date.';
      return;
    }

    if (!this.saleFormData.invoice_date) {
      this.saleErrorMessage = 'Sale Date is mandatory. Warranty will be calculated from this sale date.';
      return;
    }

    if (!this.saleFormData.customer_name.trim()) {
      this.saleErrorMessage = 'End User / Customer Name is required.';
      return;
    }

    this.isSubmittingSale = true;
    this.saleErrorMessage = '';

    const invNo = this.saleFormData.invoice_no.trim();

    const payload = {
      serial_no: this.selectedUnitForSale.serial_no,
      invoice_no: invNo,
      invoice_date: this.saleFormData.invoice_date,
      customer_name: this.saleFormData.customer_name.trim(),
      zila: this.saleFormData.zila.trim() || 'BILASPUR',
      seller_party_id: this.selectedDistributorId
    };

    fetch(`${environment.apiUrl}/distributor/sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        this.isSubmittingSale = false;
        if (res.success) {
          this.saleSuccessMessage = `Product ${res.data.serial_no} warranty successfully registered! Active till ${res.data.sale_info.warranty_end}.`;
          // Update item in local list
          const idx = this.inventory.findIndex(u => u.serial_no === res.data.serial_no);
          if (idx !== -1) {
            this.inventory[idx] = res.data;
          }
          setTimeout(() => {
            this.closeSaleModal();
            this.activeTab = 'registered';
          }, 1800);
        } else {
          this.saleErrorMessage = res.message || 'Failed to complete sale.';
        }
      })
      .catch(err => {
        this.isSubmittingSale = false;
        this.saleErrorMessage = 'Error connecting to API server.';
      });
  }
}
