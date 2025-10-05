import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { InventoryTransaction, TransactionType, StockAlert, AlertType, InventoryReport } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private transactionsSignal = signal<InventoryTransaction[]>([]);
  private alertsSignal = signal<StockAlert[]>([]);

  // Mock transactions
  private mockTransactions: InventoryTransaction[] = [
    {
      id: '1',
      productId: '1',
      type: TransactionType.PURCHASE,
      quantity: 10,
      unitPrice: 600,
      totalPrice: 6000,
      reference: 'PUR-2025-001',
      notes: 'Achat initial',
      userId: '1',
      createdAt: new Date(2025, 9, 1)
    },
    {
      id: '2',
      productId: '2',
      type: TransactionType.SALE,
      quantity: -5,
      unitPrice: 29.99,
      totalPrice: 149.95,
      reference: 'SAL-2025-001',
      userId: '1',
      createdAt: new Date(2025, 9, 2)
    },
    {
      id: '3',
      productId: '3',
      type: TransactionType.SALE,
      quantity: -2,
      unitPrice: 19.99,
      totalPrice: 39.98,
      reference: 'SAL-2025-002',
      userId: '2',
      createdAt: new Date(2025, 9, 3)
    },
    {
      id: '4',
      productId: '1',
      type: TransactionType.SALE,
      quantity: -3,
      unitPrice: 799.99,
      totalPrice: 2399.97,
      reference: 'SAL-2025-003',
      userId: '1',
      createdAt: new Date(2025, 9, 4)
    },
    {
      id: '5',
      productId: '5',
      type: TransactionType.PURCHASE,
      quantity: 12,
      unitPrice: 150,
      totalPrice: 1800,
      reference: 'PUR-2025-002',
      notes: 'Réapprovisionnement',
      userId: '1',
      createdAt: new Date(2025, 9, 5)
    }
  ];

  // Mock alerts
  private mockAlerts: StockAlert[] = [
    {
      id: '1',
      productId: '3',
      type: AlertType.LOW_STOCK,
      message: 'T-Shirt Coton Bio - Stock faible (8 unités)',
      isRead: false,
      createdAt: new Date()
    },
    {
      id: '2',
      productId: '4',
      type: AlertType.OUT_OF_STOCK,
      message: 'Clavier Mécanique RGB - Rupture de stock',
      isRead: false,
      createdAt: new Date()
    }
  ];

  constructor() {
    this.transactionsSignal.set(this.mockTransactions);
    this.alertsSignal.set(this.mockAlerts);
  }

  get transactions() {
    return this.transactionsSignal.asReadonly();
  }

  get alerts() {
    return this.alertsSignal.asReadonly();
  }

  getTransactions(): Observable<InventoryTransaction[]> {
    return of(this.transactionsSignal()).pipe(delay(300));
  }

  getTransactionsByProduct(productId: string): Observable<InventoryTransaction[]> {
    const filtered = this.transactionsSignal().filter(t => t.productId === productId);
    return of(filtered).pipe(delay(200));
  }

  addTransaction(transaction: Omit<InventoryTransaction, 'id' | 'createdAt'>): Observable<InventoryTransaction> {
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this.transactionsSignal.update(transactions => [newTransaction, ...transactions]);
    return of(newTransaction).pipe(delay(300));
  }

  getAlerts(): Observable<StockAlert[]> {
    return of(this.alertsSignal()).pipe(delay(200));
  }

  getUnreadAlerts(): Observable<StockAlert[]> {
    const unread = this.alertsSignal().filter(a => !a.isRead);
    return of(unread).pipe(delay(200));
  }

  markAlertAsRead(id: string): Observable<void> {
    this.alertsSignal.update(alerts => 
      alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
    );
    return of(void 0).pipe(delay(200));
  }

  getInventoryReport(): Observable<InventoryReport> {
    const report: InventoryReport = {
      totalProducts: 5,
      totalValue: 45000,
      lowStockItems: 1,
      outOfStockItems: 1,
      recentTransactions: this.transactionsSignal().slice(0, 5),
      topProducts: []
    };
    
    return of(report).pipe(delay(300));
  }
}
