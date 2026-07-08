import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.errorToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={styles.infoToast}
      contentContainerStyle={styles.contentContainer}
      text1Style={styles.text1}
      text2Style={styles.text2}
    />
  ),
};

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: COLORS.success,
    backgroundColor: COLORS.surface,
  },
  errorToast: {
    borderLeftColor: COLORS.error,
    backgroundColor: COLORS.surface,
  },
  infoToast: {
    borderLeftColor: COLORS.info,
    backgroundColor: COLORS.surface,
  },
  contentContainer: {
    paddingHorizontal: SPACING.md,
  },
  text1: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  text2: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
});
