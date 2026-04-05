export type Product = {
  id: string;
  name: string;
  buyingPrice: number;
  sellingPrice: number;
  quantity: number;
  category: 'Shoes' | 'Clothes' | 'Accessories';
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  createdAt: string;
};

export type ActivityEntry = {
  id: string;
  type: 'sale' | 'expense';
  title: string;
  amount: number;
  timestamp: string;
};
