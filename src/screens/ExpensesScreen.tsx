import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { DateField } from '../components/DateField';
import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
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
  const { addExpense, expenses } = useAppStore();
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');

  const handleSaveExpense = async () => {
    if (!title.trim() || !amount) {
      setFeedback({
        message: 'Enter both the expense title and amount.',
        status: 'error',
      });
      return;
    }

    const result = await addExpense({
      amount: Number(amount),
      expenseDate: expenseDate.getTime(),
      title,
    });

    if (!result.success) {
      setFeedback({
        message: result.error ?? 'Unable to save expense.',
        status: 'error',
      });
      return;
    }

    setTitle('');
    setAmount('');
    setExpenseDate(new Date());
    setIsCreating(false);
    setFeedback({
      message: copy.expenses.successMessage,
      status: 'success',
    });
  };

  return (
    <Screen
      title={copy.expenses.title}
      subtitle={isCreating ? copy.expenses.addFormSubtitle : copy.expenses.subtitle}
      headerAction={{
        label: isCreating ? copy.expenses.cancelAction : copy.expenses.addAction,
        onPress: () => setIsCreating(current => !current),
      }}
      footer={
        isCreating ? (
          <PrimaryButton label={copy.expenses.saveButton} onPress={handleSaveExpense} />
        ) : undefined
      }>
      {isCreating ? (
        <SectionCard title={copy.expenses.addTitle}>
        <TextInput
          onChangeText={setTitle}
          placeholder={copy.expenses.whatDidYouBuy}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={title}
        />
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder={copy.expenses.howMuch}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={amount}
        />
        <DateField
          date={expenseDate}
          label={copy.expenses.expenseDate}
          onChange={setExpenseDate}
        />
      </SectionCard>
      ) : (
      <SectionCard title={copy.expenses.recentTitle}>
        {expenses.map(expense => (
          <View key={expense.id} style={styles.row}>
            <View>
              <Text style={styles.title}>{expense.title}</Text>
              <Text style={styles.meta}>
                {formatRelativeExpenseTime(expense.expenseDate ?? Date.now())}
              </Text>
            </View>
            <Text style={styles.amount}>-{formatCurrency(expense.amount ?? 0)}</Text>
          </View>
        ))}
      </SectionCard>
      )}
      <FeedbackPopup
        message={feedback?.message ?? ''}
        onClose={() => setFeedback(null)}
        status={feedback?.status ?? 'success'}
        visible={Boolean(feedback)}
      />
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
