import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  serialNumber = '';
  isSearching = false;
  searchResult: { found: boolean; message: string; status?: string; daysRemaining?: number } | null = null;

  checkWarranty() {
    if (!this.serialNumber.trim()) return;

    this.isSearching = true;
    this.searchResult = null;

    // Simulate API call
    setTimeout(() => {
      this.isSearching = false;
      if (this.serialNumber.toUpperCase().startsWith('MWC')) {
        this.searchResult = {
          found: true,
          message: 'Warranty Active',
          status: 'Active',
          daysRemaining: 245
        };
      } else {
        this.searchResult = {
          found: false,
          message: 'No product found with this serial number. Please check and try again.'
        };
      }
    }, 1500);
  }

  clearSearch() {
    this.serialNumber = '';
    this.searchResult = null;
  }
}
