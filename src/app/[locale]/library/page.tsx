'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Library, BookOpen, BookMarked, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useUserLibrary, type UserBook } from '@/hooks/useReadingProgress'
import { ProgressBar, ReadingStatusBadge } from '@/components/books'
import type { Locale } from '@/i18n/config'

export default function LibraryPage() {
  const t = useTranslations('library')
  const tAuth = useTranslations('auth')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const currentLocale = pathname.split('/')[1] as Locale

  // Hooks for library data
  const {
    books,
    readingBooks,
    finishedBooks,
    wantToReadBooks,
    counts,
    isLoading: libraryLoading,
  } = useUserLibrary()

  const isLoading = authLoading || libraryLoading

  if (authLoading) {
    return <LibraryPageSkeleton />
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Library className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">{tAuth('loginRequired')}</p>
          <Button onClick={() => router.push(`/${currentLocale}/login`)}>
            {tAuth('login')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard
          label={t('stats.total')}
          value={counts.total}
          icon={<BookMarked className="h-5 w-5" />}
        />
        <StatCard
          label={t('stats.inProgress')}
          value={counts.reading}
          icon={<BookOpen className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label={t('stats.completed')}
          value={counts.finished}
          icon={<Check className="h-5 w-5 text-green-500" />}
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-1">
            {t('tabs.all')}
            {counts.total > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({counts.total})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reading" className="gap-1">
            {t('tabs.reading')}
            {counts.reading > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({counts.reading})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="wantToRead" className="gap-1">
            {t('tabs.wantToRead')}
            {counts.wantToRead > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({counts.wantToRead})
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="finished" className="gap-1">
            {t('tabs.finished')}
            {counts.finished > 0 && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({counts.finished})
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <BookListSkeleton count={3} />
          ) : books.length === 0 ? (
            <EmptyState
              message={t('emptyStates.all')}
              showSearchButton
              locale={locale}
            />
          ) : (
            <BookList books={books} locale={locale} />
          )}
        </TabsContent>

        <TabsContent value="reading" className="mt-6">
          {isLoading ? (
            <BookListSkeleton count={3} />
          ) : readingBooks.length === 0 ? (
            <EmptyState
              message={t('emptyStates.reading')}
              showSearchButton
              locale={locale}
            />
          ) : (
            <BookList books={readingBooks} locale={locale} />
          )}
        </TabsContent>

        <TabsContent value="wantToRead" className="mt-6">
          {isLoading ? (
            <BookListSkeleton count={3} />
          ) : wantToReadBooks.length === 0 ? (
            <EmptyState
              message={t('emptyStates.wantToRead')}
              showSearchButton
              locale={locale}
            />
          ) : (
            <BookList books={wantToReadBooks} locale={locale} />
          )}
        </TabsContent>

        <TabsContent value="finished" className="mt-6">
          {isLoading ? (
            <BookListSkeleton count={3} />
          ) : finishedBooks.length === 0 ? (
            <EmptyState
              message={t('emptyStates.finished')}
              showSearchButton
              locale={locale}
            />
          ) : (
            <BookList books={finishedBooks} locale={locale} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-4 text-center">
      <div className="mb-2 text-muted-foreground">{icon}</div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

interface BookListProps {
  books: UserBook[]
  locale: string
}

function BookList({ books, locale }: BookListProps) {
  return (
    <div className="space-y-3">
      {books.map((book) => (
        <LibraryBookCard key={book.bookId} book={book} locale={locale} />
      ))}
    </div>
  )
}

interface LibraryBookCardProps {
  book: UserBook
  locale: string
}

function LibraryBookCard({ book, locale }: LibraryBookCardProps) {
  // TODO: Fetch book details from Google Books API
  // For now, just show the book ID and progress
  return (
    <Link
      href={`/${locale}/books/${book.bookId}`}
      className={cn(
        'flex gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md',
        'border border-border'
      )}
    >
      {/* Book Cover Placeholder */}
      <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
          <BookOpen className="h-6 w-6" />
        </div>
      </div>

      {/* Book Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            Book ID: {book.bookId.substring(0, 12)}...
          </p>
          <div className="mt-2">
            <ReadingStatusBadge status={book.status} size="sm" />
          </div>
        </div>

        {/* Progress Bar */}
        {book.status === 'reading' && (
          <ProgressBar
            progress={book.progress}
            status={book.status}
            size="sm"
            showLabel
            className="mt-2"
          />
        )}

        {book.status === 'finished' && (
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Check className="h-3 w-3" />
            <span>Completed</span>
          </div>
        )}
      </div>
    </Link>
  )
}

interface EmptyStateProps {
  message: string
  showSearchButton?: boolean
  locale: string
}

function EmptyState({ message, showSearchButton, locale }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
      <p className="mb-4 text-muted-foreground">{message}</p>
      {showSearchButton && (
        <Button asChild variant="outline">
          <Link href={`/${locale}/search`}>
            <Search className="mr-2 h-4 w-4" />
            Search Books
          </Link>
        </Button>
      )}
    </div>
  )
}

function LibraryPageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <Skeleton className="mb-6 h-8 w-48" />

      {/* Stats Skeleton */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>

      {/* Tabs Skeleton */}
      <Skeleton className="mb-6 h-10 w-full" />

      {/* List Skeleton */}
      <BookListSkeleton count={3} />
    </div>
  )
}

function BookListSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="h-24 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
