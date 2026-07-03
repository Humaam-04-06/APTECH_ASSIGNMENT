import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private db: any = null;
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      // Validate that placeholder credentials have been replaced
      if (!environment.firebase.apiKey || environment.firebase.apiKey === 'YOUR_API_KEY') {
        throw new Error('Firebase Config: Please replace placeholder credentials in environments/environment.ts.');
      }
      const app = initializeApp(environment.firebase);
      this.db = getFirestore(app);
      this.initRealtimeListener();
    } catch (err: any) {
      console.error('Firebase initialization error:', err);
      this.error.set(err.message || 'Firebase failed to initialize. Check configuration.');
      this.loading.set(false);
    }
  }

  private initRealtimeListener() {
    if (!this.db) return;

    try {
      const productsRef = collection(this.db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));

      onSnapshot(q, (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            name: data['name'],
            category: data['category'],
            price: Number(data['price']),
            quantity: Number(data['quantity']),
            supplier: data['supplier'],
            createdAt: data['createdAt']
          });
        });
        this.products.set(list);
        this.loading.set(false);
        this.error.set(null);
      }, (err) => {
        console.error('Firestore onSnapshot error:', err);
        this.error.set(err.message || 'Failed to sync database. Please verify your Firestore rules.');
        this.loading.set(false);
      });
    } catch (err: any) {
      console.error('Failed to set up Firestore listener:', err);
      this.error.set(err.message || 'Firestore connection failed.');
      this.loading.set(false);
    }
  }

  async addProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) {
      throw new Error('Database is not initialized.');
    }
    const productsRef = collection(this.db, 'products');
    await addDoc(productsRef, {
      ...product,
      createdAt: serverTimestamp()
    });
  }

  async updateProduct(id: string, product: Omit<Product, 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) {
      throw new Error('Database is not initialized.');
    }
    const docRef = doc(this.db, 'products', id);
    await updateDoc(docRef, {
      ...product
    });
  }

  async deleteProduct(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Database is not initialized.');
    }
    const docRef = doc(this.db, 'products', id);
    await deleteDoc(docRef);
  }
}
