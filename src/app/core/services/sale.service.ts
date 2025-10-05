import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Sale, SaleItem, Customer, PaymentMethod, PaymentStatus } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private salesSignal = signal<Sale[]>([]);
  private customersSignal = signal<Customer[]>([]);

  // Mock customers
  private mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '+33 6 12 34 56 78',
      address: '10 Rue de Paris',
      city: 'Paris',
      country: 'France',
      totalPurchases: 5420.50,
      createdAt: new Date(2025, 8, 1),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Sophie Dubois',
      email: 'sophie.dubois@email.com',
      phone: '+33 6 98 76 54 32',
      address: '25 Avenue des Champs',
      city: 'Lyon',
      country: 'France',
      totalPurchases: 2150.00,
      createdAt: new Date(2025, 8, 15),
      updatedAt: new Date()
    }
  ];

  // Mock sales
  private mockSales: Sale[] = [
    {
      id: '1',
      saleNumber: 'VEN-2025-001',
      customerId: '1',
      items: [
        {
          id: '1',
          productId: '1',
          quantity: 1,
          unitPrice: 799.99,
          discount: 0,
          total: 799.99
        },
        {
          id: '2',
          productId: '2',
          quantity: 2,
          unitPrice: 29.99,
          discount: 0,
          total: 59.98
        }
      ],
      subtotal: 859.97,
      tax: 171.99,
      discount: 0,
      total: 1031.96,
      paymentMethod: PaymentMethod.CARD,
      paymentStatus: PaymentStatus.PAID,
      userId: '1',
      createdAt: new Date(2025, 9, 1),
      updatedAt: new Date(2025, 9, 1)
    },
    {
      id: '2',
      saleNumber: 'VEN-2025-002',
      customerId: '2',
      items: [
        {
          id: '3',
          productId: '3',
          quantity: 5,
          unitPrice: 19.99,
          discount: 10,
          total: 89.96
        }
      ],
      subtotal: 99.95,
      tax: 19.99,
      discount: 10,
      total: 109.94,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      userId: '2',
      createdAt: new Date(2025, 9, 2),
      updatedAt: new Date(2025, 9, 2)
    },
    {
      id: '3',
      saleNumber: 'VEN-2025-003',
      items: [
        {
          id: '4',
          productId: '5',
          quantity: 1,
          unitPrice: 249.99,
          discount: 0,
          total: 249.99
        }
      ],
      subtotal: 249.99,
      tax: 50.00,
      discount: 0,
      total: 299.99,
      paymentMethod: PaymentMethod.MOBILE_MONEY,
      paymentStatus: PaymentStatus.PENDING,
      userId: '1',
      createdAt: new Date(2025, 9, 5),
      updatedAt: new Date(2025, 9, 5)
    }
  ];

  constructor() {
    this.salesSignal.set(this.mockSales);
    this.customersSignal.set(this.mockCustomers);
  }

  get sales() {
    return this.salesSignal.asReadonly();
  }

  get customers() {
    return this.customersSignal.asReadonly();
  }

  getSales(): Observable<Sale[]> {
    return of(this.salesSignal()).pipe(delay(300));
  }

  getSaleById(id: string): Observable<Sale | undefined> {
    const sale = this.salesSignal().find(s => s.id === id);
    return of(sale).pipe(delay(200));
  }

  addSale(sale: Omit<Sale, 'id' | 'saleNumber' | 'createdAt' | 'updatedAt'>): Observable<Sale> {
    const saleNumber = `VEN-${new Date().getFullYear()}-${String(this.salesSignal().length + 1).padStart(3, '0')}`;
    
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      saleNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.salesSignal.update(sales => [newSale, ...sales]);
    return of(newSale).pipe(delay(300));
  }

  updateSale(id: string, sale: Partial<Sale>): Observable<Sale> {
    const index = this.salesSignal().findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSale = {
        ...this.salesSignal()[index],
        ...sale,
        updatedAt: new Date()
      };
      
      this.salesSignal.update(sales => {
        const newSales = [...sales];
        newSales[index] = updatedSale;
        return newSales;
      });
      
      return of(updatedSale).pipe(delay(300));
    }
    
    throw new Error('Sale not found');
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.customersSignal()).pipe(delay(200));
  }

  addCustomer(customer: Omit<Customer, 'id' | 'totalPurchases' | 'createdAt' | 'updatedAt'>): Observable<Customer> {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      totalPurchases: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.customersSignal.update(customers => [...customers, newCustomer]);
    return of(newCustomer).pipe(delay(300));
  }

  getTodaySales(): Observable<Sale[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySales = this.salesSignal().filter(s => {
      const saleDate = new Date(s.createdAt);
      saleDate.setHours(0, 0, 0, 0);
      return saleDate.getTime() === today.getTime();
    });
    
    return of(todaySales).pipe(delay(200));
  }

  getTotalRevenue(): Observable<number> {
    const total = this.salesSignal()
      .filter(s => s.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, sale) => sum + sale.total, 0);
    
    return of(total).pipe(delay(200));
  }
}
