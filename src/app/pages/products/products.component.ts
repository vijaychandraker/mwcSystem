import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = [
    {
      name: 'MWC AquaPure 500',
      category: 'RO Water Purifier',
      price: '₹12,999',
      icon: 'water_drop',
      features: ['7-Stage Purification', 'TDS Controller', '8L Storage'],
      badge: 'Best Seller'
    },
    {
      name: 'MWC CrystalClear 300',
      category: 'UV Water Purifier',
      price: '₹8,499',
      icon: 'opacity',
      features: ['UV+UF Technology', 'Auto-Shut Off', '6L Storage'],
      badge: 'Popular'
    },
    {
      name: 'MWC ProClean 700',
      category: 'RO+UV+UF Purifier',
      price: '₹18,999',
      icon: 'local_drink',
      features: ['9-Stage Purification', 'Mineral Cartridge', '10L Storage'],
      badge: 'Premium'
    },
    {
      name: 'MWC SmartFlow 200',
      category: 'Gravity Water Purifier',
      price: '₹3,999',
      icon: 'filter_alt',
      features: ['Non-Electric', 'Sediment Filter', '16L Storage'],
      badge: 'Value'
    },
    {
      name: 'MWC Industrial Pro',
      category: 'Commercial Purifier',
      price: '₹49,999',
      icon: 'precision_manufacturing',
      features: ['High Capacity', 'Industrial Grade', '50L/hr Output'],
      badge: 'Commercial'
    },
    {
      name: 'MWC TankGuard',
      category: 'Water Tank Cleaner',
      price: '₹6,999',
      icon: 'cleaning_services',
      features: ['Auto Cleaning', 'UV Sterilization', 'Smart Timer'],
      badge: 'New'
    }
  ];
}
