import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { products } from '../data/mockData';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

export function SellScreen() {
  const selectedProduct = products[0];
  const expectedTotal = selectedProduct ? selectedProduct.sellingPrice : 0;

  return (
    <Screen
      title={copy.sell.title}
      subtitle={copy.sell.subtitle}
      footer={<PrimaryButton label={copy.sell.confirmButton} />}>
      <SectionCard title={copy.sell.selectProduct}>
        <TextInput
          editable={false}
          placeholder={copy.sell.searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={selectedProduct?.name ?? ''}
        />
        <View style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>{selectedProduct?.name}</Text>
          <Text style={styles.selectionMeta}>
            {copy.sell.sellingAt} {formatCurrency(selectedProduct?.sellingPrice ?? 0)} ·{' '}
            {selectedProduct?.currentStock} {copy.sell.inStock}
          </Text>
        </View>
      </SectionCard>

      <SectionCard title={copy.sell.saleDetails}>
        <Text style={styles.fieldLabel}>{copy.sell.quantitySold}</Text>
        <TextInput
          editable={false}
          keyboardType="number-pad"
          style={styles.input}
          value="1"
        />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{copy.sell.expectedTotal}</Text>
          <Text style={styles.summaryValue}>{formatCurrency(expectedTotal)}</Text>
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  selectionCard: {
    backgroundColor: '#F3E7D7',
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  selectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  selectionMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
});
