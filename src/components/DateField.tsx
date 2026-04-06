import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

type DateFieldProps = {
  date: Date;
  label: string;
  onChange: (date: Date) => void;
};

export function DateField({ date, label, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setShowPicker(true)} style={styles.field}>
        <Text style={styles.value}>
          {date.toLocaleDateString('en-ET', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </Pressable>
      {showPicker ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          mode="date"
          onChange={(_event, selectedDate) => {
            if (Platform.OS !== 'ios') {
              setShowPicker(false);
            }

            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
          value={date}
        />
      ) : null}
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
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
});
