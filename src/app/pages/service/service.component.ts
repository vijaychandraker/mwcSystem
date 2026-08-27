import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service',
  imports: [CommonModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  services = [
    { icon: 'build', title: 'Installation', desc: 'Professional installation by trained technicians at your doorstep.' },
    { icon: 'engineering', title: 'Annual Maintenance', desc: 'Comprehensive AMC plans to keep your products running efficiently.' },
    { icon: 'swap_horiz', title: 'Filter Replacement', desc: 'Timely filter and cartridge replacements with genuine parts.' },
    { icon: 'local_shipping', title: 'Doorstep Service', desc: 'Convenient home service with scheduled appointments.' },
    { icon: 'tune', title: 'Water Quality Testing', desc: 'Free water quality analysis and purifier recommendations.' },
    { icon: 'recycling', title: 'Product Upgrade', desc: 'Exchange old products for new with attractive trade-in offers.' }
  ];
}
