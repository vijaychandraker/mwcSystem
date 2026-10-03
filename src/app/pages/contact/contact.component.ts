import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  emailContacts = [
    {
      icon: 'support_agent',
      label: 'Customer Support',
      value: 'support@invo.co.in',
      link: 'mailto:support@invo.co.in',
      tag: 'Helpdesk & Warranty'
    },
    {
      icon: 'storefront',
      label: 'Sales & Distribution',
      value: 'sales@invo.co.in',
      link: 'mailto:sales@invo.co.in',
      tag: 'Commercial & Orders'
    },
    {
      icon: 'info',
      label: 'General Information',
      value: 'info@invo.co.in',
      link: 'mailto:info@invo.co.in',
      tag: 'Inquiries & Info'
    },
    {
      icon: 'badge',
      label: 'Executive Contact',
      value: 'rajagrawal@invo.co.in',
      link: 'mailto:rajagrawal@invo.co.in',
      tag: 'Direct Line'
    }
  ];

  generalInfo = [
    { icon: 'phone', label: 'Toll-Free Phone', value: '1800-123-4567', link: 'tel:1800-123-4567' },
    { icon: 'location_on', label: 'Registered Office', value: 'Plot 42, Tech Park, Okhla Phase 3, Delhi / Bilaspur (CG)', link: '#' },
    { icon: 'schedule', label: 'Working Hours', value: 'Mon - Sat: 9:00 AM - 6:00 PM', link: '#' }
  ];

  get contactInfo() {
    return [...this.emailContacts, ...this.generalInfo];
  }
}
