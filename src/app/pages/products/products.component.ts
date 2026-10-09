import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface ProductModel {
  model_id: number;
  category_id: number;
  category_name: string;
  brand: string;
  model_no: string;
  product_name: string;
  warranty_month: number;
  status: number;
  icon?: string;
  imageUrl?: string;
  badge?: string;
  tagline?: string;
  keySpecs: ProductSpecItem[];
  fullSpecs: ProductSpecItem[];
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  searchQuery = '';
  selectedCategory = 'All';
  isLoading = false;
  selectedProductForModal: ProductModel | null = null;

  categories: string[] = ['All', 'Computer', 'ALL IN ONE PC', 'Monitor', 'TV', 'Interactive Panel', 'LED Bulb'];

  products: ProductModel[] = [
    // 1. ALL IN ONE PC
    {
      model_id: 1,
      category_id: 6,
      category_name: 'ALL IN ONE PC',
      brand: 'INVO',
      model_no: 'INVO-AIO24-i5',
      product_name: 'ALL IN ONE PC',
      warranty_month: 36,
      status: 1,
      icon: 'desktop_windows',
      imageUrl: '/images/products/all_in_one_pc.jpg',
      badge: '14th Gen Intel i5',
      tagline: 'Intel Core i5-14400 (14th Gen) • 16GB DDR4 • 512GB NVMe SSD • 24" IPS Display',
      keySpecs: [
        { label: 'Processor', value: 'Intel® Core™ i5-14400 (14th Generation)' },
        { label: 'Motherboard', value: 'H610M' },
        { label: 'RAM', value: 'DDR4, 16 GB' },
        { label: 'SSD Storage', value: 'NVMe M.2, 512 GB' },
        { label: 'Display Panel', value: '24" IPS Panel' },
        { label: 'Operating System', value: 'Windows 11 PRO' }
      ],
      fullSpecs: [
        { label: 'Processor', value: 'Intel® Core™ i5-14400 (14th Generation)' },
        { label: 'Motherboard', value: 'H610M' },
        { label: 'RAM', value: 'DDR4, 16 GB' },
        { label: 'SSD', value: 'NVMe M.2, 512 GB' },
        { label: 'Monitor', value: '24" IPS Panel' },
        { label: 'Keyboard', value: 'Full size keyboard' },
        { label: 'Mouse', value: 'Optical Wired Mouse' },
        { label: 'Operating system', value: 'Windows 11 PRO' },
        { label: 'Graphics', value: 'Intel® UHD Graphics 730' }
      ]
    },

    // 2. Desktop Computer
    {
      model_id: 2,
      category_id: 1,
      category_name: 'Computer',
      brand: 'INVO',
      model_no: 'INVO-DT14-i5',
      product_name: 'DESKTOP COMPUTER',
      warranty_month: 36,
      status: 1,
      icon: 'computer',
      imageUrl: '/images/products/INVO_desktop_computer.png',
      badge: '14th Gen Tower PC',
      tagline: 'Intel Core i5-14400 • H610M • 16GB DDR4 • 512GB NVMe M.2 • 24" IPS Monitor',
      keySpecs: [
        { label: 'Processor', value: 'Intel® Core™ i5-14400 (14th Generation)' },
        { label: 'Motherboard', value: 'H610M' },
        { label: 'RAM', value: 'DDR4, 16 GB' },
        { label: 'SSD Storage', value: 'NVMe M.2, 512 GB' },
        { label: 'Monitor Screen', value: '24" IPS Panel' },
        { label: 'Operating System', value: 'Windows 11 PRO' }
      ],
      fullSpecs: [
        { label: 'Processor', value: 'Intel® Core™ i5-14400 (14th Generation)' },
        { label: 'Motherboard', value: 'H610M' },
        { label: 'RAM', value: 'DDR4, 16 GB' },
        { label: 'SSD', value: 'NVMe M.2, 512 GB' },
        { label: 'Monitor', value: '24" IPS Panel' },
        { label: 'Keyboard', value: 'Full size keyboard' },
        { label: 'Mouse', value: 'Optical Wired Mouse' },
        { label: 'Operating system', value: 'Windows 11 PRO' },
        { label: 'Graphics', value: 'Intel® UHD Graphics 730' }
      ]
    },

    // 3. LED TELEVISION
    {
      model_id: 3,
      category_id: 3,
      category_name: 'TV',
      brand: 'Visio World',
      model_no: 'VW-32QLED',
      product_name: 'LED TELEVISION',
      warranty_month: 24,
      status: 1,
      icon: 'tv',
      imageUrl: '/images/products/Led_TELEVISON.png',
      badge: '32" HD QLED TV',
      tagline: '32 Inch HD QLED • IPS Technology • HDMI & USB • Aspect Ratio 16:9 • 60 Hz',
      keySpecs: [
        { label: 'Screen Size', value: '32 Inches' },
        { label: 'Brand', value: 'Visio World' },
        { label: 'Display Technology', value: 'QLED with IPS technology' },
        { label: 'Resolution', value: '720p HD' },
        { label: 'Refresh Rate', value: '60 Hz' },
        { label: 'Connectivity', value: 'HDMI, USB' }
      ],
      fullSpecs: [
        { label: 'Screen Size', value: '32 Inches' },
        { label: 'Brand', value: 'Visio World' },
        { label: 'Display Technology', value: 'QLED' },
        { label: 'Resolution', value: '720p' },
        { label: 'Refresh Rate', value: '60 Hz' },
        { label: 'Special Feature', value: '32 Inch HD QLED, with IPS technology display.' },
        { label: 'Connectivity', value: 'HDMI, USB' },
        { label: 'Aspect Ratio', value: '16:9' },
        { label: 'Product Dimensions', value: '15D x 72W x 47H Centimeters' },
        { label: 'Included Components', value: '1 NUMBER TV UNIT, 1 NUMBER REMOTE CONTROL, 1 NUMBER POWER CORD, 1 NUMBER USER MANUAL, 2 NUMBER STANDS, 4 NUMBER STAND SCREW' }
      ]
    },

    // 4. Monitor
    {
      model_id: 4,
      category_id: 2,
      category_name: 'Monitor',
      brand: 'INVO',
      model_no: 'INVO-MON24-FHD',
      product_name: '24" IPS MONITOR',
      warranty_month: 36,
      status: 1,
      icon: 'monitor',
      badge: '24" FHD IPS 75Hz',
      tagline: '24" FHD (1920x1080) • IPS LCD • 100Hz Supported • Anti-Glare • 250 Nits',
      keySpecs: [
        { label: 'Native Resolution', value: 'FHD (1920 x 1080) [1,2]' },
        { label: 'Panel Technology', value: 'IPS; LCD (16:9)' },
        { label: 'Screen Treatment', value: 'Anti-glare' },
        { label: 'Refresh Rate', value: 'Up to 100 Hz' },
        { label: 'Brightness', value: '250 nits [1]' },
        { label: 'Power Consumption', value: '31 W (max), 16 W (typical), 0.5 W (standby)' }
      ],
      fullSpecs: [
        { label: 'Native resolution', value: 'FHD (1920 x 1080) [1,2]' },
        { label: 'Panel technology', value: 'IPS; LCD' },
        { label: 'Aspect ratio', value: '16:9 [1]' },
        { label: 'Screen treatment', value: 'Anti-glare' },
        { label: 'Resolutions supported', value: '640 x 480 @ 60/75 Hz; 720 x 400 @ 70 Hz; 800 x 600 @ 60/75 Hz; 1024 x 768 @ 60/75 Hz; 1280 x 720 @ 50/60/100 Hz; 1280 x 1024 @ 60/75 Hz; 1440 x 900 @ 60 Hz; 1600 x 900 @ 60 Hz; 1680 x 1050 @ 60 Hz; 1920 x 1080 @ 50/60/100 Hz; 1280 x 800 @ 60 Hz' },
        { label: 'Brightness', value: '250 nits [1]' },
        { label: 'Power', value: '100 - 240 VAC 50/60 Hz' },
        { label: 'Power consumption', value: '31 W (maximum), 16 W (typical), 0.5 W (standby)' },
        { label: "What's in the box", value: 'Monitor; HDMI cable; AC power cable; Quick Setup Poster [4]' }
      ]
    },

    // 5. Interactive Panel
    {
      model_id: 5,
      category_id: 4,
      category_name: 'Interactive Panel',
      brand: 'INVO',
      model_no: 'INVO-IFP75-4K',
      product_name: '75" 4K INTERACTIVE PANEL',
      warranty_month: 36,
      status: 1,
      icon: 'touch_app',
      imageUrl: '/images/products/INTERACTIVE_TOUCH_PANAL_DISPLAY.png',
      badge: '75" 4K Touch Panel',
      tagline: '75 Inch Direct-Lit 4K UHD • 450 Nits • 8-Core CPU • 8GB/64GB • Dual Pen Included',
      keySpecs: [
        { label: 'Display Panel Size', value: '75 Inches Diagonal (Direct-lit LED)' },
        { label: 'Resolution', value: '4K UHD - 3840 x 2160 Pixels' },
        { label: 'Display Brightness', value: '450 Nits' },
        { label: 'Touch Interface', value: 'Infrared (IR) Touch & Pen Driven' },
        { label: 'CPU & Memory', value: '8 Cores, 8 GB RAM, 64 GB SSD Storage' },
        { label: 'Connectivity & OPS', value: 'Slot for OPS, 3x HDMI In, 1x HDMI Out, Bluetooth' }
      ],
      fullSpecs: [
        { label: 'Display Type', value: 'Anti-Glare LCD with Direct-lit LED' },
        { label: 'Minimum Display Panel Size Diagonal', value: '75 Inches' },
        { label: 'Minimum Display Resolution', value: '4K UHD - 3840 x 2160 Pixels' },
        { label: 'Display Brightness', value: '450 Nits' },
        { label: 'Touch Interface', value: 'Touch Sensitive as well as Pen Driven' },
        { label: 'Touch technology', value: 'Infrared (IR)' },
        { label: 'Type of CPU', value: 'Inbuilt CPU with Slot Provision for Open pluggable Specification (OPS)' },
        { label: 'Number of Cores', value: '8' },
        { label: 'Memory', value: '8 GB' },
        { label: 'SSD Storage Capacity', value: '64 GB' },
        { label: 'Provision of Slot for OPS', value: 'Yes' },
        { label: 'Number of Input HDMI Ports', value: '3' },
        { label: 'Number of Output HDMI Ports', value: '1' },
        { label: 'Mounting', value: 'Wall Mount' },
        { label: 'Availability of Bluetooth', value: 'Yes. Inbuilt' },
        { label: 'Number of Electronic Pen or Stylus', value: '2' }
      ]
    },

    // 6. LED Bulb
    {
      model_id: 6,
      category_id: 5,
      category_name: 'LED Bulb',
      brand: 'INVO',
      model_no: 'INVO-B09W-HV',
      product_name: '9W ECO LED BULB',
      warranty_month: 12,
      status: 1,
      icon: 'lightbulb',
      imageUrl: '/images/products/LED_BULB.png',
      badge: '9W High Surge LED',
      tagline: '9W (56.67W Equivalent) • B22D Base • 400V High Voltage & 4kV Surge Protection',
      keySpecs: [
        { label: 'Light Type', value: 'LED' },
        { label: 'Wattage', value: '9 Watts (56.67 Watts Incandescent Equivalent)' },
        { label: 'Protection', value: '400 Volts High Voltage & 4kV Surge Protection' },
        { label: 'Certification', value: 'BIS and BEE certified' },
        { label: 'Base & Shape', value: 'B22D Base, A19 Shape' },
        { label: 'Light Colour & Voltage', value: 'White (Cool Daylight), 240 Volts' }
      ],
      fullSpecs: [
        { label: 'Light Type', value: 'LED' },
        { label: 'Special Feature', value: '400 Volts High Voltage protection, 4kV Surge protection, BIS and BEE certified' },
        { label: 'Wattage', value: '9 Watts' },
        { label: 'Bulb Shape Size', value: 'A19' },
        { label: 'Bulb Base', value: 'B22D' },
        { label: 'Incandescent Equivalent', value: '56.67 Watts' },
        { label: 'Light Colour', value: 'White' },
        { label: 'Voltage', value: '240 Volts' },
        { label: 'Net Quantity', value: '1 Count' }
      ]
    }
  ];

  ngOnInit() {}

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

  get filteredProducts(): ProductModel[] {
    return this.products.filter(p => {
      const matchesCat = this.selectedCategory === 'All' || (p.category_name || '').toLowerCase() === this.selectedCategory.toLowerCase();
      const q = this.searchQuery.trim().toLowerCase();
      const matchesQuery = !q || (
        p.product_name.toLowerCase().includes(q) ||
        p.model_no.toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.tagline || '').toLowerCase().includes(q)
      );
      return matchesCat && matchesQuery;
    });
  }

  openSpecsModal(product: ProductModel) {
    this.selectedProductForModal = product;
    document.body.style.overflow = 'hidden';
  }

  closeSpecsModal() {
    this.selectedProductForModal = null;
    document.body.style.overflow = 'auto';
  }
}
