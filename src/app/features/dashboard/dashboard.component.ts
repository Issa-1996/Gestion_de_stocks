import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { InventoryService } from '../../core/services/inventory.service';
import { SaleService } from '../../core/services/sale.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = signal({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalRevenue: 0,
    todaySales: 0
  });

  recentTransactions = signal<any[]>([]);
  alerts = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private saleService: SaleService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    // Load products stats
    this.productService.getProducts().subscribe(products => {
      const lowStock = products.filter(p => p.quantity <= p.minQuantity && p.quantity > 0).length;
      const outOfStock = products.filter(p => p.quantity === 0).length;

      this.stats.update(s => ({
        ...s,
        totalProducts: products.length,
        lowStock,
        outOfStock
      }));
    });

    // Load revenue
    this.saleService.getTotalRevenue().subscribe(revenue => {
      this.stats.update(s => ({ ...s, totalRevenue: revenue }));
    });

    // Load today's sales
    this.saleService.getTodaySales().subscribe(sales => {
      this.stats.update(s => ({ ...s, todaySales: sales.length }));
    });

    // Load recent transactions
    this.inventoryService.getTransactions().subscribe(transactions => {
      this.recentTransactions.set(transactions.slice(0, 5));
    });

    // Load alerts
    this.inventoryService.getUnreadAlerts().subscribe(alerts => {
      this.alerts.set(alerts);
      this.loading.set(false);
    });
  }

  getTransactionTypeLabel(type: string): string {
    const labels: any = {
      'PURCHASE': 'Achat',
      'SALE': 'Vente',
      'ADJUSTMENT': 'Ajustement',
      'RETURN': 'Retour',
      'TRANSFER': 'Transfert'
    };
    return labels[type] || type;
  }

  getTransactionTypeClass(type: string): string {
    const classes: any = {
      'PURCHASE': 'success',
      'SALE': 'primary',
      'ADJUSTMENT': 'warning',
      'RETURN': 'danger',
      'TRANSFER': 'info'
    };
    return classes[type] || 'default';
  }
}
