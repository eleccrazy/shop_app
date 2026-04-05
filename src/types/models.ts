export type ProductCategory =
  | 'Baby (0-24M)'
  | 'Toddler (2-5Y)'
  | 'Kids (6-12Y)'
  | 'Shoes'
  | 'Accessories';

export type ProductGender = 'Boy' | 'Girl' | 'Unisex';

export type ProductAttributes = {
  size?: string;
  color?: string;
  gender?: ProductGender;
  brand?: string;
  material?: string;
  [key: string]: string | number | boolean | undefined;
};

export type Product = {
  id: string;
  name: string;
  sku?: string;
  category: ProductCategory;
  subCategory?: string;
  attributes: ProductAttributes;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
};

export type SaleTransaction = {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  category: ProductCategory;
  productAttributesSnapshot?: ProductAttributes;
  quantitySold: number;
  unitCostPrice: number;
  unitSellingPrice: number;
  discountAmount?: number;
  totalRevenue: number;
  totalProfit: number;
  currency: 'ETB';
  soldAt: number;
  notes?: string;
};

export type ExpenseCategory =
  | 'Rent'
  | 'Transport'
  | 'Salary'
  | 'Packaging'
  | 'Utilities'
  | 'Other';

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: number;
  recordedAt: number;
  currency: 'ETB';
  notes?: string;
};

export type StockAdjustmentType =
  | 'Restock'
  | 'Correction'
  | 'Damaged'
  | 'Return';

export type StockLog = {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  type: StockAdjustmentType;
  quantityBefore: number;
  quantityChanged: number;
  quantityAfter: number;
  loggedAt: number;
  notes?: string;
};

export type ActivityEntry = {
  id: string;
  type: 'sale' | 'expense';
  title: string;
  amount: number;
  timestamp: string;
};
