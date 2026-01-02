'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Heart, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Book } from '@/lib/google-books/types'

interface BookCardProps {
  book: Book
  variant?: 'grid' | 'list'
  isLiked?: boolean
  onLikeClick?: (bookId: string) => void
  showRating?: boolean
  className?: string
}

export function BookCard({
  book,
  variant = 'grid',
  isLiked = false,
  onLikeClick,
  showRating = true,
  className,
}: BookCardProps) {
  const t = useTranslations('book')
  const locale = useLocale()

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onLikeClick?.(book.id)
  }

  const authors = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown'

  if (variant === 'list') {
    return (
      <Link
        href={`/${locale}/books/${book.id}`}
        className={cn(
          'flex gap-4 rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md',
          'border border-border',
          className
        )}
      >
        {/* Book Cover */}
        <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {book.thumbnail ? (
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        {/* Book Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 font-semibold leading-tight text-foreground">
              {book.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
              {authors}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {showRating && book.averageRating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                {book.ratingsCount && (
                  <span className="text-muted-foreground">
                    ({book.ratingsCount.toLocaleString()})
                  </span>
                )}
              </div>
            )}

            {onLikeClick && (
              <button
                onClick={handleLikeClick}
                className="rounded-full p-2 transition-colors hover:bg-muted"
                aria-label={isLiked ? t('unlike') : t('like')}
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    isLiked
                      ? 'fill-pink-500 text-pink-500'
                      : 'text-muted-foreground hover:text-pink-500'
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </Link>
    )
  }

  // Grid variant (default)
  return (
    <Link
      href={`/${locale}/books/${book.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition-all hover:shadow-md',
        'border border-border',
        className
      )}
    >
      {/* Book Cover */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No Image
          </div>
        )}

        {/* Like Button */}
        {onLikeClick && (
          <button
            onClick={handleLikeClick}
            className={cn(
              'absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-sm transition-all',
              'hover:bg-white dark:bg-black/70 dark:hover:bg-black/90'
            )}
            aria-label={isLiked ? t('unlike') : t('like')}
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isLiked
                  ? 'fill-pink-500 text-pink-500'
                  : 'text-gray-600 dark:text-gray-300'
              )}
            />
          </button>
        )}
      </div>

      {/* Book Info */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-foreground">
          {book.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {authors}
        </p>

        {showRating && book.averageRating && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{book.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
