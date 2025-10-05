import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductStatus, Category, Supplier, SupplierStatus } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([]);
  private categoriesSignal = signal<Category[]>([]);
  private suppliersSignal = signal<Supplier[]>([]);

  // Mock data
  private mockCategories: Category[] = [
    { id: '1', name: 'Électronique', description: 'Appareils électroniques', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'Vêtements', description: 'Vêtements et accessoires', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Alimentation', description: 'Produits alimentaires', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Mobilier', description: 'Meubles et décoration', createdAt: new Date(), updatedAt: new Date() }
  ];

  private mockSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Dakar Tech Solutions',
      email: 'contact@dakartech.sn',
      phone: '+221 33 824 15 67',
      address: 'Avenue Cheikh Anta Diop, Immeuble Kebe',
      city: 'Dakar',
      country: 'Sénégal',
      website: 'www.dakartech.sn',
      contactPerson: 'Mamadou Diop',
      status: SupplierStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Teranga Distribution',
      email: 'info@teranga-distrib.sn',
      phone: '+221 77 123 45 67',
      address: 'Route de Rufisque, Zone Industrielle',
      city: 'Dakar',
      country: 'Sénégal',
      website: 'www.teranga-distrib.sn',
      contactPerson: 'Fatou Sall',
      status: SupplierStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Sahel Commerce',
      email: 'commercial@sahelcommerce.sn',
      phone: '+221 78 456 78 90',
      address: 'Boulevard du Centenaire, Plateau',
      city: 'Dakar',
      country: 'Sénégal',
      website: 'www.sahelcommerce.sn',
      contactPerson: 'Ousmane Ndiaye',
      status: SupplierStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Touba Trading',
      email: 'contact@toubatrading.sn',
      phone: '+221 76 234 56 78',
      address: 'Marché Sandaga, Allée 12',
      city: 'Dakar',
      country: 'Sénégal',
      contactPerson: 'Cheikh Fall',
      status: SupplierStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Ordinateur Portable HP',
      description: 'Ordinateur portable 15 pouces, 8GB RAM, 256GB SSD',
      sku: 'HP-LAP-001',
      barcode: '1234567890123',
      categoryId: '1',
      supplierId: '1',
      unitPrice: 799.99,
      costPrice: 600,
      quantity: 25,
      minQuantity: 5,
      maxQuantity: 50,
      unit: 'pièce',
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Souris Sans Fil Logitech',
      description: 'Souris ergonomique sans fil avec batterie longue durée',
      sku: 'LOG-MOU-002',
      barcode: '1234567890124',
      categoryId: '1',
      supplierId: '1',
      unitPrice: 29.99,
      costPrice: 15,
      quantity: 150,
      minQuantity: 20,
      maxQuantity: 200,
      unit: 'pièce',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'T-Shirt Coton Bio',
      description: 'T-shirt en coton biologique, plusieurs couleurs disponibles',
      sku: 'TSH-COT-003',
      barcode: '1234567890125',
      categoryId: '2',
      supplierId: '2',
      unitPrice: 19.99,
      costPrice: 8,
      quantity: 8,
      minQuantity: 10,
      maxQuantity: 100,
      unit: 'pièce',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Clavier Mécanique RGB',
      description: 'Clavier mécanique avec rétroéclairage RGB personnalisable',
      sku: 'KEY-MEC-004',
      barcode: '1234567890126',
      categoryId: '1',
      supplierId: '1',
      unitPrice: 89.99,
      costPrice: 50,
      quantity: 0,
      minQuantity: 10,
      maxQuantity: 50,
      unit: 'pièce',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Chaise de Bureau Ergonomique',
      description: 'Chaise de bureau avec support lombaire et accoudoirs réglables',
      sku: 'CHR-ERG-005',
      barcode: '1234567890127',
      categoryId: '4',
      supplierId: '2',
      unitPrice: 249.99,
      costPrice: 150,
      quantity: 12,
      minQuantity: 5,
      maxQuantity: 30,
      unit: 'pièce',
      imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
      status: ProductStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.productsSignal.set(this.mockProducts);
    this.categoriesSignal.set(this.mockCategories);
    this.suppliersSignal.set(this.mockSuppliers);
  }

  get products() {
    return this.productsSignal.asReadonly();
  }

  get categories() {
    return this.categoriesSignal.asReadonly();
  }

  get suppliers() {
    return this.suppliersSignal.asReadonly();
  }

  getProducts(): Observable<Product[]> {
    return of(this.productsSignal()).pipe(delay(300));
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.productsSignal().find(p => p.id === id);
    return of(product).pipe(delay(200));
  }

  addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.productsSignal.update(products => [...products, newProduct]);
    return of(newProduct).pipe(delay(300));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    const index = this.productsSignal().findIndex(p => p.id === id);
    if (index !== -1) {
      const updatedProduct = {
        ...this.productsSignal()[index],
        ...product,
        updatedAt: new Date()
      };
      
      this.productsSignal.update(products => {
        const newProducts = [...products];
        newProducts[index] = updatedProduct;
        return newProducts;
      });
      
      return of(updatedProduct).pipe(delay(300));
    }
    
    throw new Error('Product not found');
  }

  deleteProduct(id: string): Observable<void> {
    this.productsSignal.update(products => products.filter(p => p.id !== id));
    return of(void 0).pipe(delay(300));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categoriesSignal()).pipe(delay(200));
  }

  getSuppliers(): Observable<Supplier[]> {
    return of(this.suppliersSignal()).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.productsSignal().filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.sku.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(200));
  }

  getLowStockProducts(): Observable<Product[]> {
    const lowStock = this.productsSignal().filter(p => p.quantity <= p.minQuantity);
    return of(lowStock).pipe(delay(200));
  }
}
