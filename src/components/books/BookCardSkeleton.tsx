'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface BookCardSkeletonProps {
  variant?: 'grid' | 'list'
  className?: string
}

export function BookCardSkeleton({
  variant = 'grid',
  className,
}: BookCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <div
        className={cn(
          'flex gap-4 rounded-xl bg-card p-4 border border-border',
          className
        )}
      >
        <Skeleton className="h-24 w-16 flex-shrink-0 rounded-lg" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  // Grid variant
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl bg-card border border-border',
        className
      )}
    >
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="flex flex-1 flex-col p-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-3 w-2/3" />
        <Skeleton className="mt-2 h-3 w-12" />
      </div>
    </div>
  )
}

interface BookGridSkeletonProps {
  count?: number
  variant?: 'grid' | 'list'
  className?: string
}

export function BookGridSkeleton({
  count = 10,
  variant = 'grid',
  className,
}: BookGridSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <BookCardSkeleton key={i} variant="list" />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <BookCardSkeleton key={i} variant="grid" />
      ))}
    </div>
  )
}
