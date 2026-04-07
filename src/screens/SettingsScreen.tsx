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
  const { addProductCategory, renameStoredProductCategory, settings } = useAppStore();
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [renameValue, setRenameValue] = useState('');

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

  const handleRenameCategory = async () => {
    if (!editingCategory) {
      return;
    }

    const result = await renameStoredProductCategory(editingCategory, renameValue);

    if (!result.success) {
      setFeedback({
        message: result.error ?? 'Unable to rename category.',
        status: 'error',
      });
      return;
    }

    setEditingCategory(null);
    setRenameValue('');
    setFeedback({
      message: copy.settings.renameSuccessMessage,
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
              <View style={styles.categoryTextWrap}>
                <Text style={styles.categoryName}>{category}</Text>
                {editingCategory === category ? (
                  <View style={styles.renameRow}>
                    <TextInput
                      onChangeText={setRenameValue}
                      placeholder={copy.settings.renamePlaceholder}
                      placeholderTextColor={colors.textMuted}
                      style={styles.renameInput}
                      value={renameValue}
                    />
                    <Pressable
                      onPress={handleRenameCategory}
                      style={styles.editChip}>
                      <Text style={styles.editChipText}>{copy.settings.renameButton}</Text>
                    </Pressable>
                  </View>
                ) : null}
              </View>
              <Pressable
                onPress={() => {
                  setEditingCategory(category);
                  setRenameValue(category);
                }}
                style={styles.editChip}>
                <Text style={styles.editChipText}>{copy.settings.editLabel}</Text>
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
  },
  categoryName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  renameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  renameInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  editChip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  editChipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
