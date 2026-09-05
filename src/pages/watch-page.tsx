import { AlertCircle, ArrowLeft, Lock } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"
import { useSession } from "@/lib/auth-client"

export function WatchPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: session, isPending: sessionLoading } = useSession()

  const {
    data: streamData,
    loading: streamLoading,
    error: streamError,
    refetch: refetchStream,
  } = useApiResource(
    () => (id ? api.getStream(id) : Promise.reject(new Error("Missing movie ID"))),
    [id]
  )

  const { data: movieDetail } = useApiResource(
    () => (id ? api.getMovie(id) : Promise.reject(new Error("Missing movie ID"))),
    [id]
  )

  const loading = streamLoading || sessionLoading
  const movie = movieDetail?.movie

  if (loading) {
    return (
      <div className="space-y-6 py-6 max-w-5xl mx-auto">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="aspect-video w-full rounded-2xl bg-muted" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    )
  }

  // Handle unauthorized / login required
  const isUnauthorized =
    streamError &&
    (streamError.message.toLowerCase().includes("unauthorized") ||
      streamError.message.toLowerCase().includes("401") ||
      !session)

  if (isUnauthorized) {
    return (
      <div className="my-12 max-w-lg mx-auto flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <Lock className="size-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You must be logged in to stream this movie. Sign in to your account to start watching.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button onClick={() => navigate("/login")} className="w-full sm:w-auto">
            Log In
          </Button>
          <Button onClick={() => navigate("/signup")} variant="outline" className="w-full sm:w-auto">
            Create Account
          </Button>
        </div>
      </div>
    )
  }

  if (streamError || !streamData?.videoUrl) {
    return (
      <div className="my-12 max-w-lg mx-auto flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-10 text-destructive mb-3" />
        <h2 className="text-xl font-semibold text-foreground">Failed to Load Video</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {streamError?.message || "Unable to retrieve the stream link for this movie."}
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/movies">
            <Button variant="outline">Back to Movies</Button>
          </Link>
          <Button onClick={refetchStream}>Retry Stream</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div>
        <Link to={id ? `/movies/${id}` : "/movies"}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back to Movie Details
          </Button>
        </Link>
      </div>

      {/* Video Player */}
      <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
        <video
          controls
          autoPlay
          src={streamData.videoUrl}
          poster={movie?.bannerUrl || movie?.thumbnailUrl}
          className="aspect-video w-full object-contain"
        >
          Your browser does not support HTML video playback.
        </video>
      </div>

      {/* Movie Meta Information */}
      {movie && (
        <div className="space-y-2 rounded-2xl border border-border bg-card p-6">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            {movie.title}
          </h1>
          {movie.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {movie.description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
