import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { expenses } from '../data/mockData';
import { colors, radius, spacing } from '../theme';

export function ExpensesScreen() {
  return (
    <Screen
      title="Expenses"
      subtitle="Track spending so the profit numbers stay honest."
      footer={<PrimaryButton label="Save Expense" />}>
      <SectionCard title="Add Expense">
        <TextInput
          editable={false}
          placeholder="What did you buy?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value="Transport"
        />
        <TextInput
          editable={false}
          keyboardType="decimal-pad"
          placeholder="How much?"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value="$12"
        />
      </SectionCard>

      <SectionCard title="Recent Expenses">
        {expenses.map(expense => (
          <View key={expense.id} style={styles.row}>
            <View>
              <Text style={styles.title}>{expense.title}</Text>
              <Text style={styles.meta}>{expense.createdAt}</Text>
            </View>
            <Text style={styles.amount}>-${expense.amount}</Text>
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
