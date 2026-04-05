import type {
  ActivityEntry,
  Expense,
  Product,
  SaleTransaction,
  StockLog,
} from '../types/models';

const now = Date.now();
const hour = 60 * 60 * 1000;

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Mickey Mouse T-Shirt',
    sku: 'KID-TS-001',
    category: 'Kids (6-12Y)',
    subCategory: 'Tops',
    attributes: {
      size: '8Y',
      color: 'Red',
      gender: 'Unisex',
      brand: 'Local',
      material: 'Cotton',
    },
    costPrice: 420,
    sellingPrice: 650,
    currentStock: 3,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: now - 72 * hour,
    updatedAt: now - 4 * hour,
  },
  {
    id: 'p2',
    name: 'Baby Winter Coat',
    sku: 'BABY-CT-002',
    category: 'Baby (0-24M)',
    subCategory: 'Outerwear',
    attributes: {
      size: '12M',
      color: 'Pink',
      gender: 'Girl',
      brand: 'Mothercare',
      material: 'Wool Blend',
    },
    costPrice: 950,
    sellingPrice: 1350,
    currentStock: 9,
    lowStockThreshold: 4,
    isActive: true,
    createdAt: now - 120 * hour,
    updatedAt: now - 2 * hour,
  },
  {
    id: 'p3',
    name: 'School Uniform Trouser',
    sku: 'UNI-TR-003',
    category: 'Kids (6-12Y)',
    subCategory: 'School Uniform',
    attributes: {
      size: '10Y',
      color: 'Navy Blue',
      gender: 'Boy',
      brand: 'Local',
      material: 'Poly Cotton',
    },
    costPrice: 380,
    sellingPrice: 560,
    currentStock: 4,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: now - 48 * hour,
    updatedAt: now - 3 * hour,
  },
  {
    id: 'p4',
    name: 'Kids Canvas Shoes',
    sku: 'SHOE-004',
    category: 'Shoes',
    subCategory: 'Casual',
    attributes: {
      size: 'EU 31',
      color: 'White',
      gender: 'Unisex',
      brand: 'Local',
    },
    costPrice: 700,
    sellingPrice: 980,
    currentStock: 11,
    lowStockThreshold: 4,
    isActive: true,
    createdAt: now - 96 * hour,
    updatedAt: now - hour,
  },
];

export const sales: SaleTransaction[] = [
  {
    id: 's1',
    productId: 'p1',
    productName: 'Mickey Mouse T-Shirt',
    productSku: 'KID-TS-001',
    category: 'Kids (6-12Y)',
    productAttributesSnapshot: {
      size: '8Y',
      color: 'Red',
      gender: 'Unisex',
    },
    quantitySold: 2,
    unitCostPrice: 420,
    unitSellingPrice: 650,
    totalRevenue: 1300,
    totalProfit: 460,
    currency: 'ETB',
    soldAt: now - 2 * hour,
  },
  {
    id: 's2',
    productId: 'p3',
    productName: 'School Uniform Trouser',
    productSku: 'UNI-TR-003',
    category: 'Kids (6-12Y)',
    productAttributesSnapshot: {
      size: '10Y',
      color: 'Navy Blue',
      gender: 'Boy',
    },
    quantitySold: 1,
    unitCostPrice: 380,
    unitSellingPrice: 560,
    totalRevenue: 560,
    totalProfit: 180,
    currency: 'ETB',
    soldAt: now - 5 * hour,
  },
];

export const expenses: Expense[] = [
  {
    id: 'e1',
    title: 'Transport',
    category: 'Transport',
    amount: 250,
    expenseDate: now - 8 * hour,
    recordedAt: now - 8 * hour,
    currency: 'ETB',
  },
  {
    id: 'e2',
    title: 'Lunch',
    category: 'Other',
    amount: 180,
    expenseDate: now - 3 * hour,
    recordedAt: now - 3 * hour,
    currency: 'ETB',
  },
  {
    id: 'e3',
    title: 'Packaging',
    category: 'Packaging',
    amount: 120,
    expenseDate: now - 26 * hour,
    recordedAt: now - 26 * hour,
    currency: 'ETB',
  },
];

export const stockLogs: StockLog[] = [
  {
    id: 'st1',
    productId: 'p1',
    productName: 'Mickey Mouse T-Shirt',
    productSku: 'KID-TS-001',
    type: 'Restock',
    quantityBefore: 8,
    quantityChanged: 5,
    quantityAfter: 13,
    loggedAt: now - 30 * hour,
    notes: 'Weekend restock',
  },
];

export const activityFeed: ActivityEntry[] = [
  {
    id: 'a1',
    type: 'sale',
    title: 'Sold 2 Mickey Mouse T-Shirt',
    amount: 1300,
    timestamp: 'Today, 14:12',
  },
  {
    id: 'a2',
    type: 'expense',
    title: 'Bought Transport',
    amount: 250,
    timestamp: 'Today, 08:15',
  },
  {
    id: 'a3',
    type: 'sale',
    title: 'Sold 1 School Uniform Trouser',
    amount: 560,
    timestamp: 'Today, 11:30',
  },
  {
    id: 'a4',
    type: 'expense',
    title: 'Bought Lunch',
    amount: 180,
    timestamp: 'Today, 13:05',
  },
];

export const todaysSalesTotal = sales.reduce(
  (total, sale) => total + sale.totalRevenue,
  0,
);
export const todaysExpensesTotal = expenses
  .filter(expense => expense.expenseDate >= now - 24 * hour)
  .reduce((total, expense) => total + expense.amount, 0);
export const todaysProfitTotal = sales.reduce(
  (total, sale) => total + sale.totalProfit,
  0,
);

export const lowStockProducts = products.filter(
  product => product.currentStock <= product.lowStockThreshold,
);
