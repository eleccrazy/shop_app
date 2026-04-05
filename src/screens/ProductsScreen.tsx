import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { products } from '../data/mockData';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

export function ProductsScreen() {
  return (
    <Screen
      title={copy.products.title}
      subtitle={copy.products.subtitle}
      footer={<PrimaryButton label={copy.products.addButton} />}>
      {products.map(product => (
        <SectionCard key={product.id}>
          <View style={styles.row}>
            <View style={styles.productInfo}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.meta}>
                {product.category} · {copy.products.buyLabel}{' '}
                {formatCurrency(product.costPrice)} · {copy.products.sellLabel}{' '}
                {formatCurrency(product.sellingPrice)}
              </Text>
            </View>
            <View
              style={[
                styles.stockPill,
                product.currentStock <= product.lowStockThreshold
                  ? styles.lowPill
                  : styles.normalPill,
              ]}>
              <Text
                style={[
                  styles.stockPillText,
                  product.currentStock <= product.lowStockThreshold
                    ? styles.lowPillText
                    : styles.normalPillText,
                ]}>
                {product.currentStock} {copy.products.quantityUnit}
              </Text>
            </View>
          </View>
        </SectionCard>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  stockPill: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lowPill: {
    backgroundColor: '#F9E0DC',
  },
  normalPill: {
    backgroundColor: '#DDEBDD',
  },
  stockPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  lowPillText: {
    color: colors.danger,
  },
  normalPillText: {
    color: colors.success,
  },
});
