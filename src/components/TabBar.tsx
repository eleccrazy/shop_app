import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

export type TabKey = 'dashboard' | 'products' | 'sell' | 'expenses';

type TabConfig = {
  key: TabKey;
  label: string;
  icon: string;
};

type TabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

const tabs: TabConfig[] = [
  { key: 'dashboard', label: 'Home', icon: '◌' },
  { key: 'products', label: 'Products', icon: '□' },
  { key: 'sell', label: 'Sell', icon: '＋' },
  { key: 'expenses', label: 'Expenses', icon: '△' },
];

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.wrapper}>
      {tabs.map(tab => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={[styles.tab, active && styles.activeTab]}>
            <Text style={[styles.icon, active && styles.activeText]}>{tab.icon}</Text>
            <Text style={[styles.label, active && styles.activeText]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.md,
    flex: 1,
    gap: 2,
    paddingVertical: spacing.sm,
  },
  activeTab: {
    backgroundColor: colors.surfaceMuted,
  },
  icon: {
    color: colors.tabInactive,
    fontSize: 18,
    fontWeight: '800',
  },
  label: {
    color: colors.tabInactive,
    fontSize: 11,
    fontWeight: '700',
  },
  activeText: {
    color: colors.text,
  },
});
