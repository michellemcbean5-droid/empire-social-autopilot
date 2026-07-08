# Store Deployment Guide — Empire Social Autopilot

## Overview

This guide covers submitting the Empire Social Autopilot mobile app to the Apple App Store and Google Play Store.

---

## Prerequisites

- Expo account (https://expo.dev)
- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time)
- EAS CLI installed: `npm install -g eas-cli`

---

## Step 1: Configure EAS

```bash
cd mobile
eas login
eas build:configure
```

Update `app.json` with your actual EAS project ID:
```json
"extra": {
  "eas": {
    "projectId": "your-actual-project-id"
  }
}
```

---

## Step 2: Build for Production

### iOS
```bash
eas build --platform ios --profile production
```

### Android
```bash
eas build --platform android --profile production
```

### Both
```bash
eas build --platform all --profile production
```

---

## Step 3: App Store Submission (iOS)

1. **Prepare App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Create new app with bundle ID `com.qempire.socialautopilot`
   - Fill in app information (name, description, keywords)

2. **Upload Build**
   - EAS Build automatically uploads to App Store Connect
   - Or download IPA and upload via Transporter app

3. **Submit for Review**
   - Fill in App Store listing (screenshots, description, privacy policy URL)
   - Set pricing (Free with In-App Purchases)
   - Submit for review (typically 1-2 days)

---

## Step 4: Google Play Submission (Android)

1. **Prepare Google Play Console**
   - Go to https://play.google.com/console
   - Create new app with package `com.qempire.socialautopilot`

2. **Upload AAB**
   - EAS Build produces AAB (Android App Bundle)
   - Upload to Google Play Console → Production track

3. **Fill Store Listing**
   - Title: Empire Social Autopilot
   - Short description: AI-powered social media content generator & scheduler
   - Full description: See `store-metadata/description.txt`
   - Screenshots: Generate with EAS or manually

4. **Set Up Monetization**
   - Configure in-app products in Google Play Console
   - Link to RevenueCat or react-native-iap product IDs

5. **Submit for Review**
   - Google Play review typically 1-3 days

---

## Store Metadata

### Title
Empire Social Autopilot — AI Social Media Manager

### Short Description
Generate, schedule & publish AI-powered content across all platforms. Grow your empire on autopilot.

### Keywords
social media scheduler, AI content generator, Instagram scheduler, Twitter automation, LinkedIn posts, TikTok scheduler, content calendar, social media manager, AI marketing, post scheduler

### Screenshots Required
- iPhone 6.7" (1290x2796) — 5 screenshots
- iPhone 6.5" (1284x2778) — 5 screenshots
- iPad Pro 12.9" (2048x2732) — 5 screenshots
- Android Phone (1080x1920) — 5 screenshots
- Android Tablet (2048x1536) — 5 screenshots

### Feature Graphic (Android)
- 1024x500px banner

---

## Privacy Policy

Required for both stores. Template provided in `docs/privacy-policy.md`.

Must include:
- Data collection practices
- Third-party services (AI APIs, analytics)
- User rights (GDPR/CCPA)
- Contact information

---

## In-App Purchases Setup

### RevenueCat (Recommended)
1. Create account at https://revenuecat.com
2. Add app with bundle ID
3. Configure offerings:
   - `basic_monthly` — $9.99
   - `basic_annual` — $99.99
   - `pro_monthly` — $29.99
   - `pro_annual` — $299.99
   - `elite_monthly` — $99.99
   - `elite_annual` — $999.99
4. Add API key to `.env` (not committed)
5. Test with sandbox accounts

### react-native-iap (Alternative)
- Configure products in App Store Connect and Google Play Console
- Use product IDs matching `SubscriptionScreen.tsx` tiers

---

## AdMob Setup (Free Tier)

1. Create AdMob account at https://admob.google.com
2. Add app (iOS + Android)
3. Create ad units:
   - Banner: `ca-app-pub-xxx/yyy`
   - Interstitial: `ca-app-pub-xxx/zzz`
   - Rewarded: `ca-app-pub-xxx/www`
4. Update `app.json` with App IDs
5. Add ad unit IDs to `.env` (not committed)

---

## CI/CD with GitHub Actions

Build and deploy automatically on every release:

```yaml
# .github/workflows/mobile-deploy.yml
name: Mobile Deploy
on:
  push:
    tags:
      - 'v*'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: cd mobile && eas build --platform all --profile production --non-interactive
```

---

## Post-Launch Checklist

- [ ] Monitor crash reports (Firebase Crashlytics)
- [ ] Track analytics (PostHog/Plausible)
- [ ] Respond to user reviews within 24 hours
- [ ] A/B test subscription pricing
- [ ] Update AI models regularly
- [ ] Add new features based on user feedback
- [ ] Localize for international markets
- [ ] Run promotional campaigns

---

## Support Contacts

- Technical: support@qempireai.com
- Billing: billing@qempireai.com
- Enterprise: enterprise@qempireai.com
