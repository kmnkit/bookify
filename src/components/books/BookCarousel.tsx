'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/google-books/types'
import { BookCard } from './BookCard'
import { Skeleton } from '@/components/ui/skeleton'

interface BookCarouselProps {
  title: string
  books: Book[]
  seeAllHref?: string
  likedBooks?: Set<string>
  onLikeClick?: (bookId: string) => void
  className?: string
}

export function BookCarousel({
  title,
  books,
  seeAllHref,
  likedBooks,
  onLikeClick,
  className,
}: BookCarouselProps) {
  const t = useTranslations('home')

  if (books.length === 0) {
    return null
  }

  return (
    <section className={cn('py-4', className)}>
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <h2 className="text-lg font-semibold md:text-xl">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            {t('seeAll')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative mt-3">
        <div
          className={cn(
            'flex gap-3 overflow-x-auto px-4 pb-4 md:px-0',
            'scrollbar-hide snap-x snap-mandatory scroll-smooth',
            // Hide scrollbar
            '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'
          )}
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="w-32 flex-shrink-0 snap-start md:w-40"
            >
              <BookCard
                book={book}
                variant="grid"
                isLiked={likedBooks?.has(book.id)}
                onLikeClick={onLikeClick}
                showRating={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Skeleton for loading state
export function BookCarouselSkeleton({ count = 5 }: { count?: number }) {
  return (
    <section className="py-4">
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between px-4 md:px-0">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Books Skeleton */}
      <div className="relative mt-3">
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 md:px-0">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="w-32 flex-shrink-0 md:w-40">
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <Skeleton className="aspect-[2/3] w-full" />
                <div className="p-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-3 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
