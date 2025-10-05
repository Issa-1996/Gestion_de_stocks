import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductStatus } from '../../core/models/product.model';
import { UserRole } from '../../core/models/user.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestion des Produits</h1>
        @if (isAdmin()) {
          <button class="btn-primary" (click)="openAddModal()">+ Nouveau Produit</button>
        }
      </div>

      <div class="products-grid">
        @for (product of products(); track product.id) {
          <div class="product-card">
            <img [src]="product.imageUrl" [alt]="product.name" class="product-image">
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-sku">SKU: {{ product.sku }}</p>
              <div class="product-details">
                <span class="price">{{ product.unitPrice | number:'1.2-2' }} FCFA</span>
                <span class="stock" [class.low]="product.quantity <= product.minQuantity" [class.out]="product.quantity === 0">
                  Stock: {{ product.quantity }}
                </span>
              </div>
              @if (isAdmin()) {
                <div class="product-actions">
                  <button class="btn-icon btn-edit" (click)="openEditModal(product)" title="Modifier">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn-icon btn-delete" (click)="deleteProduct(product.id)" title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <app-modal [isOpen]="showModal()" [title]="editMode() ? 'Modifier le Produit' : 'Nouveau Produit'" (close)="closeModal()">
        <form (ngSubmit)="onSubmit()" class="product-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nom du produit *</label>
              <input type="text" [(ngModel)]="newProduct.name" name="name" required>
            </div>
            <div class="form-group">
              <label>SKU *</label>
              <input type="text" [(ngModel)]="newProduct.sku" name="sku" required>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="newProduct.description" name="description" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Catégorie *</label>
              <select [(ngModel)]="newProduct.categoryId" name="categoryId" required>
                <option value="">Sélectionner...</option>
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.name }}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label>Fournisseur *</label>
              <select [(ngModel)]="newProduct.supplierId" name="supplierId" required>
                <option value="">Sélectionner...</option>
                @for (sup of suppliers(); track sup.id) {
                  <option [value]="sup.id">{{ sup.name }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Prix d'achat *</label>
              <input type="number" [(ngModel)]="newProduct.costPrice" name="costPrice" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Prix de vente *</label>
              <input type="number" [(ngModel)]="newProduct.unitPrice" name="unitPrice" step="0.01" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Quantité initiale *</label>
              <input type="number" [(ngModel)]="newProduct.quantity" name="quantity" required>
            </div>
            <div class="form-group">
              <label>Stock minimum *</label>
              <input type="number" [(ngModel)]="newProduct.minQuantity" name="minQuantity" required>
            </div>
          </div>

          <div class="form-group">
            <label>URL de l'image</label>
            <input type="url" [(ngModel)]="newProduct.imageUrl" name="imageUrl" placeholder="https://...">
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary">Ajouter le produit</button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .btn-secondary { padding: 12px 24px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #f7fafc; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .product-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .product-image { width: 100%; height: 200px; object-fit: cover; }
    .product-info { padding: 16px; }
    .product-info h3 { font-size: 18px; font-weight: 600; color: #1a202c; margin: 0 0 8px 0; }
    .product-sku { font-size: 13px; color: #718096; margin: 0 0 12px 0; }
    .product-details { display: flex; justify-content: space-between; align-items: center; }
    .price { font-size: 20px; font-weight: 700; color: #667eea; }
    .stock { padding: 4px 12px; background: #e6f7f0; color: #10b981; border-radius: 12px; font-size: 13px; font-weight: 600; }
    .stock.low { background: #fff4e6; color: #f59e0b; }
    .stock.out { background: #ffe6e6; color: #ef4444; }
    
    .product-actions { display: flex; gap: 8px; margin-top: 12px; justify-content: center; }
    .btn-icon { padding: 8px; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .btn-edit { background: #e6f0ff; color: #667eea; }
    .btn-edit:hover { background: #667eea; color: white; }
    .btn-delete { background: #ffe6e6; color: #ef4444; }
    .btn-delete:hover { background: #ef4444; color: white; }
    
    .product-form { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-weight: 600; color: #2d3748; font-size: 14px; }
    .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
  `]
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<any[]>([]);
  suppliers = signal<any[]>([]);
  showModal = signal(false);
  editMode = signal(false);
  editingProductId = signal<string | null>(null);
  
  newProduct: any = {
    name: '',
    description: '',
    sku: '',
    categoryId: '',
    supplierId: '',
    unitPrice: 0,
    costPrice: 0,
    quantity: 0,
    minQuantity: 5,
    maxQuantity: 100,
    unit: 'pièce',
    imageUrl: '',
    status: ProductStatus.ACTIVE
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
    
    this.productService.getCategories().subscribe(categories => {
      this.categories.set(categories);
    });
    
    this.productService.getSuppliers().subscribe(suppliers => {
      this.suppliers.set(suppliers);
    });
  }

  isAdmin(): boolean {
    const user = this.authService.currentUser();
    return user?.role === UserRole.ADMIN;
  }

  openAddModal(): void {
    this.editMode.set(false);
    this.editingProductId.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  openEditModal(product: Product): void {
    this.editMode.set(true);
    this.editingProductId.set(product.id);
    this.newProduct = {
      name: product.name,
      description: product.description,
      sku: product.sku,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      unitPrice: product.unitPrice,
      costPrice: product.costPrice,
      quantity: product.quantity,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity,
      unit: product.unit,
      imageUrl: product.imageUrl,
      status: product.status
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editMode.set(false);
    this.editingProductId.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      sku: '',
      categoryId: '',
      supplierId: '',
      unitPrice: 0,
      costPrice: 0,
      quantity: 0,
      minQuantity: 5,
      maxQuantity: 100,
      unit: 'pièce',
      imageUrl: '',
      status: ProductStatus.ACTIVE
    };
  }

  deleteProduct(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadData();
          alert('Produit supprimé avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editMode()) {
      // Mode édition
      const productId = this.editingProductId();
      if (productId) {
        this.productService.updateProduct(productId, this.newProduct).subscribe({
          next: () => {
            this.loadData();
            this.closeModal();
            alert('Produit modifié avec succès !');
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification du produit');
          }
        });
      }
    } else {
      // Mode ajout
      this.productService.addProduct(this.newProduct).subscribe({
        next: (product) => {
          this.loadData();
          this.closeModal();
          alert('Produit ajouté avec succès !');
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du produit:', error);
          alert('Erreur lors de l\'ajout du produit');
        }
      });
    }
  }
}
