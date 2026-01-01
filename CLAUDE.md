# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bookify is a multilingual (Japanese/English/Korean) book recommendation and reading progress management web application. It uses Google Books API for book data and Claude API for AI-powered summaries.

## Development Workflow

**Follow the implementation plan**: `docs/plans/PLAN_bookify-mvp-phase1.md`
- Complete tasks in order (Phase 1 → Phase 6)
- Update checkboxes in the plan file after completing each task
- Run quality gate validation commands before proceeding to next phase
- Update "Last Updated" date when modifying the plan

**Follow UI/UX specifications**: `docs/ui-ux/`
- `design-system.md` - Colors, typography, spacing, components
- `wireframes.md` - Screen layouts and component structure
- `user-flows.md` - User journey and interaction patterns
- `accessibility.md` - WCAG 2.1 AA compliance guidelines

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **i18n**: next-intl (Japanese, English, Korean)
- **Backend/DB**: Firebase (Authentication, Firestore)
- **APIs**: Google Books API, Claude API (Haiku for summaries)
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
npm run e2e              # End-to-end tests

# Deployment
vercel                   # Preview deploy
vercel --prod            # Production deploy
```

## Project Structure (Target)

```
src/
├── app/
│   ├── [locale]/           # i18n routing
│   │   ├── (main)/         # Main layout routes
│   │   ├── login/
│   │   ├── search/
│   │   ├── books/[id]/
│   │   ├── library/
│   │   └── settings/
│   └── api/
│       └── books/
├── components/
│   ├── books/              # BookCard, BookGrid, LikeButton, etc.
│   ├── layout/             # Header, BottomNav, etc.
│   └── ui/                 # shadcn/ui components
├── contexts/               # AuthContext, etc.
├── hooks/                  # useAuth, useLike, useBookSearch, etc.
├── lib/
│   ├── firebase/           # Firebase config and utilities
│   ├── google-books/       # Google Books API client
│   └── claude/             # Claude API client
└── messages/               # i18n translation files (ja, en, ko)
```

## Key Architectural Patterns

### Authentication Flow
- Firebase Auth with Google/Apple providers
- Auth state managed via React Context (`AuthContext`)
- Protected routes via middleware redirect to `/login`

### Data Flow
- Server Components for initial data fetching
- Client-side hooks for user interactions (likes, progress)
- Firestore for user data persistence with optimistic updates

### i18n
- Locale in URL path: `/ja/`, `/en/`, `/ko/`
- Messages in `messages/{locale}.json`
- Use `useTranslations()` hook in components

### API Routes
- All external API calls (Google Books, Claude) go through Next.js API routes
- Rate limiting implemented per user for AI features
- Summaries cached in Firestore

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
- **Test organization**: `__tests__/unit/`, `__tests__/integration/`, `__tests__/e2e/`

## Environment Variables

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# APIs
GOOGLE_BOOKS_API_KEY=
ANTHROPIC_API_KEY=
```

## Related Documentation

- PRD: `docs/bookify-prd.md`
- Implementation Plan: `docs/plans/PLAN_bookify-mvp-phase1.md`
- Design System: `docs/ui-ux/design-system.md`
