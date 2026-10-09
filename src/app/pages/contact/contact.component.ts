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
      icon: 'info',
      label: 'General Information',
      value: 'info@invo.co.in',
      link: 'mailto:info@invo.co.in',
      tag: 'Inquiries & Info'
    }
  ];

  generalInfo = [
    { icon: 'phone', label: 'Toll-Free Phone', value: '0000-000-0000', link: 'tel:0000-000-0000' },
    { icon: 'location_on', label: 'Registered Office', value: 'BLOCK-A, Umiya Market, Near Madhav Timber, Bhanpuri, Raipur, C.G.- 492003', link: '#' },
    { icon: 'schedule', label: 'Working Hours', value: 'Mon - Sat: 10:00 AM - 6:00 PM', link: '#' }
  ];

  get contactInfo() {
    return [...this.emailContacts, ...this.generalInfo];
  }
}
