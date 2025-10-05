import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../core/services/inventory.service';
import { InventoryTransaction } from '../../core/models/inventory.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Transactions d'Inventaire</h1>
        <button class="btn-primary">+ Nouvelle Transaction</button>
      </div>

      <div class="transactions-table">
        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Type</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            @for (transaction of transactions(); track transaction.id) {
              <tr>
                <td><strong>{{ transaction.reference }}</strong></td>
                <td>
                  <span class="type-badge" [class]="getTypeClass(transaction.type)">
                    {{ getTypeLabel(transaction.type) }}
                  </span>
                </td>
                <td>Produit #{{ transaction.productId }}</td>
                <td>{{ transaction.quantity }}</td>
                <td>{{ transaction.unitPrice | number:'1.2-2' }} FCFA</td>
                <td><strong>{{ transaction.totalPrice | number:'1.2-2' }} FCFA</strong></td>
                <td>{{ transaction.createdAt | date:'short' }}</td>
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
    .transactions-table { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead { background: #f7fafc; }
    th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #4a5568; text-transform: uppercase; }
    tbody tr { border-bottom: 1px solid #e2e8f0; transition: background 0.2s; }
    tbody tr:hover { background: #f7fafc; }
    td { padding: 16px; color: #2d3748; font-size: 14px; }
    .type-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .type-badge.purchase { background: #e6f7f0; color: #10b981; }
    .type-badge.sale { background: #e6f0ff; color: #667eea; }
    .type-badge.adjustment { background: #fff4e6; color: #f59e0b; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions = signal<InventoryTransaction[]>([]);

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.inventoryService.getTransactions().subscribe(transactions => {
      this.transactions.set(transactions);
    });
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'PURCHASE': 'Achat',
      'SALE': 'Vente',
      'ADJUSTMENT': 'Ajustement',
      'RETURN': 'Retour',
      'TRANSFER': 'Transfert'
    };
    return labels[type] || type;
  }

  getTypeClass(type: string): string {
    return type.toLowerCase();
  }
}
