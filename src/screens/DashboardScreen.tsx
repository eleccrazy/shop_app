import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

type DashboardScreenProps = {
  onOpenReports: () => void;
};

export function DashboardScreen({ onOpenReports }: DashboardScreenProps) {
  const {
    lowStockProducts,
    todaysExpensesTotal,
    todaysProfitTotal,
    todaysSalesTotal,
  } = useAppStore();

  return (
    <Screen
      title={copy.dashboard.title}
      subtitle={copy.dashboard.subtitle}>
      <View style={styles.statGrid}>
        <StatCard
          accentColor="#F4D8C8"
          icon="📈"
          label={copy.dashboard.salesLabel}
          value={formatCurrency(todaysSalesTotal)}
        />
        <StatCard
          accentColor="#F5E2C3"
          icon="📉"
          label={copy.dashboard.expensesLabel}
          value={formatCurrency(todaysExpensesTotal)}
        />
        <StatCard
          accentColor="#D6EAD9"
          icon="↗"
          label={copy.dashboard.profitLabel}
          value={formatCurrency(todaysProfitTotal)}
        />
        <SectionCard>
          <Text style={styles.promptLabel}>{copy.dashboard.detailsTitle}</Text>
          <Text style={styles.promptText}>
            {copy.dashboard.detailsText}
          </Text>
          <PrimaryButton label={copy.dashboard.openReports} onPress={onOpenReports} />
        </SectionCard>
      </View>

      <SectionCard
        title={copy.dashboard.lowStockTitle}
        actionLabel={copy.dashboard.lowStockAction}>
        {lowStockProducts.length > 0 ? (
          lowStockProducts.map(product => (
            <View key={product.id} style={styles.stockRow}>
              <View>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {product.category}
                  {product.attributes?.size ? ` · ${product.attributes.size}` : ''}
                </Text>
              </View>
              <View style={styles.stockBadge}>
                <Text style={styles.stockBadgeText}>
                  {copy.dashboard.stockLeft(product.currentStock ?? 0)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.promptText}>All current products are above low stock level.</Text>
        )}
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
