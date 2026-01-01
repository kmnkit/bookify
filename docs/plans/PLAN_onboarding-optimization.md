# Onboarding Optimization Implementation Plan

## Overview

Bookifyの新規ユーザーオンボーディング体験を最適化するための実装計画です。
ユーザーがアプリの価値を素早く理解し、パーソナライズされた体験を開始できるようにします。

**Last Updated**: 2026-01-01

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Completion Rate | > 85% | Auth → Home到達率 |
| Time to Complete | < 45 seconds | 開始から完了まで |
| Skip Rate | < 15% | スキップ選択率 |
| User Satisfaction | > 4.5/5 | アンケート平均 |
| First Action Rate | > 60% | 初回セッションでの検索/いいね |

---

## Current State Analysis

### 既存フロー（user-flows.mdより）
```
Landing → Auth → Country Select → Language Select → Home
```

### 課題点
1. **価値提案が弱い** - Landing Pageでアプリの魅力が十分に伝わらない
2. **ステップが単調** - 視覚的なフィードバックやアニメーションが不足
3. **パーソナライズの機会損失** - 読書ジャンルの好みを収集していない
4. **モバイル最適化不足** - ジェスチャーナビゲーションが未対応

---

## Optimized Onboarding Flow

### フロー概要
```
┌─────────────────────────────────────────────────────────────────────┐
│                        OPTIMIZED ONBOARDING                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Step 0          Step 1           Step 2          Step 3            │
│  ┌───────┐      ┌────────┐       ┌────────┐      ┌───────────┐     │
│  │Welcome│  →   │ Auth   │   →   │Country/│  →   │Interests  │     │
│  │Splash │      │ Login  │       │Language│      │(Optional) │     │
│  └───────┘      └────────┘       └────────┘      └───────────┘     │
│     ↓                                                   ↓           │
│  [Get Started]                                    [Get Started]     │
│                                                         ↓           │
│                                                  ┌────────────┐     │
│                                                  │ Success    │     │
│                                                  │ Animation  │     │
│                                                  └────────────┘     │
│                                                         ↓           │
│                                                  ┌────────────┐     │
│                                                  │    Home    │     │
│                                                  └────────────┘     │
│                                                                     │
│  Progress: ────●────●────●────○  (Visual step indicator)           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Welcome Splash Screen
**Priority**: P0 (Must Have)
**Estimated Effort**: 4-6 hours

#### 1.1 UI Components
- [ ] `src/components/onboarding/WelcomeSplash.tsx`
  - アニメーション付きロゴ表示
  - キャッチコピー（多言語対応）
  - 本の表紙が浮かぶパーティクルエフェクト
  - 「始める」CTAボタン
  - 「ゲストとして続ける」オプション

#### 1.2 Design Specifications
```
Background:
  Light: Linear gradient #2563EB → #7C3AED (Brand Primary → Secondary)
  Dark: Linear gradient #0F172A → #1E293B (Slate-900 → Slate-800)

Logo Animation:
  - Scale: 0.8 → 1.0 (500ms, ease-springy)
  - Opacity: 0 → 1 (300ms)

Book Particles:
  - 5-8 floating book covers
  - Random rotation: -15deg to +15deg
  - Float animation: 3s infinite alternate
  - Opacity: 0.6
  - Blur: 4px (depth effect)

CTA Button:
  - Width: 100% (max 320px)
  - Height: 56px
  - Background: White/Dark
  - Text: Brand Primary
  - Shadow: shadow-xl
  - Hover: Scale 1.02, shadow-2xl
  - Ripple effect on tap
```

#### 1.3 Copywriting (多言語)
```json
{
  "ja": {
    "title": "Bookify",
    "tagline": "あなたの読書体験を、もっと豊かに",
    "description": "AIが選ぶ、あなたにぴったりの本",
    "getStarted": "始める",
    "continueAsGuest": "ゲストとして続ける"
  },
  "en": {
    "title": "Bookify",
    "tagline": "Enrich Your Reading Journey",
    "description": "AI-powered book recommendations, just for you",
    "getStarted": "Get Started",
    "continueAsGuest": "Continue as Guest"
  },
  "ko": {
    "title": "Bookify",
    "tagline": "독서 경험을 더욱 풍요롭게",
    "description": "AI가 선택하는, 당신에게 딱 맞는 책",
    "getStarted": "시작하기",
    "continueAsGuest": "게스트로 계속하기"
  }
}
```

#### 1.4 Implementation Tasks
- [ ] Create `WelcomeSplash` component with Framer Motion animations
- [ ] Implement floating book covers effect
- [ ] Add responsive layout (mobile-first)
- [ ] Implement gesture navigation (swipe up to continue)
- [ ] Add translations to message files
- [ ] Write unit tests

---

### Phase 2: Enhanced Authentication Screen
**Priority**: P0 (Must Have)
**Estimated Effort**: 3-4 hours

#### 2.1 UI Enhancements
- [ ] `src/components/onboarding/AuthScreen.tsx` (enhance existing login)
  - 進捗インジケーター（Step 1/3）
  - ソーシャルログインボタンの視覚的改善
  - ローディングアニメーション
  - エラーハンドリングUI改善

#### 2.2 Design Specifications
```
Progress Indicator:
  - Type: Dot indicators
  - Active: Brand Primary, scale 1.2
  - Inactive: gray-300/slate-600
  - Animation: spring transition between steps

Social Login Buttons:
  - Height: 56px
  - Gap: 16px
  - Icon: 24px, left aligned
  - Text: Center aligned
  - Loading: Spinner replaces icon

Auth Loading State:
  - Full screen overlay
  - Animated logo (pulse)
  - Status text: "認証中..." / "Signing in..."
  - Cancel option after 10s timeout
```

#### 2.3 Implementation Tasks
- [ ] Create reusable `OnboardingProgress` component
- [ ] Enhance login button with loading states
- [ ] Add smooth transition from Welcome to Auth
- [ ] Implement auth loading overlay
- [ ] Add haptic feedback on mobile (if supported)
- [ ] Write unit tests

---

### Phase 3: Country & Language Selection (Combined)
**Priority**: P0 (Must Have)
**Estimated Effort**: 5-7 hours

#### 3.1 UI Components
- [ ] `src/components/onboarding/RegionLanguageStep.tsx`
  - 国と言語を1画面に統合（効率化）
  - 国旗アイコン付きの視覚的な選択UI
  - 言語選択のプレビュー機能
  - リアルタイムのUI言語切り替え

#### 3.2 Design Specifications
```
Layout:
  - Two sections: Country (top), Language (bottom)
  - Card-based selection with visual feedback
  - Selected state: Brand Primary border, checkmark icon

Country Selection:
  - Grid layout: 2 columns mobile, 3 columns tablet+
  - Card size: 100x80px
  - Content: Flag emoji (32px) + Country name
  - Popular countries first: 🇯🇵🇺🇸🇰🇷
  - "その他" option for additional countries

Country Options:
  ┌─────────────────────────────────────────┐
  │  🇯🇵          🇺🇸          🇰🇷          │
  │  Japan      United     South       │
  │             States     Korea       │
  ├─────────────────────────────────────────┤
  │  🇬🇧          🇫🇷          🌍          │
  │  United     France     Other       │
  │  Kingdom                           │
  └─────────────────────────────────────────┘

Language Selection:
  - Horizontal scroll pills (mobile) / Grid (desktop)
  - Pill style: Background surface, border
  - Selected: Background Brand Primary 10%, text Brand Primary
  - Each shows native language name

Language Options:
  ┌─────────────────────────────────────────┐
  │  [日本語]  [English]  [한국어]          │
  └─────────────────────────────────────────┘

Preview Banner:
  - Shows sample text in selected language
  - Smooth fade transition on change
  - Example: "おすすめの本を見つけましょう" / "Let's find recommended books"
```

#### 3.3 Implementation Tasks
- [ ] Create combined `RegionLanguageStep` component
- [ ] Implement country grid with flag emojis
- [ ] Implement language pill selector
- [ ] Add live language preview functionality
- [ ] Implement smooth animations on selection
- [ ] Add "Other countries" modal with full list
- [ ] Store preferences to Firestore on continue
- [ ] Write unit tests

---

### Phase 4: Interest Selection (Optional Step)
**Priority**: P1 (Should Have)
**Estimated Effort**: 4-5 hours

#### 4.1 UI Components
- [ ] `src/components/onboarding/InterestStep.tsx`
  - ジャンル/興味選択（3〜5個選択推奨）
  - 視覚的なカード選択UI
  - スキップオプション（目立つ位置）

#### 4.2 Design Specifications
```
Layout:
  - Masonry grid or flex wrap
  - Cards with icon + label
  - Multi-select with visual feedback

Interest Categories:
  ┌───────────────────────────────────────────────────────┐
  │  📚 Fiction        🔬 Science        💼 Business      │
  │  小説             科学・技術        ビジネス          │
  ├───────────────────────────────────────────────────────┤
  │  🎨 Art           🏃 Self-Help      🌍 History       │
  │  アート           自己啓発          歴史              │
  ├───────────────────────────────────────────────────────┤
  │  💕 Romance       🔮 Fantasy        📖 Non-Fiction   │
  │  恋愛             ファンタジー      ノンフィクション   │
  ├───────────────────────────────────────────────────────┤
  │  🎭 Manga/Comics  👶 Children       🔍 Mystery       │
  │  漫画・コミック    児童書           ミステリー         │
  └───────────────────────────────────────────────────────┘

Card States:
  - Default: Surface background, Border
  - Hover: Shadow-sm, slight scale
  - Selected: Brand Primary border (2px), checkmark overlay
  - Icon: 32px emoji or Lucide icon
  - Label: Body (16px)

Selection Indicator:
  - "3〜5個選んでください" / "Select 3-5 interests"
  - Counter: "2/5 selected"
  - Progress bar fills as selections increase
```

#### 4.3 Implementation Tasks
- [ ] Create `InterestStep` component
- [ ] Define interest categories with icons
- [ ] Implement multi-select with minimum/maximum validation
- [ ] Add subtle animations on select/deselect
- [ ] Implement skip functionality
- [ ] Store preferences to user profile
- [ ] Write unit tests

---

### Phase 5: Success Celebration & Transition
**Priority**: P0 (Must Have)
**Estimated Effort**: 3-4 hours

#### 5.1 UI Components
- [ ] `src/components/onboarding/OnboardingSuccess.tsx`
  - 完了アニメーション（confetti/particles）
  - パーソナライズメッセージ
  - Homeへのスムーズな遷移

#### 5.2 Design Specifications
```
Success Animation:
  - Duration: 2 seconds total
  - Confetti burst from center (1s)
  - Checkmark icon animation (scale + rotate)
  - Message fade in (0.5s delay)

Message:
  - "準備完了！" / "You're all set!"
  - Personalized: "ようこそ、[Name]さん！" / "Welcome, [Name]!"
  - Sub-message: "あなたにぴったりの本を探しましょう"

Transition:
  - Auto-proceed after 2s OR tap to proceed
  - Fade out celebration
  - Slide up Home screen content
  - Subtle haptic on mobile
```

#### 5.3 Implementation Tasks
- [ ] Create `OnboardingSuccess` component
- [ ] Implement confetti animation (use react-confetti or custom)
- [ ] Add personalized welcome message
- [ ] Implement auto-transition with manual override
- [ ] Ensure smooth navigation to home
- [ ] Write unit tests

---

### Phase 6: Onboarding Flow Orchestration
**Priority**: P0 (Must Have)
**Estimated Effort**: 4-5 hours

#### 6.1 Flow Management
- [ ] `src/components/onboarding/OnboardingFlow.tsx`
  - 全ステップを管理するコンテナ
  - 進捗状態管理
  - ナビゲーション（戻る/進む）
  - スキップ/終了処理

#### 6.2 State Management
```typescript
interface OnboardingState {
  currentStep: number // 0-4
  isComplete: boolean
  data: {
    country: string | null
    language: Locale
    interests: string[]
  }
}

// Steps
const STEPS = [
  'welcome',      // 0
  'auth',         // 1
  'region',       // 2
  'interests',    // 3 (optional)
  'success'       // 4
] as const
```

#### 6.3 Persistence
```typescript
// Check if onboarding is needed
const needsOnboarding = !user?.hasCompletedOnboarding

// Mark complete on success
await updateUser(uid, { hasCompletedOnboarding: true })

// Skip interests but mark onboarding complete
const skipInterests = () => {
  navigate('success')
}
```

#### 6.4 Implementation Tasks
- [ ] Create `OnboardingFlow` container component
- [ ] Implement step navigation with animations
- [ ] Add back button (after auth step)
- [ ] Implement skip logic for optional steps
- [ ] Add `hasCompletedOnboarding` field to user profile
- [ ] Implement redirect logic in layout/middleware
- [ ] Handle returning users (skip onboarding)
- [ ] Write integration tests

---

### Phase 7: Animations & Microinteractions
**Priority**: P1 (Should Have)
**Estimated Effort**: 4-5 hours

#### 7.1 Animation Library
- Use **Framer Motion** (already included with shadcn/ui)

#### 7.2 Page Transitions
```typescript
// Shared animation variants
const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
}

const pageTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30
}
```

#### 7.3 Microinteractions
```
Button Press:
  - Scale: 0.98 on press
  - Duration: 100ms
  - Haptic: light impact (mobile)

Selection Toggle:
  - Scale: 1.05 briefly
  - Checkmark: draw-in animation
  - Color transition: 200ms

Progress Indicator:
  - Dot scale: spring animation
  - Fill animation: 300ms ease

Form Validation:
  - Error shake: 3 oscillations, 500ms
  - Success checkmark: scale + fade
```

#### 7.4 Implementation Tasks
- [ ] Set up Framer Motion page transitions
- [ ] Create reusable animation components
- [ ] Add button press animations
- [ ] Implement selection toggle animations
- [ ] Add form validation feedback
- [ ] Test animations on low-end devices (60fps target)

---

### Phase 8: Accessibility & Testing
**Priority**: P0 (Must Have)
**Estimated Effort**: 3-4 hours

#### 8.1 Accessibility Requirements
- [ ] All interactive elements have focus states
- [ ] Keyboard navigation works through entire flow
- [ ] Screen reader announcements for step changes
- [ ] Reduced motion support (prefers-reduced-motion)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets minimum 44x44px

#### 8.2 ARIA Implementation
```tsx
// Step container
<div
  role="main"
  aria-live="polite"
  aria-label={`Onboarding step ${step + 1} of ${totalSteps}`}
>

// Progress indicator
<nav aria-label="Onboarding progress">
  <ol>
    {steps.map((s, i) => (
      <li aria-current={i === currentStep ? 'step' : undefined}>
        {s.label}
      </li>
    ))}
  </ol>
</nav>

// Skip button
<button aria-label="Skip this step and continue to next">
  Skip
</button>
```

#### 8.3 Testing Requirements
- [ ] Unit tests for all components (>80% coverage)
- [ ] Integration tests for flow navigation
- [ ] E2E tests for complete onboarding journey
- [ ] Accessibility audit with axe-core
- [ ] Manual screen reader testing (VoiceOver/TalkBack)

---

## File Structure

```
src/
├── components/
│   └── onboarding/
│       ├── index.ts
│       ├── OnboardingFlow.tsx        # Main container
│       ├── WelcomeSplash.tsx         # Step 0
│       ├── AuthScreen.tsx            # Step 1 (enhanced login)
│       ├── RegionLanguageStep.tsx    # Step 2
│       ├── InterestStep.tsx          # Step 3
│       ├── OnboardingSuccess.tsx     # Step 4
│       ├── OnboardingProgress.tsx    # Progress indicator
│       └── animations/
│           ├── FloatingBooks.tsx
│           ├── Confetti.tsx
│           └── PageTransition.tsx
├── hooks/
│   └── useOnboarding.ts              # Onboarding state hook
├── lib/
│   └── onboarding/
│       └── interests.ts              # Interest categories data
└── messages/
    ├── ja.json                       # Updated with onboarding keys
    ├── en.json
    └── ko.json

__tests__/
├── unit/
│   └── components/
│       └── onboarding/
│           ├── WelcomeSplash.test.tsx
│           ├── RegionLanguageStep.test.tsx
│           ├── InterestStep.test.tsx
│           └── OnboardingFlow.test.tsx
├── integration/
│   └── onboarding/
│       └── flow.test.tsx
└── e2e/
    └── onboarding.spec.ts
```

---

## Implementation Order

### Sprint 1 (Foundation)
1. Phase 6: Onboarding Flow Orchestration (skeleton)
2. Phase 1: Welcome Splash Screen
3. Phase 2: Enhanced Authentication Screen

### Sprint 2 (Core Steps)
4. Phase 3: Country & Language Selection
5. Phase 5: Success Celebration

### Sprint 3 (Polish)
6. Phase 4: Interest Selection (optional step)
7. Phase 7: Animations & Microinteractions
8. Phase 8: Accessibility & Testing

---

## Dependencies

### NPM Packages
```json
{
  "framer-motion": "^11.x",      // Already installed with shadcn
  "react-confetti": "^6.x",      // Success celebration
  "canvas-confetti": "^1.x"      // Alternative confetti
}
```

### Existing Components (shadcn/ui)
- Button
- Dialog
- Card
- Progress

---

## Quality Gates

### Per Phase
- [ ] All tests passing
- [ ] TypeScript type-check clean
- [ ] ESLint clean
- [ ] Lighthouse accessibility score > 90
- [ ] Tested on iOS Safari + Android Chrome

### Final
- [ ] Complete E2E test passing
- [ ] Performance budget met (LCP < 2.5s)
- [ ] A/B test framework ready
- [ ] Analytics events implemented

---

## Analytics Events

```typescript
// Track onboarding funnel
trackEvent('onboarding_started')
trackEvent('onboarding_auth_completed')
trackEvent('onboarding_region_selected', { country, language })
trackEvent('onboarding_interests_selected', { interests, skipped: false })
trackEvent('onboarding_interests_skipped')
trackEvent('onboarding_completed', { totalTime, stepsCompleted })

// Track drop-offs
trackEvent('onboarding_abandoned', { lastStep, timeSpent })
```

---

## Rollout Plan

### Phase A: Internal Testing
- Deploy to preview environment
- Team testing + feedback collection
- Bug fixes and polish

### Phase B: Beta (10% of new users)
- Feature flag enabled for subset
- Monitor completion rates
- A/B test interest step (with vs without)

### Phase C: Full Rollout
- Gradual increase to 100%
- Monitor metrics for 1 week
- Iterate based on data

---

## Future Enhancements

### Post-MVP
1. **Personalized Recommendations Preview** - Show 3 recommended books before completing
2. **Social Proof** - "50,000+ readers use Bookify"
3. **Tutorial Tips** - First-time feature tooltips after onboarding
4. **Re-engagement** - Onboarding for returning inactive users
5. **A/B Testing Framework** - Test different copy, layouts, step orders

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-01 | Initial onboarding optimization plan |
