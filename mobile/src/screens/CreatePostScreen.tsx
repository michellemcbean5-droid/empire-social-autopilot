import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, Button, Card, CheckBox, Chip, Slider } from '@rneui/themed';
import Toast from 'react-native-toast-message';

import { useAppStore } from '../store/appStore';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';
import { Platform, Post } from '../types';
import { generateId } from '../utils/helpers';
import { aiService } from '../services/aiService';

const PLATFORMS: { key: Platform; label: string; icon: string }[] = [
  { key: 'twitter', label: 'Twitter/X', icon: 'twitter' },
  { key: 'instagram', label: 'Instagram', icon: 'instagram' },
  { key: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
  { key: 'tiktok', label: 'TikTok', icon: 'music-note' },
];

export function CreatePostScreen() {
  const { user, brandVoice, addDraft, addCalendar, setLoading, isLoading } = useAppStore();
  const [topic, setTopic] = React.useState('');
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<Platform[]>([]);
  const [generatedPosts, setGeneratedPosts] = React.useState<Post[]>([]);
  const [aiMode, setAiMode] = React.useState(false);
  const [campaignName, setCampaignName] = React.useState('');
  const [tone, setTone] = React.useState(brandVoice.tone);
  const [includeCta, setIncludeCta] = React.useState(true);
  const [hashtagCount, setHashtagCount] = React.useState(5);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const canGenerate = topic.trim().length > 0 && selectedPlatforms.length > 0;
  const tier = user?.tier || 'free';
  const aiLimit = { free: 3, basic: 20, pro: 100, elite: Infinity }[tier];
  const canUseAI = aiMode && (tier !== 'free' || aiLimit > 0);

  const generatePosts = async () => {
    if (!canGenerate) return;
    setLoading(true);

    try {
      const posts: Post[] = [];

      for (const platform of selectedPlatforms) {
        let caption: string;
        let hashtags: string[];

        if (canUseAI) {
          const result = await aiService.generateContent(topic, platform, {
            tone,
            includeCta,
            hashtagCount,
            brandName: brandVoice.name,
          });
          caption = result.caption;
          hashtags = result.hashtags;
        } else {
          // Template fallback
          const emoji = brandVoice.emoji ? '🚀 ' : '';
          const cta = includeCta ? ` ${brandVoice.cta}` : '';
          caption = `${emoji}${topic}.${cta}`;
          hashtags = brandVoice.hashtagsBase.slice(0, hashtagCount);
        }

        posts.push({
          id: generateId(),
          platform,
          caption,
          hashtags,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          aiGenerated: canUseAI,
        });
      }

      setGeneratedPosts(posts);
      Toast.show({
        type: 'success',
        text1: `Generated ${posts.length} posts`,
        text2: canUseAI ? 'AI-powered content created!' : 'Template content created.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Generation failed',
        text2: 'Using template fallback.',
      });
      // Fallback to template
      const posts = selectedPlatforms.map((platform) => ({
        id: generateId(),
        platform,
        caption: `${brandVoice.emoji ? '🚀 ' : ''}${topic}. ${brandVoice.cta}`,
        hashtags: brandVoice.hashtagsBase.slice(0, hashtagCount),
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        aiGenerated: false,
      }));
      setGeneratedPosts(posts);
    } finally {
      setLoading(false);
    }
  };

  const saveToDrafts = () => {
    generatedPosts.forEach((post) => addDraft(post));
    Toast.show({
      type: 'success',
      text1: 'Saved to drafts',
      text2: `${generatedPosts.length} posts ready for scheduling.`,
    });
    setGeneratedPosts([]);
    setTopic('');
    setSelectedPlatforms([]);
  };

  const createCampaign = () => {
    if (!campaignName.trim() || generatedPosts.length === 0) return;
    const calendar = {
      id: generateId(),
      campaign: campaignName,
      posts: generatedPosts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active' as const,
      platforms: selectedPlatforms,
      topics: [topic],
    };
    addCalendar(calendar);
    Toast.show({
      type: 'success',
      text1: 'Campaign created!',
      text2: `"${campaignName}" with ${generatedPosts.length} posts.`,
    });
    setGeneratedPosts([]);
    setTopic('');
    setCampaignName('');
    setSelectedPlatforms([]);
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Text style={styles.title}>Create Content</Text>
        <Text style={styles.subtitle}>Generate AI-powered posts for your empire</Text>
      </View>

      <Card containerStyle={styles.card}>
        <Text style={styles.label}>Topic or Idea</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., How AI agents build businesses on autopilot"
          placeholderTextColor={COLORS.textMuted}
          value={topic}
          onChangeText={setTopic}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
        <Text style={styles.charCount}>{topic.length}/200</Text>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.label}>Platforms</Text>
        <View style={styles.platformsRow}>
          {PLATFORMS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.platformChip,
                selectedPlatforms.includes(p.key) && styles.platformChipActive,
              ]}
              onPress={() => togglePlatform(p.key)}
            >
              <Text
                style={[
                  styles.platformChipText,
                  selectedPlatforms.includes(p.key) && styles.platformChipTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <View style={styles.aiToggleRow}>
          <Text style={styles.label}>AI Content Generation</Text>
          <TouchableOpacity
            style={[styles.aiToggle, aiMode && styles.aiToggleActive]}
            onPress={() => setAiMode(!aiMode)}
          >
            <View style={[styles.aiToggleKnob, aiMode && styles.aiToggleKnobActive]} />
          </TouchableOpacity>
        </View>
        {aiMode && tier === 'free' && (
          <Text style={styles.aiLimitText}>
            Free tier: {aiLimit} AI generations. Upgrade for unlimited.
          </Text>
        )}

        {aiMode && (
          <>
            <Text style={styles.label}>Tone</Text>
            <TextInput
              style={styles.input}
              value={tone}
              onChangeText={setTone}
              placeholderTextColor={COLORS.textMuted}
            />

            <View style={styles.row}>
              <CheckBox
                title="Include CTA"
                checked={includeCta}
                onPress={() => setIncludeCta(!includeCta)}
                containerStyle={styles.checkbox}
                textStyle={styles.checkboxText}
              />
            </View>

            <Text style={styles.label}>Hashtags: {hashtagCount}</Text>
            <Slider
              value={hashtagCount}
              onValueChange={setHashtagCount}
              minimumValue={1}
              maximumValue={12}
              step={1}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />
          </>
        )}
      </Card>

      <Button
        title={isLoading ? 'Generating...' : 'Generate Posts'}
        onPress={generatePosts}
        disabled={!canGenerate || isLoading}
        loading={isLoading}
        containerStyle={styles.generateButton}
        buttonStyle={{ paddingVertical: 14 }}
      />

      {generatedPosts.length > 0 && (
        <Card containerStyle={styles.card}>
          <Text style={styles.label}>Generated Posts</Text>
          {generatedPosts.map((post) => (
            <View key={post.id} style={styles.generatedPost}>
              <View style={styles.postHeader}>
                <Text style={styles.postPlatform}>{post.platform.toUpperCase()}</Text>
                {post.aiGenerated && (
                  <Chip title="AI" type="outline" size="sm" containerStyle={styles.aiChip} />
                )}
              </View>
              <Text style={styles.postCaption}>{post.caption}</Text>
              <Text style={styles.postHashtags}>{post.hashtags.join(' ')}</Text>
            </View>
          ))}

          <TextInput
            style={[styles.input, { marginTop: SPACING.md }]}
            placeholder="Campaign name (optional)"
            placeholderTextColor={COLORS.textMuted}
            value={campaignName}
            onChangeText={setCampaignName}
          />

          <View style={styles.actionRow}>
            <Button
              title="Save to Drafts"
              type="outline"
              onPress={saveToDrafts}
              containerStyle={{ flex: 1, marginRight: SPACING.sm }}
            />
            <Button
              title="Create Campaign"
              onPress={createCampaign}
              disabled={!campaignName.trim()}
              containerStyle={{ flex: 1, marginLeft: SPACING.sm }}
            />
          </View>
        </Card>
      )}
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
    marginTop: 0,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  platformsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  platformChip: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformChipActive: {
    backgroundColor: COLORS.primary + '20',
    borderColor: COLORS.primary,
  },
  platformChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  platformChipTextActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  aiToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  aiToggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  aiToggleActive: {
    backgroundColor: COLORS.primary,
  },
  aiToggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.text,
    transform: [{ translateX: 0 }],
  },
  aiToggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  aiLimitText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    color: COLORS.text,
    fontWeight: '400',
    fontSize: FONT_SIZE.md,
  },
  generateButton: {
    margin: SPACING.lg,
    marginTop: 0,
  },
  generatedPost: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  postPlatform: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.primary,
  },
  aiChip: {
    borderColor: COLORS.secondary,
  },
  postCaption: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  postHashtags: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.sm,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
  },
});
