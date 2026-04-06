import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

import {
  insertExpenseWithActivity,
  insertProduct,
  insertSaleAndAdjustStock,
  loadDatabaseState,
  updateProductRecord,
} from '../db/database';
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

type UpdateProductInput = AddProductInput & {
  id: string;
};

type RecordSaleInput = {
  actualSoldPrice: number;
  productId: string;
  quantitySold: number;
  soldAt: number;
};

type AddExpenseInput = {
  amount: number;
  category?: ExpenseCategory;
  expenseDate: number;
  title: string;
};

type AppStoreValue = AppState & {
  addExpense: (input: AddExpenseInput) => Promise<{ error?: string; success: boolean }>;
  addProduct: (input: AddProductInput) => Promise<{ error?: string; success: boolean }>;
  isHydrated: boolean;
  lowStockProducts: Product[];
  recordSale: (input: RecordSaleInput) => { error?: string; success: boolean };
  recordSaleAsync: (
    input: RecordSaleInput,
  ) => Promise<{ error?: string; success: boolean }>;
  todaysExpensesTotal: number;
  todaysProfitTotal: number;
  todaysSalesTotal: number;
  updateProduct: (
    input: UpdateProductInput,
  ) => Promise<{ error?: string; success: boolean }>;
};

type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'ADD_PRODUCT'; payload: { product: Product } }
  | { type: 'UPDATE_PRODUCT'; payload: UpdateProductInput }
  | {
      type: 'ADD_EXPENSE';
      payload: { activityEntry: ActivityEntry; expense: Expense };
    }
  | {
      type: 'RECORD_SALE';
      payload: {
        activityEntry: ActivityEntry;
        productId: string;
        quantitySold: number;
        sale: SaleTransaction;
      };
    };

const AppStoreContext = createContext<AppStoreValue | null>(null);

const initialState: AppState = {
  activityFeed: [],
  expenses: [],
  products: [],
  sales: [],
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
    case 'HYDRATE':
      return action.payload;
    case 'ADD_PRODUCT': {
      return {
        ...state,
        products: [action.payload.product, ...state.products],
      };
    }
    case 'UPDATE_PRODUCT': {
      const timestamp = Date.now();

      return {
        ...state,
        products: state.products.map(product => {
          if (product.id !== action.payload.id) {
            return product;
          }

          return {
            ...product,
            category: action.payload.category,
            costPrice: action.payload.costPrice,
            currentStock: action.payload.currentStock,
            name: action.payload.name.trim(),
            sellingPrice: action.payload.sellingPrice,
            updatedAt: timestamp,
          };
        }),
      };
    }
    case 'ADD_EXPENSE': {
      return {
        ...state,
        activityFeed: [action.payload.activityEntry, ...state.activityFeed],
        expenses: [action.payload.expense, ...state.expenses],
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

      return {
        ...state,
        activityFeed: [action.payload.activityEntry, ...state.activityFeed],
        products: updatedProducts,
        sales: [action.payload.sale, ...state.sales],
      };
    }
    default:
      return state;
  }
}

export function AppStoreProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  useEffect(() => {
    let mounted = true;

    loadDatabaseState()
      .then(data => {
        if (!mounted) {
          return;
        }

        dispatch({ type: 'HYDRATE', payload: data });
        setIsHydrated(true);
      })
      .catch(() => {
        if (mounted) {
          setIsHydrated(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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
      addExpense: async input => {
        const timestamp = Date.now();
        const expense: Expense = {
          amount: input.amount,
          category: input.category ?? normalizeExpenseCategory(input.title),
          currency: 'ETB',
          expenseDate: input.expenseDate,
          id: createDocumentId('expense'),
          recordedAt: timestamp,
          title: input.title.trim(),
        };
        const activityEntry: ActivityEntry = {
          amount: expense.amount,
          id: createDocumentId('activity'),
          timestamp: formatTimestamp(timestamp),
          title: `Bought ${expense.title}`,
          type: 'expense',
        };

        try {
          await insertExpenseWithActivity(expense, activityEntry);
          dispatch({
            type: 'ADD_EXPENSE',
            payload: { activityEntry, expense },
          });
          return { success: true };
        } catch {
          return { error: 'Unable to save expense locally.', success: false };
        }
      },
      addProduct: async input => {
        const timestamp = Date.now();
        const product: Product = {
          id: createDocumentId('product'),
          attributes: {},
          category: input.category,
          costPrice: input.costPrice,
          createdAt: timestamp,
          currentStock: input.currentStock,
          isActive: true,
          lowStockThreshold: 5,
          name: input.name.trim(),
          sellingPrice: input.sellingPrice,
          updatedAt: timestamp,
        };

        try {
          await insertProduct(product);
          dispatch({ type: 'ADD_PRODUCT', payload: { product } });
          return { success: true };
        } catch {
          return { error: 'Unable to save product locally.', success: false };
        }
      },
      isHydrated,
      lowStockProducts: state.products.filter(
        product =>
          (product.currentStock ?? 0) <= (product.lowStockThreshold ?? 0),
      ),
      recordSale: _input => {
        return { error: 'Use recordSaleAsync for persistence.', success: false };
      },
      recordSaleAsync: async input => {
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
        if (!product?.id || !product.name || !product.category) {
          return { error: 'Selected product is invalid.', success: false };
        }

        const timestamp = Date.now();
        const sale: SaleTransaction = {
          actualSoldPrice: input.actualSoldPrice,
          category: product.category,
          currency: 'ETB',
          id: createDocumentId('sale'),
          productAttributesSnapshot: product.attributes,
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          quantitySold: input.quantitySold,
          soldAt: input.soldAt,
          totalProfit:
            input.quantitySold * input.actualSoldPrice -
            input.quantitySold * (product.costPrice ?? 0),
          totalRevenue: input.quantitySold * input.actualSoldPrice,
          unitCostPrice: product.costPrice ?? 0,
          unitSellingPrice: input.actualSoldPrice,
        };
        const activityEntry: ActivityEntry = {
          amount: sale.totalRevenue,
          id: createDocumentId('activity'),
          timestamp: formatTimestamp(timestamp),
          title: `Sold ${input.quantitySold} ${product.name}`,
          type: 'sale',
        };

        try {
          await insertSaleAndAdjustStock(
            sale,
            activityEntry,
            currentStock - input.quantitySold,
          );
          dispatch({
            type: 'RECORD_SALE',
            payload: {
              activityEntry,
              productId: input.productId,
              quantitySold: input.quantitySold,
              sale,
            },
          });
          return { success: true };
        } catch {
          return { error: 'Unable to save sale locally.', success: false };
        }
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
      updateProduct: async input => {
        const existingProduct = state.products.find(product => product.id === input.id);

        if (!existingProduct) {
          return { error: 'Product not found.', success: false };
        }

        const updatedProduct: Product = {
          ...existingProduct,
          category: input.category,
          costPrice: input.costPrice,
          currentStock: input.currentStock,
          name: input.name.trim(),
          sellingPrice: input.sellingPrice,
          updatedAt: Date.now(),
        };

        try {
          await updateProductRecord(updatedProduct);
          dispatch({ type: 'UPDATE_PRODUCT', payload: input });
          return { success: true };
        } catch {
          return { error: 'Unable to update product locally.', success: false };
        }
      },
    };
  }, [isHydrated, state]);

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
