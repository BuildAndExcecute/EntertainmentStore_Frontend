import { AlertCircle, ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { MovieDetails } from "@/components/movie-details"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"

export function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error, refetch } = useApiResource(
    () => (id ? api.getMovie(id) : Promise.reject(new Error("Missing movie ID"))),
    [id]
  )

  if (loading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="aspect-video w-full max-h-[440px] rounded-2xl" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive mb-3" />
        <h2 className="text-xl font-semibold text-foreground">Movie Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-md">
          {error?.message || "We couldn't find the requested movie details."}
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/movies">
            <Button variant="outline">Back to Movies</Button>
          </Link>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <div>
        <Link to="/movies">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to Catalog
          </Button>
        </Link>
      </div>

      <MovieDetails detail={data} onFeedbackAdded={refetch} />
    </div>
  )
}
