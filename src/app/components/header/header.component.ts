import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMobileMenuOpen = false;
  isScrolled = false;
  isLoginDropdownOpen = false;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = typeof window !== 'undefined' ? window.scrollY > 15 : false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.login-menu-container')) {
      this.isLoginDropdownOpen = false;
    }
  }

  toggleLoginDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isLoginDropdownOpen = !this.isLoginDropdownOpen;
  }

  closeLoginDropdown() {
    this.isLoginDropdownOpen = false;
  }

  handleLogout(role: 'ADMIN' | 'DISTRIBUTOR') {
    this.closeLoginDropdown();
    this.closeMobileMenu();
    if (role === 'ADMIN') {
      this.authService.logoutAdmin();
    } else {
      this.authService.logoutDistributor();
    }
  }

  navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Warranty Check', path: '/warranty-check' },
    { label: 'Service', path: '/service' },
    { label: 'Contact Us', path: '/contact' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    this.isLoginDropdownOpen = false;
  }
}
