import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

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
  const [routeHistory, setRouteHistory] = useState<RouteKey[]>(['dashboard']);
  const route = routeHistory[routeHistory.length - 1] ?? 'dashboard';
  const activeTab: TabKey =
    route === 'reports' || route === 'settings' ? 'dashboard' : route;
  const canGoBack = routeHistory.length > 1;

  const navigateTo = useCallback((nextRoute: RouteKey) => {
    setRouteHistory(currentHistory => {
      const currentRoute = currentHistory[currentHistory.length - 1];

      if (currentRoute === nextRoute) {
        return currentHistory;
      }

      return [...currentHistory, nextRoute];
    });
  }, []);

  const goBack = useCallback(() => {
    setRouteHistory(currentHistory => {
      if (currentHistory.length <= 1) {
        return currentHistory;
      }

      return currentHistory.slice(0, -1);
    });
  }, []);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!canGoBack) {
        return false;
      }

      goBack();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [canGoBack, goBack]);

  const screens = useMemo(
    () => ({
      dashboard: (
        <DashboardScreen
          onOpenReports={() => navigateTo('reports')}
          onOpenSettings={() => navigateTo('settings')}
        />
      ),
      products: <ProductsScreen />,
      sell: <SellScreen />,
      expenses: <ExpensesScreen />,
      reports: <ReportsScreen onBack={goBack} />,
      settings: <SettingsScreen onBack={goBack} />,
    }),
    [goBack, navigateTo],
  );

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {screens[route]}
      </View>

      {route !== 'reports' && route !== 'settings' ? (
        <View style={styles.tabContainer}>
          <TabBar activeTab={activeTab} onTabPress={navigateTo} />
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
