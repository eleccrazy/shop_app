import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TabBar, type TabKey } from '../components/TabBar';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { SellScreen } from '../screens/SellScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors, spacing } from '../theme';

type RouteKey = TabKey | 'reports' | 'settings';

export function AppNavigator() {
  const [route, setRoute] = useState<RouteKey>('dashboard');
  const activeTab: TabKey =
    route === 'reports' || route === 'settings' ? 'dashboard' : route;

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {route === 'dashboard' ? (
          <DashboardScreen
            onOpenReports={() => setRoute('reports')}
            onOpenSettings={() => setRoute('settings')}
          />
        ) : null}
        {route === 'products' ? <ProductsScreen /> : null}
        {route === 'sell' ? <SellScreen /> : null}
        {route === 'expenses' ? <ExpensesScreen /> : null}
        {route === 'reports' ? (
          <ReportsScreen onBack={() => setRoute('dashboard')} />
        ) : null}
        {route === 'settings' ? (
          <SettingsScreen onBack={() => setRoute('dashboard')} />
        ) : null}
      </View>

      {route !== 'reports' && route !== 'settings' ? (
        <View style={styles.tabContainer}>
          <TabBar activeTab={activeTab} onTabPress={setRoute} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  tabContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
});
