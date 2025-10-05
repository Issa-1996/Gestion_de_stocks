import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Supplier } from '../../core/models/product.model';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Fournisseurs</h1>
        <button class="btn-primary">+ Nouveau Fournisseur</button>
      </div>

      <div class="suppliers-list">
        @for (supplier of suppliers(); track supplier.id) {
          <div class="supplier-card">
            <div class="supplier-header">
              <div class="supplier-avatar">{{ supplier.name.charAt(0) }}</div>
              <div class="supplier-info">
                <h3>{{ supplier.name }}</h3>
                <p>{{ supplier.contactPerson }}</p>
              </div>
              <span class="status-badge" [class]="supplier.status.toLowerCase()">{{ getStatusLabel(supplier.status) }}</span>
            </div>
            <div class="supplier-details">
              <div class="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{{ supplier.email }}</span>
              </div>
              <div class="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ supplier.phone }}</span>
              </div>
              <div class="detail-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>{{ supplier.city }}, {{ supplier.country }}</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .suppliers-list { display: flex; flex-direction: column; gap: 16px; }
    .supplier-card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .supplier-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .supplier-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; }
    .supplier-info { flex: 1; }
    .supplier-info h3 { font-size: 18px; font-weight: 600; color: #1a202c; margin: 0 0 4px 0; }
    .supplier-info p { font-size: 14px; color: #718096; margin: 0; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.active { background: #e6f7f0; color: #10b981; }
    .status-badge.inactive { background: #ffe6e6; color: #ef4444; }
    .supplier-details { display: flex; flex-wrap: wrap; gap: 24px; }
    .detail-item { display: flex; align-items: center; gap: 8px; color: #718096; font-size: 14px; }
  `]
})
export class SuppliersComponent implements OnInit {
  suppliers = signal<Supplier[]>([]);

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getSuppliers().subscribe(suppliers => {
      this.suppliers.set(suppliers);
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'ACTIVE': 'Actif',
      'INACTIVE': 'Inactif'
    };
    return labels[status] || status;
  }
}
