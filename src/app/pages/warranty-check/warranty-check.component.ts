import { Component, inject, OnInit, HostListener } from '@angular/core';
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
  tagline: string;
  colorClass: string;
  badgeText: string;
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
  isDropdownOpen = false;

  categories: CategoryOption[] = [
    {
      id: 'All',
      name: 'All Categories',
      icon: 'category',
      tagline: 'Search any product across all categories',
      colorClass: 'color-all',
      badgeText: 'ALL',
      placeholder: 'Enter Serial Number, Component SN or Invoice No (e.g., IN22135001 or IN22I35001)',
      sampleSN: 'IN22135001',
      sampleModel: 'All Categories',
      locationHint: 'Printed on product label sticker, packaging box, or customer invoice.'
    },
    {
      id: 'Computer',
      name: 'Computer',
      icon: 'desktop_windows',
      tagline: 'Desktop Towers, Workstations & Parts',
      colorClass: 'color-computer',
      badgeText: 'PC',
      placeholder: 'Enter Computer Serial No or Component SN (e.g., IN22135001 or INVO-DB-777)',
      sampleSN: 'IN22135001',
      sampleModel: 'IN22-0125DS / DeskPro',
      locationHint: 'Printed on the rear panel of the CPU cabinet or motherboard sticker.'
    },
    {
      id: 'ALL IN ONE PC',
      name: 'ALL IN ONE PC',
      icon: 'computer',
      tagline: '23.8" FHD AIO PC with 9 Component Warranties',
      colorClass: 'color-aio',
      badgeText: 'AIO',
      placeholder: 'Enter All In One PC Serial No (e.g., IN22I35001 to IN22I35010)',
      sampleSN: 'IN22I35001',
      sampleModel: 'IN22-0125DS / AIO 24"',
      locationHint: 'Located on the rear stand/chassis label or back cover barcode sticker.'
    },
    {
      id: 'Monitor',
      name: 'Monitor',
      icon: 'monitor',
      tagline: 'IPS FHD & Curved Gaming Displays',
      colorClass: 'color-monitor',
      badgeText: 'DISPLAY',
      placeholder: 'Enter Monitor Serial Number (e.g., 9100725100014A or INVO-MON24)',
      sampleSN: '9100725100014A',
      sampleModel: 'INVO Vue 24" / 27"',
      locationHint: 'Located on the barcode label at the rear side of the monitor display.'
    },
    {
      id: 'TV',
      name: 'TV',
      icon: 'tv',
      tagline: 'Smart LED & 4K UHD Televisions',
      colorClass: 'color-tv',
      badgeText: 'SMART TV',
      placeholder: 'Enter Smart TV Serial Number (e.g., IN0000000126 or INV-32LED)',
      sampleSN: 'IN0000000126',
      sampleModel: 'INV-32LED / Smart TV',
      locationHint: 'Located on the rear backplate barcode sticker and retail invoice.'
    },
    {
      id: 'Interactive Panel',
      name: 'Interactive Panel',
      icon: 'touch_app',
      tagline: '4K Touch IFP Panels for Education & Offices',
      colorClass: 'color-ifp',
      badgeText: 'TOUCH IFP',
      placeholder: 'Enter IFP Display Serial Number (e.g., INVO-IFP65-2026003 or INVO-IFP65)',
      sampleSN: 'INVO-IFP65-2026003',
      sampleModel: 'INVO Board 65" / 75"',
      locationHint: 'Printed on the lower-right chassis border and packaging carton.'
    },
    {
      id: 'LED Bulb',
      name: 'LED Bulb',
      icon: 'lightbulb',
      tagline: 'Eco & Heavy Duty High-Wattage Bulbs',
      colorClass: 'color-bulb',
      badgeText: 'LIGHTING',
      placeholder: 'Enter LED Bulb Serial Number or Batch (e.g., 2536521452 or INB09WW)',
      sampleSN: '2536521452',
      sampleModel: 'INB09WW 60W / 9W',
      locationHint: 'Laser-engraved around the neck collar of the bulb housing.'
    }
  ];

  get currentCategoryConfig(): CategoryOption {
    return this.categories.find(c => c.id === this.selectedCategory) || this.categories[0];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-category-dropdown')) {
      this.isDropdownOpen = false;
    }
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

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCategoryOption(catId: string) {
    this.selectedCategory = catId;
    this.isDropdownOpen = false;
    if (this.warrantyResult && this.warrantyResult.wrongCategory) {
      this.warrantyResult = null;
    }
    if (this.serialNumber.trim()) {
      this.checkWarranty();
    }
  }

  selectCategory(catId: string) {
    this.selectCategoryOption(catId);
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
    this.isDropdownOpen = false;

    // Search query to warranty endpoint
    const apiUrl = `${environment.apiUrl}/warranty/${encodeURIComponent(serial)}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.isSearching = false;

        // 1. If backend returned not found
        if (!res || !res.found) {
          this.warrantyResult = {
            found: false,
            wrongCategory: false,
            searchedCategory: this.selectedCategory,
            serialNo: serial,
            message: this.selectedCategory === 'All'
              ? `No warranty record found for serial number "${serial}" in INVO IT database. Please check the serial number and try again.`
              : `No ${this.selectedCategory} found with serial number "${serial}" in INVO IT database. Please verify the serial number or switch category.`
          };
          this.scrollToWarrantyResult();
          return;
        }

        // 2. Identify the accurate actual category of the found hardware item
        const pName = (res.productName || '').toLowerCase();
        const sn = (res.serialNo || serial).toUpperCase();
        let actualCat = res.category || '';

        if (pName.includes('desktop') || pName.includes('tower') || pName.includes('deskpro') || sn.startsWith('IN221') || sn.startsWith('INVO-DB') || sn.startsWith('INVO-DP') || sn.startsWith('INVO-WS') || (Number(res.category_id) === 1 && !pName.includes('all in one'))) {
          actualCat = 'Computer';
        } else if (Number(res.category_id) === 6 || pName.includes('all in one') || sn.startsWith('IN22I')) {
          actualCat = 'ALL IN ONE PC';
        } else if (Number(res.category_id) === 2 || pName.includes('monitor') || pName.includes('vue 2') || sn.startsWith('INVO-MON') || (sn.startsWith('91007') && !pName.includes('all in one'))) {
          actualCat = 'Monitor';
        } else if (Number(res.category_id) === 3 || pName.includes('tv') || pName.includes('smart vision') || sn.startsWith('INV-32') || sn.startsWith('IN000')) {
          actualCat = 'TV';
        } else if (Number(res.category_id) === 4 || pName.includes('panel') || pName.includes('interactive') || pName.includes('board') || sn.startsWith('INVO-IFP')) {
          actualCat = 'Interactive Panel';
        } else if (Number(res.category_id) === 5 || pName.includes('bulb') || pName.includes('ecobulb') || sn.startsWith('INB09') || sn.startsWith('IN-P1') || sn === '2536521452') {
          actualCat = 'LED Bulb';
        }

        // 3. Category Filter Check: Compare actual category with user's selected category
        const isMatch = (this.selectedCategory === 'All') ||
                        (actualCat.toLowerCase() === this.selectedCategory.toLowerCase());

        if (!isMatch) {
          // Category Mismatch! Show clean Category Mismatch status card
          this.warrantyResult = {
            found: false,
            wrongCategory: true,
            searchedCategory: this.selectedCategory,
            actualCategory: actualCat,
            serialNo: res.serialNo || serial,
            productName: res.productName,
            brand: res.brand || 'INVO',
            modelNo: res.modelNo,
            message: `Product serial "${serial}" belongs to the "${actualCat}" category, but your current filter is set to "${this.selectedCategory}".`
          };
          this.scrollToWarrantyResult();
          return;
        }

        // 4. Success: Product matches selected category!
        res.found = true;
        res.wrongCategory = false;
        res.category = actualCat;

        // Auto-generate 9 component warranties breakdown for Computer & ALL IN ONE PC if empty
        if ((actualCat === 'ALL IN ONE PC' || actualCat === 'Computer') && (!res.partWarranties || res.partWarranties.length === 0) && res.spec) {
          const s = res.spec;
          const isAio = actualCat === 'ALL IN ONE PC';
          const startDate = res.invoiceDate || res.warrantyStart || '2026-11-06';
          const addMonths = (dStr: string, m: number) => {
            try {
              const d = new Date(dStr);
              d.setMonth(d.getMonth() + m);
              return d.toISOString().split('T')[0];
            } catch (e) {
              return dStr;
            }
          };

          const partsList = [
            { partName: 'Motherboard', serialNo: s.motherboard_sn || 'Integrated', details: 'Mainboard', warrantyMonths: Number(s.motherboard_warr || 36) },
            { partName: 'Processor (CPU)', serialNo: s.processor_sn || 'Included', details: s.processor || 'i3 12th gen', warrantyMonths: Number(s.processor_warr || 36) },
            { partName: 'RAM Memory', serialNo: s.ram_sn || 'Integrated', details: s.ram_size ? s.ram_size + ' RAM' : '16 GB RAM', warrantyMonths: Number(s.ram_warr || 36) },
            { partName: 'Solid State Drive (SSD)', serialNo: s.ssd_sn || 'Integrated', details: s.ssd_size ? s.ssd_size + ' SSD' : '512 GB SSD', warrantyMonths: Number(s.ssd_warr || 36) },
            { partName: isAio ? 'AIO Chassis & Power Supply' : 'Cabinet & Power Supply', serialNo: s.cabinet_sn || 'Chassis', details: isAio ? 'AIO Body / SMPS' : 'Tower / SMPS', warrantyMonths: Number(s.cabinet_warr || 12) },
            { partName: isAio ? 'Built-in Display Screen (AIO Monitor)' : 'Monitor Screen', serialNo: s.monitor_sn || 'Display Panel', details: s.screen_size || (isAio ? '23.8" FHD IPS Panel' : 'Display Unit'), warrantyMonths: Number(s.monitor_warr || 36) },
            { partName: 'Keyboard', serialNo: s.keyboard_sn || 'Bundled', details: 'Input Peripheral', warrantyMonths: Number(s.keyboard_warr || 12) },
            { partName: 'Optical Mouse', serialNo: s.mouse_sn || 'Bundled', details: 'Input Peripheral', warrantyMonths: Number(s.mouse_warr || 12) },
            { partName: 'Graphic Card (GPU)', serialNo: s.graphic_card_sn || 'Integrated', details: 'Video Adapter', warrantyMonths: Number(s.graphic_card_warr || 36) }
          ];

          const now = new Date();
          res.partWarranties = partsList.filter(p => p.serialNo && p.serialNo !== 'None').map(p => {
            const wEnd = addMonths(startDate, p.warrantyMonths);
            const days = Math.max(0, Math.ceil((new Date(wEnd).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            return {
              partName: p.partName,
              serialNo: p.serialNo,
              details: p.details,
              warrantyMonths: p.warrantyMonths,
              warrantyEnd: wEnd,
              status: days > 0 ? 'Active' : 'Expired',
              daysRemaining: days
            };
          });
        }

        this.warrantyResult = res;
        this.scrollToWarrantyResult();
      },
      error: (err) => {
        this.isSearching = false;
        this.warrantyResult = {
          found: false,
          wrongCategory: false,
          searchedCategory: this.selectedCategory,
          serialNo: serial,
          message: this.selectedCategory === 'All'
            ? `No warranty record found for serial number "${serial}" in INVO IT database. Please check the serial number and try again.`
            : `No ${this.selectedCategory} found with serial number "${serial}" in INVO IT database. Please verify the serial number or switch category.`
        };
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
