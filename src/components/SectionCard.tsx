import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

type SectionCardProps = PropsWithChildren<{
  title?: string;
  actionLabel?: string;
}>;

export function SectionCard({
  children,
  title,
  actionLabel,
}: SectionCardProps) {
  return (
    <View style={styles.card}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {actionLabel ? <Text style={styles.action}>{actionLabel}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#6B4A2D',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  action: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
