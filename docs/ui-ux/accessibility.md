# Bookify Accessibility Guidelines

## Overview
Bookifyはすべてのユーザーがアクセスできるインクルーシブなアプリケーションであることを目指します。WCAG 2.1 AA準拠を目標に、障害のある方を含むすべての人々に優れた体験を提供します。

---

## Accessibility Principles

### 1. Perceivable (知覚可能)
情報とUIコンポーネントは、ユーザーが知覚できる方法で提示される必要があります。

### 2. Operable (操作可能)
UIコンポーネントとナビゲーションは操作可能である必要があります。

### 3. Understandable (理解可能)
情報とUIの操作は理解可能である必要があります。

### 4. Robust (堅牢)
コンテンツは支援技術を含む幅広いユーザーエージェントで解釈可能である必要があります。

---

## WCAG 2.1 AA Compliance Checklist

### Level A Requirements

#### 1.1 Text Alternatives
- [ ] すべての画像に適切な代替テキストを提供
- [ ] 装飾的な画像には空のaltを使用
- [ ] アイコンボタンにaria-labelを提供

#### 1.2 Time-based Media
- [ ] 動画コンテンツにキャプション提供（将来の機能）
- [ ] オーディオにトランスクリプト提供（将来の機能）

#### 1.3 Adaptable
- [ ] セマンティックHTMLを使用
- [ ] 論理的な読み順序を維持
- [ ] フォーム要素に適切なラベルを関連付け

#### 1.4 Distinguishable
- [ ] テキストとbackgroundのコントラスト比 4.5:1以上
- [ ] UIコンポーネントのコントラスト比 3:1以上
- [ ] 色のみに依存しない情報伝達
- [ ] テキストサイズを200%まで拡大可能

#### 2.1 Keyboard Accessible
- [ ] すべての機能をキーボードで操作可能
- [ ] キーボードトラップなし
- [ ] ショートカットキーの提供（Desktop）

#### 2.2 Enough Time
- [ ] タイムアウトの警告と延長オプション
- [ ] 自動更新コンテンツの一時停止機能

#### 2.3 Seizures
- [ ] 1秒間に3回以上点滅するコンテンツなし

#### 2.4 Navigable
- [ ] ページタイトルを適切に設定
- [ ] フォーカス順序が論理的
- [ ] リンクの目的が明確
- [ ] 複数のナビゲーション手段を提供

#### 2.5 Input Modalities
- [ ] タッチターゲット最小44x44px
- [ ] ジェスチャーに代替手段を提供
- [ ] ラベルとアクセシブル名が一致

#### 3.1 Readable
- [ ] ページの言語を指定（lang属性）
- [ ] 部分的な言語変更を指定

#### 3.2 Predictable
- [ ] フォーカスで予期しない変更なし
- [ ] 入力で予期しない変更なし
- [ ] 一貫したナビゲーション

#### 3.3 Input Assistance
- [ ] エラーの特定と説明
- [ ] ラベルまたは説明文を提供
- [ ] エラー修正の提案

#### 4.1 Compatible
- [ ] 有効なHTML
- [ ] Name, Role, Value を提供

### Level AA Additional Requirements

#### 1.4 Distinguishable (Enhanced)
- [ ] テキストを画像ではなくテキストで提供
- [ ] 視覚的提示のカスタマイズ可能性
- [ ] フォーカスインジケーターの視認性

#### 2.4 Navigable (Enhanced)
- [ ] 見出しとラベルが内容を説明
- [ ] フォーカスが視認可能

#### 3.1 Readable (Enhanced)
- [ ] 専門用語の説明（Glossary機能 - 将来）

---

## Implementation Guidelines

### 1. Semantic HTML

#### Use Proper HTML Elements
```html
<!-- Good: Semantic structure -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/home">Home</a></li>
    </ul>
  </nav>
</header>

<main>
  <h1>Recommended Books</h1>
  <section aria-labelledby="trending">
    <h2 id="trending">Trending in Japan</h2>
    <ul>
      <li>...</li>
    </ul>
  </section>
</main>

<!-- Bad: Div soup -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
```

#### Heading Hierarchy
```html
<!-- Good: Logical hierarchy -->
<h1>Norwegian Wood</h1>
  <h2>About this book</h2>
  <h2>Details</h2>
    <h3>Publication Information</h3>
  <h2>Similar Books</h2>

<!-- Bad: Skipping levels -->
<h1>Norwegian Wood</h1>
  <h3>About this book</h3> <!-- Skipped h2 -->
```

### 2. ARIA Attributes

#### Button Labels
```jsx
// Icon-only buttons need aria-label
<button aria-label="Add to library">
  <PlusIcon />
</button>

<button aria-label="Like this book">
  <HeartIcon />
</button>

<button aria-label="Search">
  <SearchIcon />
</button>

// Buttons with text don't need aria-label
<button>
  <PlusIcon />
  Add to Library
</button>
```

#### Toggle States
```jsx
// Like button with state
<button
  aria-label={isLiked ? "Unlike this book" : "Like this book"}
  aria-pressed={isLiked}
>
  <HeartIcon filled={isLiked} />
</button>

// Theme toggle
<button
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  aria-pressed={isDark}
>
  {isDark ? <SunIcon /> : <MoonIcon />}
</button>
```

#### Live Regions
```jsx
// Toast notifications
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {toast.message}
</div>

// Error messages
<div
  role="alert"
  aria-live="assertive"
>
  {error.message}
</div>

// Loading states
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  Loading books...
</div>
```

#### Modal Dialogs
```jsx
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <h2 id="dialog-title">Update Reading Progress</h2>
  <p id="dialog-description">
    Enter the page number you've reached
  </p>

  {/* Focus trap within modal */}
  <button onClick={closeModal}>Cancel</button>
  <button onClick={saveProgress}>Save</button>
</div>
```

#### Tabs
```jsx
<div role="tablist" aria-label="Book information">
  <button
    role="tab"
    aria-selected={activeTab === 'overview'}
    aria-controls="overview-panel"
    id="overview-tab"
  >
    Overview
  </button>
  <button
    role="tab"
    aria-selected={activeTab === 'details'}
    aria-controls="details-panel"
    id="details-tab"
  >
    Details
  </button>
</div>

<div
  role="tabpanel"
  id="overview-panel"
  aria-labelledby="overview-tab"
  hidden={activeTab !== 'overview'}
>
  {/* Overview content */}
</div>
```

### 3. Color Contrast

#### Text Contrast Requirements
```css
/* WCAG AA Requirements */

/* Normal text (< 18pt or < 14pt bold) */
/* Minimum contrast ratio: 4.5:1 */
.text-primary {
  color: #111827; /* gray-900 */
  background: #FFFFFF; /* white */
  /* Contrast ratio: 16.59:1 ✓ */
}

.text-secondary {
  color: #6B7280; /* gray-500 */
  background: #FFFFFF;
  /* Contrast ratio: 5.74:1 ✓ */
}

/* Large text (≥ 18pt or ≥ 14pt bold) */
/* Minimum contrast ratio: 3:1 */
.heading {
  color: #374151; /* gray-700 */
  background: #FFFFFF;
  font-size: 24px;
  font-weight: 600;
  /* Contrast ratio: 9.73:1 ✓ */
}

/* Dark mode */
.dark .text-primary {
  color: #F1F5F9; /* slate-100 */
  background: #0F172A; /* slate-900 */
  /* Contrast ratio: 14.91:1 ✓ */
}

/* UI Components */
/* Minimum contrast ratio: 3:1 */
.button-primary {
  color: #FFFFFF;
  background: #2563EB; /* blue-600 */
  /* Contrast ratio: 4.56:1 ✓ */
}

.border {
  border-color: #E5E7EB; /* gray-200 */
  background: #FFFFFF;
  /* Contrast ratio: 1.15:1 (not text, for visual separation only) */
}
```

#### Testing Tool Integration
```javascript
// Automated contrast checking in CI/CD
import { checkContrast } from 'wcag-contrast'

const colors = {
  text: '#111827',
  background: '#FFFFFF'
}

const ratio = checkContrast(colors.text, colors.background)
if (ratio < 4.5) {
  throw new Error(`Contrast ratio ${ratio} fails WCAG AA`)
}
```

### 4. Keyboard Navigation

#### Focus Management
```jsx
// Focus visible indicator
.focus-visible:focus {
  outline: 2px solid #2563EB; /* Primary blue */
  outline-offset: 2px;
}

// Skip to main content link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

// Focus trap in modal
import { useFocusTrap } from '@/hooks/useFocusTrap'

function Modal({ isOpen, onClose }) {
  const modalRef = useFocusTrap(isOpen)

  return (
    <div ref={modalRef} role="dialog">
      {/* Modal content */}
    </div>
  )
}
```

#### Keyboard Shortcuts
```typescript
// Desktop keyboard shortcuts
const shortcuts = {
  '/': 'Focus search input',
  'Esc': 'Close modal/dialog',
  'h': 'Navigate to Home',
  's': 'Navigate to Search',
  'l': 'Navigate to Library',
  'p': 'Navigate to Profile',
  '?': 'Show keyboard shortcuts help',
  'ArrowUp/Down': 'Navigate list items',
  'Enter/Space': 'Activate focused element',
  'Tab': 'Move focus forward',
  'Shift+Tab': 'Move focus backward'
}

// Implementation
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    // Don't trigger if user is typing in input
    if (e.target instanceof HTMLInputElement) return

    switch(e.key) {
      case '/':
        e.preventDefault()
        searchInputRef.current?.focus()
        break
      case 'h':
        router.push('/home')
        break
      // ... other shortcuts
    }
  }

  window.addEventListener('keydown', handleKeyboard)
  return () => window.removeEventListener('keydown', handleKeyboard)
}, [])
```

#### Tab Order
```jsx
// Ensure logical tab order
<form>
  <input tabIndex={0} /> {/* Natural order */}
  <input tabIndex={0} />
  <button tabIndex={0}>Submit</button>

  {/* Avoid positive tabindex */}
  <input tabIndex={1} /> {/* Bad: disrupts natural order */}

  {/* Use tabindex="-1" to programmatically focus */}
  <div tabIndex={-1} ref={errorRef}>
    Error message
  </div>
</form>
```

### 5. Screen Reader Support

#### Alternative Text for Images
```jsx
// Book cover images
<img
  src={book.coverUrl}
  alt={`Book cover for ${book.title} by ${book.author}`}
/>

// Decorative images
<img
  src="/decorative-pattern.svg"
  alt="" // Empty alt for decorative
  role="presentation"
/>

// Icon with adjacent text
<button>
  <SearchIcon aria-hidden="true" />
  Search
</button>

// Icon-only button
<button aria-label="Close dialog">
  <XIcon />
</button>
```

#### Screen Reader Only Text
```css
/* Visually hidden but available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

```jsx
// Usage
<button>
  <HeartIcon />
  <span className="sr-only">Like this book</span>
</button>

// Progress indicator
<div className="progress-bar">
  <div style={{ width: '42%' }} />
  <span className="sr-only">Reading progress: 42%</span>
</div>
```

#### Announcing Changes
```jsx
// Progress update announcement
const [announcement, setAnnouncement] = useState('')

const updateProgress = (page: number) => {
  // Update state
  setCurrentPage(page)

  // Announce to screen reader
  const percentage = Math.round((page / totalPages) * 100)
  setAnnouncement(`Progress updated to ${percentage}%`)
}

return (
  <>
    {/* Live region for announcements */}
    <div role="status" aria-live="polite" className="sr-only">
      {announcement}
    </div>

    {/* UI */}
  </>
)
```

### 6. Form Accessibility

#### Labels and Inputs
```jsx
// Explicit labels (preferred)
<label htmlFor="search-input">
  Search books
</label>
<input
  id="search-input"
  type="text"
  placeholder="Title, author, ISBN..."
/>

// aria-label (when visual label not desired)
<input
  type="search"
  aria-label="Search books"
  placeholder="Search..."
/>

// aria-labelledby (for complex labels)
<div id="email-label">
  Email address
  <span className="text-red-500">*</span>
</div>
<input
  type="email"
  aria-labelledby="email-label"
  aria-required="true"
/>
```

#### Error Handling
```jsx
// Error messages linked to input
const [error, setError] = useState('')

<label htmlFor="page-input">Current page</label>
<input
  id="page-input"
  type="number"
  aria-invalid={!!error}
  aria-describedby={error ? "page-error" : undefined}
/>
{error && (
  <p id="page-error" role="alert">
    {error}
  </p>
)}
```

#### Required Fields
```jsx
<label htmlFor="email">
  Email address
  <span aria-label="required">*</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
/>
```

### 7. Touch Target Size

#### Minimum Sizes
```css
/* Mobile touch targets: 44x44px minimum */
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}

.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Desktop can be slightly smaller */
@media (min-width: 1024px) {
  .button-desktop {
    min-height: 40px;
  }
}
```

#### Spacing Between Targets
```css
/* Minimum 8px spacing between interactive elements */
.button-group {
  display: flex;
  gap: 8px;
}

.list-item {
  margin-bottom: 12px; /* Spacing between tappable items */
}
```

### 8. Motion and Animation

#### Respect Prefers-Reduced-Motion
```css
/* Respect user's motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Safe animations (okay with reduced motion) */
.fade-in {
  opacity: 0;
  animation: fadeIn 300ms ease-in forwards;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    opacity: 1; /* Just show, don't animate */
    animation: none;
  }
}
```

#### Pausable Animations
```jsx
// Auto-scrolling carousel with pause control
<div className="carousel">
  <button
    onClick={toggleAutoplay}
    aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
  >
    {isPlaying ? <PauseIcon /> : <PlayIcon />}
  </button>

  {/* Carousel content */}
</div>
```

### 9. Internationalization (i18n) Accessibility

#### Language Attributes
```jsx
// Page-level language
<html lang="ja">

// Section with different language
<blockquote lang="en">
  "A beautifully written story of loss and nostalgia."
</blockquote>

// RTL support for future Arabic/Hebrew
<html lang="ar" dir="rtl">
```

#### Text Direction
```css
/* Logical properties for RTL support */
.card {
  padding-inline-start: 16px; /* Left in LTR, Right in RTL */
  padding-inline-end: 16px;   /* Right in LTR, Left in RTL */
  margin-block-start: 12px;   /* Top in both */
}

/* Instead of */
.card {
  padding-left: 16px;  /* Hard-coded direction */
  padding-right: 16px;
}
```

### 10. Testing for Accessibility

#### Automated Testing
```typescript
// Jest + Testing Library
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('BookCard should be accessible', async () => {
  const { container } = render(<BookCard {...mockBook} />)
  const results = await axe(container)

  expect(results).toHaveNoViolations()
})

// Check for specific elements
test('Like button should have accessible name', () => {
  render(<BookCard {...mockBook} />)

  const likeButton = screen.getByRole('button', { name: /like/i })
  expect(likeButton).toBeInTheDocument()
})
```

#### Manual Testing Checklist

**Keyboard Testing:**
- [ ] Tab through all interactive elements
- [ ] Verify focus order is logical
- [ ] Check all actions can be triggered with keyboard
- [ ] Ensure no keyboard traps
- [ ] Test keyboard shortcuts

**Screen Reader Testing:**
- [ ] Test with VoiceOver (macOS/iOS)
- [ ] Test with NVDA/JAWS (Windows)
- [ ] Test with TalkBack (Android)
- [ ] Verify all content is announced
- [ ] Check heading structure
- [ ] Verify form labels

**Visual Testing:**
- [ ] Test with 200% zoom
- [ ] Verify no horizontal scrolling
- [ ] Check color contrast ratios
- [ ] Test without color (grayscale)
- [ ] Verify focus indicators visible

**Touch Testing:**
- [ ] Verify touch targets >= 44x44px
- [ ] Test with pointer/finger
- [ ] Check spacing between targets

#### Browser Extensions for Testing
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Colour Contrast Analyser**: Check color ratios
- **HeadingsMap**: Verify heading structure
- **Landmark Navigation**: Check ARIA landmarks

---

## Component-Specific Guidelines

### Bottom Navigation
```jsx
<nav
  role="navigation"
  aria-label="Main navigation"
>
  <a
    href="/home"
    aria-current={isActive('/home') ? 'page' : undefined}
  >
    <HomeIcon aria-hidden="true" />
    <span>Home</span>
  </a>

  {/* Other nav items */}
</nav>
```

### Book Card
```jsx
<article aria-labelledby={`book-title-${book.id}`}>
  <a href={`/books/${book.id}`}>
    <img
      src={book.coverUrl}
      alt={`Cover of ${book.title}`}
    />
    <h3 id={`book-title-${book.id}`}>
      {book.title}
    </h3>
    <p>{book.author}</p>
  </a>

  <button
    aria-label={`Like ${book.title}`}
    aria-pressed={isLiked}
  >
    <HeartIcon aria-hidden="true" />
  </button>
</article>
```

### Search Input
```jsx
<div role="search">
  <label htmlFor="search" className="sr-only">
    Search books
  </label>
  <input
    id="search"
    type="search"
    placeholder="Search books, authors..."
    aria-autocomplete="list"
    aria-controls="search-results"
    aria-expanded={showResults}
  />

  <div
    id="search-results"
    role="listbox"
    aria-label="Search results"
  >
    {results.map(book => (
      <div role="option" key={book.id}>
        {book.title}
      </div>
    ))}
  </div>
</div>
```

### Progress Slider
```jsx
<div>
  <label htmlFor="page-slider">
    Current page: {currentPage} of {totalPages}
  </label>
  <input
    id="page-slider"
    type="range"
    min={0}
    max={totalPages}
    value={currentPage}
    onChange={(e) => setCurrentPage(e.target.value)}
    aria-valuemin={0}
    aria-valuemax={totalPages}
    aria-valuenow={currentPage}
    aria-valuetext={`Page ${currentPage} of ${totalPages}`}
  />
</div>
```

### Loading States
```jsx
// Loading spinner
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  <span className="sr-only">Loading books...</span>
  <Spinner aria-hidden="true" />
</div>

// Skeleton loader
<div aria-hidden="true">
  <div className="skeleton-line" />
  <div className="skeleton-line" />
</div>
<span className="sr-only">Loading content</span>
```

### Empty States
```jsx
<div role="status">
  <EmptyIcon aria-hidden="true" />
  <h2>Your Library is Empty</h2>
  <p>Start building your reading collection by adding books</p>
  <a href="/search">Explore Books</a>
</div>
```

---

## Mobile-Specific Accessibility

### iOS VoiceOver
```jsx
// Grouping related content
<div role="group" aria-label="Book information">
  <h3>{book.title}</h3>
  <p>{book.author}</p>
  <p>{book.rating}</p>
</div>

// Custom actions for swipe gestures
// Communicated via accessibility hints
<div
  role="article"
  aria-label={`${book.title} by ${book.author}. Swipe up for actions.`}
>
  {/* Book content */}
</div>
```

### Android TalkBack
```jsx
// Content descriptions for non-text elements
<button
  aria-label="Add to library"
  // Android-specific: contentDescription set via React Native
>
  <PlusIcon />
</button>

// Accessibility hints
<input
  aria-label="Search books"
  aria-describedby="search-hint"
/>
<div id="search-hint" className="sr-only">
  Start typing to search by title, author, or ISBN
</div>
```

---

## Responsive Accessibility

### Mobile Considerations
- Touch targets minimum 44x44px
- Increased font sizes (minimum 16px to prevent zoom on iOS)
- Simplified navigation (bottom tab bar)
- Swipe gestures with accessible alternatives

### Desktop Considerations
- Keyboard shortcuts for power users
- Hover states (but don't rely on hover alone)
- Larger information density
- Multi-column layouts with proper heading structure

### Tablet Considerations
- Hybrid approach (both touch and keyboard)
- Adaptive layouts based on orientation
- Sufficient spacing for both input methods

---

## Accessibility Statement

### User-Facing Statement
```markdown
## Accessibility Commitment

Bookify is committed to ensuring digital accessibility for people with disabilities.
We are continually improving the user experience for everyone and applying the
relevant accessibility standards.

### Conformance Status
We aim to conform to WCAG 2.1 Level AA standards.

### Feedback
We welcome your feedback on the accessibility of Bookify. Please contact us:
- Email: accessibility@bookify.app
- In-app: Settings > Help & Support > Accessibility Feedback

We try to respond to accessibility feedback within 2 business days.

### Known Limitations
While we strive for full accessibility, some third-party content (book covers,
descriptions) may not meet all accessibility standards. We are working with
content providers to improve this.

Last updated: 2026-01-01
```

---

## Accessibility Roadmap

### Phase 1 (MVP) - Done
- [x] Semantic HTML structure
- [x] ARIA labels for all interactive elements
- [x] Keyboard navigation support
- [x] Color contrast compliance
- [x] Touch target sizing
- [x] Screen reader testing
- [x] Focus management

### Phase 2 (Q1 2026)
- [ ] Comprehensive accessibility audit by third party
- [ ] User testing with assistive technology users
- [ ] Accessibility documentation for developers
- [ ] Custom focus indicators per component
- [ ] Improved error recovery for screen readers

### Phase 3 (Q2 2026)
- [ ] Accessibility preferences in user settings
- [ ] High contrast mode
- [ ] Text spacing adjustments
- [ ] Voice control support (Siri/Google Assistant)
- [ ] Haptic feedback for important actions (mobile)

### Phase 4 (Q3 2026)
- [ ] WCAG 2.2 compliance
- [ ] AAA level compliance for critical paths
- [ ] Accessibility training for development team
- [ ] Regular automated accessibility testing in CI/CD
- [ ] User testing program with diverse abilities

---

## Resources for Developers

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Articles](https://webaim.org/articles/)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)

### Screen Readers
- **macOS/iOS**: VoiceOver (built-in)
- **Windows**: NVDA (free), JAWS (commercial)
- **Android**: TalkBack (built-in)
- **ChromeOS**: ChromeVox (built-in)

### Color Contrast Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

---

## Developer Checklist

Before merging any PR:
- [ ] Run automated accessibility tests (axe)
- [ ] Test keyboard navigation
- [ ] Verify color contrast ratios
- [ ] Check touch target sizes
- [ ] Test with screen reader (at least one)
- [ ] Verify focus management in modals/dialogs
- [ ] Check ARIA attributes are correct
- [ ] Ensure all images have alt text
- [ ] Test with zoom at 200%
- [ ] Verify form labels and error messages

---

## Version History
- v1.0.0 (2026-01-01): Initial accessibility guidelines for MVP
- Target: WCAG 2.1 Level AA compliance
- Next review: 2026-03-01
