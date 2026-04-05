import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { products } from '../data/mockData';
import { colors, radius, spacing } from '../theme';

export function SellScreen() {
  return (
    <Screen
      title="New Sale"
      subtitle="Keep this flow fast for the counter. Search, enter quantity, confirm."
      footer={<PrimaryButton label="Confirm Sale" />}>
      <SectionCard title="Select Product">
        <TextInput
          editable={false}
          placeholder="Search product"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={products[0]?.name ?? ''}
        />
        <View style={styles.selectionCard}>
          <Text style={styles.selectionTitle}>{products[0]?.name}</Text>
          <Text style={styles.selectionMeta}>
            Selling at ${products[0]?.sellingPrice} · {products[0]?.quantity} in stock
          </Text>
        </View>
      </SectionCard>

      <SectionCard title="Sale Details">
        <Text style={styles.fieldLabel}>Quantity Sold</Text>
        <TextInput
          editable={false}
          keyboardType="number-pad"
          style={styles.input}
          value="1"
        />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Expected total</Text>
          <Text style={styles.summaryValue}>$88</Text>
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
