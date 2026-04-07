import SQLite from 'react-native-sqlite-storage';

import {
  activityFeed as seedActivityFeed,
  expenses as seedExpenses,
  products as seedProducts,
  sales as seedSales,
} from '../data/mockData';
import type {
  ActivityEntry,
  AppSettings,
  Expense,
  Product,
  SaleTransaction,
} from '../types/models';

SQLite.enablePromise(false);

type DatabaseShape = {
  activityFeed: ActivityEntry[];
  expenses: Expense[];
  products: Product[];
  sales: SaleTransaction[];
  settings: AppSettings;
};

type SQLiteDatabase = {
  executeSql: (
    sql: string,
    params?: unknown[],
    success?: (result: SQLiteResultSet) => void,
    error?: (err: unknown) => void,
  ) => void;
  transaction: (
    fn: (tx: SQLiteTransaction) => void,
    error?: (err: unknown) => void,
    success?: () => void,
  ) => void;
};

type SQLiteResultSet = {
  insertId?: number;
  rows: {
    item: (index: number) => Record<string, unknown>;
    length: number;
  };
};

type SQLiteTransaction = {
  executeSql: (
    sql: string,
    params?: unknown[],
    success?: (_tx: unknown, result: SQLiteResultSet) => void,
    error?: (_tx: unknown, err: unknown) => boolean,
  ) => void;
};

const DB_NAME = 'shopapp.db';
const DEFAULT_PRODUCT_CATEGORIES = ['Other'];

let databaseInstance: SQLiteDatabase | null = null;

function getRowArray<T>(result: SQLiteResultSet) {
  const rows: T[] = [];

  for (let index = 0; index < result.rows.length; index += 1) {
    rows.push(result.rows.item(index) as T);
  }

  return rows;
}

function openDatabase() {
  if (databaseInstance) {
    return Promise.resolve(databaseInstance);
  }

  return new Promise<SQLiteDatabase>((resolve, reject) => {
    const db = SQLite.openDatabase(
      { name: DB_NAME, location: 'default' },
      () => {
        databaseInstance = db as SQLiteDatabase;
        resolve(databaseInstance);
      },
      error => {
        reject(error);
      },
    );
  });
}

async function executeSql(sql: string, params: unknown[] = []) {
  const db = await openDatabase();

  return new Promise<SQLiteResultSet>((resolve, reject) => {
    db.executeSql(
      sql,
      params,
      result => resolve(result),
      error => {
        reject(error);
      },
    );
  });
}

async function runTransaction(
  operations: (tx: SQLiteTransaction) => void,
) {
  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    db.transaction(operations, reject, resolve);
  });
}

function serializeProduct(product: Product) {
  return [
    product.id,
    product.name ?? null,
    product.sku ?? null,
    product.category ?? null,
    product.subCategory ?? null,
    JSON.stringify(product.attributes ?? {}),
    product.costPrice ?? 0,
    product.sellingPrice ?? 0,
    product.currentStock ?? 0,
    product.lowStockThreshold ?? 0,
    product.isActive ? 1 : 0,
    product.createdAt ?? Date.now(),
    product.updatedAt ?? Date.now(),
  ];
}

function mapProductRow(row: Record<string, unknown>): Product {
  return {
    attributes: JSON.parse(String(row.attributes_json ?? '{}')),
    category: row.category as Product['category'],
    costPrice: Number(row.cost_price ?? 0),
    createdAt: Number(row.created_at ?? 0),
    currentStock: Number(row.current_stock ?? 0),
    id: String(row.id),
    isActive: Number(row.is_active ?? 0) === 1,
    lowStockThreshold: Number(row.low_stock_threshold ?? 0),
    name: String(row.name ?? ''),
    sellingPrice: Number(row.selling_price ?? 0),
    sku: row.sku ? String(row.sku) : undefined,
    subCategory: row.sub_category ? String(row.sub_category) : undefined,
    updatedAt: Number(row.updated_at ?? 0),
  };
}

function mapSaleRow(row: Record<string, unknown>): SaleTransaction {
  return {
    actualSoldPrice: Number(row.actual_sold_price ?? 0),
    category: row.category as SaleTransaction['category'],
    currency: 'ETB',
    id: String(row.id),
    notes: row.notes ? String(row.notes) : undefined,
    productAttributesSnapshot: JSON.parse(
      String(row.product_attributes_snapshot_json ?? '{}'),
    ),
    productId: String(row.product_id ?? ''),
    productName: String(row.product_name ?? ''),
    productSku: row.product_sku ? String(row.product_sku) : undefined,
    quantitySold: Number(row.quantity_sold ?? 0),
    soldAt: Number(row.sold_at ?? 0),
    totalProfit: Number(row.total_profit ?? 0),
    totalRevenue: Number(row.total_revenue ?? 0),
    unitCostPrice: Number(row.unit_cost_price ?? 0),
    unitSellingPrice: Number(row.unit_selling_price ?? 0),
  };
}

function mapExpenseRow(row: Record<string, unknown>): Expense {
  return {
    amount: Number(row.amount ?? 0),
    category: row.category as Expense['category'],
    currency: 'ETB',
    expenseDate: Number(row.expense_date ?? 0),
    id: String(row.id),
    notes: row.notes ? String(row.notes) : undefined,
    recordedAt: Number(row.recorded_at ?? 0),
    title: String(row.title ?? ''),
  };
}

function mapActivityRow(row: Record<string, unknown>): ActivityEntry {
  return {
    amount: Number(row.amount ?? 0),
    id: String(row.id),
    timestamp: String(row.timestamp_text ?? ''),
    title: String(row.title ?? ''),
    type: row.type as ActivityEntry['type'],
  };
}

export async function initializeDatabase() {
  await executeSql(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value_json TEXT NOT NULL
    )
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      sku TEXT,
      category TEXT,
      sub_category TEXT,
      attributes_json TEXT NOT NULL,
      cost_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      current_stock INTEGER NOT NULL,
      low_stock_threshold INTEGER NOT NULL,
      is_active INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      product_sku TEXT,
      category TEXT,
      product_attributes_snapshot_json TEXT NOT NULL,
      quantity_sold INTEGER NOT NULL,
      unit_cost_price REAL NOT NULL,
      unit_selling_price REAL NOT NULL,
      actual_sold_price REAL NOT NULL,
      total_revenue REAL NOT NULL,
      total_profit REAL NOT NULL,
      sold_at INTEGER NOT NULL,
      notes TEXT
    )
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      amount REAL NOT NULL,
      expense_date INTEGER NOT NULL,
      recorded_at INTEGER NOT NULL,
      notes TEXT
    )
  `);

  await executeSql(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      timestamp_text TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `);

  const countResult = await executeSql('SELECT COUNT(*) as count FROM products');
  const count = Number(countResult.rows.item(0)?.count ?? 0);
  const settingsResult = await executeSql(
    "SELECT COUNT(*) as count FROM app_settings WHERE key = 'productCategories'",
  );
  const settingsCount = Number(settingsResult.rows.item(0)?.count ?? 0);

  if (settingsCount === 0) {
    await executeSql(
      'INSERT INTO app_settings (key, value_json) VALUES (?, ?)',
      ['productCategories', JSON.stringify(DEFAULT_PRODUCT_CATEGORIES)],
    );
  }

  if (count > 0) {
    return;
  }

  await runTransaction(tx => {
    seedProducts.forEach(product => {
      tx.executeSql(
        `INSERT INTO products (
          id, name, sku, category, sub_category, attributes_json,
          cost_price, selling_price, current_stock, low_stock_threshold,
          is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        serializeProduct(product),
      );
    });

    seedSales.forEach(sale => {
      tx.executeSql(
        `INSERT INTO sales (
          id, product_id, product_name, product_sku, category,
          product_attributes_snapshot_json, quantity_sold, unit_cost_price,
          unit_selling_price, actual_sold_price, total_revenue, total_profit,
          sold_at, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sale.id,
          sale.productId ?? '',
          sale.productName ?? '',
          sale.productSku ?? null,
          sale.category ?? null,
          JSON.stringify(sale.productAttributesSnapshot ?? {}),
          sale.quantitySold ?? 0,
          sale.unitCostPrice ?? 0,
          sale.unitSellingPrice ?? 0,
          sale.actualSoldPrice ?? sale.unitSellingPrice ?? 0,
          sale.totalRevenue ?? 0,
          sale.totalProfit ?? 0,
          sale.soldAt ?? Date.now(),
          sale.notes ?? null,
        ],
      );
    });

    seedExpenses.forEach(expense => {
      tx.executeSql(
        `INSERT INTO expenses (
          id, title, category, amount, expense_date, recorded_at, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.id,
          expense.title ?? '',
          expense.category ?? null,
          expense.amount ?? 0,
          expense.expenseDate ?? Date.now(),
          expense.recordedAt ?? Date.now(),
          expense.notes ?? null,
        ],
      );
    });

    seedActivityFeed.forEach((entry, index) => {
      tx.executeSql(
        `INSERT INTO activity_logs (
          id, type, title, amount, timestamp_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.type ?? 'sale',
          entry.title ?? '',
          entry.amount ?? 0,
          entry.timestamp ?? '',
          Date.now() - index,
        ],
      );
    });
  });
}

export async function loadDatabaseState(): Promise<DatabaseShape> {
  await initializeDatabase();

  const [productsResult, salesResult, expensesResult, activityResult, settingsResult] =
    await Promise.all([
      executeSql('SELECT * FROM products ORDER BY created_at DESC'),
      executeSql('SELECT * FROM sales ORDER BY sold_at DESC'),
      executeSql('SELECT * FROM expenses ORDER BY expense_date DESC'),
      executeSql('SELECT * FROM activity_logs ORDER BY created_at DESC'),
      executeSql("SELECT value_json FROM app_settings WHERE key = 'productCategories'"),
    ]);

  const settingsRow = settingsResult.rows.length > 0 ? settingsResult.rows.item(0) : null;

  return {
    activityFeed: getRowArray<Record<string, unknown>>(activityResult).map(mapActivityRow),
    expenses: getRowArray<Record<string, unknown>>(expensesResult).map(mapExpenseRow),
    products: getRowArray<Record<string, unknown>>(productsResult).map(mapProductRow),
    sales: getRowArray<Record<string, unknown>>(salesResult).map(mapSaleRow),
    settings: {
      productCategories: settingsRow?.value_json
        ? JSON.parse(String(settingsRow.value_json))
        : DEFAULT_PRODUCT_CATEGORIES,
    },
  };
}

export async function insertProduct(product: Product) {
  await executeSql(
    `INSERT INTO products (
      id, name, sku, category, sub_category, attributes_json,
      cost_price, selling_price, current_stock, low_stock_threshold,
      is_active, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    serializeProduct(product),
  );
}

export async function updateProductRecord(product: Product) {
  await executeSql(
    `UPDATE products
      SET name = ?, sku = ?, category = ?, sub_category = ?, attributes_json = ?,
          cost_price = ?, selling_price = ?, current_stock = ?, low_stock_threshold = ?,
          is_active = ?, updated_at = ?
      WHERE id = ?`,
    [
      product.name ?? '',
      product.sku ?? null,
      product.category ?? null,
      product.subCategory ?? null,
      JSON.stringify(product.attributes ?? {}),
      product.costPrice ?? 0,
      product.sellingPrice ?? 0,
      product.currentStock ?? 0,
      product.lowStockThreshold ?? 0,
      product.isActive ? 1 : 0,
      product.updatedAt ?? Date.now(),
      product.id,
    ],
  );
}

export async function insertExpenseWithActivity(
  expense: Expense,
  activity: ActivityEntry,
) {
  await runTransaction(tx => {
    tx.executeSql(
      `INSERT INTO expenses (
        id, title, category, amount, expense_date, recorded_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        expense.id,
        expense.title ?? '',
        expense.category ?? null,
        expense.amount ?? 0,
        expense.expenseDate ?? Date.now(),
        expense.recordedAt ?? Date.now(),
        expense.notes ?? null,
      ],
    );
    tx.executeSql(
      `INSERT INTO activity_logs (
        id, type, title, amount, timestamp_text, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        activity.id,
        activity.type ?? 'expense',
        activity.title ?? '',
        activity.amount ?? 0,
        activity.timestamp ?? '',
        Date.now(),
      ],
    );
  });
}

export async function insertSaleAndAdjustStock(
  sale: SaleTransaction,
  activity: ActivityEntry,
  nextStock: number,
) {
  await runTransaction(tx => {
    tx.executeSql(
      `INSERT INTO sales (
        id, product_id, product_name, product_sku, category,
        product_attributes_snapshot_json, quantity_sold, unit_cost_price,
        unit_selling_price, actual_sold_price, total_revenue, total_profit,
        sold_at, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sale.id,
        sale.productId ?? '',
        sale.productName ?? '',
        sale.productSku ?? null,
        sale.category ?? null,
        JSON.stringify(sale.productAttributesSnapshot ?? {}),
        sale.quantitySold ?? 0,
        sale.unitCostPrice ?? 0,
        sale.unitSellingPrice ?? 0,
        sale.actualSoldPrice ?? 0,
        sale.totalRevenue ?? 0,
        sale.totalProfit ?? 0,
        sale.soldAt ?? Date.now(),
        sale.notes ?? null,
      ],
    );
    tx.executeSql(
      'UPDATE products SET current_stock = ?, updated_at = ? WHERE id = ?',
      [nextStock, Date.now(), sale.productId ?? ''],
    );
    tx.executeSql(
      `INSERT INTO activity_logs (
        id, type, title, amount, timestamp_text, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        activity.id,
        activity.type ?? 'sale',
        activity.title ?? '',
        activity.amount ?? 0,
        activity.timestamp ?? '',
        Date.now(),
      ],
    );
  });
}

export async function saveProductCategories(productCategories: string[]) {
  await executeSql(
    'INSERT OR REPLACE INTO app_settings (key, value_json) VALUES (?, ?)',
    ['productCategories', JSON.stringify(productCategories)],
  );
}
