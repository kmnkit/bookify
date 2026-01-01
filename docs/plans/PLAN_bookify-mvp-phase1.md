# Implementation Plan: Bookify MVP Phase 1

**Status**: 🔄 In Progress
**Started**: 2026-01-01
**Last Updated**: 2026-01-01
**Estimated Completion**: -

---

**CRITICAL INSTRUCTIONS**: After completing each phase:
1. Check off completed task checkboxes
2. Run all quality gate validation commands
3. Verify ALL quality gate items pass
4. Update "Last Updated" date above
5. Document learnings in Notes section
6. Only then proceed to next phase

**DO NOT skip quality gates or proceed with failing checks**

---

## Overview

### Feature Description
Bookifyは、ユーザーの居住国に基づいて本をおすすめし、読書進捗を管理できるWebアプリケーション。Google Books APIを活用し、パーソナライズされた読書体験を提供する。多言語対応（日本語・英語・韓国語）でグローバルな読書コミュニティを構築する。

### Success Criteria
- [ ] ソーシャルログイン（Google/Apple）が動作する
- [ ] 国別おすすめ本が表示される
- [ ] 本検索ができる
- [ ] いいね・読書進捗を管理できる
- [ ] AI要約が生成される
- [ ] 多言語（日/英/韓）切り替えができる
- [ ] レスポンシブUIで動作する
- [ ] Vercelにデプロイ完了

### User Impact
- 自国で入手可能な本を効率的に発見できる
- 読書進捗を一元管理できる
- AIによる3行要約で本の内容を素早く把握できる

---

## Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Next.js 15 App Router | サーバーコンポーネント、ストリーミング対応、SEO最適化 | 学習コスト |
| Firebase Auth | Google/Apple統合が容易、無料枠が大きい | ベンダーロックイン |
| Firestore | リアルタイム同期、NoSQLでスケーラブル | 複雑なクエリ制限 |
| next-intl | App Router完全対応、型安全なi18n | 初期設定の複雑さ |
| shadcn/ui + Tailwind CSS | 高いカスタマイズ性、コピー&ペースト方式 | 初期セットアップ |
| Claude API (Haiku) | 低コスト・高速な要約生成 | APIコスト |

---

## Dependencies

### Required Before Starting
- [ ] Node.js 20+ インストール済み
- [ ] Firebase プロジェクト作成済み
- [ ] Google Books API キー取得済み
- [ ] Claude API キー取得済み
- [ ] Vercel アカウント作成済み

### External Dependencies
- next: 15.x
- react: 19.x
- firebase: 11.x
- @anthropic-ai/sdk: latest
- next-intl: 3.x
- tailwindcss: 3.x
- shadcn/ui components

---

## Test Strategy

### Testing Approach
**TDD Principle**: Write tests FIRST, then implement to make them pass

### Test Pyramid for This Feature
| Test Type | Coverage Target | Purpose |
|-----------|-----------------|---------|
| **Unit Tests** | ≥80% | ビジネスロジック、ユーティリティ、hooks |
| **Integration Tests** | Critical paths | API連携、Firebase操作、コンポーネント統合 |
| **E2E Tests** | Key user flows | ログイン→本検索→いいね→進捗更新フロー |

### Test File Organization
```
__tests__/
├── unit/
│   ├── lib/
│   ├── hooks/
│   └── utils/
├── integration/
│   ├── api/
│   └── firebase/
└── e2e/
    └── user-flows/
```

### Coverage Requirements by Phase
- **Phase 1**: セットアップ・設定ファイルのみ（テスト基盤構築）
- **Phase 2**: 認証ロジック ≥80%
- **Phase 3**: API連携・検索ロジック ≥80%
- **Phase 4**: 読書管理ロジック ≥80%
- **Phase 5**: AI要約ロジック ≥80%
- **Phase 6**: E2Eテスト + 総合カバレッジ ≥75%

---

## Implementation Phases

### Phase 1: Project Foundation
**Goal**: Next.js App Router + Firebase + i18n + 共通UI基盤の構築
**Estimated Time**: 3-4 hours
**Status**: Completed

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 1.1**: テスト環境セットアップ
  - File(s): `jest.config.js`, `vitest.config.ts`
  - 詳細: Jest/Vitestの設定、Testing Library導入

**GREEN: Implement to Make Tests Pass**
- [x] **Task 1.2**: Next.js プロジェクト初期化
  - Command: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir`
  - 詳細: TypeScript, Tailwind CSS, ESLint, App Router, src/ディレクトリ

- [x] **Task 1.3**: shadcn/ui セットアップ
  - Command: `npx shadcn@latest init`
  - 詳細: 基本コンポーネント（Button, Card, Input, Dialog等）追加

- [x] **Task 1.4**: Firebase 初期設定
  - File(s): `src/lib/firebase/config.ts`, `src/lib/firebase/auth.ts`
  - 詳細: Firebase初期化、環境変数設定

- [x] **Task 1.5**: 多言語対応（next-intl）セットアップ
  - File(s): `src/i18n.ts`, `messages/ja.json`, `messages/en.json`, `messages/ko.json`
  - 詳細: 言語ファイル作成、ミドルウェア設定

- [x] **Task 1.6**: 共通レイアウト作成
  - File(s): `src/app/[locale]/layout.tsx`, `src/components/layout/`
  - 詳細: ヘッダー、フッター、ボトムナビゲーション（モバイル）

- [x] **Task 1.7**: ダークモード対応
  - File(s): `src/components/theme-provider.tsx`
  - 詳細: next-themes導入、システム設定連動

**REFACTOR: Clean Up Code**
- [x] **Task 1.8**: リファクタリング
  - 詳細: フォルダ構成整理、共通型定義、ESLint/Prettier設定調整

#### Quality Gate

**Build & Tests**:
- [x] `npm run build` がエラーなく完了
- [x] `npm run lint` がエラーなし
- [x] `npm run type-check` がエラーなし

**Functionality**:
- [x] ローカル開発サーバーが起動する
- [x] 日本語/英語/韓国語の切り替えが動作
- [x] ダークモード切り替えが動作
- [x] レスポンシブレイアウトが正常表示

**Validation Commands**:
```bash
npm run build
npm run lint
npm run type-check
npm run dev
```

---

### Phase 2: Authentication System
**Goal**: ソーシャルログイン（Google/Apple）+ ユーザープロフィール + 国・言語設定
**Estimated Time**: 3-4 hours
**Status**: Completed

#### Tasks

**RED: Write Failing Tests First**
- [x] **Test 2.1**: 認証フック単体テスト
  - File(s): `__tests__/unit/hooks/useAuth.test.tsx`
  - 詳細: ログイン状態、ログアウト、ユーザー情報取得のテスト

- [x] **Test 2.2**: ユーザー設定保存テスト
  - File(s): `__tests__/integration/firebase/user.test.ts`
  - 詳細: Firestore へのユーザー保存・取得テスト

**GREEN: Implement to Make Tests Pass**
- [x] **Task 2.3**: Firebase Authentication 設定
  - File(s): `src/lib/firebase/auth.ts`
  - 詳細: Google/Apple プロバイダー設定

- [x] **Task 2.4**: 認証Context/Hook作成
  - File(s): `src/contexts/AuthContext.tsx`, `src/hooks/useAuth.ts`
  - 詳細: ログイン状態管理、ユーザー情報取得

- [x] **Task 2.5**: ログイン画面UI
  - File(s): `src/app/[locale]/login/page.tsx`
  - 詳細: ソーシャルログインボタン、ランディングページ

- [x] **Task 2.6**: ユーザー設定画面
  - File(s): `src/app/[locale]/settings/page.tsx`
  - 詳細: 国選択、言語選択、プロフィール編集

- [x] **Task 2.7**: Firestore ユーザーデータ管理
  - File(s): `src/lib/firebase/firestore/users.ts`
  - 詳細: ユーザー作成・更新・取得

- [x] **Task 2.8**: 認証ミドルウェア
  - File(s): `src/components/auth/AuthGuard.tsx`
  - 詳細: 保護ルート用クライアントサイドAuthGuardコンポーネント

**REFACTOR: Clean Up Code**
- [x] **Task 2.9**: リファクタリング
  - 詳細: 認証ロジックの整理、エラーハンドリング強化

#### Quality Gate

**TDD Compliance**:
- [x] 認証hookのテストカバレッジ ≥80%
- [x] 全テスト通過

**Build & Tests**:
- [x] `npm run test` 全パス
- [x] `npm run build` 成功

**Functionality**:
- [x] Googleログインが動作
- [x] Appleログインが動作
- [x] ログアウトが動作
- [x] 国・言語設定が保存される
- [x] 未認証時にログイン画面へリダイレクト

**Validation Commands**:
```bash
npm run test -- --coverage
npm run build
npm run lint
```

---

### Phase 3: Book Search & Discovery
**Goal**: Google Books API連携 + 本検索 + 本詳細画面 + 国別おすすめ表示
**Estimated Time**: 4-5 hours
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 3.1**: Google Books APIクライアントテスト
  - File(s): `__tests__/unit/lib/google-books.test.ts`
  - 詳細: 検索、詳細取得、国別フィルタリングのテスト

- [ ] **Test 3.2**: 本検索hookテスト
  - File(s): `__tests__/unit/hooks/useBookSearch.test.ts`
  - 詳細: 検索状態、ページネーション、エラーハンドリング

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 3.3**: Google Books APIクライアント
  - File(s): `src/lib/google-books/client.ts`, `src/lib/google-books/types.ts`
  - 詳細: API呼び出し、型定義、エラーハンドリング

- [ ] **Task 3.4**: 本検索API Route
  - File(s): `src/app/api/books/search/route.ts`
  - 詳細: サーバーサイドでのAPI呼び出し、レート制限対策

- [ ] **Task 3.5**: 本検索画面UI
  - File(s): `src/app/[locale]/search/page.tsx`
  - 詳細: 検索フォーム、結果一覧、無限スクロール

- [ ] **Task 3.6**: 本詳細画面UI
  - File(s): `src/app/[locale]/books/[id]/page.tsx`
  - 詳細: 本情報表示、表紙画像、説明文

- [ ] **Task 3.7**: ホーム画面（国別おすすめ）
  - File(s): `src/app/[locale]/(main)/page.tsx`
  - 詳細: 国別ベストセラー、カテゴリ別おすすめ

- [ ] **Task 3.8**: 本カードコンポーネント
  - File(s): `src/components/books/BookCard.tsx`, `src/components/books/BookGrid.tsx`
  - 詳細: 再利用可能な本表示コンポーネント

**REFACTOR: Clean Up Code**
- [ ] **Task 3.9**: リファクタリング
  - 詳細: API呼び出しの最適化、キャッシュ戦略、スケルトンローディング

#### Quality Gate

**TDD Compliance**:
- [ ] APIクライアントテストカバレッジ ≥80%
- [ ] 全テスト通過

**Build & Tests**:
- [ ] `npm run test` 全パス
- [ ] `npm run build` 成功

**Functionality**:
- [ ] 本検索が動作
- [ ] 検索結果が正しく表示
- [ ] 本詳細画面が正しく表示
- [ ] 国別おすすめが表示
- [ ] スケルトンローディングが動作

**Validation Commands**:
```bash
npm run test -- --coverage
npm run build
npm run lint
```

---

### Phase 4: Reading Management
**Goal**: いいね機能 + 読書進捗管理 + マイライブラリ
**Estimated Time**: 3-4 hours
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 4.1**: いいね機能テスト
  - File(s): `__tests__/unit/hooks/useLike.test.ts`
  - 詳細: いいね追加・削除、状態管理

- [ ] **Test 4.2**: 読書進捗テスト
  - File(s): `__tests__/unit/hooks/useReadingProgress.test.ts`
  - 詳細: 進捗更新、ステータス変更

- [ ] **Test 4.3**: Firestore操作テスト
  - File(s): `__tests__/integration/firebase/books.test.ts`
  - 詳細: ユーザー書籍データのCRUD

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 4.4**: Firestore 書籍データ管理
  - File(s): `src/lib/firebase/firestore/books.ts`
  - 詳細: ユーザーの本データCRUD操作

- [ ] **Task 4.5**: いいねhook
  - File(s): `src/hooks/useLike.ts`
  - 詳細: いいね状態管理、Firestore同期

- [ ] **Task 4.6**: 読書進捗hook
  - File(s): `src/hooks/useReadingProgress.ts`
  - 詳細: 進捗率、ステータス管理

- [ ] **Task 4.7**: いいねボタンコンポーネント
  - File(s): `src/components/books/LikeButton.tsx`
  - 詳細: アニメーション付きいいねボタン

- [ ] **Task 4.8**: 読書進捗スライダー
  - File(s): `src/components/books/ProgressSlider.tsx`
  - 詳細: 進捗率入力、ステータス選択

- [ ] **Task 4.9**: マイライブラリ画面
  - File(s): `src/app/[locale]/library/page.tsx`
  - 詳細: いいねした本、読書中の本、読了本のタブ表示

**REFACTOR: Clean Up Code**
- [ ] **Task 4.10**: リファクタリング
  - 詳細: 楽観的更新、エラーハンドリング、ローディング状態

#### Quality Gate

**TDD Compliance**:
- [ ] 読書管理hookテストカバレッジ ≥80%
- [ ] 全テスト通過

**Build & Tests**:
- [ ] `npm run test` 全パス
- [ ] `npm run build` 成功

**Functionality**:
- [ ] いいね追加・削除が動作
- [ ] 進捗更新が保存される
- [ ] マイライブラリに本が表示される
- [ ] タブ切り替えが動作

**Validation Commands**:
```bash
npm run test -- --coverage
npm run build
npm run lint
```

---

### Phase 5: AI Book Summary
**Goal**: Claude API連携 + 本の要約生成 + キャッシュ戦略
**Estimated Time**: 3-4 hours
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 5.1**: Claude APIクライアントテスト
  - File(s): `__tests__/unit/lib/claude.test.ts`
  - 詳細: 要約生成、エラーハンドリング

- [ ] **Test 5.2**: 要約API Routeテスト
  - File(s): `__tests__/integration/api/summary.test.ts`
  - 詳細: 認証チェック、レート制限

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 5.3**: Claude APIクライアント
  - File(s): `src/lib/claude/client.ts`
  - 詳細: Anthropic SDK設定、要約プロンプト

- [ ] **Task 5.4**: 要約生成API Route
  - File(s): `src/app/api/books/[id]/summary/route.ts`
  - 詳細: 認証チェック、レート制限、キャッシュ

- [ ] **Task 5.5**: 要約キャッシュ（Firestore）
  - File(s): `src/lib/firebase/firestore/summaries.ts`
  - 詳細: 要約結果の永続キャッシュ

- [ ] **Task 5.6**: 要約表示コンポーネント
  - File(s): `src/components/books/AISummary.tsx`
  - 詳細: 要約ボタン、ローディング、表示

- [ ] **Task 5.7**: レート制限実装
  - File(s): `src/lib/rate-limit.ts`
  - 詳細: ユーザーごとの日次制限（10回/日）

**REFACTOR: Clean Up Code**
- [ ] **Task 5.8**: リファクタリング
  - 詳細: エラーメッセージ多言語化、ストリーミングUI検討

#### Quality Gate

**TDD Compliance**:
- [ ] AI要約ロジックテストカバレッジ ≥80%
- [ ] 全テスト通過

**Build & Tests**:
- [ ] `npm run test` 全パス
- [ ] `npm run build` 成功

**Security**:
- [ ] APIキーがクライアントに露出していない
- [ ] 認証チェックが動作
- [ ] レート制限が動作

**Functionality**:
- [ ] AI要約が生成される
- [ ] 3行の多言語要約が表示される
- [ ] キャッシュが動作（同じ本は再生成しない）
- [ ] レート制限超過時にエラー表示

**Validation Commands**:
```bash
npm run test -- --coverage
npm run build
npm run lint
```

---

### Phase 6: Polish & Deploy
**Goal**: レスポンシブUI調整 + パフォーマンス最適化 + Vercelデプロイ
**Estimated Time**: 3-4 hours
**Status**: Pending

#### Tasks

**RED: Write Failing Tests First**
- [ ] **Test 6.1**: E2Eテスト作成
  - File(s): `__tests__/e2e/user-flow.test.ts`
  - 詳細: ログイン→検索→いいね→進捗更新フロー

**GREEN: Implement to Make Tests Pass**
- [ ] **Task 6.2**: レスポンシブUI調整
  - 詳細: モバイル/タブレット/デスクトップ表示確認・調整

- [ ] **Task 6.3**: ボトムナビゲーション（モバイル）
  - File(s): `src/components/layout/BottomNav.tsx`
  - 詳細: ホーム/検索/ライブラリ/プロフィール

- [ ] **Task 6.4**: パフォーマンス最適化
  - 詳細: 画像最適化、コード分割、Suspense境界

- [ ] **Task 6.5**: SEO対応
  - File(s): `src/app/[locale]/layout.tsx`, 各ページのmetadata
  - 詳細: メタタグ、OGP、多言語hreflang

- [ ] **Task 6.6**: エラーページ
  - File(s): `src/app/[locale]/error.tsx`, `src/app/[locale]/not-found.tsx`
  - 詳細: エラー画面、404画面

- [ ] **Task 6.7**: Vercel環境変数設定
  - 詳細: Firebase, Claude API, Google Books APIキー設定

- [ ] **Task 6.8**: Vercelデプロイ
  - 詳細: プロダクションデプロイ、ドメイン設定（オプション）

**REFACTOR: Clean Up Code**
- [ ] **Task 6.9**: 最終リファクタリング
  - 詳細: 不要コード削除、コメント整理、README更新

#### Quality Gate

**TDD Compliance**:
- [ ] E2Eテスト通過
- [ ] 総合テストカバレッジ ≥75%

**Build & Tests**:
- [ ] `npm run test` 全パス
- [ ] `npm run build` 成功
- [ ] `npm run e2e` 成功

**Performance**:
- [ ] Lighthouse Performance ≥80
- [ ] Lighthouse Accessibility ≥90
- [ ] Core Web Vitals 緑

**Deployment**:
- [ ] Vercelプレビューデプロイ成功
- [ ] 本番デプロイ成功
- [ ] 全機能が本番環境で動作

**Validation Commands**:
```bash
npm run test -- --coverage
npm run e2e
npm run build
npx lighthouse http://localhost:3000 --view
vercel --prod
```

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Google Books API レート制限 | Medium | High | キャッシュ戦略、サーバーサイド呼び出し |
| Firebase 認証エラー | Low | High | エラーハンドリング、再認証フロー |
| Claude API コスト超過 | Low | Medium | レート制限、コスト監視、Haiku使用 |
| Apple Sign-In 設定複雑さ | Medium | Medium | ドキュメント確認、段階的実装 |
| i18n 翻訳品質 | Low | Low | 主要言語のみ、機械翻訳レビュー |

---

## Rollback Strategy

### If Phase 1 Fails
- `rm -rf` でプロジェクト削除、再作成

### If Phase 2 Fails
- Firebase認証無効化
- 認証関連ファイル削除
- Phase 1状態に戻す

### If Phase 3 Fails
- Google Books API関連ファイル削除
- 検索・詳細画面削除
- Phase 2状態に戻す

### If Phase 4 Fails
- Firestore書籍コレクション削除
- 読書管理関連ファイル削除
- Phase 3状態に戻す

### If Phase 5 Fails
- Claude API関連ファイル削除
- 要約機能無効化
- Phase 4状態に戻す

### If Phase 6 Fails
- Vercelデプロイ削除
- Phase 5状態に戻す

---

## Progress Tracking

### Completion Status
- **Phase 1**: 100% (Completed)
- **Phase 2**: 100% (Completed)
- **Phase 3**: 0%
- **Phase 4**: 0%
- **Phase 5**: 0%
- **Phase 6**: 0%

**Overall Progress**: ~33% complete (2/6 phases)

### Time Tracking
| Phase | Estimated | Actual | Variance |
|-------|-----------|--------|----------|
| Phase 1 | 3-4 hours | ~30min | Faster than expected |
| Phase 2 | 3-4 hours | ~20min | Faster than expected |
| Phase 3 | 4-5 hours | - | - |
| Phase 4 | 3-4 hours | - | - |
| Phase 5 | 3-4 hours | - | - |
| Phase 6 | 3-4 hours | - | - |
| **Total** | 19-25 hours | - | - |

---

## Notes & Learnings

### Implementation Notes
- Next.js 16.1.1 (latest) was installed instead of 15.x, which is compatible
- Vitest was chosen over Jest for faster test execution
- shadcn/ui with Tailwind CSS v4 works well
- next-intl v4 requires different setup than v3 docs

### Blockers Encountered
- (ブロッカー発生時に追記)

### Improvements for Future Plans
- (振り返り時に追記)

---

## References

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Google Books API](https://developers.google.com/books)
- [Claude API](https://docs.anthropic.com/)
- [next-intl](https://next-intl-docs.vercel.app/)
- [shadcn/ui](https://ui.shadcn.com/)

### Related Files
- PRD: `docs/bookify-prd.md`
- Onboarding Plan: `docs/plans/PLAN_onboarding-optimization.md`
- Design System: `docs/ui-ux/design-system.md`
- User Flows: `docs/ui-ux/user-flows.md`
- Wireframes: `docs/ui-ux/wireframes.md`
- Accessibility: `docs/ui-ux/accessibility.md`

---

## Final Checklist

**Before marking plan as COMPLETE**:
- [ ] All phases completed with quality gates passed
- [ ] Full integration testing performed
- [ ] Documentation updated
- [ ] Performance benchmarks meet targets
- [ ] Security review completed
- [ ] Accessibility requirements met
- [ ] README.md updated
- [ ] Plan document archived for future reference

---

**Plan Status**: In Progress
**Next Action**: Phase 3 開始 - 本検索&発見機能
**Blocked By**: None
