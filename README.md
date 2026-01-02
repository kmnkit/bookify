# Bookify

A multilingual book recommendation and reading progress management web application.

## Features

### Implemented

- **Multilingual Support** - Japanese, English, and Korean with URL-based locale switching
- **Authentication** - Google and Apple sign-in via Firebase Auth
- **Book Search** - Search books using Google Books API with debounced input
- **Book Details** - View book information including cover, ratings, description, and metadata
- **Country-Based Recommendations** - Home page shows books based on user's locale/country
- **Responsive Design** - Mobile-first design with horizontal scroll carousels
- **Dark Mode** - System-aware theme switching
- **Loading States** - Skeleton loaders for improved UX

### Coming Soon

- Like/Favorite books
- Reading progress tracking
- Personal library management
- AI-powered book summaries

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **APIs**: Google Books API, Claude API
- **Testing**: Vitest + React Testing Library
- **i18n**: next-intl

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase project
- Google Books API key

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bookify

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your environment variables

# Run development server
npm run dev
```

### Environment Variables

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

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test         # Run tests
```

## Project Structure

```
src/
├── app/             # Next.js App Router pages
│   ├── [locale]/    # i18n routes
│   └── api/         # API routes
├── components/      # React components
│   ├── books/       # Book-related components
│   ├── layout/      # Layout components
│   └── ui/          # shadcn/ui components
├── contexts/        # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
└── messages/        # i18n translation files
```

## Development Progress

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Foundation | Completed |
| 2 | Authentication | Completed |
| 3 | Book Search & Discovery | Completed |
| 4 | Reading Management | Pending |
| 5 | AI Summaries | Pending |
| 6 | Final Polish & Deploy | Pending |

## Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- __tests__/unit/lib/google-books.test.ts
```

Current test coverage: 69 tests passing

## Documentation

- [Implementation Plan](docs/plans/PLAN_bookify-mvp-phase1.md)
- [Design System](docs/ui-ux/design-system.md)
- [Wireframes](docs/ui-ux/wireframes.md)

## License

MIT
