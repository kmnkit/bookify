import { Suspense } from 'react'
import { searchBooks, getBooksByCountry } from '@/lib/google-books/client'
import { getCountryFromLocale, getLocalizedCountryName } from '@/lib/locale-utils'
import { HomePageClient, HomePageSkeleton } from './HomePageClient'
import type { Book } from '@/lib/google-books/types'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

async function fetchHomePageBooks(locale: string): Promise<{
  recommendedBooks: Book[]
  trendingBooks: Book[]
  newReleases: Book[]
  error?: string
}> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY

  if (!apiKey) {
    return {
      recommendedBooks: [],
      trendingBooks: [],
      newReleases: [],
      error: 'API key not configured',
    }
  }

  const { code: countryCode } = getCountryFromLocale(locale)

  try {
    // Fetch books in parallel
    const [recommendedResult, trendingResult, newReleasesResult] =
      await Promise.all([
        // Recommended - fiction books for the user's country
        getBooksByCountry(countryCode, apiKey, {
          category: 'fiction',
          maxResults: 10,
        }),
        // Trending - bestsellers in the user's country
        getBooksByCountry(countryCode, apiKey, {
          category: 'bestsellers',
          maxResults: 10,
        }),
        // New releases - recent books
        searchBooks('subject:fiction', apiKey, {
          orderBy: 'newest',
          maxResults: 10,
          country: countryCode,
        }),
      ])

    return {
      recommendedBooks: recommendedResult.books,
      trendingBooks: trendingResult.books,
      newReleases: newReleasesResult.books,
    }
  } catch (error) {
    console.error('Failed to fetch home page books:', error)
    return {
      recommendedBooks: [],
      trendingBooks: [],
      newReleases: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  const { code: countryCode } = getCountryFromLocale(locale)
  const countryName = getLocalizedCountryName(countryCode, locale)

  const { recommendedBooks, trendingBooks, newReleases, error } =
    await fetchHomePageBooks(locale)

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient
        recommendedBooks={recommendedBooks}
        trendingBooks={trendingBooks}
        newReleases={newReleases}
        countryName={countryName}
        locale={locale}
        error={error}
      />
    </Suspense>
  )
}
