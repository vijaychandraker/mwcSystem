import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  stats = [
    { value: '10+', label: 'Years Experience' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '100+', label: 'Service Centers' },
    { value: '24/7', label: 'Support Available' }
  ];
}
