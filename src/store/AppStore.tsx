import React, { createContext, useContext, useMemo, useReducer } from 'react';

import {
  activityFeed as initialActivityFeed,
  expenses as initialExpenses,
  products as initialProducts,
  sales as initialSales,
} from '../data/mockData';
import type {
  ActivityEntry,
  Expense,
  ExpenseCategory,
  Product,
  ProductCategory,
  SaleTransaction,
} from '../types/models';
import { createDocumentId } from '../utils/id';

type AppState = {
  activityFeed: ActivityEntry[];
  expenses: Expense[];
  products: Product[];
  sales: SaleTransaction[];
};

type AddProductInput = {
  category: ProductCategory;
  costPrice: number;
  currentStock: number;
  name: string;
  sellingPrice: number;
};

type RecordSaleInput = {
  actualSoldPrice: number;
  productId: string;
  quantitySold: number;
};

type AddExpenseInput = {
  amount: number;
  category?: ExpenseCategory;
  title: string;
};

type AppStoreValue = AppState & {
  addExpense: (input: AddExpenseInput) => void;
  addProduct: (input: AddProductInput) => void;
  lowStockProducts: Product[];
  recordSale: (input: RecordSaleInput) => { error?: string; success: boolean };
  todaysExpensesTotal: number;
  todaysProfitTotal: number;
  todaysSalesTotal: number;
};

type Action =
  | { type: 'ADD_PRODUCT'; payload: AddProductInput }
  | { type: 'ADD_EXPENSE'; payload: AddExpenseInput }
  | { type: 'RECORD_SALE'; payload: RecordSaleInput };

const AppStoreContext = createContext<AppStoreValue | null>(null);

const initialState: AppState = {
  activityFeed: initialActivityFeed,
  expenses: initialExpenses,
  products: initialProducts,
  sales: initialSales,
};

function formatTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString('en-ET', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
}

function normalizeExpenseCategory(title: string): ExpenseCategory {
  const normalized = title.trim().toLowerCase();

  if (normalized.includes('transport')) {
    return 'Transport';
  }
  if (normalized.includes('rent')) {
    return 'Rent';
  }
  if (normalized.includes('salary')) {
    return 'Salary';
  }
  if (normalized.includes('package')) {
    return 'Packaging';
  }
  if (normalized.includes('water') || normalized.includes('light')) {
    return 'Utilities';
  }

  return 'Other';
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const timestamp = Date.now();
      const newProduct: Product = {
        id: createDocumentId('product'),
        attributes: {},
        category: action.payload.category,
        costPrice: action.payload.costPrice,
        createdAt: timestamp,
        currentStock: action.payload.currentStock,
        isActive: true,
        lowStockThreshold: 5,
        name: action.payload.name.trim(),
        sellingPrice: action.payload.sellingPrice,
        updatedAt: timestamp,
      };

      return {
        ...state,
        products: [newProduct, ...state.products],
      };
    }
    case 'ADD_EXPENSE': {
      const timestamp = Date.now();
      const newExpense: Expense = {
        amount: action.payload.amount,
        category:
          action.payload.category ?? normalizeExpenseCategory(action.payload.title),
        currency: 'ETB',
        expenseDate: timestamp,
        id: createDocumentId('expense'),
        recordedAt: timestamp,
        title: action.payload.title.trim(),
      };
      const activityEntry: ActivityEntry = {
        amount: newExpense.amount,
        id: createDocumentId('activity'),
        timestamp: formatTimestamp(timestamp),
        title: `Bought ${newExpense.title}`,
        type: 'expense',
      };

      return {
        ...state,
        activityFeed: [activityEntry, ...state.activityFeed],
        expenses: [newExpense, ...state.expenses],
      };
    }
    case 'RECORD_SALE': {
      const product = state.products.find(
        currentProduct => currentProduct.id === action.payload.productId,
      );

      if (!product?.id || !product.name || !product.category) {
        return state;
      }

      const currentStock = product.currentStock ?? 0;
      const costPrice = product.costPrice ?? 0;
      const sellingPrice = action.payload.actualSoldPrice;
      const quantitySold = action.payload.quantitySold;
      const timestamp = Date.now();

      if (quantitySold <= 0 || quantitySold > currentStock) {
        return state;
      }

      const updatedProducts = state.products.map(currentProduct => {
        if (currentProduct.id !== product.id) {
          return currentProduct;
        }

        return {
          ...currentProduct,
          currentStock: currentStock - quantitySold,
          updatedAt: timestamp,
        };
      });

      const totalRevenue = quantitySold * sellingPrice;
      const totalProfit = totalRevenue - quantitySold * costPrice;

      const sale: SaleTransaction = {
        category: product.category,
        currency: 'ETB',
        id: createDocumentId('sale'),
        productAttributesSnapshot: product.attributes,
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        actualSoldPrice: sellingPrice,
        quantitySold,
        soldAt: timestamp,
        totalProfit,
        totalRevenue,
        unitCostPrice: costPrice,
        unitSellingPrice: sellingPrice,
      };

      const activityEntry: ActivityEntry = {
        amount: totalRevenue,
        id: createDocumentId('activity'),
        timestamp: formatTimestamp(timestamp),
        title: `Sold ${quantitySold} ${product.name}`,
        type: 'sale',
      };

      return {
        ...state,
        activityFeed: [activityEntry, ...state.activityFeed],
        products: updatedProducts,
        sales: [sale, ...state.sales],
      };
    }
    default:
      return state;
  }
}

export function AppStoreProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo<AppStoreValue>(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const today = startOfToday.getTime();

    const todaysSales = state.sales.filter(sale => (sale.soldAt ?? 0) >= today);
    const todaysExpenses = state.expenses.filter(
      expense => (expense.expenseDate ?? 0) >= today,
    );

    return {
      ...state,
      addExpense: input => {
        dispatch({ type: 'ADD_EXPENSE', payload: input });
      },
      addProduct: input => {
        dispatch({ type: 'ADD_PRODUCT', payload: input });
      },
      lowStockProducts: state.products.filter(
        product =>
          (product.currentStock ?? 0) <= (product.lowStockThreshold ?? 0),
      ),
      recordSale: input => {
        const product = state.products.find(item => item.id === input.productId);
        const currentStock = product?.currentStock ?? 0;

        if (!product) {
          return { error: 'Select a product first.', success: false };
        }
        if (input.actualSoldPrice <= 0) {
          return { error: 'Sold price must be greater than zero.', success: false };
        }
        if (input.quantitySold <= 0) {
          return { error: 'Quantity must be greater than zero.', success: false };
        }
        if (input.quantitySold > currentStock) {
          return { error: 'Not enough stock available.', success: false };
        }

        dispatch({ type: 'RECORD_SALE', payload: input });
        return { success: true };
      },
      todaysExpensesTotal: todaysExpenses.reduce(
        (total, expense) => total + (expense.amount ?? 0),
        0,
      ),
      todaysProfitTotal: todaysSales.reduce(
        (total, sale) => total + (sale.totalProfit ?? 0),
        0,
      ),
      todaysSalesTotal: todaysSales.reduce(
        (total, sale) => total + (sale.totalRevenue ?? 0),
        0,
      ),
    };
  }, [state]);

  return (
    <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppStoreContext);

  if (!context) {
    throw new Error('useAppStore must be used within AppStoreProvider');
  }

  return context;
}
