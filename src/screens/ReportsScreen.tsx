import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { activityFeed } from '../data/mockData';
import { colors, spacing } from '../theme';

type ReportsScreenProps = {
  onBack: () => void;
};

export function ReportsScreen({ onBack }: ReportsScreenProps) {
  return (
    <Screen
      title="Reports"
      subtitle="A simple audit trail of sales and expenses."
      footer={<PrimaryButton label="Back to Dashboard" onPress={onBack} variant="ghost" />}>
      <SectionCard title="History">
        {activityFeed.map(entry => (
          <View key={entry.id} style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={styles.title}>{entry.title}</Text>
              <Text style={styles.meta}>{entry.timestamp}</Text>
            </View>
            <Text
              style={[
                styles.amount,
                entry.type === 'sale' ? styles.saleAmount : styles.expenseAmount,
              ]}>
              {entry.type === 'sale' ? '+' : '-'}${entry.amount}
            </Text>
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  amount: {
    fontSize: 17,
    fontWeight: '800',
  },
  saleAmount: {
    color: colors.success,
  },
  expenseAmount: {
    color: colors.danger,
  },
});
