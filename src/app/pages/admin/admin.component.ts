import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WarrantyItem {
  id: number;
  serialNumber: string;
  productName: string;
  customerName: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

interface ProductItem {
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'discontinued';
}

interface ServiceTicket {
  id: string;
  customerName: string;
  serialNumber: string;
  type: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  scheduledDate: string;
}

interface CustomerItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: 'overview' | 'warranties' | 'products' | 'service' | 'customers' = 'overview';
  searchQuery = '';

  // Modals
  showAddWarrantyModal = false;
  showAddProductModal = false;

  // New Warranty Form Data
  newWarranty = {
    serialNumber: '',
    productName: 'MWC AquaPure 500',
    customerName: '',
    purchaseDate: '',
    expiryDate: ''
  };

  // New Product Form Data
  newProduct = {
    code: '',
    name: '',
    category: 'RO Water Purifier',
    price: 0
  };

  // Mock Database State
  warranties: WarrantyItem[] = [
    { id: 1, serialNumber: 'MWC-12345', productName: 'MWC AquaPure 500', customerName: 'Rahul Sharma', purchaseDate: '2025-03-15', expiryDate: '2026-03-15', status: 'Active' },
    { id: 2, serialNumber: 'MWC-67890', productName: 'MWC CrystalClear 300', customerName: 'Priya Patel', purchaseDate: '2025-01-10', expiryDate: '2026-01-10', status: 'Active' },
    { id: 3, serialNumber: 'MWC-99999', productName: 'MWC ProClean 700', customerName: 'Amit Kumar', purchaseDate: '2024-06-01', expiryDate: '2026-06-01', status: 'Active' },
    { id: 4, serialNumber: 'MWC-88888', productName: 'MWC SmartFlow 200', customerName: 'Rahul Sharma', purchaseDate: '2023-05-10', expiryDate: '2024-05-10', status: 'Expired' }
  ];

  products: ProductItem[] = [
    { id: 1, code: 'MWC-AP500', name: 'MWC AquaPure 500', category: 'RO Water Purifier', price: 12999, status: 'active' },
    { id: 2, code: 'MWC-CC300', name: 'MWC CrystalClear 300', category: 'UV Water Purifier', price: 8499, status: 'active' },
    { id: 3, code: 'MWC-PC700', name: 'MWC ProClean 700', category: 'RO+UV+UF Purifier', price: 18999, status: 'active' },
    { id: 4, code: 'MWC-SF200', name: 'MWC SmartFlow 200', category: 'Gravity Water Purifier', price: 3999, status: 'active' },
    { id: 5, code: 'MWC-INDPRO', name: 'MWC Industrial Pro', category: 'Commercial Purifier', price: 49999, status: 'active' },
    { id: 6, code: 'MWC-TG100', name: 'MWC TankGuard', category: 'Water Tank Cleaner', price: 6999, status: 'active' }
  ];

  tickets: ServiceTicket[] = [
    { id: 'SR-2026-001', customerName: 'Rahul Sharma', serialNumber: 'MWC-12345', type: 'Filter Replacement', status: 'Pending', scheduledDate: '2026-08-30' },
    { id: 'SR-2026-002', customerName: 'Priya Patel', serialNumber: 'MWC-67890', type: 'Maintenance', status: 'In Progress', scheduledDate: '2026-08-26' },
    { id: 'SR-2026-003', customerName: 'Amit Kumar', serialNumber: 'MWC-99999', type: 'Installation', status: 'Completed', scheduledDate: '2026-08-15' }
  ];

  customers: CustomerItem[] = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 9876543210', city: 'Mumbai' },
    { id: 2, name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 9876543211', city: 'Pune' },
    { id: 3, name: 'Amit Kumar', email: 'amit.kumar@example.com', phone: '+91 9876543212', city: 'Navi Mumbai' }
  ];

  // Filtered Warranties
  get filteredWarranties() {
    if (!this.searchQuery) return this.warranties;
    const q = this.searchQuery.toLowerCase();
    return this.warranties.filter(w =>
      w.serialNumber.toLowerCase().includes(q) ||
      w.customerName.toLowerCase().includes(q) ||
      w.productName.toLowerCase().includes(q)
    );
  }

  // Filtered Products
  get filteredProducts() {
    if (!this.searchQuery) return this.products;
    const q = this.searchQuery.toLowerCase();
    return this.products.filter(p =>
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Filtered Tickets
  get filteredTickets() {
    if (!this.searchQuery) return this.tickets;
    const q = this.searchQuery.toLowerCase();
    return this.tickets.filter(t =>
      t.id.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.serialNumber.toLowerCase().includes(q)
    );
  }

  // Actions
  updateTicketStatus(ticket: ServiceTicket, status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled') {
    ticket.status = status;
  }

  addWarranty() {
    if (!this.newWarranty.serialNumber || !this.newWarranty.customerName) return;

    this.warranties.unshift({
      id: this.warranties.length + 1,
      serialNumber: this.newWarranty.serialNumber.toUpperCase(),
      productName: this.newWarranty.productName,
      customerName: this.newWarranty.customerName,
      purchaseDate: this.newWarranty.purchaseDate || new Date().toISOString().split('T')[0],
      expiryDate: this.newWarranty.expiryDate || '2027-08-30',
      status: 'Active'
    });

    this.newWarranty = { serialNumber: '', productName: 'MWC AquaPure 500', customerName: '', purchaseDate: '', expiryDate: '' };
    this.showAddWarrantyModal = false;
  }

  addProduct() {
    if (!this.newProduct.name || !this.newProduct.code) return;

    this.products.unshift({
      id: this.products.length + 1,
      code: this.newProduct.code.toUpperCase(),
      name: this.newProduct.name,
      category: this.newProduct.category,
      price: this.newProduct.price || 9999,
      status: 'active'
    });

    this.newProduct = { code: '', name: '', category: 'RO Water Purifier', price: 0 };
    this.showAddProductModal = false;
  }

  deleteWarranty(id: number) {
    this.warranties = this.warranties.filter(w => w.id !== id);
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}
