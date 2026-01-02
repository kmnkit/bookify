import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBookById } from '@/lib/google-books/client'
import { BookDetailClient } from './BookDetailClient'

interface BookDetailPageProps {
  params: Promise<{
    id: string
    locale: string
  }>
}

async function getBook(id: string) {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY
    if (!apiKey) {
      throw new Error('Google Books API key not configured')
    }
    return await getBookById(id, apiKey)
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const book = await getBook(id)

  if (!book) {
    return {
      title: 'Book Not Found',
    }
  }

  return {
    title: book.title,
    description: book.description?.slice(0, 160),
    openGraph: {
      title: book.title,
      description: book.description?.slice(0, 160),
      images: book.thumbnail ? [book.thumbnail] : [],
    },
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id, locale } = await params
  const book = await getBook(id)

  if (!book) {
    notFound()
  }

  return <BookDetailClient book={book} locale={locale} />
}
