import { Component, input, computed } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.css'
})
export class DashboardStatsComponent {
  products = input.required<Product[]>();

  totalProducts = computed(() => this.products().length);

  totalValue = computed(() => {
    return this.products().reduce((sum, p) => sum + (p.price * p.quantity), 0);
  });

  lowStockCount = computed(() => {
    return this.products().filter(p => p.quantity > 0 && p.quantity < 10).length;
  });

  outOfStockCount = computed(() => {
    return this.products().filter(p => p.quantity === 0).length;
  });

  categoryCount = computed(() => {
    const categories = this.products().map(p => p.category.toLowerCase().trim());
    return new Set(categories.filter(c => c !== '')).size;
  });
}
