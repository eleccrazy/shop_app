import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { expenses } from '../data/mockData';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

function formatRelativeExpenseTime(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleString('en-ET', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  });
}

export function ExpensesScreen() {
  return (
    <Screen
      title={copy.expenses.title}
      subtitle={copy.expenses.subtitle}
      footer={<PrimaryButton label={copy.expenses.saveButton} />}>
      <SectionCard title={copy.expenses.addTitle}>
        <TextInput
          editable={false}
          placeholder={copy.expenses.whatDidYouBuy}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value="Transport"
        />
        <TextInput
          editable={false}
          keyboardType="decimal-pad"
          placeholder={copy.expenses.howMuch}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={formatCurrency(12)}
        />
      </SectionCard>

      <SectionCard title={copy.expenses.recentTitle}>
        {expenses.map(expense => (
          <View key={expense.id} style={styles.row}>
            <View>
              <Text style={styles.title}>{expense.title}</Text>
              <Text style={styles.meta}>{formatRelativeExpenseTime(expense.expenseDate)}</Text>
            </View>
            <Text style={styles.amount}>-{formatCurrency(expense.amount)}</Text>
          </View>
        ))}
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  amount: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '800',
  },
});
