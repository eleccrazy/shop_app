import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, radius, spacing } from '../theme';

type SettingsScreenProps = {
  onBack: () => void;
};

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { addProductCategory, removeProductCategory, settings } = useAppStore();
  const [categoryName, setCategoryName] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);

  const handleAddCategory = async () => {
    const result = await addProductCategory(categoryName);

    if (!result.success) {
      setFeedback({
        message: result.error ?? 'Unable to save category.',
        status: 'error',
      });
      return;
    }

    setCategoryName('');
    setFeedback({
      message: copy.settings.successMessage,
      status: 'success',
    });
  };

  const handleRemoveCategory = async (category: string) => {
    const result = await removeProductCategory(category);

    if (!result.success) {
      setFeedback({
        message: result.error ?? 'Unable to remove category.',
        status: 'error',
      });
      return;
    }

    setFeedback({
      message: copy.settings.removeSuccessMessage,
      status: 'success',
    });
  };

  return (
    <Screen
      title={copy.settings.title}
      subtitle={copy.settings.subtitle}
      footer={
        <PrimaryButton
          label={copy.settings.backButton}
          onPress={onBack}
          variant="ghost"
        />
      }>
      <SectionCard title={copy.settings.categoriesTitle}>
        <TextInput
          onChangeText={setCategoryName}
          placeholder={copy.settings.addPlaceholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={categoryName}
        />
        <PrimaryButton label={copy.settings.saveButton} onPress={handleAddCategory} />
      </SectionCard>

      <SectionCard title={copy.settings.addCategory}>
        {settings.productCategories.length > 0 ? (
          settings.productCategories.map(category => (
            <View key={category} style={styles.row}>
              <Text style={styles.categoryName}>{category}</Text>
              <Pressable
                onPress={() => handleRemoveCategory(category)}
                style={styles.removeChip}>
                <Text style={styles.removeChipText}>{copy.settings.removeLabel}</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>{copy.settings.emptyState}</Text>
        )}
      </SectionCard>

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
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  removeChip: {
    backgroundColor: '#F9E0DC',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  removeChipText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
