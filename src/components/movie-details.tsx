import * as React from "react"
import { Eye, MessageSquare, Play, Send, ThumbsDown, ThumbsUp, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useSession } from "@/lib/auth-client"
import type { MovieDetail } from "@/lib/types"

type MovieDetailsProps = {
  detail: MovieDetail
  onFeedbackAdded?: () => void
}

export function MovieDetails({ detail, onFeedbackAdded }: MovieDetailsProps) {
  const { movie, feedbacks = [] } = detail
  const { data: session } = useSession()
  const navigate = useNavigate()

  const [feedbackText, setFeedbackText] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackText.trim()) return

    if (!session) {
      navigate("/login")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await api.addFeedback({ movieId: movie.id, feedback: feedbackText.trim() })
      setFeedbackText("")
      if (onFeedbackAdded) {
        onFeedbackAdded()
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit feedback.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Banner / Hero Section */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-border bg-card">
        {movie.bannerUrl || movie.thumbnailUrl ? (
          <img
            src={movie.bannerUrl || movie.thumbnailUrl}
            alt={movie.title}
            className="absolute inset-0 -z-20 size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/80 to-background/30" />

        <div className="flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-end">
          {movie.thumbnailUrl && (
            <div className="aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-xl border border-border shadow-2xl">
              <img
                src={movie.thumbnailUrl}
                alt={movie.title}
                className="size-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4 max-w-2xl">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {movie.title}
            </h1>

            {movie.description && (
              <p className="text-base text-muted-foreground leading-relaxed sm:text-lg">
                {movie.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
              {typeof movie.views === "number" && (
                <span className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 font-medium">
                  <Eye className="size-4 text-primary" />
                  {movie.views.toLocaleString()} views
                </span>
              )}
              {typeof movie.likes === "number" && (
                <span className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 font-medium">
                  <ThumbsUp className="size-4 text-emerald-500" />
                  {movie.likes}
                </span>
              )}
              {typeof movie.dislikes === "number" && (
                <span className="flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 font-medium">
                  <ThumbsDown className="size-4 text-rose-500" />
                  {movie.dislikes}
                </span>
              )}
            </div>

            <div className="pt-4">
              <Link to={`/watch/${movie.id}`}>
                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                  <Play className="mr-2 size-5 fill-current" />
                  Watch Movie
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feedbacks / Comments Section */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-primary" />
            <h2 className="text-xl font-semibold">User Feedback ({feedbacks.length})</h2>
          </div>
        </div>

        {/* Add Feedback Form */}
        <form onSubmit={handleSubmitFeedback} className="space-y-3">
          <div className="flex gap-3">
            <Input
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={
                session ? "Share your thoughts about this movie..." : "Log in to post your feedback"
              }
              disabled={submitting || !session}
              className="bg-muted/40"
            />
            {session ? (
              <Button type="submit" disabled={submitting || !feedbackText.trim()}>
                <Send className="size-4 mr-1" />
                Submit
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="secondary">Log In</Button>
              </Link>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>

        {/* Feedbacks List */}
        <div className="space-y-4 pt-2">
          {feedbacks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No feedback yet. Be the first to review this movie!
            </p>
          ) : (
            feedbacks.map((fb, idx) => (
              <div
                key={fb.id || idx}
                className="flex gap-4 rounded-xl border border-border/50 bg-muted/20 p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      User {fb.userId ? fb.userId.slice(-4) : "Anonymous"}
                    </span>
                    {fb.createdAt && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/90">{fb.feedback}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
