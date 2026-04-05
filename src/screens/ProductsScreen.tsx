import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';
import { radius } from '../theme';
import type { ProductCategory } from '../types/models';

const categoryOptions: Array<ProductCategory | 'All'> = [
  'All',
  'Baby (0-24M)',
  'Toddler (2-5Y)',
  'Kids (6-12Y)',
  'Shoes',
  'Accessories',
];

export function ProductsScreen() {
  const { addProduct, products, updateProduct } = useAppStore();
  const [category, setCategory] = useState<ProductCategory>('Kids (6-12Y)');
  const [costPrice, setCostPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ProductCategory | 'All'>('All');
  const [sellingPrice, setSellingPrice] = useState('');

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'All') {
      return products;
    }

    return products.filter(product => product.category === selectedFilter);
  }, [products, selectedFilter]);

  const isEditing = editingProductId !== null;

  const resetForm = () => {
    setCategory('Kids (6-12Y)');
    setName('');
    setCostPrice('');
    setSellingPrice('');
    setCurrentStock('');
    setEditingProductId(null);
    setIsCreating(false);
  };

  const handleSaveProduct = () => {
    if (!name.trim() || !costPrice || !sellingPrice || !currentStock) {
      setFeedback({
        message: 'Fill in all product fields before saving.',
        status: 'error',
      });
      return;
    }

    if (isEditing && editingProductId) {
      updateProduct({
        category,
        costPrice: Number(costPrice),
        currentStock: Number(currentStock),
        id: editingProductId,
        name,
        sellingPrice: Number(sellingPrice),
      });
    } else {
      addProduct({
        category,
        costPrice: Number(costPrice),
        currentStock: Number(currentStock),
        name,
        sellingPrice: Number(sellingPrice),
      });
    }

    resetForm();
    setFeedback({
      message: isEditing
        ? copy.products.updateSuccessMessage
        : 'Product saved successfully.',
      status: 'success',
    });
  };

  const openCreateForm = () => {
    setIsCreating(true);
  };

  const closeCreateForm = () => {
    resetForm();
  };

  const openEditForm = (productId: string) => {
    const product = products.find(item => item.id === productId);

    if (!product) {
      return;
    }

    setEditingProductId(product.id);
    setCategory(product.category ?? 'Kids (6-12Y)');
    setName(product.name ?? '');
    setCostPrice(String(product.costPrice ?? ''));
    setSellingPrice(String(product.sellingPrice ?? ''));
    setCurrentStock(String(product.currentStock ?? ''));
    setIsCreating(true);
  };

  return (
    <Screen
      title={copy.products.title}
      subtitle={
        isCreating
          ? isEditing
            ? copy.products.editSubtitle
            : copy.products.formSubtitle
          : copy.products.subtitle
      }
      headerAction={{
        label: isCreating ? copy.products.cancelAction : copy.products.addAction,
        onPress: isCreating ? closeCreateForm : openCreateForm,
      }}
      footer={
        isCreating ? (
          <PrimaryButton
            label={isEditing ? copy.products.editButton : copy.products.addButton}
            onPress={handleSaveProduct}
          />
        ) : undefined
      }>
      {isCreating ? (
        <SectionCard
          title={isEditing ? copy.products.editFormTitle : copy.products.formTitle}>
          <TextInput
            onChangeText={setName}
            placeholder={copy.products.namePlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={name}
          />

          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>{copy.products.categoryField}</Text>
          </View>
          <View style={styles.filterRow}>
            {categoryOptions.slice(1).map(option => {
              const active = option === category;

              return (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
                  style={[styles.filterChip, active && styles.activeFilterChip]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.activeFilterChipText,
                    ]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            keyboardType="numeric"
            onChangeText={setCostPrice}
            placeholder={copy.products.costPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={costPrice}
          />
          <TextInput
            keyboardType="numeric"
            onChangeText={setSellingPrice}
            placeholder={copy.products.sellPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={sellingPrice}
          />
          <TextInput
            keyboardType="numeric"
            onChangeText={setCurrentStock}
            placeholder={copy.products.stockPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={currentStock}
          />
        </SectionCard>
      ) : (
        <>
          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>{copy.products.filterLabel}</Text>
          </View>
          <View style={styles.filterRow}>
            {categoryOptions.map(option => {
              const active = option === selectedFilter;

              return (
                <Pressable
                  key={option}
                  onPress={() => setSelectedFilter(option)}
                  style={[styles.filterChip, active && styles.activeFilterChip]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      active && styles.activeFilterChipText,
                    ]}>
                    {option === 'All' ? copy.products.allCategories : option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredProducts.length === 0 ? (
            <Text style={styles.emptyText}>{copy.products.emptyState}</Text>
          ) : null}
        </>
      )}

      {!isCreating &&
        filteredProducts.map(product => (
        <Pressable key={product.id} onPress={() => openEditForm(product.id)}>
          <SectionCard>
            <View style={styles.row}>
              <View style={styles.productInfo}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.meta}>
                  {product.category} · {copy.products.buyLabel}{' '}
                  {formatCurrency(product.costPrice ?? 0)} · {copy.products.sellLabel}{' '}
                  {formatCurrency(product.sellingPrice ?? 0)}
                </Text>
              </View>
              <View
                style={[
                  styles.stockPill,
                  (product.currentStock ?? 0) <= (product.lowStockThreshold ?? 0)
                    ? styles.lowPill
                    : styles.normalPill,
                ]}>
                <Text
                  style={[
                    styles.stockPillText,
                    (product.currentStock ?? 0) <= (product.lowStockThreshold ?? 0)
                      ? styles.lowPillText
                      : styles.normalPillText,
                  ]}>
                  {product.currentStock ?? 0} {copy.products.quantityUnit}
                </Text>
              </View>
            </View>
            <Text style={styles.tapHint}>Tap to update this product</Text>
          </SectionCard>
        </Pressable>
      ))}
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  filterHeader: {
    marginBottom: spacing.xs,
  },
  filterLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  activeFilterChipText: {
    color: colors.surface,
  },
  productInfo: {
    flex: 1,
    paddingRight: spacing.md,
  },
  tapHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  stockPill: {
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lowPill: {
    backgroundColor: '#F9E0DC',
  },
  normalPill: {
    backgroundColor: '#DDEBDD',
  },
  stockPillText: {
    fontSize: 13,
    fontWeight: '800',
  },
  lowPillText: {
    color: colors.danger,
  },
  normalPillText: {
    color: colors.success,
  },
});
