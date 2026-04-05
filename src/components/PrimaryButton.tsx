import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'solid' | 'ghost';
};

export function PrimaryButton({
  label,
  onPress,
  variant = 'solid',
}: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isGhost ? styles.ghostButton : styles.solidButton,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, isGhost ? styles.ghostLabel : styles.solidLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  solidButton: {
    backgroundColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: colors.surfaceMuted,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  solidLabel: {
    color: colors.surface,
  },
  ghostLabel: {
    color: colors.text,
  },
});
