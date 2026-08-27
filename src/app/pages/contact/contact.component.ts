import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  isSubmitted = false;

  contactInfo = [
    { icon: 'phone', label: 'Phone', value: '1800-123-4567', link: 'tel:1800-123-4567' },
    { icon: 'email', label: 'Email', value: 'support@mwcsystem.com', link: 'mailto:support@mwcsystem.com' },
    { icon: 'location_on', label: 'Address', value: 'Mumbai, Maharashtra, India', link: '#' },
    { icon: 'schedule', label: 'Working Hours', value: 'Mon - Sat: 9AM - 6PM', link: '#' }
  ];

  submitForm() {
    if (!this.formData.name || !this.formData.email || !this.formData.message) return;

    this.isSubmitting = true;

    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;
      this.formData = { name: '', email: '', phone: '', subject: '', message: '' };
    }, 1500);
  }
}
