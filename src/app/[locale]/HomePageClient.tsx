'use client'

import { useTranslations } from 'next-intl'
import { AlertCircle } from 'lucide-react'
import { BookCarousel, BookCarouselSkeleton } from '@/components/books'
import { Button } from '@/components/ui/button'
import type { Book } from '@/lib/google-books/types'

interface HomePageClientProps {
  recommendedBooks: Book[]
  trendingBooks: Book[]
  newReleases: Book[]
  countryName: string
  locale: string
  error?: string
}

export function HomePageClient({
  recommendedBooks,
  trendingBooks,
  newReleases,
  countryName,
  locale,
  error,
}: HomePageClientProps) {
  const t = useTranslations('home')
  const tCommon = useTranslations('common')

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-lg font-medium">{t('errorLoading')}</p>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          {tCommon('retry')}
        </Button>
      </div>
    )
  }

  const hasNoBooks =
    recommendedBooks.length === 0 &&
    trendingBooks.length === 0 &&
    newReleases.length === 0

  if (hasNoBooks) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <p className="text-lg text-muted-foreground">{t('noBooks')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-4 md:px-4">
      {/* Recommended for You */}
      {recommendedBooks.length > 0 && (
        <BookCarousel
          title={t('recommended')}
          books={recommendedBooks}
          seeAllHref={`/${locale}/search?category=recommended`}
        />
      )}

      {/* Trending in Country */}
      {trendingBooks.length > 0 && (
        <BookCarousel
          title={t('trendingIn', { country: countryName })}
          books={trendingBooks}
          seeAllHref={`/${locale}/search?category=trending`}
        />
      )}

      {/* New Releases */}
      {newReleases.length > 0 && (
        <BookCarousel
          title={t('newReleases')}
          books={newReleases}
          seeAllHref={`/${locale}/search?category=new`}
        />
      )}
    </div>
  )
}

// Loading state component
export function HomePageSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-4 md:px-4">
      <BookCarouselSkeleton count={5} />
      <BookCarouselSkeleton count={5} />
      <BookCarouselSkeleton count={5} />
    </div>
  )
}
