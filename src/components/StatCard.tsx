import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

type StatCardProps = {
  accentColor: string;
  icon: string;
  label: string;
  value: string;
};

export function StatCard({ accentColor, icon, label, value }: StatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: accentColor }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    minHeight: 124,
    padding: spacing.lg,
    width: '48%',
  },
  icon: {
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.72,
    textTransform: 'uppercase',
  },
  value: {
    color: colors.text,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: spacing.sm,
  },
});
