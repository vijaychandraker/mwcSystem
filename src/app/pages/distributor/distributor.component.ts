import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WholesaleProduct {
  id: number;
  code: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  stockAvailable: number;
  orderQty: number;
}

interface DistributorOrder {
  orderId: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'Processing' | 'Dispatched' | 'Delivered';
  trackingNumber: string;
}

@Component({
  selector: 'app-distributor',
  imports: [CommonModule, FormsModule],
  templateUrl: './distributor.component.html',
  styleUrl: './distributor.component.css'
})
export class DistributorComponent {
  Math = Math; // Expose Math for template calculations

  activeTab: 'catalog' | 'orders' | 'activation' | 'analytics' = 'catalog';

  distributorInfo = {
    name: 'Apex Water Solutions Pvt Ltd',
    code: 'DIST-MUM-402',
    tier: 'Gold Partner (25% Discount)',
    region: 'Western Region (Mumbai / Pune)',
    manager: 'Vikram Singh (+91 98200 11223)',
    address: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093',
    gstin: '27AAACA1234B1Z5'
  };

  // Modals & State
  showOrderModal = false;
  showActivationModal = false;
  showInvoiceModal = false;
  selectedOrderForInvoice: DistributorOrder | null = null;
  orderSuccessMessage = '';

  // Customer Warranty Activation Form Data
  activationData = {
    serialNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    installationDate: ''
  };

  // Wholesale Products Catalog
  products: WholesaleProduct[] = [
    { id: 1, code: 'MWC-AP500', name: 'MWC AquaPure 500', category: 'RO Water Purifier', retailPrice: 12999, wholesalePrice: 9749, stockAvailable: 120, orderQty: 0 },
    { id: 2, code: 'MWC-CC300', name: 'MWC CrystalClear 300', category: 'UV Water Purifier', retailPrice: 8499, wholesalePrice: 6374, stockAvailable: 85, orderQty: 0 },
    { id: 3, code: 'MWC-PC700', name: 'MWC ProClean 700', category: 'RO+UV+UF Purifier', retailPrice: 18999, wholesalePrice: 14249, stockAvailable: 60, orderQty: 0 },
    { id: 4, code: 'MWC-SF200', name: 'MWC SmartFlow 200', category: 'Gravity Water Purifier', retailPrice: 3999, wholesalePrice: 2999, stockAvailable: 200, orderQty: 0 },
    { id: 5, code: 'MWC-INDPRO', name: 'MWC Industrial Pro', category: 'Commercial Purifier', retailPrice: 49999, wholesalePrice: 37499, stockAvailable: 15, orderQty: 0 },
    { id: 6, code: 'MWC-TG100', name: 'MWC TankGuard', category: 'Water Tank Cleaner', retailPrice: 6999, wholesalePrice: 5249, stockAvailable: 90, orderQty: 0 }
  ];

  // Orders History
  orders: DistributorOrder[] = [
    { orderId: 'DIST-2026-904', date: '2026-08-28', itemsCount: 25, totalAmount: 243725, status: 'Dispatched', trackingNumber: 'TRK-BXL-88192' },
    { orderId: 'DIST-2026-871', date: '2026-08-15', itemsCount: 40, totalAmount: 389960, status: 'Delivered', trackingNumber: 'TRK-BXL-77102' },
    { orderId: 'DIST-2026-810', date: '2026-07-30', itemsCount: 15, totalAmount: 146235, status: 'Delivered', trackingNumber: 'TRK-BXL-55410' }
  ];

  // Calculated Order Total
  get totalCartItems(): number {
    return this.products.reduce((acc, p) => acc + p.orderQty, 0);
  }

  get totalCartValue(): number {
    return this.products.reduce((acc, p) => acc + (p.orderQty * p.wholesalePrice), 0);
  }

  get totalCartSavings(): number {
    return this.products.reduce((acc, p) => acc + (p.orderQty * (p.retailPrice - p.wholesalePrice)), 0);
  }

  updateQty(product: WholesaleProduct, delta: number) {
    product.orderQty = Math.max(0, product.orderQty + delta);
  }

  placeBulkOrder() {
    if (this.totalCartItems === 0) return;

    const newOrder: DistributorOrder = {
      orderId: `DIST-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0],
      itemsCount: this.totalCartItems,
      totalAmount: this.totalCartValue,
      status: 'Processing',
      trackingNumber: `TRK-BXL-${Math.floor(10000 + Math.random() * 90000)}`
    };

    this.orders.unshift(newOrder);

    // Reset quantities
    this.products.forEach(p => p.orderQty = 0);
    this.showOrderModal = false;
    this.orderSuccessMessage = `Order ${newOrder.orderId} submitted successfully! Your account manager has been notified.`;

    setTimeout(() => {
      this.orderSuccessMessage = '';
    }, 5000);
  }

  activateWarranty() {
    if (!this.activationData.serialNumber || !this.activationData.customerName) return;

    this.showActivationModal = false;
    this.orderSuccessMessage = `Customer Warranty for Serial ${this.activationData.serialNumber.toUpperCase()} activated successfully!`;
    this.activationData = { serialNumber: '', customerName: '', customerEmail: '', customerPhone: '', installationDate: '' };

    setTimeout(() => {
      this.orderSuccessMessage = '';
    }, 5000);
  }

  // Download Invoice Action
  viewInvoice(order: DistributorOrder) {
    this.selectedOrderForInvoice = order;
    this.showInvoiceModal = true;
  }

  printInvoice() {
    window.print();
  }
}
