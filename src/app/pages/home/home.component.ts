import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface CarouselSlide {
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  highlights: string[];
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface FeaturedProduct {
  name: string;
  category: string;
  model: string;
  warranty: string;
  tagline: string;
  image?: string;
  icon?: string;
  badge: string;
  specs: string[];
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  // Carousel Data
  currentSlide = 0;
  autoPlayTimer: any = null;
  isPaused = false;

  slides: CarouselSlide[] = [
    {
      tag: 'Next-Gen Computing',
      badge: '14th Gen Intel Core i5',
      title: 'ALL IN ONE PC & Workstations',
      subtitle: 'Sleek, bezel-less computing powered by Intel Core i5-14400, 16GB high-speed RAM, 512GB NVMe SSD, and 24" Full HD IPS Display.',
      image: '/images/banners/aio_pc_banner.jpg',
      alt: 'INVO All In One PC Executive Workstation',
      highlights: ['24" FHD IPS Display', '16GB DDR4 + 512GB NVMe', '3-Year Warranty'],
      primaryCtaText: 'Explore All Products',
      primaryCtaLink: '/products',
      secondaryCtaText: 'Check Warranty',
      secondaryCtaLink: '/warranty-check'
    },
    {
      tag: 'Smart Classrooms & Boardrooms',
      badge: 'Dual OS • 20-Point Multi-Touch',
      title: '75" 4K Interactive Flat Panel Display',
      subtitle: 'Transform presentations and digital education with 4K UHD Anti-Glare glass, Android 13 + Windows 11 Dual OS, and 48MP AI Auto-Tracking Camera.',
      image: '/images/banners/smart_panel_banner.jpg',
      alt: 'INVO 75 Inch Interactive Flat Panel Smart Boardroom',
      highlights: ['4K UHD Anti-Glare', '20-Point Multi-Touch', '48MP AI Camera'],
      primaryCtaText: 'View IFP Specs',
      primaryCtaLink: '/products',
      secondaryCtaText: 'Institutional Inquiry',
      secondaryCtaLink: '/contact'
    },
    {
      tag: 'Enterprise & Institutional PC',
      badge: 'Reliable Workhorse',
      title: 'INVO Commercial Desktop Computer',
      subtitle: 'Engineered for continuous heavy-duty business operation with Intel Core i5, 8GB DDR4, 512GB SSD, Gigabit LAN, and Windows 11 Pro.',
      image: '/images/banners/desktop_pc_banner.jpg',
      alt: 'INVO Desktop Computer Enterprise Setup',
      highlights: ['Intel Core i5 Processor', '512GB Solid State Drive', 'Windows 11 Pro Ready'],
      primaryCtaText: 'Check PC Configurations',
      primaryCtaLink: '/products',
      secondaryCtaText: 'Verify Serial Warranty',
      secondaryCtaLink: '/warranty-check'
    },
    {
      tag: 'Commercial & Home Entertainment',
      badge: 'Quantum Dot Clarity',
      title: '32" Frameless Smart QLED TV',
      subtitle: 'Immerse in true-to-life colors with Quantum Dot technology, cinematic Dolby Audio, Smart Quad-Core processor, and seamless wireless casting.',
      image: '/images/banners/qled_display_banner.jpg',
      alt: 'INVO Smart QLED TV Luxury Display',
      highlights: ['Quantum Dot QLED', 'Dolby Digital Audio', 'Frameless Bezel Design'],
      primaryCtaText: 'Explore Display Range',
      primaryCtaLink: '/products',
      secondaryCtaText: 'Bulk Enquiry',
      secondaryCtaLink: '/contact'
    }
  ];

  // Featured Products (from /products) - Only 3 top flagships shown on Home
  featuredProducts: FeaturedProduct[] = [
    {
      name: 'ALL IN ONE PC',
      category: 'Computer',
      model: 'INVO-AIO24-i5',
      warranty: '36 Months',
      tagline: 'Intel Core i5-14400 (14th Gen) • 16GB RAM • 512GB SSD • 24" IPS',
      image: '/images/products/all_in_one_pc.jpg',
      badge: '14th Gen i5',
      specs: ['Intel Core i5-14400', '16GB DDR4 RAM', '512GB NVMe SSD', '24" FHD IPS']
    },
    {
      name: '75" 4K Interactive Flat Panel',
      category: 'Interactive Panel',
      model: 'INVO-IFP75-4K',
      warranty: '36 Months',
      tagline: '75" 4K UHD • 20-Point Touch • Android 13 + Win 11 • 48MP AI Cam',
      image: '/images/products/INTERACTIVE_TOUCH_PANAL_DISPLAY.png',
      badge: '4K Touch',
      specs: ['75" 4K UHD Anti-Glare', 'Android 13 + Win 11', '8GB RAM + 128GB ROM', '48MP AI Camera']
    },
    {
      name: 'Desktop Computer',
      category: 'Computer',
      model: 'INVO-DESK-i5',
      warranty: '36 Months',
      tagline: 'Intel Core i5 • 8GB RAM • 512GB SSD • Windows 11 Pro',
      image: '/images/products/INVO_desktop_computer.png',
      badge: 'Enterprise',
      specs: ['Intel Core i5', '8GB DDR4 RAM', '512GB SSD', 'Windows 11 Pro']
    }
  ];

  // Services Mix (from /service)
  servicesList = [
    {
      icon: 'settings_suggest',
      title: 'Hardware Setup & Deployment',
      desc: 'Complete turnkey hardware provisioning, operating system imaging, and secure institutional network rollout.'
    },
    {
      icon: 'engineering',
      title: 'Annual Maintenance (AMC)',
      desc: 'Comprehensive annual AMC packages for educational campuses, government labs, and corporate offices.'
    },
    {
      icon: 'memory',
      title: 'Component Upgrades & Repairs',
      desc: 'Rapid RAM, SSD, and board-level repairs using 100% genuine INVO-certified replacement parts.'
    },
    {
      icon: 'support_agent',
      title: 'On-Site Technical Helpdesk',
      desc: 'Field engineers deployed for timely on-site diagnostics, scheduled preventive checks, and repairs.'
    }
  ];

  // About Snapshot (from /about)
  companyHighlights = [
    { number: '6+', label: 'Hardware Categories' },
    { number: '36 Mo', label: 'Max Warranty Coverage' },
    { number: '100%', label: 'Genuine Tested Parts' },
    { number: 'Pan-India', label: 'Institutional Delivery' }
  ];

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.startAutoPlay(); // reset timer on manual click
  }

  pauseSlide() {
    this.isPaused = true;
  }

  resumeSlide() {
    this.isPaused = false;
  }
}
