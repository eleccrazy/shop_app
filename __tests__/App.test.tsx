/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-sqlite-storage', () => {
  const executeSql = jest.fn((_sql, _params, success) => {
    success?.(null, {
      rows: {
        item: () => ({ count: 0 }),
        length: 0,
      },
    });
  });

  const transaction = jest.fn((fn, _error, success) => {
    fn({ executeSql });
    success?.();
  });

  return {
    __esModule: true,
    default: {
      enablePromise: jest.fn(),
      openDatabase: jest.fn((_options, success) => {
        const db = { executeSql, transaction };
        success?.();
        return db;
      }),
    },
  };
});

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('@react-native-firebase/firestore', () => {
  const documentRef = {
    get: jest.fn(async () => ({
      data: () => undefined,
      exists: false,
    })),
    set: jest.fn(async () => undefined),
    update: jest.fn(async () => undefined),
  };

  const collectionRef = {
    doc: jest.fn(() => documentRef),
    get: jest.fn(async () => ({ docs: [] })),
    where: jest.fn(() => ({
      get: jest.fn(async () => ({ docs: [] })),
    })),
  };

  return {
    __esModule: true,
    default: jest.fn(() => ({
      batch: jest.fn(() => ({
        commit: jest.fn(async () => undefined),
        set: jest.fn(),
        update: jest.fn(),
      })),
      collection: jest.fn(() => collectionRef),
    })),
  };
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  await ReactTestRenderer.act(() => {
    renderer?.unmount();
  });
});
