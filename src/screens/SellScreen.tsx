import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, radius, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';

export function SellScreen() {
  const { products, recordSale } = useAppStore();
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [quantityText, setQuantityText] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '');
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

  const handleConfirmSale = () => {
    if (!selectedProduct?.id) {
      setFeedback({
        message: 'Select a product first.',
        status: 'error',
      });
      return;
    }

    const result = recordSale({
      actualSoldPrice,
      productId: selectedProduct.id,
      quantitySold,
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
  };

  return (
    <Screen
      title={copy.sell.title}
      subtitle={copy.sell.subtitle}
      footer={<PrimaryButton label={copy.sell.confirmButton} onPress={handleConfirmSale} />}>
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
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{copy.sell.expectedTotal}</Text>
          <Text style={styles.summaryValue}>{formatCurrency(expectedTotal)}</Text>
        </View>
      </SectionCard>
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
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
