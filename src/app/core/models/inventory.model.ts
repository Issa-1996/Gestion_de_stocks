export interface InventoryTransaction {
  id: string;
  productId: string;
  product?: any;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reference: string;
  notes?: string;
  userId: string;
  user?: any;
  createdAt: Date;
}

export enum TransactionType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  ADJUSTMENT = 'ADJUSTMENT',
  RETURN = 'RETURN',
  TRANSFER = 'TRANSFER'
}

export interface StockAlert {
  id: string;
  productId: string;
  product?: any;
  type: AlertType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export enum AlertType {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRING_SOON = 'EXPIRING_SOON'
}

export interface InventoryReport {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  recentTransactions: InventoryTransaction[];
  topProducts: any[];
}
