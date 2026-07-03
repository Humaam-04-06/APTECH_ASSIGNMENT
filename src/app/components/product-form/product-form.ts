import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() product: Product | null = null;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Omit<Product, 'id' | 'createdAt'>>();

  productForm: FormGroup;
  isSubmitAttempted = false;

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

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      supplier: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        category: this.product.category,
        price: this.product.price,
        quantity: this.product.quantity,
        supplier: this.product.supplier
      });
      this.isSubmitAttempted = false;
    } else if (changes['isOpen'] && this.isOpen && !this.product) {
      this.productForm.reset({
        name: '',
        category: '',
        price: null,
        quantity: null,
        supplier: ''
      });
      this.isSubmitAttempted = false;
    }
  }

  onSubmit(): void {
    this.isSubmitAttempted = true;
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const data: Omit<Product, 'id' | 'createdAt'> = {
        name: formValue.name.trim(),
        category: formValue.category,
        price: Number(formValue.price),
        quantity: Number(formValue.quantity),
        supplier: formValue.supplier.trim()
      };
      this.save.emit(data);
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
