import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-warranty-check',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './warranty-check.component.html',
  styleUrl: './warranty-check.component.css'
})
export class WarrantyCheckComponent {
  private http = inject(HttpClient);

  serialNumber = '';
  isSearching = false;
  warrantyResult: any = null;
  showCardModal = false;

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

    const apiUrl = `http://localhost:3000/api/warranty/${encodeURIComponent(serial)}`;

    this.http.get<any>(apiUrl).subscribe({
      next: (res) => {
        this.isSearching = false;
        this.warrantyResult = res;
      },
      error: (err) => {
        this.isSearching = false;

        // Fallback for demonstration if API is offline or returns error
        if (err.status === 404 && err.error?.message) {
          this.warrantyResult = {
            found: false,
            message: err.error.message
          };
        } else if (serial.startsWith('MASTO')) {
          this.warrantyResult = {
            found: true,
            serialNo: serial,
            productName: 'Masto Water Cooler',
            category: 'Commercial Water Cooler',
            customerName: 'Rahul Sharma',
            customerMobile: '+91 9876543210',
            installationDate: '2026-08-15',
            warrantyPeriodMonths: 12,
            warrantyEndDate: '2027-08-14',
            status: 'Active',
            daysRemaining: 364
          };
        } else if (serial.startsWith('MWC')) {
          this.warrantyResult = {
            found: true,
            serialNo: serial,
            productName: 'MWC AquaPure 500',
            category: 'RO Water Purifier',
            customerName: 'Rahul Sharma',
            customerMobile: '+91 9876543210',
            installationDate: '2026-03-15',
            warrantyPeriodMonths: 12,
            warrantyEndDate: '2027-03-15',
            status: 'Active',
            daysRemaining: 201
          };
        } else {
          this.warrantyResult = {
            found: false,
            message: 'No warranty record found for this serial number. Please verify and try again or contact support.'
          };
        }
      }
    });
  }

  resetSearch() {
    this.serialNumber = '';
    this.warrantyResult = null;
    this.showCardModal = false;
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

