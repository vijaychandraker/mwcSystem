import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class FeaturesComponent {
  features = [
    {
      icon: 'verified_user',
      title: '1 Year Warranty',
      description: 'All products come with comprehensive 1-year warranty coverage.',
      color: '#0ea5e9'
    },
    {
      icon: 'settings_suggest',
      title: 'Genuine Parts',
      description: 'We use only 100% genuine and certified replacement parts.',
      color: '#10b981'
    },
    {
      icon: 'support_agent',
      title: 'Expert Support',
      description: '24/7 dedicated customer support from trained professionals.',
      color: '#8b5cf6'
    },
    {
      icon: 'task_alt',
      title: 'Easy Claims',
      description: 'Hassle-free warranty claims with quick processing.',
      color: '#f59e0b'
    }
  ];
}
