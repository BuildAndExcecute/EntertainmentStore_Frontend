import * as React from "react"
import { Search } from "lucide-react"

import { MovieGrid } from "@/components/movie-grid"
import { Input } from "@/components/ui/input"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"

export function MoviesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const { data, loading, error, refetch } = useApiResource(() => api.getMovies(1, 50))

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            All Movies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse our full catalog of available streaming titles.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="pl-9"
          />
        </div>
      </div>

      <MovieGrid
        movies={data?.movies}
        loading={loading}
        error={error}
        searchQuery={searchQuery}
        emptyMessage="No movies available in the catalog."
        onRetry={refetch}
      />
    </div>
  )
}
