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
  leadingAction?: {
    accessibilityLabel?: string;
    icon: string;
    onPress?: () => void;
  };
  headerAction?: {
    accessibilityLabel?: string;
    icon?: string;
    label?: string;
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
  leadingAction,
  headerAction,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.content, contentContainerStyle]}>
      <View style={styles.header}>
        {leadingAction ? (
          <Pressable
            accessibilityLabel={leadingAction.accessibilityLabel}
            hitSlop={10}
            onPress={leadingAction.onPress}
            style={styles.leadingAction}>
            <Text style={styles.leadingActionIcon}>{leadingAction.icon}</Text>
          </Pressable>
        ) : null}
        <View style={styles.headerTopRow}>
          <Text style={styles.title}>{title}</Text>
          {headerAction ? (
            <Pressable
              accessibilityLabel={headerAction.accessibilityLabel}
              onPress={headerAction.onPress}
              style={[
                styles.headerAction,
                headerAction.icon && !headerAction.label
                  ? styles.headerIconAction
                  : null,
              ]}>
              {headerAction.icon ? (
                <Text style={styles.headerActionIcon}>{headerAction.icon}</Text>
              ) : null}
              {headerAction.label ? (
                <Text style={styles.headerActionText}>{headerAction.label}</Text>
              ) : null}
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
  leadingAction: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 48,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    marginLeft: -8,
    width: 48,
  },
  leadingActionIcon: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 32,
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
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerIconAction: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.primaryDark,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: colors.primaryDark,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    width: 40,
    elevation: 3,
  },
  headerActionIcon: {
    color: colors.primaryDark,
    fontSize: 19,
    fontWeight: '800',
  },
  headerActionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    shadowColor: '#6B4A2D',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
});
