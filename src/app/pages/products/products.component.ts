import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

export interface ProductModel {
  model_id: number;
  category_id: number;
  category_name?: string;
  brand: string;
  model_no: string;
  product_name: string;
  warranty_month: number;
  status: number;
  icon?: string;
  badge?: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  private http = inject(HttpClient);

  searchQuery = '';
  selectedCategory = 'All';
  isLoading = false;

  categories: string[] = ['All', 'Computer', 'Monitor', 'TV', 'Interactive Panel', 'LED Bulb'];

  products: ProductModel[] = [
    { model_id: 1, category_id: 1, category_name: 'Computer', brand: 'INVO', model_no: 'INVO-DP500', product_name: 'INVO DeskPro i5 PC', warranty_month: 24, status: 1, icon: 'computer', badge: 'Best Seller' },
    { model_id: 2, category_id: 1, category_name: 'Computer', brand: 'INVO', model_no: 'INVO-WS700', product_name: 'INVO Workstation i7 Desktop', warranty_month: 36, status: 1, icon: 'desktop_windows', badge: 'High Performance' },
    { model_id: 3, category_id: 2, category_name: 'Monitor', brand: 'INVO', model_no: 'INVO-MON24', product_name: 'INVO Vue 24" IPS FHD Monitor', warranty_month: 12, status: 1, icon: 'monitor', badge: 'Popular' },
    { model_id: 4, category_id: 2, category_name: 'Monitor', brand: 'INVO', model_no: 'INVO-MON27', product_name: 'INVO Vue 27" Curved Gaming Monitor', warranty_month: 24, status: 1, icon: 'monitor', badge: 'Curved Display' },
    { model_id: 5, category_id: 3, category_name: 'TV', brand: 'INVO', model_no: 'INVO-TV43', product_name: 'INVO Smart Vision 43" 4K Smart TV', warranty_month: 24, status: 1, icon: 'tv', badge: '4K Ultra HD' },
    { model_id: 6, category_id: 3, category_name: 'TV', brand: 'INVO', model_no: 'INVO-TV55', product_name: 'INVO Ultra 55" QLED 4K TV', warranty_month: 36, status: 1, icon: 'tv', badge: 'Premium QLED' },
    { model_id: 7, category_id: 4, category_name: 'Interactive Panel', brand: 'INVO', model_no: 'INVO-IFP65', product_name: 'INVO Board 65" 4K Interactive Flat Panel', warranty_month: 36, status: 1, icon: 'touch_app', badge: 'Smart Classroom' },
    { model_id: 8, category_id: 4, category_name: 'Interactive Panel', brand: 'INVO', model_no: 'INVO-IFP75', product_name: 'INVO Board 75" Premium Touch IFP', warranty_month: 36, status: 1, icon: 'touch_app', badge: 'Enterprise IFP' },
    { model_id: 9, category_id: 5, category_name: 'LED Bulb', brand: 'INVO', model_no: 'INVO-B09W', product_name: 'INVO EcoBulb 9W Cool Daylight LED', warranty_month: 12, status: 1, icon: 'lightbulb', badge: 'Energy Saver' },
    { model_id: 10, category_id: 5, category_name: 'LED Bulb', brand: 'INVO', model_no: 'INVO-B15W', product_name: 'INVO BrightMax 15W High Watt Bulb', warranty_month: 12, status: 1, icon: 'lightbulb', badge: 'High Watt' }
  ];

  ngOnInit() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/api/products').subscribe({
      next: (data) => {
        this.isLoading = false;
        if (Array.isArray(data) && data.length > 0) {
          this.products = data.map(item => ({
            ...item,
            icon: this.getCategoryIcon(item.category_name),
            badge: `${item.warranty_month || 12} Months Warranty`
          }));
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getCategoryIcon(catName?: string): string {
    switch ((catName || '').toLowerCase()) {
      case 'computer': return 'computer';
      case 'monitor': return 'monitor';
      case 'tv': return 'tv';
      case 'interactive panel': return 'touch_app';
      case 'led bulb': return 'lightbulb';
      default: return 'devices';
    }
  }

  get filteredProducts() {
    return this.products.filter(p => {
      const matchesCat = this.selectedCategory === 'All' || (p.category_name || '').toLowerCase() === this.selectedCategory.toLowerCase();
      const q = this.searchQuery.trim().toLowerCase();
      const matchesQuery = !q || (p.product_name.toLowerCase().includes(q) || p.model_no.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }
}
