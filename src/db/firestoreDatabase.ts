import type {
  ActivityEntry,
  Expense,
  Product,
  SaleTransaction,
} from '../types/models';
import type { DatabaseAdapter, DatabaseShape, SyncOperation } from './types';

const COLLECTIONS = {
  activityFeed: 'activityFeed',
  expenses: 'expenses',
  products: 'products',
  sales: 'sales',
  settings: 'appSettings',
} as const;

const SETTINGS_DOCUMENT_ID = 'shopApp';

function getFirestore() {
  return require('@react-native-firebase/firestore').default;
}

function withTimestamps<T extends Record<string, unknown> & { id: string }>(
  items: T[],
  field: string,
) {
  return [...items].sort(
    (left, right) =>
      Number(right[field as keyof T] ?? 0) - Number(left[field as keyof T] ?? 0),
  );
}

function mapSettings(snapshot: { data: () => Record<string, unknown> | undefined }) {
  const data = snapshot.data();

  return {
    productCategories: Array.isArray(data?.productCategories)
      ? (data?.productCategories as string[])
      : [],
  };
}

async function ensureSettingsDocument() {
  const firestore = getFirestore();
  const settingsRef = firestore()
    .collection(COLLECTIONS.settings)
    .doc(SETTINGS_DOCUMENT_ID);
  const snapshot = await settingsRef.get();

  if (!snapshot.exists) {
    await settingsRef.set({ productCategories: [] });
  }
}

async function loadDatabaseState(): Promise<DatabaseShape> {
  await ensureSettingsDocument();
  const firestore = getFirestore();

  const [productsSnapshot, salesSnapshot, expensesSnapshot, activitySnapshot, settingsSnapshot] =
    await Promise.all([
      firestore().collection(COLLECTIONS.products).get(),
      firestore().collection(COLLECTIONS.sales).get(),
      firestore().collection(COLLECTIONS.expenses).get(),
      firestore().collection(COLLECTIONS.activityFeed).get(),
      firestore().collection(COLLECTIONS.settings).doc(SETTINGS_DOCUMENT_ID).get(),
    ]);

  const products = withTimestamps(
    productsSnapshot.docs.map((document: { data: () => unknown }) => document.data() as Product),
    'createdAt',
  );
  const sales = withTimestamps(
    salesSnapshot.docs.map(
      (document: { data: () => unknown }) => document.data() as SaleTransaction,
    ),
    'soldAt',
  );
  const expenses = withTimestamps(
    expensesSnapshot.docs.map((document: { data: () => unknown }) => document.data() as Expense),
    'expenseDate',
  );
  const activityFeed = withTimestamps(
    activitySnapshot.docs.map(
      (document: { data: () => unknown }) => document.data() as ActivityEntry,
    ),
    'createdAt',
  );

  return {
    activityFeed,
    expenses,
    products,
    sales,
    settings: mapSettings(settingsSnapshot),
  };
}

async function insertProduct(product: Product) {
  const firestore = getFirestore();
  await firestore().collection(COLLECTIONS.products).doc(product.id).set(product);
}

async function updateProductRecord(product: Product) {
  const firestore = getFirestore();
  await firestore().collection(COLLECTIONS.products).doc(product.id).set(product);
}

async function insertExpenseWithActivity(expense: Expense, activity: ActivityEntry) {
  const firestore = getFirestore();
  const batch = firestore().batch();

  batch.set(firestore().collection(COLLECTIONS.expenses).doc(expense.id), expense);
  batch.set(
    firestore().collection(COLLECTIONS.activityFeed).doc(activity.id),
    activity,
  );

  await batch.commit();
}

async function insertSaleAndAdjustStock(
  sale: SaleTransaction,
  activity: ActivityEntry,
  nextStock: number,
) {
  const firestore = getFirestore();
  const batch = firestore().batch();
  const productRef = firestore()
    .collection(COLLECTIONS.products)
    .doc(sale.productId ?? '');

  batch.set(firestore().collection(COLLECTIONS.sales).doc(sale.id), sale);
  batch.set(
    firestore().collection(COLLECTIONS.activityFeed).doc(activity.id),
    activity,
  );
  batch.update(productRef, {
    currentStock: nextStock,
    updatedAt: Date.now(),
  });

  await batch.commit();
}

async function saveProductCategories(productCategories: string[]) {
  const firestore = getFirestore();
  await firestore()
    .collection(COLLECTIONS.settings)
    .doc(SETTINGS_DOCUMENT_ID)
    .set({ productCategories }, { merge: true });
}

async function renameProductCategory(
  oldCategory: string,
  newCategory: string,
  nextCategories: string[],
) {
  const firestore = getFirestore();
  const productsSnapshot = await firestore()
    .collection(COLLECTIONS.products)
    .where('category', '==', oldCategory)
    .get();
  const batch = firestore().batch();

  productsSnapshot.docs.forEach((document: { ref: unknown }) => {
    batch.update(document.ref, {
      category: newCategory,
      updatedAt: Date.now(),
    });
  });

  batch.set(
    firestore().collection(COLLECTIONS.settings).doc(SETTINGS_DOCUMENT_ID),
    { productCategories: nextCategories },
    { merge: true },
  );

  await batch.commit();
}

async function isAvailable() {
  try {
    await ensureSettingsDocument();
    return true;
  } catch {
    return false;
  }
}

async function applySyncOperation(operation: SyncOperation) {
  switch (operation.type) {
    case 'insertProduct':
      await insertProduct(operation.product);
      return;
    case 'updateProduct':
      await updateProductRecord(operation.product);
      return;
    case 'insertExpenseWithActivity':
      await insertExpenseWithActivity(operation.expense, operation.activity);
      return;
    case 'insertSaleAndAdjustStock':
      await insertSaleAndAdjustStock(
        operation.sale,
        operation.activity,
        operation.nextStock,
      );
      return;
    case 'saveProductCategories':
      await saveProductCategories(operation.productCategories);
      return;
    case 'renameProductCategory':
      await renameProductCategory(
        operation.oldCategory,
        operation.newCategory,
        operation.nextCategories,
      );
      return;
  }
}

export const firestoreDatabaseAdapter: DatabaseAdapter = {
  insertExpenseWithActivity,
  insertProduct,
  insertSaleAndAdjustStock,
  isAvailable,
  loadDatabaseState,
  renameProductCategory,
  saveProductCategories,
  updateProductRecord,
};

export {
  applySyncOperation as applyFirestoreSyncOperation,
  isAvailable as isFirestoreAvailable,
  loadDatabaseState as loadRemoteDatabaseState,
};
