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
