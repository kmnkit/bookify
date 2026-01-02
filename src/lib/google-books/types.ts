// Google Books API response types
// Reference: https://developers.google.com/books/docs/v1/reference/volumes

export interface GoogleBooksVolumeInfo {
  title: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  industryIdentifiers?: {
    type: string
    identifier: string
  }[]
  pageCount?: number
  categories?: string[]
  averageRating?: number
  ratingsCount?: number
  imageLinks?: {
    smallThumbnail?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
    extraLarge?: string
  }
  language?: string
  previewLink?: string
  infoLink?: string
}

export interface GoogleBooksSaleInfo {
  country?: string
  saleability?: 'FOR_SALE' | 'NOT_FOR_SALE' | 'FREE' | 'FOR_PREORDER'
  isEbook?: boolean
  listPrice?: {
    amount: number
    currencyCode: string
  }
  retailPrice?: {
    amount: number
    currencyCode: string
  }
  buyLink?: string
}

export interface GoogleBooksAccessInfo {
  country?: string
  viewability?: 'PARTIAL' | 'ALL_PAGES' | 'NO_PAGES' | 'UNKNOWN'
  embeddable?: boolean
  publicDomain?: boolean
  epub?: {
    isAvailable: boolean
    acsTokenLink?: string
  }
  pdf?: {
    isAvailable: boolean
    acsTokenLink?: string
  }
  webReaderLink?: string
}

export interface GoogleBooksVolume {
  kind: 'books#volume'
  id: string
  etag?: string
  selfLink: string
  volumeInfo: GoogleBooksVolumeInfo
  saleInfo?: GoogleBooksSaleInfo
  accessInfo?: GoogleBooksAccessInfo
}

export interface GoogleBooksSearchResponse {
  kind: 'books#volumes'
  totalItems: number
  items?: GoogleBooksVolume[]
}

// Simplified Book type for app usage
export interface Book {
  id: string
  title: string
  subtitle?: string
  authors: string[]
  publisher?: string
  publishedDate?: string
  description?: string
  pageCount?: number
  categories: string[]
  averageRating?: number
  ratingsCount?: number
  thumbnail?: string
  language?: string
  previewLink?: string
  infoLink?: string
  isbn?: string
  saleability?: string
  isEbook?: boolean
  country?: string
}

// Search parameters
export interface BookSearchParams {
  query: string
  startIndex?: number
  maxResults?: number
  orderBy?: 'relevance' | 'newest'
  printType?: 'all' | 'books' | 'magazines'
  langRestrict?: string
  country?: string
}

// Search result with pagination
export interface BookSearchResult {
  books: Book[]
  totalItems: number
  startIndex: number
  hasMore: boolean
}

// API client options
export interface GoogleBooksClientOptions {
  apiKey: string
  baseUrl?: string
}

// Error types
export class GoogleBooksError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message)
    this.name = 'GoogleBooksError'
  }
}
