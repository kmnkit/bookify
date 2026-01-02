# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookify is a multilingual (Japanese/English/Korean) book recommendation and reading progress management web application. It uses Google Books API for book data and Claude API for AI-powered summaries.

**Current Status**: Phase 3 (Book Search & Discovery) - In Progress
- Phase 1 (Project Foundation): ✅ Completed
- Phase 2 (Authentication): ✅ Completed
- Phase 3 (Book Search & Discovery): 🔄 In Progress
- Phase 4-6: ⏳ Pending

## Development Workflow

**Follow the implementation plan**: `docs/plans/PLAN_bookify-mvp-phase1.md`
- Complete tasks in order (Phase 1 → Phase 6)
- Use TDD approach: Write tests FIRST, then implement
- Update checkboxes in the plan file after completing each task
- Run quality gate validation commands before proceeding to next phase
- Update "Last Updated" date when modifying the plan

**Follow UI/UX specifications**: `docs/ui-ux/`
- `design-system.md` - Colors, typography, spacing, components
- `wireframes.md` - Screen layouts and component structure
- `user-flows.md` - User journey and interaction patterns
- `accessibility.md` - WCAG 2.1 AA compliance guidelines

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **i18n**: next-intl (Japanese, English, Korean)
- **Backend/DB**: Firebase (Authentication, Firestore)
- **APIs**: Google Books API, Claude API (Haiku for summaries)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # ESLint
npm run type-check       # TypeScript check

# Testing
npm run test             # Run unit/integration tests
npm run test -- --coverage  # With coverage report
npm run e2e              # End-to-end tests (Playwright)

# Deployment
vercel                   # Preview deploy
vercel --prod            # Production deploy
```

## Project Structure (Current)

```
src/
├── app/
│   ├── [locale]/                  # i18n routing
│   │   ├── page.tsx               # Home page (country-based recommendations)
│   │   ├── HomePageClient.tsx     # Client component for home
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── login/page.tsx         # Login page (Google/Apple auth)
│   │   ├── search/page.tsx        # Book search with debounce
│   │   ├── books/[id]/            # Book detail pages
│   │   │   ├── page.tsx           # Server component
│   │   │   └── BookDetailClient.tsx # Client component
│   │   ├── library/page.tsx       # User library (placeholder)
│   │   └── settings/page.tsx      # User settings
│   └── api/
│       └── books/
│           ├── search/route.ts    # Book search API
│           └── [id]/route.ts      # Book detail API
├── components/
│   ├── books/                     # Book-related components
│   │   ├── BookCard.tsx           # Grid/list variants
│   │   ├── BookGrid.tsx           # Grid layout
│   │   ├── BookCarousel.tsx       # Horizontal scroll carousel
│   │   └── BookCardSkeleton.tsx   # Loading skeletons
│   ├── layout/
│   │   ├── Header.tsx             # App header with nav
│   │   └── BottomNav.tsx          # Mobile bottom navigation
│   ├── auth/
│   │   └── AuthGuard.tsx          # Protected route wrapper
│   └── ui/                        # shadcn/ui components
├── contexts/
│   └── AuthContext.tsx            # Firebase auth state
├── hooks/
│   ├── useAuth.ts                 # Re-export from AuthContext
│   └── useBookSearch.ts           # Book search with pagination
├── lib/
│   ├── firebase/
│   │   ├── config.ts              # Firebase initialization
│   │   ├── auth.ts                # Auth helpers
│   │   └── firestore/users.ts     # User data operations
│   ├── google-books/
│   │   ├── client.ts              # API client & helpers
│   │   └── types.ts               # TypeScript types
│   ├── locale-utils.ts            # Locale to country mapping
│   └── utils.ts                   # cn() utility
├── i18n/
│   ├── config.ts                  # Locale configuration
│   └── request.ts                 # next-intl request config
└── messages/                      # i18n JSON files
    ├── en.json
    ├── ja.json
    └── ko.json

__tests__/
├── unit/
│   ├── hooks/
│   │   ├── useAuth.test.tsx       # Auth hook tests (11 tests)
│   │   └── useBookSearch.test.tsx # Search hook tests (20 tests)
│   ├── lib/
│   │   └── google-books.test.ts   # API client tests (26 tests)
│   └── utils/
│       └── sample.test.ts         # Sample utility tests (3 tests)
└── integration/
    └── firebase/
        └── user.test.ts           # Firestore user tests (9 tests)
```

## Key Implemented Features

### Authentication (Phase 2)
- Google/Apple sign-in via Firebase Auth
- `AuthContext` for global auth state
- `AuthGuard` component for protected routes
- User preferences stored in Firestore

### Book Search & Discovery (Phase 3)
- Google Books API integration with full TypeScript types
- Search page with debounced input (300ms)
- Pagination with "Load More" functionality
- Book detail page with metadata, cover, ratings
- Home page with country-based recommendations:
  - Recommended for You (fiction by country)
  - Trending in {Country} (bestsellers)
  - New Releases (newest fiction)
- Horizontal scroll carousels on mobile
- Skeleton loading states

### i18n
- Locale in URL path: `/ja/`, `/en/`, `/ko/`
- Messages in `messages/{locale}.json`
- Use `useTranslations()` hook in components
- Country names localized per user's locale

## Key Architectural Patterns

### Server/Client Component Split
- **Server Components**: Data fetching, SEO metadata
- **Client Components**: User interactions, state management
- Pattern: `page.tsx` (server) + `*Client.tsx` (client)

### Data Flow
- Server Components fetch initial data via API routes
- Client-side hooks for search, pagination, likes
- Optimistic updates for user interactions (future)

### API Routes
- All external API calls go through Next.js API routes
- Caching headers for performance
- Error handling with proper status codes

### Hooks Pattern
- `useBookSearch`: Search state, pagination, debounce
- `useAuth`: Authentication state (re-export from context)
- Future: `useLike`, `useReadingProgress`

## Design System Reference

| Token | Light | Dark |
|-------|-------|------|
| Brand Primary | #2563EB | #3B82F6 |
| Background | #FFFFFF | #0F172A |
| Text Primary | #111827 | #F1F5F9 |
| Like/Favorite | #EC4899 | #F472B6 |

- **Font families**: Inter (English), Noto Sans JP (Japanese), Noto Sans KR (Korean)
- **Spacing base**: 4px
- **Touch targets**: Minimum 44x44px
- **Border radius**: 8px (buttons), 12px (cards), 16px (modals)

## Testing Strategy

- **TDD approach**: Write tests before implementation
- **Coverage targets**: ≥80% for business logic, ≥75% overall
- **Current status**: 69 tests passing (26 API + 20 hooks + 11 auth + 9 firebase + 3 utils)
- **Test framework**: Vitest + React Testing Library
- **Mocking**: vi.fn(), vi.mock() for external dependencies

## Environment Variables

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# APIs
GOOGLE_BOOKS_API_KEY=
ANTHROPIC_API_KEY=
```

## Common Tasks

### Adding a new page
1. Create `src/app/[locale]/newpage/page.tsx` (server component)
2. Create `src/app/[locale]/newpage/NewPageClient.tsx` (client component if needed)
3. Add translations to all `messages/*.json` files
4. Update navigation in `Header.tsx` and `BottomNav.tsx` if needed

### Adding a new component
1. Create component in appropriate folder (`components/books/`, etc.)
2. Export from `index.ts` barrel file
3. Write tests in `__tests__/unit/components/`

### Adding translations
1. Add keys to `messages/en.json`, `messages/ja.json`, `messages/ko.json`
2. Use with `useTranslations('namespace')` hook
3. Use interpolation: `t('key', { param: value })`

## Related Documentation

- PRD: `docs/bookify-prd.md`
- Implementation Plan: `docs/plans/PLAN_bookify-mvp-phase1.md`
- Design System: `docs/ui-ux/design-system.md`
- Wireframes: `docs/ui-ux/wireframes.md`
