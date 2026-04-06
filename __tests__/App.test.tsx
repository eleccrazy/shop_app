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

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
