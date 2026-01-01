# Bookify Design System

## Overview
Bookifyは読書体験を豊かにする多言語対応の本おすすめ&読書進捗管理アプリです。本の表紙画像を活かしたビジュアルリッチなデザインと、直感的な操作性を重視しています。

## Design Principles

### 1. Content-First
本の表紙画像とコンテンツを主役に、UIは控えめで機能的に。

### 2. Accessible by Default
WCAG 2.1 AA準拠を目標に、すべてのユーザーが快適に利用できるデザイン。

### 3. Culturally Adaptive
多言語・多文化対応で、各言語の可読性と美しさを保つ。

### 4. Mobile-First
スマートフォンでの読書体験を最優先に設計。

---

## Color Palette

### Light Mode

#### Primary Colors
```
Brand Primary:   #2563EB (blue-600)  - メインアクション、リンク
Brand Secondary: #7C3AED (violet-600) - アクセント、特別な要素
```

#### Neutral Colors
```
Background:      #FFFFFF (white)      - メイン背景
Surface:         #F9FAFB (gray-50)    - カード背景
Surface Raised:  #FFFFFF (white)      - 浮き上がった要素
Border:          #E5E7EB (gray-200)   - 境界線
Divider:         #F3F4F6 (gray-100)   - 区切り線
```

#### Text Colors
```
Text Primary:    #111827 (gray-900)   - 見出し、本文
Text Secondary:  #6B7280 (gray-500)   - 補足テキスト
Text Tertiary:   #9CA3AF (gray-400)   - プレースホルダー
Text Disabled:   #D1D5DB (gray-300)   - 無効状態
```

#### Semantic Colors
```
Success:         #10B981 (green-500)  - 完読、成功メッセージ
Warning:         #F59E0B (amber-500)  - 注意、読書中
Error:           #EF4444 (red-500)    - エラー、削除
Info:            #3B82F6 (blue-500)   - 情報、ヒント
```

#### Feature Colors
```
Like/Favorite:   #EC4899 (pink-500)   - いいね、お気に入り
Progress:        #8B5CF6 (violet-500) - 読書進捗バー
New Badge:       #06B6D4 (cyan-500)   - 新着バッジ
```

### Dark Mode

#### Primary Colors
```
Brand Primary:   #3B82F6 (blue-500)   - メインアクション
Brand Secondary: #8B5CF6 (violet-500) - アクセント
```

#### Neutral Colors
```
Background:      #0F172A (slate-900)  - メイン背景
Surface:         #1E293B (slate-800)  - カード背景
Surface Raised:  #334155 (slate-700)  - 浮き上がった要素
Border:          #334155 (slate-700)  - 境界線
Divider:         #1E293B (slate-800)  - 区切り線
```

#### Text Colors
```
Text Primary:    #F1F5F9 (slate-100)  - 見出し、本文
Text Secondary:  #94A3B8 (slate-400)  - 補足テキスト
Text Tertiary:   #64748B (slate-500)  - プレースホルダー
Text Disabled:   #475569 (slate-600)  - 無効状態
```

#### Semantic Colors (Dark Mode Adjusted)
```
Success:         #34D399 (green-400)
Warning:         #FBBF24 (amber-400)
Error:           #F87171 (red-400)
Info:            #60A5FA (blue-400)
Like/Favorite:   #F472B6 (pink-400)
Progress:        #A78BFA (violet-400)
New Badge:       #22D3EE (cyan-400)
```

### Opacity Scale
```
100: FF (100%)
95:  F2 (95%)
90:  E6 (90%)
80:  CC (80%)
70:  B3 (70%)
60:  99 (60%)
50:  80 (50%)
40:  66 (40%)
30:  4D (30%)
20:  33 (20%)
10:  1A (10%)
5:   0D (5%)
```

---

## Typography

### Font Families

#### Japanese (日本語)
```css
font-family: 'Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', Meiryo, sans-serif;
```

#### English
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

#### Korean (한국어)
```css
font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
```

#### Fallback (Multi-language)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans JP', 'Noto Sans KR', sans-serif;
```

### Type Scale

#### Display (ランディングページヘッダー)
```
Size: 48px (3rem) / Mobile: 36px (2.25rem)
Line Height: 1.1
Font Weight: 700 (Bold)
Letter Spacing: -0.02em
```

#### Heading 1 (ページタイトル)
```
Size: 32px (2rem) / Mobile: 24px (1.5rem)
Line Height: 1.2
Font Weight: 700 (Bold)
Letter Spacing: -0.01em
```

#### Heading 2 (セクション見出し)
```
Size: 24px (1.5rem) / Mobile: 20px (1.25rem)
Line Height: 1.3
Font Weight: 600 (Semibold)
Letter Spacing: -0.01em
```

#### Heading 3 (サブセクション)
```
Size: 20px (1.25rem) / Mobile: 18px (1.125rem)
Line Height: 1.4
Font Weight: 600 (Semibold)
Letter Spacing: 0
```

#### Body Large (本の説明、重要テキスト)
```
Size: 18px (1.125rem)
Line Height: 1.6
Font Weight: 400 (Regular)
Letter Spacing: 0
```

#### Body (本文、デフォルト)
```
Size: 16px (1rem)
Line Height: 1.5
Font Weight: 400 (Regular)
Letter Spacing: 0
```

#### Body Small (補足情報、メタデータ)
```
Size: 14px (0.875rem)
Line Height: 1.5
Font Weight: 400 (Regular)
Letter Spacing: 0
```

#### Caption (タイムスタンプ、ラベル)
```
Size: 12px (0.75rem)
Line Height: 1.4
Font Weight: 400 (Regular)
Letter Spacing: 0.01em
```

#### Button Text
```
Size: 16px (1rem) / Small: 14px (0.875rem)
Line Height: 1.5
Font Weight: 500 (Medium)
Letter Spacing: 0.01em
```

### Language-Specific Adjustments

#### 日本語
```
Line Height: +0.1 (より広めの行間)
Letter Spacing: 0.02em (わずかに広めの文字間)
```

#### 한국어
```
Line Height: +0.05
Font Weight: Regular → 500 (可読性向上)
```

---

## Spacing System

### Base Unit: 4px

```
0:   0px
1:   4px    (0.25rem)
2:   8px    (0.5rem)
3:   12px   (0.75rem)
4:   16px   (1rem)
5:   20px   (1.25rem)
6:   24px   (1.5rem)
8:   32px   (2rem)
10:  40px   (2.5rem)
12:  48px   (3rem)
16:  64px   (4rem)
20:  80px   (5rem)
24:  96px   (6rem)
```

### Common Usage

```
Component Padding (Small):    12px (3)
Component Padding (Default):  16px (4)
Component Padding (Large):    24px (6)

Section Spacing (Mobile):     24px (6)
Section Spacing (Desktop):    48px (12)

Card Gap:                     16px (4)
List Item Gap:                12px (3)

Safe Area (Mobile):           16px (4)
Safe Area (Desktop):          24px (6)
```

---

## Border Radius

```
None:      0px
Small:     4px    (0.25rem)  - バッジ、タグ
Default:   8px    (0.5rem)   - ボタン、インプット
Medium:    12px   (0.75rem)  - カード
Large:     16px   (1rem)     - モーダル、大きなカード
XLarge:    24px   (1.5rem)   - 本の表紙カード
Full:      9999px            - アバター、ピル型ボタン
```

---

## Shadows

### Light Mode
```css
/* Small - ボタンホバー、小さいカード */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default - カード、ドロップダウン */
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Medium - 浮き上がったカード */
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Large - モーダル、ドロワー */
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* XLarge - 本の表紙カード（フォーカス時） */
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Dark Mode
```css
/* 暗い背景では影を強調 */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.5);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.6), 0 4px 6px -4px rgb(0 0 0 / 0.6);
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.7), 0 8px 10px -6px rgb(0 0 0 / 0.7);
```

---

## Iconography

### Icon Library
**Lucide Icons** (shadcn/ui default)
- 軽量でカスタマイズ可能
- 一貫したビジュアルスタイル
- React対応

### Icon Sizes
```
Extra Small: 12px - インラインアイコン
Small:       16px - ボタン内、ラベル横
Default:     20px - ナビゲーション、リスト
Medium:      24px - ヘッダーアクション
Large:       32px - エンプティステート
XLarge:      48px - スプラッシュ、オンボーディング
```

### Common Icons
```
Home:           Home
Search:         Search
Library:        Library
Profile:        User
Book:           Book, BookOpen
Like:           Heart
Bookmark:       Bookmark
Progress:       TrendingUp, Activity
Settings:       Settings
Language:       Languages, Globe
Dark Mode:      Moon, Sun
Add:            Plus
Edit:           Pencil
Delete:         Trash2
Share:          Share2
Filter:         Filter
Sort:           ArrowUpDown
Close:          X
Back:           ArrowLeft
Next:           ArrowRight
Check:          Check
Alert:          AlertCircle
Info:           Info
```

---

## Component Specifications

### Buttons

#### Primary Button
```
Background: Brand Primary
Text: White
Padding: 12px 24px (3, 6)
Border Radius: 8px
Font: Button Text (16px, Medium)
Min Height: 44px (タッチターゲット)

States:
- Hover: Opacity 90%
- Active: Opacity 80%, Scale 0.98
- Disabled: Opacity 50%, cursor not-allowed
- Focus: Ring 2px Brand Primary with offset
```

#### Secondary Button
```
Background: Surface
Text: Text Primary
Border: 1px solid Border
Padding: 12px 24px
Border Radius: 8px
Min Height: 44px

States:
- Hover: Background Surface Raised
- Active: Background Border
- Disabled: Opacity 50%
- Focus: Ring 2px Brand Primary
```

#### Ghost Button
```
Background: Transparent
Text: Brand Primary
Padding: 12px 24px
Border Radius: 8px
Min Height: 44px

States:
- Hover: Background Primary with 10% opacity
- Active: Background Primary with 20% opacity
- Focus: Ring 2px Brand Primary
```

#### Icon Button
```
Size: 44x44px (タッチターゲット)
Icon Size: 20px
Background: Transparent
Border Radius: 8px

States:
- Hover: Background Surface
- Active: Background Border
- Focus: Ring 2px Brand Primary
```

### Cards

#### Book Card (Vertical)
```
Container:
- Width: 100% (flex/grid child)
- Border Radius: 12px
- Background: Surface
- Padding: 12px
- Shadow: shadow-sm
- Hover: shadow-md, transform translateY(-2px)

Book Cover:
- Aspect Ratio: 2:3
- Border Radius: 8px
- Object Fit: cover
- Shadow: shadow-sm

Content:
- Padding Top: 12px
- Title: Body (16px), 2 lines max, ellipsis
- Author: Body Small (14px), Text Secondary, 1 line
- Metadata: Caption (12px), Text Tertiary

Actions:
- Position: absolute top-right
- Like button: Icon 20px
```

#### Book Card (Horizontal)
```
Container:
- Display: flex
- Gap: 16px
- Padding: 16px
- Border Radius: 12px
- Background: Surface

Book Cover:
- Width: 80px
- Height: 120px
- Border Radius: 8px

Content:
- Flex: 1
- Title: Body Large (18px), Bold
- Author: Body Small (14px)
- Progress Bar: Below author
```

#### Feature Card
```
Container:
- Padding: 24px
- Border Radius: 16px
- Background: Gradient or Surface
- Border: 1px solid Border

Icon:
- Size: 32px
- Color: Brand Primary
- Margin Bottom: 16px

Heading: Heading 3 (20px)
Description: Body Small (14px), Text Secondary
```

### Navigation

#### Bottom Navigation (Mobile)
```
Container:
- Position: fixed bottom
- Height: 64px + safe-area-inset-bottom
- Background: Surface with backdrop blur
- Border Top: 1px solid Divider
- Shadow: shadow-lg (inverted)

Items:
- Display: flex, justify-between
- Padding: 8px 16px
- Min Width: 64px (タッチターゲット)

Item:
- Icon: 24px
- Label: Caption (12px)
- Color: Text Tertiary (inactive), Brand Primary (active)
- Gap: 4px

Active State:
- Icon Color: Brand Primary
- Label Color: Brand Primary
- Background: Primary with 10% opacity, radius 8px
```

#### Top Navigation (Desktop)
```
Container:
- Height: 64px
- Background: Surface
- Border Bottom: 1px solid Divider
- Padding: 0 24px

Logo:
- Height: 32px
- Font: Display or custom logo

Navigation Items:
- Display: flex, gap 8px
- Padding: 8px 16px
- Border Radius: 8px
- Hover: Background Surface Raised

User Menu:
- Position: right
- Avatar: 32px, rounded-full
```

### Forms

#### Text Input
```
Container:
- Border: 1px solid Border
- Border Radius: 8px
- Background: Surface
- Padding: 12px 16px
- Min Height: 44px

Input:
- Font: Body (16px) - iOS zoom防止
- Color: Text Primary
- Placeholder: Text Tertiary

States:
- Focus: Border Brand Primary, Ring 2px
- Error: Border Error, Ring Error
- Disabled: Background Surface, Opacity 50%

Label:
- Font: Body Small (14px), Medium
- Color: Text Primary
- Margin Bottom: 8px

Helper Text:
- Font: Caption (12px)
- Color: Text Secondary
- Margin Top: 4px

Error Text:
- Font: Caption (12px)
- Color: Error
- Icon: AlertCircle 12px
```

#### Search Input
```
Container: Same as Text Input

Prefix Icon:
- Icon: Search, 20px
- Color: Text Tertiary
- Margin Right: 8px

Clear Button:
- Icon: X, 16px
- Padding: 4px
- Border Radius: 4px
- Hover: Background Surface Raised
```

#### Select / Dropdown
```
Trigger:
- Same as Text Input
- Icon: ChevronDown, 20px, right

Dropdown:
- Background: Surface
- Border: 1px solid Border
- Border Radius: 8px
- Shadow: shadow-lg
- Max Height: 300px
- Overflow: auto

Option:
- Padding: 12px 16px
- Min Height: 44px
- Hover: Background Surface Raised
- Selected: Background Primary 10%, Text Brand Primary
- Focus: Background Surface Raised, Ring inset
```

### Progress Components

#### Progress Bar
```
Track:
- Height: 8px
- Border Radius: 9999px
- Background: Border

Fill:
- Height: 100%
- Border Radius: 9999px
- Background: Linear gradient (Brand Primary → Secondary)
- Transition: width 300ms ease

Labels:
- Above: Current / Total pages
- Font: Caption (12px)
- Color: Text Secondary
```

#### Circular Progress
```
Size: 64px (Default), 48px (Small), 80px (Large)
Stroke Width: 6px
Track Color: Border
Progress Color: Brand Primary
Percentage: Center, Heading 3, Bold
```

#### Reading Status Badge
```
Padding: 4px 12px
Border Radius: 9999px
Font: Caption (12px), Medium

To Read:
- Background: gray-100 / slate-800
- Text: gray-700 / slate-300

Reading:
- Background: amber-100 / amber-900/30
- Text: amber-700 / amber-400

Completed:
- Background: green-100 / green-900/30
- Text: green-700 / green-400
```

### Feedback Components

#### Toast / Notification
```
Container:
- Width: 360px max, 90vw mobile
- Padding: 16px
- Border Radius: 12px
- Background: Surface
- Border: 1px solid Border
- Shadow: shadow-lg

Icon:
- Size: 20px
- Color: Semantic color
- Margin Right: 12px

Content:
- Title: Body (16px), Medium
- Description: Body Small (14px), Text Secondary

Close Button:
- Icon: X, 16px
- Padding: 4px
- Border Radius: 4px

Variants:
- Success: Border green, Icon green
- Error: Border red, Icon red
- Warning: Border amber, Icon amber
- Info: Border blue, Icon blue
```

#### Skeleton Loader
```
Background: Linear gradient shimmer
- Base: gray-200 / slate-700
- Highlight: gray-100 / slate-600
Animation: Shimmer 1.5s infinite

Shapes:
- Text Line: Height 16px, Border Radius 4px
- Title: Height 24px, Width 60%
- Avatar: Circle 40px
- Image: Aspect ratio preserved, Border Radius 8px
- Book Cover: Aspect 2:3, Border Radius 8px
```

#### Empty State
```
Container:
- Padding: 48px 24px
- Text Align: center

Icon:
- Size: 48px
- Color: Text Tertiary
- Margin Bottom: 16px

Heading:
- Font: Heading 3 (20px)
- Color: Text Primary
- Margin Bottom: 8px

Description:
- Font: Body (16px)
- Color: Text Secondary
- Max Width: 400px
- Margin Bottom: 24px

Action Button:
- Primary or Secondary button
```

### Modal / Dialog

#### Modal Container
```
Overlay:
- Background: black with 50% opacity
- Backdrop Blur: 4px

Content:
- Background: Background
- Border Radius: 16px (Desktop), 16px 16px 0 0 (Mobile)
- Max Width: 500px (Desktop)
- Padding: 24px
- Shadow: shadow-xl

Mobile:
- Position: fixed bottom
- Width: 100%
- Animation: Slide up

Desktop:
- Position: centered
- Animation: Fade + scale
```

#### Modal Header
```
Padding Bottom: 16px
Border Bottom: 1px solid Divider

Title:
- Font: Heading 2 (24px)
- Color: Text Primary

Close Button:
- Position: absolute top-right
- Icon: X, 20px
- Size: 44x44px
```

#### Modal Footer
```
Padding Top: 16px
Border Top: 1px solid Divider
Display: flex
Gap: 12px
Justify: flex-end

Buttons: Primary + Secondary/Ghost
```

---

## Animation & Transitions

### Timing Functions
```css
ease-smooth:     cubic-bezier(0.4, 0, 0.2, 1)
ease-springy:    cubic-bezier(0.34, 1.56, 0.64, 1)
ease-soft:       cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### Duration
```
Fast:     150ms   - Hover, focus states
Default:  300ms   - Transitions, animations
Slow:     500ms   - Page transitions, complex animations
```

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In */
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## Responsive Breakpoints

```
Mobile:      0px    - 639px   (default)
Tablet:      640px  - 1023px  (sm)
Desktop:     1024px - 1279px  (md)
Large:       1280px - 1535px  (lg)
Extra Large: 1536px+           (xl)
```

### Layout Adaptations

#### Mobile (< 640px)
- Bottom navigation
- Single column layout
- Full-width cards
- Simplified headers
- Drawer menus

#### Tablet (640px - 1023px)
- 2-column grid for book cards
- Side navigation option
- Expanded search
- More metadata visible

#### Desktop (1024px+)
- Side navigation
- 3-4 column grid
- Hover interactions
- Full metadata
- Keyboard shortcuts support

---

## Grid System

### Container
```
Max Width:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

Padding: 16px (Mobile), 24px (Desktop)
```

### Book Grid
```
Mobile:    1 column
Tablet:    2 columns, gap 16px
Desktop:   3 columns, gap 24px
Large:     4 columns, gap 24px

Aspect Ratio: Maintained for book covers (2:3)
```

---

## Best Practices

### Touch Targets
- Minimum size: 44x44px (iOS), 48x48px (Android)
- Spacing between targets: 8px minimum

### Loading States
- Always show skeleton loaders for async content
- Preserve layout to prevent jank
- Show progress for long operations (>2s)

### Error Handling
- Inline validation for forms
- Toast for system errors
- Empty states with recovery actions

### Performance
- Lazy load images below fold
- Virtualize long lists (>50 items)
- Debounce search input (300ms)
- Optimize images (WebP, responsive sizes)

### Accessibility
- Semantic HTML
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus visible indicators
- Color contrast ratio 4.5:1 (AA)

---

## Implementation Notes

### Tailwind Configuration
```javascript
// tailwind.config.js key extensions
{
  colors: {
    brand: {
      primary: '#2563EB',
      secondary: '#7C3AED'
    }
  },
  fontFamily: {
    sans: ['Inter', 'Noto Sans JP', 'Noto Sans KR', ...],
  },
  spacing: {
    // 4px base unit system
  }
}
```

### shadcn/ui Theme
```css
/* Light mode CSS variables */
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 221 83% 53%;
  --primary-foreground: 0 0% 100%;
  /* ... */
}

/* Dark mode */
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Font Loading
```javascript
// Next.js font optimization
import { Inter, Noto_Sans_JP, Noto_Sans_KR } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansJP = Noto_Sans_JP({ subsets: ['latin', 'japanese'] })
const notoSansKR = Noto_Sans_KR({ subsets: ['latin', 'korean'] })
```

---

## Version History
- v1.0.0 (2026-01-01): Initial design system for MVP
