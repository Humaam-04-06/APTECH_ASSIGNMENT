import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from './models/product.model';
import { ProductService } from './services/product.service';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats';
import { ProductFormComponent } from './components/product-form/product-form';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    DashboardStatsComponent, 
    ProductFormComponent, 
    ConfirmationModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly productService = inject(ProductService);

  // Filter & Search Signals
  searchText = signal('');
  selectedCategory = signal('');
  stockFilter = signal('all');
  
  // Sorting Signals
  sortBy = signal('createdAt');
  sortDirection = signal<'asc' | 'desc'>('desc');

  // Modal States
  isFormOpen = false;
  selectedProduct: Product | null = null;
  
  isConfirmOpen = false;
  productToDelete: Product | null = null;

  // Operation States (to show progress during Firebase calls)
  isSubmitting = false;
  operationError: string | null = null;

  categories = [
    'Electronics',
    'Clothing & Apparel',
    'Home & Kitchen',
    'Sports & Outdoors',
    'Books & Stationary',
    'Beauty & Cosmetics',
    'Automotive',
    'Office Supplies',
    'Toys & Games',
    'Others'
  ];

  // Computed signal for filtered and sorted products
  filteredProducts = computed(() => {
    let list = this.productService.products();

    // 1. Search filter (by name or supplier)
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.supplier.toLowerCase().includes(search)
      );
    }

    // 2. Category filter
    const cat = this.selectedCategory();
    if (cat) {
      list = list.filter(p => p.category === cat);
    }

    // 3. Stock filter
    const stock = this.stockFilter();
    if (stock === 'in') {
      list = list.filter(p => p.quantity >= 10);
    } else if (stock === 'low') {
      list = list.filter(p => p.quantity > 0 && p.quantity < 10);
    } else if (stock === 'out') {
      list = list.filter(p => p.quantity === 0);
    }

    // 4. Sorting
    const sortField = this.sortBy();
    const sortDir = this.sortDirection();
    
    return [...list].sort((a, b) => {
      let valA = a[sortField as keyof Product];
      let valB = b[sortField as keyof Product];

      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  // Modal Handlers
  openAddModal(): void {
    this.selectedProduct = null;
    this.operationError = null;
    this.isFormOpen = true;
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.operationError = null;
    this.isFormOpen = true;
  }

  closeFormModal(): void {
    this.isFormOpen = false;
    this.selectedProduct = null;
  }

  openDeleteConfirm(product: Product): void {
    this.productToDelete = product;
    this.operationError = null;
    this.isConfirmOpen = true;
  }

  closeDeleteConfirm(): void {
    this.isConfirmOpen = false;
    this.productToDelete = null;
  }

  // Firebase Operations
  async onSaveProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
    this.isSubmitting = true;
    this.operationError = null;
    try {
      if (this.selectedProduct && this.selectedProduct.id) {
        await this.productService.updateProduct(this.selectedProduct.id, productData);
      } else {
        await this.productService.addProduct(productData);
      }
      this.closeFormModal();
    } catch (err: any) {
      console.error('Failed to save product:', err);
      this.operationError = err.message || 'An error occurred while saving the product.';
    } finally {
      this.isSubmitting = false;
    }
  }

  async onConfirmDelete(): Promise<void> {
    if (!this.productToDelete || !this.productToDelete.id) return;
    
    this.isSubmitting = true;
    this.operationError = null;
    try {
      await this.productService.deleteProduct(this.productToDelete.id);
      this.closeDeleteConfirm();
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      this.operationError = err.message || 'An error occurred while deleting the product.';
    } finally {
      this.isSubmitting = false;
    }
  }

  // Sort Handler
  toggleSort(field: string): void {
    if (this.sortBy() === field) {
      // Toggle direction
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
  }

  // Stock status helper
  getStockBadgeClass(qty: number): string {
    if (qty === 0) return 'badge-out-of-stock';
    if (qty < 10) return 'badge-low-stock';
    return 'badge-in-stock';
  }

  getStockLabel(qty: number): string {
    if (qty === 0) return 'Out of Stock';
    if (qty < 10) return 'Low Stock';
    return 'In Stock';
  }
}
