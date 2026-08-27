import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

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
