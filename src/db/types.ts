import type {
  ActivityEntry,
  AppSettings,
  Expense,
  Product,
  SaleTransaction,
} from '../types/models';

export type DatabaseShape = {
  activityFeed: ActivityEntry[];
  expenses: Expense[];
  products: Product[];
  sales: SaleTransaction[];
  settings: AppSettings;
};

export type DatabaseAdapter = {
  insertExpenseWithActivity: (
    expense: Expense,
    activity: ActivityEntry,
  ) => Promise<void>;
  insertProduct: (product: Product) => Promise<void>;
  insertSaleAndAdjustStock: (
    sale: SaleTransaction,
    activity: ActivityEntry,
    nextStock: number,
  ) => Promise<void>;
  isAvailable: () => Promise<boolean>;
  loadDatabaseState: () => Promise<DatabaseShape>;
  renameProductCategory: (
    oldCategory: string,
    newCategory: string,
    nextCategories: string[],
  ) => Promise<void>;
  saveProductCategories: (productCategories: string[]) => Promise<void>;
  updateProductRecord: (product: Product) => Promise<void>;
};

export type SyncOperation =
  | {
      type: 'insertProduct';
      product: Product;
    }
  | {
      type: 'updateProduct';
      product: Product;
    }
  | {
      type: 'insertExpenseWithActivity';
      expense: Expense;
      activity: ActivityEntry;
    }
  | {
      type: 'insertSaleAndAdjustStock';
      sale: SaleTransaction;
      activity: ActivityEntry;
      nextStock: number;
    }
  | {
      type: 'saveProductCategories';
      productCategories: string[];
    }
  | {
      type: 'renameProductCategory';
      oldCategory: string;
      newCategory: string;
      nextCategories: string[];
    };
