import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { InventoryService } from '../../core/services/inventory.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { TransactionType } from '../../core/models/inventory.model';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-stock-out',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Sorties de Stock</h1>
        <button class="btn-primary" (click)="openModal()">+ Nouvelle Sortie</button>
      </div>

      <!-- Statistiques -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ todayOuts() }}</h3>
            <p>Sorties aujourd'hui</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon danger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ lowStockCount() }}</h3>
            <p>Produits en stock faible</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ totalValue() | number:'1.2-2' }} FCFA</h3>
            <p>Valeur des sorties</p>
          </div>
        </div>
      </div>

      <!-- Liste des sorties récentes -->
      <div class="transactions-section">
        <h2>Historique des Sorties</h2>
        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Référence</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Type</th>
                <th>Motif</th>
                <th>Utilisateur</th>
              </tr>
            </thead>
            <tbody>
              @for (transaction of recentOuts(); track transaction.id) {
                <tr>
                  <td>{{ transaction.createdAt | date:'short' }}</td>
                  <td><strong>{{ transaction.reference }}</strong></td>
                  <td>{{ getProductName(transaction.productId) }}</td>
                  <td><span class="quantity-badge">{{ Math.abs(transaction.quantity) }}</span></td>
                  <td>
                    <span class="type-badge" [class]="getTypeClass(transaction.type)">
                      {{ getTypeLabel(transaction.type) }}
                    </span>
                  </td>
                  <td>{{ transaction.notes || '-' }}</td>
                  <td>Utilisateur #{{ transaction.userId }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de sortie de stock -->
      <app-modal [isOpen]="showModal()" [title]="'Nouvelle Sortie de Stock'" (close)="closeModal()">
        <form (ngSubmit)="onSubmit()" class="stock-out-form">
          <div class="form-group">
            <label>Produit *</label>
            <select [(ngModel)]="stockOut.productId" name="productId" required (change)="onProductChange()">
              <option value="">Sélectionner un produit...</option>
              @for (product of products(); track product.id) {
                <option [value]="product.id">
                  {{ product.name }} (Stock: {{ product.quantity }})
                </option>
              }
            </select>
          </div>

          @if (selectedProduct()) {
            <div class="product-info-box">
              <div class="info-row">
                <span class="label">Stock actuel:</span>
                <span class="value">{{ selectedProduct()?.quantity }} {{ selectedProduct()?.unit }}</span>
              </div>
              <div class="info-row">
                <span class="label">Prix unitaire:</span>
                <span class="value">{{ selectedProduct()?.unitPrice | number:'1.2-2' }} FCFA</span>
              </div>
            </div>
          }

          <div class="form-group">
            <label>Type de sortie *</label>
            <select [(ngModel)]="stockOut.type" name="type" required>
              <option value="SALE">Vente</option>
              <option value="RETURN">Retour fournisseur</option>
              <option value="ADJUSTMENT">Ajustement (perte/casse)</option>
              <option value="TRANSFER">Transfert</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Quantité *</label>
              <input 
                type="number" 
                [(ngModel)]="stockOut.quantity" 
                name="quantity" 
                min="1"
                [max]="selectedProduct()?.quantity || 999"
                required
                (input)="calculateTotal()"
              >
            </div>
            <div class="form-group">
              <label>Prix unitaire *</label>
              <input 
                type="number" 
                [(ngModel)]="stockOut.unitPrice" 
                name="unitPrice" 
                step="0.01"
                required
                (input)="calculateTotal()"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Référence</label>
            <input 
              type="text" 
              [(ngModel)]="stockOut.reference" 
              name="reference"
              placeholder="Généré automatiquement si vide"
            >
          </div>

          <div class="form-group">
            <label>Motif / Notes</label>
            <textarea 
              [(ngModel)]="stockOut.notes" 
              name="notes" 
              rows="3"
              placeholder="Raison de la sortie, détails..."
            ></textarea>
          </div>

          @if (stockOut.quantity > 0 && stockOut.unitPrice > 0) {
            <div class="total-box">
              <span class="total-label">Total:</span>
              <span class="total-value">{{ calculateTotal() | number:'1.2-2' }} FCFA</span>
            </div>
          }

          @if (errorMessage()) {
            <div class="error-message">{{ errorMessage() }}</div>
          }

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="closeModal()">Annuler</button>
            <button type="submit" class="btn-primary" [disabled]="!isFormValid()">
              Enregistrer la sortie
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { padding: 12px 24px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-secondary:hover { background: #f7fafc; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .stat-card { background: white; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-icon { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .stat-icon.warning { background: #fff4e6; color: #f59e0b; }
    .stat-icon.danger { background: #ffe6e6; color: #ef4444; }
    .stat-icon.info { background: #e6f0ff; color: #667eea; }
    .stat-content h3 { font-size: 28px; font-weight: 700; margin: 0 0 4px 0; color: #1a202c; }
    .stat-content p { margin: 0; color: #718096; font-size: 14px; }

    .transactions-section { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .transactions-section h2 { font-size: 20px; font-weight: 600; color: #1a202c; margin: 0 0 16px 0; }
    .transactions-table { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f7fafc; }
    th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #4a5568; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid #e2e8f0; transition: background 0.2s; }
    tbody tr:hover { background: #f7fafc; }
    td { padding: 16px; color: #2d3748; font-size: 14px; }
    
    .quantity-badge { padding: 4px 12px; background: #fff4e6; color: #f59e0b; border-radius: 12px; font-size: 13px; font-weight: 600; }
    .type-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .type-badge.sale { background: #e6f0ff; color: #667eea; }
    .type-badge.return { background: #ffe6e6; color: #ef4444; }
    .type-badge.adjustment { background: #fff4e6; color: #f59e0b; }
    .type-badge.transfer { background: #e6f7ff; color: #3b82f6; }

    .stock-out-form { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { font-weight: 600; color: #2d3748; font-size: 14px; }
    .form-group input, .form-group select, .form-group textarea { padding: 10px 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; transition: all 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: #667eea; box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1); }
    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }

    .product-info-box { background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .info-row:last-child { margin-bottom: 0; }
    .info-row .label { color: #718096; font-size: 14px; }
    .info-row .value { color: #1a202c; font-weight: 600; font-size: 14px; }

    .total-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
    .total-label { font-size: 16px; font-weight: 600; }
    .total-value { font-size: 24px; font-weight: 700; }

    .error-message { background: #fee; color: #c33; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #c33; font-size: 14px; }
  `]
})
export class StockOutComponent implements OnInit {
  products = signal<Product[]>([]);
  recentOuts = signal<any[]>([]);
  showModal = signal(false);
  selectedProduct = signal<Product | null>(null);
  errorMessage = signal('');
  todayOuts = signal(0);
  lowStockCount = signal(0);
  totalValue = signal(0);
  
  Math = Math;

  stockOut: any = {
    productId: '',
    type: 'SALE',
    quantity: 1,
    unitPrice: 0,
    reference: '',
    notes: ''
  };

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
      const lowStock = products.filter(p => p.quantity <= p.minQuantity && p.quantity > 0).length;
      this.lowStockCount.set(lowStock);
    });

    this.inventoryService.getTransactions().subscribe(transactions => {
      const outs = transactions.filter(t => 
        t.type === TransactionType.SALE || 
        t.type === TransactionType.RETURN ||
        t.type === TransactionType.ADJUSTMENT ||
        t.type === TransactionType.TRANSFER
      );
      this.recentOuts.set(outs);

      // Calculer les stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTransactions = outs.filter(t => {
        const tDate = new Date(t.createdAt);
        tDate.setHours(0, 0, 0, 0);
        return tDate.getTime() === today.getTime();
      });
      this.todayOuts.set(todayTransactions.length);

      const total = outs.reduce((sum, t) => sum + Math.abs(t.totalPrice), 0);
      this.totalValue.set(total);
    });
  }

  openModal(): void {
    this.resetForm();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.stockOut = {
      productId: '',
      type: 'SALE',
      quantity: 1,
      unitPrice: 0,
      reference: '',
      notes: ''
    };
    this.selectedProduct.set(null);
    this.errorMessage.set('');
  }

  onProductChange(): void {
    const product = this.products().find(p => p.id === this.stockOut.productId);
    this.selectedProduct.set(product || null);
    if (product) {
      this.stockOut.unitPrice = product.unitPrice;
    }
    this.errorMessage.set('');
  }

  calculateTotal(): number {
    return this.stockOut.quantity * this.stockOut.unitPrice;
  }

  isFormValid(): boolean {
    if (!this.stockOut.productId || !this.stockOut.quantity || !this.stockOut.unitPrice) {
      return false;
    }

    const product = this.selectedProduct();
    if (!product) return false;

    if (this.stockOut.quantity > product.quantity) {
      this.errorMessage.set(`Stock insuffisant ! Disponible: ${product.quantity}`);
      return false;
    }

    this.errorMessage.set('');
    return true;
  }

  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === productId);
    return product?.name || 'Produit inconnu';
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'SALE': 'Vente',
      'RETURN': 'Retour',
      'ADJUSTMENT': 'Ajustement',
      'TRANSFER': 'Transfert'
    };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    return type.toLowerCase();
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const user = this.authService.currentUser();
    const reference = this.stockOut.reference || `OUT-${Date.now()}`;

    const transaction = {
      productId: this.stockOut.productId,
      type: this.stockOut.type,
      quantity: -Math.abs(this.stockOut.quantity), // Négatif pour sortie
      unitPrice: this.stockOut.unitPrice,
      totalPrice: this.calculateTotal(),
      reference: reference,
      notes: this.stockOut.notes,
      userId: user?.id || '1'
    };

    this.inventoryService.addTransaction(transaction).subscribe({
      next: () => {
        // Mettre à jour le stock du produit
        const product = this.selectedProduct();
        if (product) {
          const newQuantity = product.quantity - this.stockOut.quantity;
          this.productService.updateProduct(product.id, { quantity: newQuantity }).subscribe();
        }
        
        this.loadData();
        this.closeModal();
        alert('Sortie de stock enregistrée avec succès !');
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage.set('Erreur lors de l\'enregistrement de la sortie');
      }
    });
  }
}
