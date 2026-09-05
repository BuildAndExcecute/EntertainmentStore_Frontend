import { Eye, Info, Play, Sparkles, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

import { MovieGrid } from "@/components/movie-grid"
import { Button } from "@/components/ui/button"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"
import type { Movie } from "@/lib/types"

export function HomePage() {
  const { data, loading, error, refetch } = useApiResource(() => api.getMovies(1, 20))

  const movies = data?.movies || []
  const heroMovie = movies.length > 0 ? movies[0] : null

  // Derive Trending section by sorting movies by views descending
  const trendingMovies = [...movies]
    .filter((m) => typeof m.views === "number")
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4)

  return (
    <div className="space-y-12 pb-12">
      {/* Featured Hero Banner */}
      {heroMovie && <HeroSection movie={heroMovie} />}

      {/* Trending Section */}
      {trendingMovies.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Trending Now
            </h2>
          </div>
          <MovieGrid movies={trendingMovies} loading={loading} error={error} onRetry={refetch} />
        </section>
      )}

      {/* All Movies Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Explore All Movies
          </h2>
          <Link to="/movies">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          emptyMessage="No movies available yet."
          onRetry={refetch}
        />
      </section>
    </div>
  )
}

function HeroSection({ movie }: { movie: Movie }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
      <img
        src={movie.bannerUrl || movie.thumbnailUrl}
        alt={movie.title}
        className="absolute inset-0 -z-20 size-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="flex min-h-[440px] max-w-2xl flex-col justify-end p-6 sm:p-10 lg:p-12">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
          <Sparkles className="size-3.5" />
          Featured Premiere
        </div>

        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {movie.title}
        </h1>

        {movie.description && (
          <p className="mt-3 line-clamp-3 text-sm text-muted-foreground sm:text-base leading-relaxed">
            {movie.description}
          </p>
        )}

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          {typeof movie.views === "number" && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Eye className="size-3.5 text-primary" />
              {movie.views.toLocaleString()} views
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to={`/watch/${movie.id}`}>
            <Button size="lg" className="h-11 px-6 font-semibold shadow-lg shadow-primary/20">
              <Play className="mr-2 size-4 fill-current" />
              Watch Now
            </Button>
          </Link>
          <Link to={`/movies/${movie.id}`}>
            <Button size="lg" variant="secondary" className="h-11 px-6">
              <Info className="mr-2 size-4" />
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
