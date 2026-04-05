import type { ActivityEntry, Expense, Product } from '../types/models';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Nike Air Max',
    buyingPrice: 62,
    sellingPrice: 88,
    quantity: 3,
    category: 'Shoes',
  },
  {
    id: 'p2',
    name: 'Adidas Street Runner',
    buyingPrice: 55,
    sellingPrice: 79,
    quantity: 9,
    category: 'Shoes',
  },
  {
    id: 'p3',
    name: 'Denim Jacket',
    buyingPrice: 28,
    sellingPrice: 49,
    quantity: 4,
    category: 'Clothes',
  },
  {
    id: 'p4',
    name: 'Classic Hoodie',
    buyingPrice: 19,
    sellingPrice: 35,
    quantity: 11,
    category: 'Clothes',
  },
];

export const expenses: Expense[] = [
  {
    id: 'e1',
    title: 'Transport',
    amount: 12,
    createdAt: 'Today, 08:15',
  },
  {
    id: 'e2',
    title: 'Lunch',
    amount: 9,
    createdAt: 'Today, 13:05',
  },
  {
    id: 'e3',
    title: 'Packaging',
    amount: 6,
    createdAt: 'Yesterday, 17:40',
  },
];

export const activityFeed: ActivityEntry[] = [
  {
    id: 'a1',
    type: 'sale',
    title: 'Sold 2 Nike Air Max',
    amount: 176,
    timestamp: 'Today, 14:12',
  },
  {
    id: 'a2',
    type: 'expense',
    title: 'Bought Transport',
    amount: 12,
    timestamp: 'Today, 08:15',
  },
  {
    id: 'a3',
    type: 'sale',
    title: 'Sold 1 Denim Jacket',
    amount: 49,
    timestamp: 'Today, 11:30',
  },
  {
    id: 'a4',
    type: 'expense',
    title: 'Bought Lunch',
    amount: 9,
    timestamp: 'Today, 13:05',
  },
];

export const todaysSalesTotal = 225;
export const todaysExpensesTotal = 21;
export const todaysProfitTotal = 94;

export const lowStockProducts = products.filter(product => product.quantity <= 5);
