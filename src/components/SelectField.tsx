import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

type SelectFieldProps = {
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  value: string;
};

export function SelectField({
  label,
  onSelect,
  options,
  value,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.field}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>
      <Modal animationType="fade" transparent visible={open}>
        <Pressable onPress={() => setOpen(false)} style={styles.backdrop}>
          <View style={styles.sheet}>
            {options.map(option => (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  setOpen(false);
                }}
                style={[styles.option, option === value && styles.activeOption]}>
                <Text
                  style={[
                    styles.optionText,
                    option === value && styles.activeOptionText,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  field: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '800',
  },
  backdrop: {
    backgroundColor: 'rgba(29,27,22,0.35)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  option: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  activeOption: {
    backgroundColor: colors.surfaceMuted,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  activeOptionText: {
    color: colors.primaryDark,
  },
});
