import type {
  ActivityEntry,
  Expense,
  Product,
  SaleTransaction,
} from '../types/models';
import {
  applyFirestoreSyncOperation,
  isFirestoreAvailable,
  loadRemoteDatabaseState,
} from './firestoreDatabase';
import {
  insertExpenseWithActivity as insertExpenseWithActivityLocally,
  insertProduct as insertProductLocally,
  insertSaleAndAdjustStock as insertSaleAndAdjustStockLocally,
  loadLocalDatabaseState,
  loadPendingSyncOperations,
  mergeRemoteDatabaseState,
  removePendingSyncOperation,
  renameProductCategory as renameProductCategoryLocally,
  saveProductCategories as saveProductCategoriesLocally,
  updateProductRecord as updateProductRecordLocally,
} from './sqliteDatabase';

let synchronizationPromise: Promise<void> | null = null;

async function runSynchronization() {
  const firestoreReady = await isFirestoreAvailable();

  if (!firestoreReady) {
    return;
  }

  const pendingOperations = await loadPendingSyncOperations();
  for (const pendingOperation of pendingOperations) {
    await applyFirestoreSyncOperation(pendingOperation.operation);
    await removePendingSyncOperation(pendingOperation.id);
  }

  const remoteState = await loadRemoteDatabaseState();
  await mergeRemoteDatabaseState(remoteState);
}

export async function synchronizeDatabase() {
  if (!synchronizationPromise) {
    synchronizationPromise = runSynchronization().finally(() => {
      synchronizationPromise = null;
    });
  }

  return synchronizationPromise;
}

export async function loadDatabaseState() {
  const localState = await loadLocalDatabaseState();

  try {
    await synchronizeDatabase();
    return await loadLocalDatabaseState();
  } catch {
    return localState;
  }
}

export async function insertProduct(product: Product) {
  await insertProductLocally(product);
  void synchronizeDatabase();
}

export async function updateProductRecord(product: Product) {
  await updateProductRecordLocally(product);
  void synchronizeDatabase();
}

export async function insertExpenseWithActivity(
  expense: Expense,
  activity: ActivityEntry,
) {
  await insertExpenseWithActivityLocally(expense, activity);
  void synchronizeDatabase();
}

export async function insertSaleAndAdjustStock(
  sale: SaleTransaction,
  activity: ActivityEntry,
  nextStock: number,
) {
  await insertSaleAndAdjustStockLocally(sale, activity, nextStock);
  void synchronizeDatabase();
}

export async function saveProductCategories(productCategories: string[]) {
  await saveProductCategoriesLocally(productCategories);
  void synchronizeDatabase();
}

export async function renameProductCategory(
  oldCategory: string,
  newCategory: string,
  nextCategories: string[],
) {
  await renameProductCategoryLocally(oldCategory, newCategory, nextCategories);
  void synchronizeDatabase();
}
