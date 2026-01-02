'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Search as SearchIcon, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BookGrid, BookGridSkeleton } from '@/components/books'
import { useBookSearch } from '@/hooks/useBookSearch'

export default function SearchPage() {
  const t = useTranslations('search')
  const tCommon = useTranslations('common')

  const [inputValue, setInputValue] = useState('')
  const {
    books,
    isLoading,
    error,
    hasMore,
    query,
    totalItems,
    search,
    loadMore,
    reset,
  } = useBookSearch()

  // Debounced search
  useEffect(() => {
    const trimmed = inputValue.trim()
    if (trimmed === query) return

    const timer = setTimeout(() => {
      if (trimmed) {
        search(trimmed)
      } else {
        reset()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, query, search, reset])

  const handleClear = useCallback(() => {
    setInputValue('')
    reset()
  }, [reset])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const trimmed = inputValue.trim()
      if (trimmed) {
        search(trimmed)
      }
    },
    [inputValue, search]
  )

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('placeholder')}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Search Results */}
      <div className="mt-6">
        {/* Result Count */}
        {query && !isLoading && books.length > 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            {t('results', { count: totalItems })}
          </p>
        )}

        {/* Loading State */}
        {isLoading && books.length === 0 && <BookGridSkeleton count={10} />}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => search(query)}
              className="mt-4"
            >
              {tCommon('retry')}
            </Button>
          </div>
        )}

        {/* Results */}
        {!error && books.length > 0 && (
          <>
            <BookGrid books={books} />

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="min-w-[200px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tCommon('loading')}
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && !error && query && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">{t('noResults')}</p>
            <p className="mt-2 text-muted-foreground">
              Try different keywords or check your spelling
            </p>
          </div>
        )}

        {/* Initial State */}
        {!isLoading && !error && !query && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <SearchIcon className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{t('placeholder')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
