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
    { icon: 'settings_suggest', title: 'Hardware Setup & Deployment', desc: 'Professional installation, OS deployment, and network integration at your institution or office.' },
    { icon: 'engineering', title: 'Annual Maintenance (AMC)', desc: 'Comprehensive AMC coverage for desktops, AIOs, interactive flat panels, and displays.' },
    { icon: 'memory', title: 'Component Upgrades & Repairs', desc: 'RAM, SSD, processor, and display replacements using certified genuine parts.' },
    { icon: 'home_repair_service', title: 'On-Site Technical Support', desc: 'Prompt doorstep and campus engineer visits with scheduled appointment tracking.' },
    { icon: 'speed', title: 'Diagnostics & Performance Tuning', desc: 'Hardware benchmarking, display calibration, and thermal health checks.' },
    { icon: 'devices', title: 'IT Lifecycle Upgrades', desc: 'Modernize legacy office and school IT infrastructure with scalable upgrade programs.' }
  ];
}
