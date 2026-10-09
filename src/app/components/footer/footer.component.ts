import { Component, inject } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private router = inject(Router);
  currentYear = new Date().getFullYear();
  isPortalRoute = false;

  constructor() {
    this.checkRoute(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.urlAfterRedirects || event.url);
    });
  }

  private checkRoute(url: string) {
    this.isPortalRoute = url.includes('/admin') || url.includes('/distributor');
  }

  quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Warranty Check', path: '/warranty-check' }
  ];

  supportLinks = [
    { label: 'Service Centers', path: '/service' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'FAQs', path: '/contact' },
    { label: 'Terms & Conditions', path: '/about' }
  ];
}
