import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../core/services/sale.service';
import { Sale } from '../../core/models/sale.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Ventes</h1>
        <button class="btn-primary">+ Nouvelle Vente</button>
      </div>

      <div class="sales-table">
        <table>
          <thead>
            <tr>
              <th>N° Vente</th>
              <th>Client</th>
              <th>Articles</th>
              <th>Total</th>
              <th>Paiement</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            @for (sale of sales(); track sale.id) {
              <tr>
                <td><strong>{{ sale.saleNumber }}</strong></td>
                <td>{{ sale.customerId || 'Client anonyme' }}</td>
                <td>{{ sale.items.length }} article(s)</td>
                <td><strong>{{ sale.total | number:'1.2-2' }} FCFA</strong></td>
                <td>{{ getPaymentMethodLabel(sale.paymentMethod) }}</td>
                <td>
                  <span class="status-badge" [class]="sale.paymentStatus.toLowerCase()">
                    {{ getPaymentStatusLabel(sale.paymentStatus) }}
                  </span>
                </td>
                <td>{{ sale.createdAt | date:'short' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a202c; margin: 0; }
    .btn-primary { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .sales-table { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f7fafc; }
    th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #4a5568; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid #e2e8f0; transition: background 0.2s; }
    tbody tr:hover { background: #f7fafc; }
    td { padding: 16px; color: #2d3748; font-size: 14px; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.paid { background: #e6f7f0; color: #10b981; }
    .status-badge.pending { background: #fff4e6; color: #f59e0b; }
    .status-badge.cancelled { background: #ffe6e6; color: #ef4444; }
  `]
})
export class SalesComponent implements OnInit {
  sales = signal<Sale[]>([]);

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.saleService.getSales().subscribe(sales => {
      this.sales.set(sales);
    });
  }

  getPaymentMethodLabel(method: string): string {
    const labels: any = {
      'CASH': 'Espèces',
      'CARD': 'Carte bancaire',
      'MOBILE_MONEY': 'Mobile Money',
      'BANK_TRANSFER': 'Virement bancaire',
      'CHECK': 'Chèque'
    };
    return labels[method] || method;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: any = {
      'PENDING': 'En attente',
      'PAID': 'Payé',
      'PARTIAL': 'Partiel',
      'CANCELLED': 'Annulé'
    };
    return labels[status] || status;
  }
}
