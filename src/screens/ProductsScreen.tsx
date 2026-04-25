import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FeedbackPopup } from '../components/FeedbackPopup';
import { PrimaryButton } from '../components/PrimaryButton';
import { SelectField } from '../components/SelectField';
import { Screen } from '../components/Screen';
import { SectionCard } from '../components/SectionCard';
import { copy } from '../content/copy';
import { useAppStore } from '../store/AppStore';
import { colors, spacing } from '../theme';
import { formatCurrency } from '../utils/currency';
import { radius } from '../theme';

const PRODUCTS_PAGE_SIZE = 20;

export function ProductsScreen() {
  const { addProduct, products, settings, updateProduct } = useAppStore();
  const [category, setCategory] = useState('Other');
  const [costPrice, setCostPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    status: 'error' | 'success';
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sellingPrice, setSellingPrice] = useState('');
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PAGE_SIZE);

  const categoryOptions = useMemo(() => {
    const options = ['All', ...settings.productCategories];

    if (category && !options.includes(category)) {
      options.push(category);
    }

    return options;
  }, [category, settings.productCategories]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();

    return products.filter(product => {
      const matchesCategory =
        selectedFilter === 'All' || product.category === selectedFilter;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        product.name,
        product.sku,
        product.subCategory,
        product.category,
        product.attributes?.size,
        product.attributes?.color,
        product.attributes?.brand,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [products, searchText, selectedFilter]);
  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount],
  );
  const hasMoreProducts = visibleCount < filteredProducts.length;

  const isEditing = editingProductId !== null;

  useEffect(() => {
    setVisibleCount(PRODUCTS_PAGE_SIZE);
  }, [searchText, selectedFilter, products.length]);

  const resetForm = () => {
    setCategory('Other');
    setName('');
    setCostPrice('');
    setSellingPrice('');
    setCurrentStock('');
    setEditingProductId(null);
    setIsCreating(false);
  };

  const handleSaveProduct = async () => {
    if (!name.trim() || !costPrice || !sellingPrice || !currentStock) {
      setFeedback({
        message: 'Fill in all product fields before saving.',
        status: 'error',
      });
      return;
    }

    if (isEditing && editingProductId) {
      const result = await updateProduct({
        category,
        costPrice: Number(costPrice),
        currentStock: Number(currentStock),
        id: editingProductId,
        name,
        sellingPrice: Number(sellingPrice),
      });

      if (!result.success) {
        setFeedback({
          message: result.error ?? 'Unable to update product.',
          status: 'error',
        });
        return;
      }
    } else {
      const result = await addProduct({
        category,
        costPrice: Number(costPrice),
        currentStock: Number(currentStock),
        name,
        sellingPrice: Number(sellingPrice),
      });

      if (!result.success) {
        setFeedback({
          message: result.error ?? 'Unable to save product.',
          status: 'error',
        });
        return;
      }
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

  const loadMoreProducts = () => {
    setVisibleCount(currentCount => currentCount + PRODUCTS_PAGE_SIZE);
  };

  const openEditForm = (productId: string) => {
    const product = products.find(item => item.id === productId);

    if (!product) {
      return;
    }

    setEditingProductId(product.id);
    setCategory(product.category ?? 'Other');
    setName(product.name ?? '');
    setCostPrice(String(product.costPrice ?? ''));
    setSellingPrice(String(product.sellingPrice ?? ''));
    setCurrentStock(String(product.currentStock ?? ''));
    setIsCreating(true);
  };

  return (
    <Screen
      contentContainerStyle={!isCreating ? styles.listContent : undefined}
      scrollable={isCreating}
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

          <SelectField
            label={copy.products.categoryField}
            onSelect={setCategory}
            options={categoryOptions.slice(1)}
            value={category}
          />
          <Text style={styles.helperText}>{copy.products.categoryHelp}</Text>

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
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={visibleProducts}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{copy.products.emptyState}</Text>
          }
          ListFooterComponent={
            hasMoreProducts ? (
              <PrimaryButton
                label={`Load ${Math.min(PRODUCTS_PAGE_SIZE, filteredProducts.length - visibleCount)} more`}
                onPress={loadMoreProducts}
                variant="ghost"
              />
            ) : filteredProducts.length > PRODUCTS_PAGE_SIZE ? (
              <Text style={styles.resultsHint}>
                Showing all {filteredProducts.length} products
              </Text>
            ) : null
          }
          ListHeaderComponent={
            <SectionCard title="Find Products">
              <SelectField
                label={copy.products.filterLabel}
                onSelect={setSelectedFilter}
                options={categoryOptions.map(option =>
                  option === 'All' ? copy.products.allCategories : option,
                )}
                value={
                  selectedFilter === 'All'
                    ? copy.products.allCategories
                    : selectedFilter
                }
              />
              <TextInput
                onChangeText={setSearchText}
                placeholder="Search by product name"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                value={searchText}
              />
            </SectionCard>
          }
          renderItem={({ item: product }) => (
            <Pressable onPress={() => openEditForm(product.id)}>
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
          )}
          showsVerticalScrollIndicator={false}
        />
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
  listContent: {
    flex: 1,
  },
  listContainer: {
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
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
    textAlign: 'center',
  },
  resultsHint: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
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
