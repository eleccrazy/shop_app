import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

type DashboardScreenProps = {
  onOpenReports: () => void;
  onOpenSettings: () => void;
};

type InsightKey = 'expenses' | 'profit' | 'sales';

const insightConfig: Record<
  InsightKey,
  {
    accentColor: string;
    eyebrow: string;
    icon: string;
    summary: string;
  }
> = {
  sales: {
    accentColor: colors.salesCard,
    eyebrow: 'Sales pulse',
    icon: '↗',
    summary: 'Check top-line cash coming in from today’s sales.',
  },
  expenses: {
    accentColor: colors.expenseCard,
    eyebrow: 'Expense watch',
    icon: '−',
    summary: 'Track money leaving the shop before it dilutes margin.',
  },
  profit: {
    accentColor: colors.profitCard,
    eyebrow: 'Margin health',
    icon: '◎',
    summary: 'Use profit as the clean read on whether today is strong.',
  },
};

export function DashboardScreen({
  onOpenReports,
  onOpenSettings,
}: DashboardScreenProps) {
  const {
    activityFeed,
    lowStockProducts,
    todaysExpensesTotal,
    todaysProfitTotal,
    todaysSalesTotal,
  } = useAppStore();
  const [activeInsight, setActiveInsight] = useState<InsightKey>('sales');
  const heroFade = useRef(new Animated.Value(0)).current;
  const heroLift = useRef(new Animated.Value(18)).current;
  const cardsFade = useRef(new Animated.Value(0)).current;
  const cardsLift = useRef(new Animated.Value(24)).current;
  const detailFade = useRef(new Animated.Value(0)).current;
  const detailLift = useRef(new Animated.Value(28)).current;
  const glow = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(heroFade, {
          duration: 420,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(heroLift, {
          duration: 420,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(cardsFade, {
          duration: 380,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(cardsLift, {
          duration: 380,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(detailFade, {
          duration: 380,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(detailLift, {
          duration: 380,
          easing: Easing.out(Easing.cubic),
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          toValue: 1.04,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          duration: 1800,
          easing: Easing.inOut(Easing.quad),
          toValue: 0.96,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, [cardsFade, cardsLift, detailFade, detailLift, glow, heroFade, heroLift]);

  const activeInsightDetails = useMemo(() => {
    if (activeInsight === 'sales') {
      return {
        body: 'Revenue is useful for speed. Pair it with profit before deciding to restock aggressively.',
        callout:
          todaysSalesTotal > 0
            ? 'Today is active. Use the reports view to audit each transaction.'
            : 'No sales yet today. Use this window to tidy products and pricing.',
        value: formatCurrency(todaysSalesTotal),
      };
    }

    if (activeInsight === 'expenses') {
      return {
        body: 'Expenses move quietly. Logging them quickly keeps the profit number honest.',
        callout:
          todaysExpensesTotal > 0
            ? 'You already have cost movement today. Review whether it was operational or inventory-related.'
            : 'No expenses logged yet today. Record cash outflow as it happens.',
        value: formatCurrency(todaysExpensesTotal),
      };
    }

    return {
      body: 'Profit is the dashboard’s strongest signal because it accounts for both selling and cost.',
      callout:
        todaysProfitTotal > 0
          ? 'Margin is positive so far. Keep an eye on low-stock items before momentum stalls.'
          : 'Profit is flat or negative. Review pricing, discounts, and expenses before the day closes.',
      value: formatCurrency(todaysProfitTotal),
    };
  }, [activeInsight, todaysExpensesTotal, todaysProfitTotal, todaysSalesTotal]);

  const heroMessage =
    lowStockProducts.length > 0
      ? `${lowStockProducts.length} product${lowStockProducts.length === 1 ? '' : 's'} need attention soon.`
      : 'Everything currently in stock is sitting above its low-stock threshold.';
  const recentReportItems = activityFeed.slice(0, 2);

  return (
    <Screen
      headerAction={{
        accessibilityLabel: 'Open settings',
        icon: '✦',
        onPress: onOpenSettings,
      }}
      title={copy.dashboard.title}
      subtitle={copy.dashboard.subtitle}>
      <Animated.View
        style={[
          styles.heroCard,
          {
            opacity: heroFade,
            transform: [{ translateY: heroLift }],
          },
        ]}>
        <View style={styles.heroBackdrop}>
          <Animated.View
            style={[
              styles.heroOrbPrimary,
              {
                transform: [{ scale: glow }],
              },
            ]}
          />
          <View style={styles.heroOrbSecondary} />
        </View>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Live Overview</Text>
          </View>
          <Text style={styles.heroCaption}>Tap cards below to shift the focus.</Text>
        </View>
        <Text style={styles.heroTitle}>Run the shop from one glance, then drill in.</Text>
        <Text style={styles.heroText}>{heroMessage}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.statGrid,
          {
            opacity: cardsFade,
            transform: [{ translateY: cardsLift }],
          },
        ]}>
        <MetricCard
          active={activeInsight === 'sales'}
          accentColor={colors.salesCard}
          icon="↗"
          label={copy.dashboard.salesLabel}
          onPress={() => setActiveInsight('sales')}
          summary="Cash in"
          value={formatCurrency(todaysSalesTotal)}
        />
        <MetricCard
          active={activeInsight === 'expenses'}
          accentColor={colors.expenseCard}
          icon="−"
          label={copy.dashboard.expensesLabel}
          onPress={() => setActiveInsight('expenses')}
          summary="Cash out"
          value={formatCurrency(todaysExpensesTotal)}
        />
        <MetricCard
          active={activeInsight === 'profit'}
          accentColor={colors.profitCard}
          icon="◎"
          label={copy.dashboard.profitLabel}
          onPress={() => setActiveInsight('profit')}
          summary="Net result"
          value={formatCurrency(todaysProfitTotal)}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.detailStack,
          {
            opacity: detailFade,
            transform: [{ translateY: detailLift }],
          },
        ]}>
        <SectionCard>
          <View style={styles.insightHeader}>
            <View>
              <Text style={styles.insightEyebrow}>
                {insightConfig[activeInsight].eyebrow}
              </Text>
              <Text style={styles.insightTitle}>
                {insightConfig[activeInsight].summary}
              </Text>
            </View>
            <View
              style={[
                styles.insightIconWrap,
                { backgroundColor: insightConfig[activeInsight].accentColor },
              ]}>
              <Text style={styles.insightIcon}>
                {insightConfig[activeInsight].icon}
              </Text>
            </View>
          </View>
          <Text style={styles.insightValue}>{activeInsightDetails.value}</Text>
          <Text style={styles.promptText}>{activeInsightDetails.body}</Text>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>{activeInsightDetails.callout}</Text>
          </View>
        </SectionCard>

        <View style={styles.reportsCard}>
          <View style={styles.reportsHeader}>
            <View>
              <Text style={styles.reportsEyebrow}>Reports Preview</Text>
              <Text style={styles.reportsTitle}>Recent activity worth checking</Text>
            </View>
            <View style={styles.reportsIconWrap}>
              <Text style={styles.reportsIcon}>▤</Text>
            </View>
          </View>

          {recentReportItems.length > 0 ? (
            recentReportItems.map(entry => (
              <View key={entry.id} style={styles.reportRow}>
                <View style={styles.reportTextWrap}>
                  <Text style={styles.reportTitleText}>{entry.title}</Text>
                  <Text style={styles.reportMetaText}>{entry.timestamp}</Text>
                </View>
                <Text
                  style={[
                    styles.reportAmountText,
                    entry.type === 'sale'
                      ? styles.reportAmountPositive
                      : styles.reportAmountNegative,
                  ]}>
                  {entry.type === 'sale' ? '+' : '-'}
                  {formatCurrency(entry.amount ?? 0)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.reportEmptyState}>
              <Text style={styles.reportEmptyTitle}>No report activity yet.</Text>
              <Text style={styles.promptText}>
                Sales and expenses will start appearing here as soon as you log them.
              </Text>
            </View>
          )}

          <Pressable onPress={onOpenReports} style={styles.seeMoreButton}>
            <Text style={styles.seeMoreButtonText}>See more</Text>
          </Pressable>
        </View>
      </Animated.View>

      <SectionCard
        title={copy.dashboard.lowStockTitle}
        actionLabel={copy.dashboard.lowStockAction}>
        {lowStockProducts.length > 0 ? (
          lowStockProducts.slice(0, 5).map(product => (
            <View key={product.id} style={styles.stockRow}>
              <View style={styles.stockTextWrap}>
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
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateTitle}>Stock is in a healthy range.</Text>
            <Text style={styles.promptText}>
              No urgent restock signal is showing on the dashboard right now.
            </Text>
          </View>
        )}
      </SectionCard>
    </Screen>
  );
}

type MetricCardProps = {
  active: boolean;
  accentColor: string;
  icon: string;
  label: string;
  onPress: () => void;
  summary: string;
  value: string;
};

function MetricCard({
  active,
  accentColor,
  icon,
  label,
  onPress,
  summary,
  value,
}: MetricCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.metricPressable, pressed && styles.metricPressed]}>
      <View
        style={[
          styles.metricCard,
          { backgroundColor: accentColor },
          active && styles.metricCardActive,
        ]}>
        <View style={styles.metricTopRow}>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={styles.metricIcon}>{icon}</Text>
        </View>
        <Text numberOfLines={1} adjustsFontSizeToFit style={styles.metricValue}>
          {value}
        </Text>
        <Text style={styles.metricSummary}>{summary}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.heroBase,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    padding: spacing.xl,
    position: 'relative',
  },
  heroBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOrbPrimary: {
    backgroundColor: colors.heroAccent,
    borderRadius: 999,
    height: 180,
    opacity: 0.35,
    position: 'absolute',
    right: -36,
    top: -52,
    width: 180,
  },
  heroOrbSecondary: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    height: 96,
    opacity: 0.35,
    position: 'absolute',
    right: 32,
    top: 48,
    width: 96,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 249, 242, 0.82)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heroBadgeText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heroCaption: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  heroTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginTop: spacing.lg,
    maxWidth: '78%',
  },
  heroText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: spacing.sm,
    maxWidth: '82%',
  },
  statGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailStack: {
    gap: spacing.lg,
  },
  metricPressable: {
    flex: 1,
    minWidth: 0,
  },
  metricPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.985 }],
  },
  metricCard: {
    borderRadius: radius.lg,
    height: 156,
    justifyContent: 'space-between',
    padding: spacing.lg,
    width: '100%',
  },
  metricCardActive: {
    borderColor: colors.text,
    borderWidth: 1,
  },
  metricTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.76,
    textTransform: 'uppercase',
  },
  metricIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  metricValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: spacing.lg,
    minWidth: 0,
  },
  metricSummary: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
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
  insightHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  insightEyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  insightTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },
  insightIconWrap: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  insightIcon: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  insightValue: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  callout: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  calloutText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  reportsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  reportsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  reportsEyebrow: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  reportsTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: spacing.xs,
  },
  reportsIconWrap: {
    alignItems: 'center',
    backgroundColor: colors.salesCard,
    borderRadius: radius.pill,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  reportsIcon: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  reportRow: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  reportTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  reportTitleText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  reportMetaText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  reportAmountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  reportAmountPositive: {
    color: colors.success,
  },
  reportAmountNegative: {
    color: colors.danger,
  },
  reportEmptyState: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  reportEmptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  seeMoreButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: spacing.lg,
  },
  seeMoreButtonText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stockRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
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
    backgroundColor: colors.lowStockCard,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  stockBadgeText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
  emptyStateCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  emptyStateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
});
