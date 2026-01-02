'use client'

import { cn } from '@/lib/utils'
import type { Book } from '@/lib/google-books/types'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  variant?: 'grid' | 'list'
  likedBooks?: Set<string>
  onLikeClick?: (bookId: string) => void
  showRating?: boolean
  className?: string
}

export function BookGrid({
  books,
  variant = 'grid',
  likedBooks,
  onLikeClick,
  showRating = true,
  className,
}: BookGridProps) {
  if (books.length === 0) {
    return null
  }

  if (variant === 'list') {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            variant="list"
            isLiked={likedBooks?.has(book.id)}
            onLikeClick={onLikeClick}
            showRating={showRating}
          />
        ))}
      </div>
    )
  }

  // Grid variant
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        className
      )}
    >
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          variant="grid"
          isLiked={likedBooks?.has(book.id)}
          onLikeClick={onLikeClick}
          showRating={showRating}
        />
      ))}
    </div>
  )
}
