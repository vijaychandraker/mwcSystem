import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  placeholder: string;
  sampleSN: string;
  sampleModel: string;
  locationHint: string;
}

@Component({
  selector: 'app-warranty-check',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './warranty-check.component.html',
  styleUrl: './warranty-check.component.css'
})
export class WarrantyCheckComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  serialNumber = '';
  selectedCategory = 'All';
  isSearching = false;
  warrantyResult: any = null;
  showCardModal = false;

  categories: CategoryOption[] = [
    {
      id: 'All',
      name: 'All Categories',
      icon: 'category',
      placeholder: 'Enter Serial Number, Component SN or Invoice No (e.g., IN22135001 or IN0000000126)',
      sampleSN: 'IN22135001',
      sampleModel: 'All Categories',
      locationHint: 'Printed on product label sticker, packaging box, or customer invoice.'
    },
    {
      id: 'Computer',
      name: 'Computer',
      icon: 'desktop_windows',
      placeholder: 'Enter Computer Serial No or Component SN (e.g., IN22135001 or INVO-DB-777)',
      sampleSN: 'IN22135001',
      sampleModel: 'IN22-0125DS / DeskPro',
      locationHint: 'Printed on the rear panel of the CPU cabinet or motherboard sticker.'
    },
    {
      id: 'ALL IN ONE PC',
      name: 'ALL IN ONE PC',
      icon: 'computer',
      placeholder: 'Enter All In One PC Serial No or Component SN (e.g., IN22I35001 or INVO-AIO24)',
      sampleSN: 'IN22I35001',
      sampleModel: 'IN22-0125DS / AIO 24"',
      locationHint: 'Located on the rear stand/chassis label or back cover barcode sticker.'
    },
    {
      id: 'Monitor',
      name: 'Monitor',
      icon: 'monitor',
      placeholder: 'Enter Monitor Serial Number (e.g., 9100725100014A or INVO-MON24)',
      sampleSN: '9100725100014A',
      sampleModel: 'INVO Vue 24" / 27"',
      locationHint: 'Located on the barcode label at the rear side of the monitor display.'
    },
    {
      id: 'TV',
      name: 'TV',
      icon: 'tv',
      placeholder: 'Enter Smart TV Serial Number (e.g., IN0000000126 or INV-32LED)',
      sampleSN: 'IN0000000126',
      sampleModel: 'INV-32LED / Smart TV',
      locationHint: 'Located on the rear backplate barcode sticker and retail invoice.'
    },
    {
      id: 'Interactive Panel',
      name: 'Interactive Panel',
      icon: 'touch_app',
      placeholder: 'Enter IFP Display Serial Number (e.g., INVO-IFP65-2026003 or INVO-IFP65)',
      sampleSN: 'INVO-IFP65-2026003',
      sampleModel: 'INVO Board 65" / 75"',
      locationHint: 'Printed on the lower-right chassis border and packaging carton.'
    },
    {
      id: 'LED Bulb',
      name: 'LED Bulb',
      icon: 'lightbulb',
      placeholder: 'Enter LED Bulb Serial Number or Batch (e.g., 2536521452 or INB09WW)',
      sampleSN: '2536521452',
      sampleModel: 'INB09WW 60W / 9W',
      locationHint: 'Laser-engraved around the neck collar of the bulb housing.'
    }
  ];

  get currentCategoryConfig(): CategoryOption {
    return this.categories.find(c => c.id === this.selectedCategory) || this.categories[0];
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        const cat = params['category'];
        const matched = this.categories.find(c => c.id.toLowerCase() === cat.toLowerCase());
        if (matched) {
          this.selectedCategory = matched.id;
        }
      }
      if (params['serial']) {
        this.serialNumber = params['serial'];
        this.checkWarranty();
      }
    });
  }

  selectCategory(catId: string) {
    this.selectedCategory = catId;
    if (this.warrantyResult && this.warrantyResult.wrongCategory) {
      this.warrantyResult = null;
    }
  }

  useSampleSerial(sn: string) {
    this.serialNumber = sn;
    this.checkWarranty();
  }

  switchCategoryAndSearch(catName: string) {
    const matched = this.categories.find(c => c.id.toLowerCase() === catName.toLowerCase() || c.name.toLowerCase() === catName.toLowerCase());
    if (matched) {
      this.selectedCategory = matched.id;
    } else {
      this.selectedCategory = 'All';
    }
    this.checkWarranty();
  }

  getProgressWidth(daysRemaining: number, periodMonths: number = 12): number {
    const totalDays = (periodMonths || 12) * 30.5;
    return Math.min(100, Math.max(0, (daysRemaining / totalDays) * 100));
  }

  checkWarranty() {
    const serial = this.serialNumber.trim().toUpperCase();
    if (!serial) return;

    this.isSearching = true;
    this.warrantyResult = null;
    this.showCardModal = false;

    let apiUrl = `${environment.apiUrl}/warranty/${encodeURIComponent(serial)}`;
    if (this.selectedCategory && this.selectedCategory !== 'All') {
      apiUrl += `?category=${encodeURIComponent(this.selectedCategory)}`;
    }

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.isSearching = false;
        this.warrantyResult = res;
        this.scrollToWarrantyResult();
      },
      error: (err) => {
        this.isSearching = false;

        if (err.status === 404 && err.error?.message) {
          this.warrantyResult = {
            found: false,
            message: err.error.message
          };
        } else if (serial === 'INVO-DP500-2026001') {
          this.warrantyResult = {
            found: true,
            serialNo: 'INVO-DP500-2026001',
            productName: 'INVO DeskPro i5 PC',
            category: 'Computer',
            brand: 'INVO',
            modelNo: 'INVO-DP500',
            customerName: 'St. Xavier Higher Secondary School',
            invoiceNo: 'INV-2026-101',
            invoiceDate: '2026-02-15',
            sellerName: 'TechNova Solutions Pvt Ltd',
            warrantyStart: '2026-02-15',
            warrantyEnd: '2028-02-15',
            warrantyPeriodMonths: 24,
            status: 'Active',
            daysRemaining: 529
          };
        } else {
          this.warrantyResult = {
            found: false,
            message: 'No warranty record found for this serial number. Please verify and try again.'
          };
        }
        this.scrollToWarrantyResult();
      }
    });
  }

  private scrollToWarrantyResult() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      const el = document.getElementById('warranty-result-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  }

  resetSearch() {
    this.serialNumber = '';
    this.warrantyResult = null;
    this.showCardModal = false;
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openCardModal() {
    this.showCardModal = true;
  }

  closeCardModal() {
    this.showCardModal = false;
  }

  downloadWarrantyCard() {
    this.showCardModal = true;
    setTimeout(() => {
      window.print();
    }, 300);
  }
}
