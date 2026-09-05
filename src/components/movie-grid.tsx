import { Film, AlertCircle } from "lucide-react"

import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Movie } from "@/lib/types"

type MovieGridProps = {
  movies: Movie[] | null | undefined
  loading?: boolean
  error?: Error | null
  emptyMessage?: string
  searchQuery?: string
  onRetry?: () => void
}

export function MovieGrid({
  movies,
  loading = false,
  error = null,
  emptyMessage = "No movies found.",
  searchQuery = "",
  onRetry,
}: MovieGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border/50 p-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive mb-3" />
        <h3 className="text-lg font-semibold text-foreground">Failed to load movies</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          {error.message || "An unexpected error occurred while fetching movies from the server."}
        </p>
        {onRetry && (
          <Button variant="outline" className="mt-4" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    )
  }

  const filteredMovies = (movies || []).filter((movie) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      movie.title.toLowerCase().includes(q) ||
      (movie.description && movie.description.toLowerCase().includes(q))
    )
  })

  if (filteredMovies.length === 0) {
    return (
      <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-muted/20 p-12 text-center">
        <Film className="size-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-semibold text-foreground">
          {searchQuery ? `No results for "${searchQuery}"` : emptyMessage}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {searchQuery
            ? "Try searching for a different title or keyword."
            : "Check back later for new additions to the catalog."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
