# Bookify User Flows

## Overview
このドキュメントでは、Bookifyアプリの主要なユーザーフローを定義します。各フローは、ユーザーの目標達成までの手順を明確に示します。

---

## Flow Diagrams

### Legend
```
┌─────────┐
│ Screen  │  = 画面
└─────────┘

[Action]     = ユーザーアクション

{Decision}   = 条件分岐

→            = フロー方向

((Endpoint)) = 終了状態
```

---

## 1. 初回ユーザーオンボーディングフロー

### Goal
新規ユーザーがアカウントを作成し、パーソナライズされた体験を開始する

### Flow Diagram
```
Start
  ↓
┌─────────────────┐
│  Landing Page   │
│  - App Overview │
│  - Login CTAs   │
└─────────────────┘
  ↓
[User taps "Sign in with Google/Apple"]
  ↓
{Authentication}
  ↓ Success
┌─────────────────┐
│ Onboarding 1/2  │
│ Country Select  │
└─────────────────┘
  ↓
[User selects country]
  ↓
[User taps "Continue"]
  ↓
┌─────────────────┐
│ Onboarding 2/2  │
│ Language Select │
└─────────────────┘
  ↓
[User selects language]
  ↓
[User taps "Get Started"]
  ↓
┌─────────────────┐
│   Home Screen   │
│ (Personalized)  │
└─────────────────┘
  ↓
((User successfully onboarded))
```

### Alternative Paths

#### Skip Onboarding
```
Onboarding Screen
  ↓
[User taps "Skip"]
  ↓
┌─────────────────┐
│   Home Screen   │
│ (Default JP/EN) │
└─────────────────┘
  ↓
{Can change in Settings later}
```

#### Authentication Failure
```
Authentication
  ↓ Failure
┌─────────────────┐
│  Error Message  │
│  "Auth Failed"  │
└─────────────────┘
  ↓
[User taps "Try Again"]
  ↓
Landing Page
```

### User Journey Map
```
Stage:      Awareness → Interest → Setup → First Use
Touchpoint: Landing   → Auth     → Config → Home
Emotion:    Curious   → Hopeful  → Engaged→ Satisfied
```

### Success Metrics
- Onboarding completion rate > 80%
- Time to complete: < 60 seconds
- Skip rate: < 20%

---

## 2. 本検索・発見フロー

### Goal
ユーザーが興味のある本を見つける

### Flow Diagram - Search Path
```
Start
  ↓
┌─────────────────┐
│  Any Screen     │
└─────────────────┘
  ↓
[User taps Search icon/bar]
  ↓
┌─────────────────┐
│ Search Screen   │
│ - Empty state   │
│ - Recent search │
│ - Popular tags  │
└─────────────────┘
  ↓
[User types query]
  ↓
{Query length > 2}
  ↓ Yes
┌─────────────────┐
│ Search Results  │
│ - Book list     │
│ - Filters       │
└─────────────────┘
  ↓
{Results found?}
  ↓ Yes
[User taps book]
  ↓
┌─────────────────┐
│ Book Detail     │
└─────────────────┘
  ↓
((Book discovered))

{Results found?}
  ↓ No
┌─────────────────┐
│ Empty State     │
│ "No results"    │
│ Suggestions     │
└─────────────────┘
  ↓
[User tries different query OR browses categories]
```

### Flow Diagram - Browse Path
```
Start
  ↓
┌─────────────────┐
│  Home Screen    │
│ - Recommended   │
│ - Trending      │
│ - New Releases  │
└─────────────────┘
  ↓
[User scrolls/swipes carousel]
  ↓
[User taps book card]
  ↓
┌─────────────────┐
│ Book Detail     │
└─────────────────┘
  ↓
((Book discovered))
```

### Flow Diagram - Category Browse
```
Home Screen
  ↓
[User taps "See All" on section]
  ↓
┌─────────────────┐
│ Category View   │
│ - Grid/List     │
│ - Filters       │
└─────────────────┘
  ↓
[User applies filters]
  ↓
[User scrolls]
  ↓
[User taps book]
  ↓
┌─────────────────┐
│ Book Detail     │
└─────────────────┘
  ↓
((Book discovered))
```

### User Decision Points
1. Search vs Browse
2. Query formulation
3. Filter application
4. Result selection

### Success Metrics
- Search success rate: > 70%
- Time to find book: < 2 minutes
- Filter usage rate: 30-40%

---

## 3. 本詳細閲覧・アクションフロー

### Goal
ユーザーが本の詳細を確認し、アクションを実行する

### Flow Diagram
```
Start (from search/browse)
  ↓
┌─────────────────┐
│ Book Detail     │
│ - Cover         │
│ - Info          │
│ - Actions       │
└─────────────────┘
  ↓
[User scrolls to explore]
  ↓
{User interested?}
  ↓ No → Back to previous screen
  ↓ Yes
  │
  ├─→ [User taps Like button]
  │     ↓
  │   ┌─────────────────┐
  │   │ Like Animation  │
  │   │ Heart fills     │
  │   └─────────────────┘
  │     ↓
  │   Toast: "Liked"
  │     ↓
  │   ((Action complete))
  │
  ├─→ [User taps "Add to Library"]
  │     ↓
  │   ┌─────────────────┐
  │   │ Status Selector │
  │   │ - To Read       │
  │   │ - Reading       │
  │   │ - Completed     │
  │   └─────────────────┘
  │     ↓
  │   [User selects status]
  │     ↓
  │   Toast: "Added to Library"
  │     ↓
  │   ((Book added))
  │
  ├─→ [User taps "Share"]
  │     ↓
  │   ┌─────────────────┐
  │   │ Native Share    │
  │   │ Sheet           │
  │   └─────────────────┘
  │     ↓
  │   ((Share complete))
  │
  └─→ [User taps "AI Summary"]
        ↓
      ┌─────────────────┐
      │ Loading Spinner │
      └─────────────────┘
        ↓
      {AI generation}
        ↓ Success
      ┌─────────────────┐
      │ AI Summary Text │
      └─────────────────┘
        ↓
      ((Summary viewed))
```

### Tab Navigation Flow
```
Book Detail (Overview tab)
  ↓
[User taps "Details" tab]
  ↓
Shows: Pages, Published, ISBN, Language
  ↓
[User taps "Reviews" tab]
  ↓
Shows: User reviews, ratings
  ↓
[User can navigate back to any tab]
```

### Success Metrics
- Add to library rate: > 25%
- Like rate: > 40%
- AI summary generation rate: > 15%
- Average time on page: 45-90 seconds

---

## 4. ライブラリ追加・管理フロー

### Goal
ユーザーが本をライブラリに追加し、読書ステータスを管理する

### Flow Diagram - Add to Library
```
Start (from Book Detail)
  ↓
[User taps "Add to Library"]
  ↓
┌─────────────────┐
│ Status Selector │
│ Modal/Sheet     │
└─────────────────┘
  ↓
[User selects status]
  │
  ├─→ "To Read"
  │     ↓
  │   Book added with status: TO_READ
  │
  ├─→ "Reading"
  │     ↓
  │   ┌─────────────────┐
  │   │ Set Start Page? │
  │   │ (Optional)      │
  │   └─────────────────┘
  │     ↓
  │   Book added with status: READING, page: 0
  │
  └─→ "Completed"
        ↓
      ┌─────────────────┐
      │ Add Review?     │
      │ (Optional)      │
      └─────────────────┘
        ↓
      Book added with status: COMPLETED
  ↓
Toast: "Added to Library"
  ↓
┌─────────────────┐
│ Book Detail     │
│ (Updated UI)    │
│ "In Library" ✓  │
└─────────────────┘
  ↓
((Book in library))
```

### Flow Diagram - Update Progress
```
Start
  ↓
┌─────────────────┐
│ My Library      │
│ - Reading list  │
└─────────────────┘
  ↓
[User taps book card]
  ↓
┌─────────────────┐
│ Book Detail     │
│ (Shows progress)│
└─────────────────┘
  ↓
[User taps "Update Progress"]
  ↓
┌─────────────────┐
│ Progress Modal  │
│ - Page slider   │
│ - Quick actions │
│ - Status toggle │
└─────────────────┘
  ↓
[User adjusts page number]
  │
  ├─→ Via slider
  ├─→ Via text input
  └─→ Via quick buttons (+10, +25, +50)
  ↓
{Page >= Total pages?}
  ↓ Yes
  ┌─────────────────┐
  │ Completion Alert│
  │ "Finished book?"│
  └─────────────────┘
    ↓
  [User confirms]
    ↓
  Status → COMPLETED
  ┌─────────────────┐
  │ Celebration     │
  │ Animation       │
  └─────────────────┘
    ↓
  Toast: "Congratulations! 🎉"
  ↓
{Page >= Total pages?}
  ↓ No
  [User taps "Save Progress"]
  ↓
Database updated
  ↓
Toast: "Progress saved"
  ↓
┌─────────────────┐
│ Book Detail     │
│ (Updated)       │
└─────────────────┘
  ↓
((Progress updated))
```

### Flow Diagram - Remove from Library
```
Start (from Library or Book Detail)
  ↓
[User taps "Remove" or swipes]
  ↓
┌─────────────────┐
│ Confirmation    │
│ Dialog          │
│ "Remove book?"  │
└─────────────────┘
  ↓
{User confirms?}
  ↓ No → Cancel
  ↓ Yes
Database updated (soft delete)
  ↓
Toast: "Removed from library"
  ↓
UI updated (book removed)
  ↓
((Book removed))
```

### Success Metrics
- Library addition completion: > 95%
- Progress update frequency: 2-3x per week (active readers)
- Completion celebration view rate: 100%

---

## 5. 読書進捗追跡フロー

### Goal
ユーザーが読書進捗を継続的に記録する

### Flow Diagram - Regular Progress Update
```
Day 1:
User opens app
  ↓
Push notification: "Update your reading progress"
  ↓
[User taps notification]
  ↓
┌─────────────────┐
│ My Library      │
│ Reading section │
└─────────────────┘
  ↓
[User taps book]
  ↓
[User taps "Update Progress"]
  ↓
[Updates page number]
  ↓
[Saves]
  ↓
((Progress recorded))

Day 2-7:
Repeat above flow
  ↓
{User reaches end}
  ↓
Completion celebration
  ↓
┌─────────────────┐
│ Statistics      │
│ - Reading time  │
│ - Speed         │
└─────────────────┘
  ↓
((Book completed, stats shown))
```

### Flow Diagram - Quick Update (Widget/Shortcut)
```
Home Screen Widget (Future)
  ↓
[User taps book on widget]
  ↓
[Quick progress picker]
  ↓
[User selects page]
  ↓
Background update
  ↓
Widget refreshes
  ↓
((Quick update complete))
```

### Engagement Loop
```
1. User reads book
2. Opens app to update
3. Sees progress visualization
4. Feels accomplishment
5. Motivated to read more
6. Back to step 1
```

### Success Metrics
- Active readers updating weekly: > 60%
- Average updates per book: > 5
- Completion rate: > 40%

---

## 6. 設定・パーソナライゼーションフロー

### Goal
ユーザーがアプリをカスタマイズする

### Flow Diagram - Change Language
```
Start
  ↓
┌─────────────────┐
│ Any Screen      │
└─────────────────┘
  ↓
[User taps Profile/Settings]
  ↓
┌─────────────────┐
│ Profile Screen  │
└─────────────────┘
  ↓
[User taps "Country & Language"]
  ↓
┌─────────────────┐
│ Language Settings│
│ - App language  │
│ - Country       │
│ - Content prefs │
└─────────────────┘
  ↓
[User selects new language]
  ↓
{Confirmation needed?}
  ↓ Yes (if changing country)
  ┌─────────────────┐
  │ Confirm Dialog  │
  │ "Recommendations│
  │  will change"   │
  └─────────────────┘
    ↓
  [User confirms]
  ↓
App reloads with new language
  ↓
┌─────────────────┐
│ Home Screen     │
│ (New language)  │
└─────────────────┘
  ↓
Toast: "設定を更新しました" (in new language)
  ↓
((Settings updated))
```

### Flow Diagram - Toggle Dark Mode
```
Any Screen
  ↓
[User taps theme toggle (top nav)]
  ↓
{Current theme?}
  │
  ├─→ Light → Dark
  ├─→ Dark → Light
  └─→ System → Light/Dark (follows OS)
  ↓
Smooth transition animation
  ↓
Theme updated across app
  ↓
Preference saved
  ↓
((Theme changed))
```

### Flow Diagram - Notification Preferences
```
Profile Screen
  ↓
[User taps "Notifications"]
  ↓
┌─────────────────┐
│ Notification    │
│ Settings        │
│ - Reading remind│
│ - New releases  │
│ - Recommendations│
└─────────────────┘
  ↓
[User toggles preferences]
  ↓
{Permission granted?}
  ↓ No
  ┌─────────────────┐
  │ Request Permiss.│
  └─────────────────┘
    ↓
  {User grants?}
    ↓ No → Cannot enable
    ↓ Yes
  ↓
Preferences saved
  ↓
Toast: "Notification settings updated"
  ↓
((Settings saved))
```

### Success Metrics
- Settings page visit rate: > 30% of users
- Dark mode adoption: > 50%
- Notification opt-in: > 40%

---

## 7. ソーシャル機能フロー (Future)

### Goal
ユーザーが本を共有し、他のユーザーとつながる

### Flow Diagram - Share Book
```
Book Detail
  ↓
[User taps "Share"]
  ↓
┌─────────────────┐
│ Native Share    │
│ Sheet           │
│ - Copy link     │
│ - Social apps   │
│ - Message       │
└─────────────────┘
  ↓
[User selects platform]
  ↓
{Platform type}
  │
  ├─→ Copy Link
  │     ↓
  │   Link copied to clipboard
  │     ↓
  │   Toast: "Link copied"
  │
  ├─→ Social Media
  │     ↓
  │   Opens share sheet with pre-filled text
  │     ↓
  │   User completes share
  │
  └─→ Message
        ↓
      Opens messaging app
        ↓
      User sends
  ↓
((Share complete))
```

### Flow Diagram - Follow User (Future Phase 2)
```
User Profile (not own)
  ↓
[User taps "Follow"]
  ↓
API call
  ↓
{Success?}
  ↓ Yes
Button state changes to "Following"
  ↓
Toast: "Now following [User]"
  ↓
User's books appear in feed
  ↓
((Following relationship created))
```

### Success Metrics
- Share rate: > 10% of book views
- Most shared platform: Measure and optimize
- Follow conversion (future): > 20%

---

## 8. エラー回復フロー

### Goal
ユーザーがエラー状態から回復する

### Flow Diagram - Network Error
```
User action (any)
  ↓
API request
  ↓
{Network available?}
  ↓ No
┌─────────────────┐
│ Error State     │
│ "No connection" │
│ [Retry] button  │
└─────────────────┘
  ↓
{User action}
  │
  ├─→ [Taps Retry]
  │     ↓
  │   Retry API call
  │     ↓
  │   {Success?}
  │     ↓ Yes → Content loads
  │     ↓ No → Show error again
  │
  ├─→ [Navigates away]
  │     ↓
  │   Show cached/offline content if available
  │
  └─→ [Waits]
        ↓
      Auto-retry after 30s (background)
        ↓
      {Success?}
        ↓ Yes → Update UI, show content
```

### Flow Diagram - Authentication Error
```
User session expires
  ↓
API returns 401
  ↓
┌─────────────────┐
│ Session Expired │
│ Alert           │
│ "Please sign in"│
└─────────────────┘
  ↓
[User taps "Sign In"]
  ↓
┌─────────────────┐
│ Login Screen    │
└─────────────────┘
  ↓
[User authenticates]
  ↓
{Success?}
  ↓ Yes
Restore previous state
  ↓
((Session restored))
```

### Flow Diagram - Data Sync Conflict
```
User edits progress offline
  ↓
App comes online
  ↓
Sync attempt
  ↓
{Conflict detected?}
  ↓ Yes
┌─────────────────┐
│ Conflict Dialog │
│ "Which to keep?"│
│ - Local: page X │
│ - Server: page Y│
└─────────────────┘
  ↓
[User selects version]
  ↓
Update database
  ↓
Toast: "Progress synced"
  ↓
((Conflict resolved))
```

### Success Metrics
- Error recovery rate: > 80%
- Retry success rate: > 70%
- User frustration (measured by app abandonment): < 5%

---

## 9. 完全なユーザージャーニー例

### Scenario: 新規ユーザーがBookifyで本を読み始めるまで

```
Day 1 - Discovery & Onboarding
─────────────────────────────

10:00 AM - User discovers app via App Store
  ↓
[Downloads and opens app]
  ↓
┌─────────────────┐
│ Landing Screen  │
│ Shows value prop│
└─────────────────┘
  ↓
[Taps "Sign in with Google"]
  ↓
Authentication completes (3 seconds)
  ↓
┌─────────────────┐
│ Country Select  │
└─────────────────┘
  ↓
[Selects "Japan"]
  ↓
[Taps "Continue"]
  ↓
┌─────────────────┐
│ Language Select │
└─────────────────┘
  ↓
[Selects "日本語"]
  ↓
[Taps "始める"]
  ↓
┌─────────────────┐
│ Home Screen     │
│ (Japanese UI)   │
│ (Japan trending)│
└─────────────────┘
  ↓
[User browses recommended books]
  ↓
[Taps interesting book cover]
  ↓
┌─────────────────┐
│ Book Detail     │
│ "Norwegian Wood"│
└─────────────────┘
  ↓
[Reads description]
  ↓
[Taps "AI Summary"]
  ↓
[Reads AI-generated summary]
  ↓
[Taps "ライブラリに追加"]
  ↓
┌─────────────────┐
│ Status Selector │
└─────────────────┘
  ↓
[Selects "読みたい"]
  ↓
Toast: "ライブラリに追加されました"
  ↓
[Navigates to Library tab]
  ↓
┌─────────────────┐
│ My Library      │
│ 1 book "To Read"│
└─────────────────┘
  ↓
User closes app, satisfied with setup

Total time: 3 minutes


Day 3 - Starting to Read
────────────────────────

8:00 PM - User opens app after purchasing physical book
  ↓
┌─────────────────┐
│ Home Screen     │
└─────────────────┘
  ↓
[Taps Library tab]
  ↓
┌─────────────────┐
│ My Library      │
│ To Read section │
└─────────────────┘
  ↓
[Taps "Norwegian Wood"]
  ↓
┌─────────────────┐
│ Book Detail     │
└─────────────────┘
  ↓
[Taps "読書を開始"]
  ↓
Status updated to "Reading"
  ↓
┌─────────────────┐
│ Progress Modal  │
│ Current page: 0 │
└─────────────────┘
  ↓
[User adjusts to page 1]
  ↓
[Taps "保存"]
  ↓
Toast: "読書を開始しました"
  ↓
((User has started reading))


Day 7 - Regular Progress Update
────────────────────────────────

9:00 PM - User has read to page 45
  ↓
Push notification: "読書進捗を更新しましょう"
  ↓
[User taps notification]
  ↓
Opens directly to Library
  ↓
[Taps "Norwegian Wood"]
  ↓
[Taps "進捗を更新"]
  ↓
┌─────────────────┐
│ Progress Modal  │
│ Current: page 12│
└─────────────────┘
  ↓
[Taps "+25" quick button]
  ↓
[Fine-tunes to page 45 via slider]
  ↓
[Taps "保存"]
  ↓
Progress bar updates (15% complete)
  ↓
Toast: "進捗が保存されました"
  ↓
┌─────────────────┐
│ Book Detail     │
│ ████░░░░░░ 15% │
│ Page 45/296     │
└─────────────────┘
  ↓
User feels accomplished, closes app

Total time: 30 seconds


Day 28 - Book Completion
─────────────────────────

11:00 PM - User finishes the book
  ↓
[Opens app]
  ↓
[Updates to page 296]
  ↓
{Page == Total pages}
  ↓ Yes
┌─────────────────┐
│ Completion Alert│
│ "本を読み終えた？"│
└─────────────────┘
  ↓
[User taps "はい"]
  ↓
┌─────────────────┐
│ 🎉 Celebration  │
│ Animation       │
│ "おめでとう!"     │
└─────────────────┘
  ↓
Status → Completed
  ↓
┌─────────────────┐
│ Reading Stats   │
│ - 28 days       │
│ - 10.6 pages/day│
└─────────────────┘
  ↓
[Optional: Add review]
  ↓
┌─────────────────┐
│ Similar Books   │
│ Recommendations │
└─────────────────┘
  ↓
[User browses next book]
  ↓
((Reading cycle continues))
```

---

## 10. フロー最適化ポイント

### Critical User Paths (最優先最適化)
1. Onboarding to first book: < 60 seconds
2. Search to book detail: < 10 seconds
3. Add to library: < 3 taps
4. Update progress: < 20 seconds

### Friction Points to Address
1. **Authentication**
   - Pre-fill with device credentials
   - Reduce steps to 1-tap login

2. **Search**
   - Improve autocomplete speed (< 100ms)
   - Better relevance ranking

3. **Progress Update**
   - Add home screen widget for quick updates
   - Voice input for page numbers

4. **Notifications**
   - Smart timing based on reading patterns
   - Don't interrupt, gentle reminders

### A/B Testing Opportunities
1. Onboarding: Skip vs Required country/language
2. Book cards: Horizontal vs Vertical layouts
3. Progress modal: Slider vs Number input default
4. Recommendations: Algorithm A vs B

---

## 11. Error Prevention Strategies

### Proactive Measures
```
Before API Call:
  ↓
{Network check}
  ↓ Offline
Show cached content + offline indicator
  ↓
{User tries to modify}
  ↓
Queue action for later sync
  ↓
Toast: "変更は接続時に同期されます"
```

### Input Validation
```
Progress Update Modal:
  ↓
[User enters page number]
  ↓
{Validate input}
  │
  ├─→ Page < 0
  │     ↓
  │   Show error: "ページ番号は0以上"
  │   Prevent save
  │
  ├─→ Page > Total
  │     ↓
  │   Show confirmation: "本を読み終えた？"
  │
  └─→ Valid
        ↓
      Allow save
```

### Undo Actions
```
User removes book from library
  ↓
Toast: "削除されました [Undo]"
  ↓
{User taps Undo within 5s?}
  ↓ Yes
Restore book to library
  ↓
Toast: "元に戻しました"
  ↓ No (5s timeout)
Permanent deletion (soft delete in DB)
```

---

## 12. Analytics & Tracking Points

### Key Events to Track
```
User Journey:
- app_opened
- onboarding_started
- onboarding_completed
- onboarding_skipped

Discovery:
- search_performed (query, filters)
- book_viewed (source: search/browse/recommendation)
- category_browsed

Engagement:
- book_liked
- book_added_to_library (status)
- progress_updated (frequency, amount)
- book_completed
- ai_summary_generated

Settings:
- language_changed
- theme_changed
- notifications_enabled

Social:
- book_shared (platform)
- link_clicked (source)
```

### Conversion Funnels
```
Funnel 1: Onboarding
Landing → Auth → Country → Language → Home
Track: Drop-off at each step

Funnel 2: Book to Library
Home → Book Detail → Add → Library
Track: Conversion rate

Funnel 3: Reading Completion
Add → First Update → Multiple Updates → Completion
Track: Completion rate, average updates
```

### User Segmentation
```
Segments:
- New users (< 7 days)
- Active readers (updated progress in last 7 days)
- Dormant users (no activity in 30 days)
- Completers (finished at least 1 book)

Analyze:
- Feature usage by segment
- Retention by segment
- Reactivation campaigns for dormant
```

---

## 13. Accessibility Considerations

### Screen Reader Flows
```
VoiceOver/TalkBack enabled:
  ↓
All images have alt text
  ↓
Interactive elements have labels
  ↓
State changes announced
  ↓
{User navigates with gestures}
  │
  ├─→ Swipe: Move focus
  ├─→ Double-tap: Activate
  └─→ Rotor: Quick navigation

Example - Book Card:
Announces: "Norwegian Wood by Haruki Murakami,
           4.2 stars, 2847 ratings,
           Like button, Add to library button"
```

### Keyboard Navigation (Desktop)
```
{User presses Tab}
  ↓
Focus moves to next interactive element
  ↓
Visual focus indicator shown (2px outline)
  ↓
{User presses Enter/Space}
  ↓
Element activated
  ↓
{User presses Esc}
  ↓
Close modal/dialog
  ↓
Focus returns to trigger element
```

### Color Blind Modes
```
Don't rely on color alone:
  ↓
Like button: Heart icon + "Liked" text
  ↓
Reading status: Badge color + text label
  ↓
Progress: Bar + percentage text
  ↓
All states distinguishable by shape/text
```

---

## 14. Performance Optimization Flows

### Image Loading Strategy
```
User scrolls to book section
  ↓
{Images in viewport?}
  ↓ Not yet
Load placeholder (low-quality blur)
  ↓
{Image enters viewport}
  ↓ Yes (within 500px)
Lazy load full-quality image
  ↓
{Image loaded?}
  ↓ Yes
Fade in animation (200ms)
  ↓
Replace placeholder
  ↓
((Smooth experience, fast loading))
```

### Data Prefetching
```
User on Home screen
  ↓
Prefetch likely next screens:
  - Book Detail (for trending books)
  - Search autocomplete data
  - User's library summary
  ↓
Store in memory cache
  ↓
{User navigates to prefetched screen}
  ↓
Instant load (< 50ms)
  ↓
((Feels instant))
```

### Optimistic UI Updates
```
User taps "Like" button
  ↓
Immediately:
  - Animate button (heart fills)
  - Update UI state
  - Show toast
  ↓
Background:
  - Send API request
  ↓
{API response}
  ↓ Success → No change needed
  ↓ Failure
    ↓
  Rollback UI state
  ↓
  Toast: "いいねに失敗しました [Retry]"
  ↓
  ((User experiences instant feedback))
```

---

## Version History
- v1.0.0 (2026-01-01): Initial user flows for MVP features
