'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Star,
  Calendar,
  Building2,
  FileText,
  Globe,
  ExternalLink,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Book } from '@/lib/google-books/types'
import { cn } from '@/lib/utils'

interface BookDetailClientProps {
  book: Book
  locale: string
}

export function BookDetailClient({ book, locale }: BookDetailClientProps) {
  const t = useTranslations('book')
  const tCommon = useTranslations('common')

  const authors = book.authors.length > 0 ? book.authors.join(', ') : 'Unknown'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `${book.title} by ${authors}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur">
        <Link
          href={`/${locale}/search`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">{tCommon('back')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-6">
        {/* Book Hero Section */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Book Cover */}
          <div className="relative h-72 w-48 flex-shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg md:h-80 md:w-56">
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <BookOpen className="h-16 w-16" />
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold md:text-3xl">{book.title}</h1>
            {book.subtitle && (
              <p className="mt-1 text-lg text-muted-foreground">
                {book.subtitle}
              </p>
            )}
            <p className="mt-2 text-muted-foreground">{authors}</p>

            {/* Rating */}
            {book.averageRating && (
              <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(book.averageRating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium">
                  {book.averageRating.toFixed(1)}
                </span>
                {book.ratingsCount && (
                  <span className="text-muted-foreground">
                    ({book.ratingsCount.toLocaleString()} ratings)
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Button size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                {t('like')}
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="h-5 w-5" />
                {t('addToLibrary')}
              </Button>
            </div>

            {/* Preview Link */}
            {book.previewLink && (
              <div className="mt-4">
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview on Google Books
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">About this book</h2>
            <div
              className="prose prose-sm mt-3 max-w-none text-muted-foreground dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: book.description }}
            />
          </div>
        )}

        {/* Categories */}
        {book.categories.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Genres</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Book Details */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Details</h2>
          <dl className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {book.publisher && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    {t('publisher')}
                  </dt>
                  <dd className="font-medium">{book.publisher}</dd>
                </div>
              </div>
            )}
            {book.publishedDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    {t('publishedDate')}
                  </dt>
                  <dd className="font-medium">{book.publishedDate}</dd>
                </div>
              </div>
            )}
            {book.pageCount && (
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">
                    {t('pages')}
                  </dt>
                  <dd className="font-medium">{book.pageCount} pages</dd>
                </div>
              </div>
            )}
            {book.language && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">Language</dt>
                  <dd className="font-medium">
                    {book.language.toUpperCase()}
                  </dd>
                </div>
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <dt className="text-xs text-muted-foreground">ISBN</dt>
                  <dd className="font-medium">{book.isbn}</dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        {/* AI Summary Placeholder */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">{t('aiSummary')}</h2>
          <div className="mt-3 rounded-xl border border-dashed bg-muted/50 p-6 text-center">
            <p className="text-muted-foreground">
              AI summaries will be available in a future update.
            </p>
            <Button variant="secondary" className="mt-3" disabled>
              {t('generateSummary')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
