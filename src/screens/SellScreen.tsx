import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DateField } from '../components/DateField';
import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

export function SellScreen() {
  const { products, recordSaleAsync, sales } = useAppStore();
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [quantityText, setQuantityText] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
  const [soldAt, setSoldAt] = useState(new Date());
  const [soldPriceText, setSoldPriceText] = useState(
    String(products[0]?.sellingPrice ?? ''),
  );

  const filteredProducts = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(product =>
      product.name?.toLowerCase().includes(query),
    );
  }, [products, searchText]);

  const selectedProduct =
    products.find(product => product.id === selectedProductId) ?? filteredProducts[0];
  const quantitySold = Number(quantityText) || 0;
  const actualSoldPrice = Number(soldPriceText) || 0;
  const expectedTotal = actualSoldPrice * quantitySold;

  const handleConfirmSale = async () => {
    if (!selectedProduct?.id) {
      setFeedback({
        message: 'Select a product first.',
        status: 'error',
      });
      return;
    }

    const result = await recordSaleAsync({
      actualSoldPrice,
      productId: selectedProduct.id,
      quantitySold,
      soldAt: soldAt.getTime(),
    });

    if (!result.success) {
      setFeedback({
        message: result.error ?? 'Unable to record sale.',
        status: 'error',
      });
      return;
    }

    setFeedback({
      message: copy.sell.successMessage,
      status: 'success',
    });
    setQuantityText('1');
    setSearchText('');
    setSelectedProductId(selectedProduct.id);
    setSoldPriceText(String(selectedProduct.sellingPrice ?? ''));
    setSoldAt(new Date());
    setIsCreating(false);
  };

  return (
    <Screen
      title={copy.sell.title}
      subtitle={isCreating ? copy.sell.addFormSubtitle : copy.sell.subtitle}
      headerAction={{
        label: isCreating ? copy.sell.cancelAction : copy.sell.addAction,
        onPress: () => setIsCreating(current => !current),
      }}
      footer={
        isCreating ? (
          <PrimaryButton label={copy.sell.confirmButton} onPress={handleConfirmSale} />
        ) : undefined
      }>
      {isCreating ? (
        <>
      <SectionCard title={copy.sell.selectProduct}>
        <TextInput
          onChangeText={setSearchText}
          placeholder={copy.sell.searchPlaceholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={searchText}
        />
        <Text style={styles.helperText}>{copy.sell.helper}</Text>
        {filteredProducts.length > 0 ? (
          filteredProducts.slice(0, 4).map(product => {
            const active = product.id === selectedProduct?.id;

            return (
              <Pressable
                key={product.id}
                onPress={() => {
                  setSelectedProductId(product.id);
                  setSearchText(product.name ?? '');
                  setSoldPriceText(String(product.sellingPrice ?? ''));
                  setFeedback(null);
                }}
                style={[styles.selectionCard, active && styles.activeSelectionCard]}>
                <Text style={styles.selectionTitle}>{product.name}</Text>
                <Text style={styles.selectionMeta}>
                  {copy.sell.sellingAt} {formatCurrency(product.sellingPrice ?? 0)} ·{' '}
                  {product.currentStock ?? 0} {copy.sell.inStock}
                </Text>
              </Pressable>
            );
          })
        ) : (
          <Text style={styles.helperText}>{copy.sell.emptyState}</Text>
        )}
      </SectionCard>

      <SectionCard title={copy.sell.saleDetails}>
        <Text style={styles.fieldLabel}>{copy.sell.quantitySold}</Text>
        <TextInput
          keyboardType="number-pad"
          onChangeText={setQuantityText}
          style={styles.input}
          value={quantityText}
        />
        <Text style={styles.fieldLabel}>{copy.sell.actualSoldPrice}</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setSoldPriceText}
          style={styles.input}
          value={soldPriceText}
        />
        <DateField date={soldAt} label={copy.sell.soldDate} onChange={setSoldAt} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{copy.sell.expectedTotal}</Text>
          <Text style={styles.summaryValue}>{formatCurrency(expectedTotal)}</Text>
        </View>
      </SectionCard>
      </>
      ) : (
        <SectionCard title={copy.sell.recentTitle}>
          {sales.length > 0 ? (
            sales.map(sale => (
              <View key={sale.id} style={styles.historyRow}>
                <View style={styles.historyInfo}>
                  <Text style={styles.selectionTitle}>{sale.productName}</Text>
                  <Text style={styles.selectionMeta}>
                    {sale.quantitySold} sold ·{' '}
                    {new Date(sale.soldAt ?? Date.now()).toLocaleDateString('en-ET', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Text style={styles.historyAmount}>
                  {formatCurrency(sale.totalRevenue ?? 0)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.helperText}>{copy.sell.noSales}</Text>
          )}
        </SectionCard>
      )}
      <FeedbackPopup
        message={feedback?.message ?? ''}
        onClose={() => setFeedback(null)}
        status={feedback?.status ?? 'success'}
        visible={Boolean(feedback)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  selectionCard: {
    backgroundColor: '#F3E7D7',
    borderRadius: radius.md,
    gap: spacing.xs,
    padding: spacing.md,
  },
  activeSelectionCard: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  selectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  selectionMeta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  historyRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  historyAmount: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '800',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
