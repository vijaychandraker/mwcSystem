import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
  private router = inject(Router);

  serialNumber = '';
  isSearching = false;
  searchResult: { found: boolean; message: string; status?: string; daysRemaining?: number } | null = null;

  checkWarranty() {
    const serial = this.serialNumber.trim();
    if (!serial) return;
    this.router.navigate(['/warranty-check'], { queryParams: { serial } });
  }

  clearSearch() {
    this.serialNumber = '';
    this.searchResult = null;
  }
}
