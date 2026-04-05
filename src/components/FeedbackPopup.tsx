import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

type FeedbackPopupProps = {
  message: string;
  onClose: () => void;
  status: 'error' | 'success';
  visible: boolean;
};

export function FeedbackPopup({
  message,
  onClose,
  status,
  visible,
}: FeedbackPopupProps) {
  const success = status === 'success';

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconWrap,
              success ? styles.successIconWrap : styles.errorIconWrap,
            ]}>
            <Text style={styles.icon}>{success ? '✓' : '✕'}</Text>
          </View>
          <Text style={styles.title}>{success ? 'Success' : 'Error'}</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable
            onPress={onClose}
            style={[
              styles.button,
              success ? styles.successButton : styles.errorButton,
            ]}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(29,27,22,0.42)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
    width: '100%',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radius.pill,
    height: 82,
    justifyContent: 'center',
    marginBottom: spacing.lg,
    width: 82,
  },
  successIconWrap: {
    backgroundColor: '#DDEBDD',
  },
  errorIconWrap: {
    backgroundColor: '#F9E0DC',
  },
  icon: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    borderRadius: radius.pill,
    minWidth: 120,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  errorButton: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});
