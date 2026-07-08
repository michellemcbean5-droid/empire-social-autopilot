import React from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Text, Card, Button, Icon, CheckBox } from '@rneui/themed';
import Toast from 'react-native-toast-message';

import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

export function BrandVoiceScreen() {
  const { brandVoice, setBrandVoice } = useAppStore();
  const [name, setName] = React.useState(brandVoice.name);
  const [tone, setTone] = React.useState(brandVoice.tone);
  const [cta, setCta] = React.useState(brandVoice.cta);
  const [emoji, setEmoji] = React.useState(brandVoice.emoji);
  const [hashtags, setHashtags] = React.useState(brandVoice.hashtagsBase.join(', '));

  const handleSave = () => {
    setBrandVoice({
      name,
      tone,
      cta,
      emoji,
      hashtagsBase: hashtags.split(',').map((h) => h.trim()).filter(Boolean),
    });
    Toast.show({
      type: 'success',
      text1: 'Brand Voice Saved',
      text2: 'Your content will now reflect these settings.',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Brand Voice</Text>
        <Text style={styles.subtitle}>Define how your content sounds</Text>
      </View>

      <Card containerStyle={styles.card}>
        <Text style={styles.label}>Brand Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your brand name"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={styles.label}>Tone</Text>
        <TextInput
          style={styles.input}
          value={tone}
          onChangeText={setTone}
          placeholder="e.g., bold, motivational, entrepreneurial"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />

        <Text style={styles.label}>Call to Action</Text>
        <TextInput
          style={styles.input}
          value={cta}
          onChangeText={setCta}
          placeholder="Your default CTA"
          placeholderTextColor={COLORS.textMuted}
        />

        <CheckBox
          title="Use emojis"
          checked={emoji}
          onPress={() => setEmoji(!emoji)}
          containerStyle={styles.checkbox}
          textStyle={styles.checkboxText}
        />

        <Text style={styles.label}>Base Hashtags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={hashtags}
          onChangeText={setHashtags}
          placeholder="#QEmpire, #AIautomation, #Entrepreneur"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />

        <Button
          title="Save Brand Voice"
          onPress={handleSave}
          containerStyle={{ marginTop: SPACING.lg }}
        />
      </Card>

      <Card containerStyle={styles.previewCard}>
        <Text style={styles.previewTitle}>Preview</Text>
        <Text style={styles.previewText}>
          {emoji ? '🚀 ' : ''}How AI agents build businesses on autopilot. {cta}
        </Text>
        <Text style={styles.previewHashtags}>
          {hashtags.split(',').map((h) => h.trim()).filter(Boolean).join(' ')}
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginTop: SPACING.md,
  },
  checkboxText: {
    color: COLORS.text,
    fontWeight: '400',
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 0,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
  },
  previewTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  previewText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  previewHashtags: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
});
