import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { products } from '../data/mockData';
import { colors, spacing } from '../theme';

export function ProductsScreen() {
  return (
    <Screen
      title="Products"
      subtitle="Your inventory master list with pricing and stock levels."
      footer={<PrimaryButton label="+ Add Product" />}>
      {products.map(product => (
        <SectionCard key={product.id}>
          <View style={styles.row}>
            <View style={styles.productInfo}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.meta}>
                {product.category} · Buy ${product.buyingPrice} · Sell $
                {product.sellingPrice}
              </Text>
            </View>
            <View
              style={[
                styles.stockPill,
                product.quantity <= 5 ? styles.lowPill : styles.normalPill,
              ]}>
              <Text
                style={[
                  styles.stockPillText,
                  product.quantity <= 5 ? styles.lowPillText : styles.normalPillText,
                ]}>
                {product.quantity} pcs
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
