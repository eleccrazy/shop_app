import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import {
  lowStockProducts,
  todaysExpensesTotal,
  todaysProfitTotal,
  todaysSalesTotal,
} from '../data/mockData';
import { colors, spacing } from '../theme';

type DashboardScreenProps = {
  onOpenReports: () => void;
};

export function DashboardScreen({ onOpenReports }: DashboardScreenProps) {
  return (
    <Screen
      title="Today at a Glance"
      subtitle="A fast view of sales, spending, profit, and what needs restocking.">
      <View style={styles.statGrid}>
        <StatCard
          accentColor="#F4D8C8"
          icon="💰"
          label="Today's Sales"
          value={`$${todaysSalesTotal}`}
        />
        <StatCard
          accentColor="#F5E2C3"
          icon="📉"
          label="Today's Expenses"
          value={`$${todaysExpensesTotal}`}
        />
        <StatCard
          accentColor="#D6EAD9"
          icon="↗"
          label="Profit"
          value={`$${todaysProfitTotal}`}
        />
        <SectionCard>
          <Text style={styles.promptLabel}>Need details?</Text>
          <Text style={styles.promptText}>
            Open the activity history to audit each sale and expense entry.
          </Text>
          <PrimaryButton label="Open Reports" onPress={onOpenReports} />
        </SectionCard>
      </View>

      <SectionCard title="Low Stock Alerts" actionLabel="Reorder Soon">
        {lowStockProducts.map(product => (
          <View key={product.id} style={styles.stockRow}>
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productMeta}>{product.category}</Text>
            </View>
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>{product.quantity} left</Text>
            </View>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  promptLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  promptText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  stockRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  productMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  stockBadge: {
    backgroundColor: '#F9E0DC',
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stockBadgeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});
