import type {
  ActivityEntry,
  Expense,
  Product,
  SaleTransaction,
} from '../types/models';
import { firestoreDatabaseAdapter } from './firestoreDatabase';
import { sqliteDatabaseAdapter } from './sqliteDatabase';
import type { DatabaseAdapter } from './types';

let resolvedAdapter: DatabaseAdapter | null = null;

async function getDatabaseAdapter() {
  if (resolvedAdapter) {
    return resolvedAdapter;
  }

  const firestoreAvailable = await firestoreDatabaseAdapter.isAvailable();
  resolvedAdapter = firestoreAvailable
    ? firestoreDatabaseAdapter
    : sqliteDatabaseAdapter;

  return resolvedAdapter;
}

export async function loadDatabaseState() {
  const adapter = await getDatabaseAdapter();
  return adapter.loadDatabaseState();
}

export async function insertProduct(product: Product) {
  const adapter = await getDatabaseAdapter();
  return adapter.insertProduct(product);
}

export async function updateProductRecord(product: Product) {
  const adapter = await getDatabaseAdapter();
  return adapter.updateProductRecord(product);
}

export async function insertExpenseWithActivity(
  expense: Expense,
  activity: ActivityEntry,
) {
  const adapter = await getDatabaseAdapter();
  return adapter.insertExpenseWithActivity(expense, activity);
}

export async function insertSaleAndAdjustStock(
  sale: SaleTransaction,
  activity: ActivityEntry,
  nextStock: number,
) {
  const adapter = await getDatabaseAdapter();
  return adapter.insertSaleAndAdjustStock(sale, activity, nextStock);
}

export async function saveProductCategories(productCategories: string[]) {
  const adapter = await getDatabaseAdapter();
  return adapter.saveProductCategories(productCategories);
}

export async function renameProductCategory(
  oldCategory: string,
  newCategory: string,
  nextCategories: string[],
) {
  const adapter = await getDatabaseAdapter();
  return adapter.renameProductCategory(oldCategory, newCategory, nextCategories);
}
