import React, { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

type ScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  scrollable?: boolean;
  footer?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  headerAction?: {
    label: string;
    onPress?: () => void;
  };
}>;

export function Screen({
  children,
  title,
  subtitle,
  scrollable = true,
  footer,
  contentContainerStyle,
  headerAction,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.content, contentContainerStyle]}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>{title}</Text>
          {headerAction ? (
            <Pressable onPress={headerAction.onPress} style={styles.headerAction}>
              <Text style={styles.headerActionText}>{headerAction.label}</Text>
            </Pressable>
          ) : null}
        </View>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.root}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top + spacing.lg, paddingBottom: spacing.xxxl },
          ]}>
          {content}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.nonScrollContent,
            { paddingTop: insets.top + spacing.lg },
          ]}>
          {content}
        </View>
      )}
      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  nonScrollContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  content: {
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  headerTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  headerAction: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerActionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
