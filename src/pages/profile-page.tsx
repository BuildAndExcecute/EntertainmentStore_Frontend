import { Clock, History, LogOut, MessageSquare, User as UserIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useApiResource } from "@/hooks/use-api-resource"
import { api } from "@/lib/api"
import { signOut, useSession } from "@/lib/auth-client"


export function ProfilePage() {
  const navigate = useNavigate()
  const { data: session, isPending: sessionLoading } = useSession()

  const {
    data: history,
    loading: historyLoading,
    error: historyError,
  } = useApiResource(
    () => (session ? api.getUserHistory() : Promise.resolve([])),
    [session]
  )

  const {
    data: feedbacks,
    loading: feedbacksLoading,
    error: feedbacksError,
  } = useApiResource(
    () => (session ? api.getUserFeedbacks() : Promise.resolve([])),
    [session]
  )

  const handleSignOut = async () => {
    await signOut()
    navigate("/login")
  }

  if (sessionLoading) {
    return (
      <div className="space-y-6 py-6 max-w-4xl mx-auto">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="my-12 max-w-md mx-auto flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
          <UserIcon className="size-7" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Sign In to View Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You need an active session to view your watch history and feedbacks.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => navigate("/login")}>Log In</Button>
          <Button onClick={() => navigate("/signup")} variant="outline">
            Sign Up
          </Button>
        </div>
      </div>
    )
  }

  const user = session.user

  return (
    <div className="space-y-10 pb-12 max-w-4xl mx-auto">
      {/* User Info Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary overflow-hidden">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="size-16 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="size-8" />
            )}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {user.name || "User"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {"username" in user && (
              <p className="text-xs text-muted-foreground mt-0.5">
                @{String(user.username)}
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
          <LogOut className="mr-2 size-4" />
          Log Out
        </Button>
      </div>

      {/* Watch History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <History className="size-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-foreground">
            Watch History
          </h2>
        </div>

        {historyLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : historyError ? (
          <p className="text-sm text-destructive py-4">
            Failed to load watch history: {historyError.message}
          </p>
        ) : !history || history.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            No watch history recorded yet. Start watching movies to build your history!
          </div>
        ) : (
          <div className="grid gap-3">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition hover:border-border/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item?.thumbnailUrl && (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="size-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-sm text-foreground">
                      {item?.title || "Unknown Title"}
                    </h3>
                    {item.watchedAt && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="size-3" />
                        {new Date(item.watchedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {item?.movieId && (
                  <Link to={`/watch/${item.movieId}`}>
                    <Button size="sm" variant="secondary">
                      Watch Again
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User Feedbacks */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <MessageSquare className="size-5 text-primary" />
          <h2 className="font-heading text-xl font-bold text-foreground">
            My Feedback
          </h2>
        </div>

        {feedbacksLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : feedbacksError ? (
          <p className="text-sm text-destructive py-4">
            Failed to load feedbacks: {feedbacksError.message}
          </p>
        ) : !feedbacks || feedbacks.length === 0 ? (
          <div className="rounded-xl border border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
            You haven&apos;t submitted any movie feedback yet.
          </div>
        ) : (
          <div className="grid gap-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="space-y-2 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">
                    Movie ID: {fb.movieId}
                  </span>
                  {fb.updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(fb.updatedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/90">{fb.feedback}</p>
                <div className="pt-1">
                  <Link to={`/movies/${fb.movieId}`}>
                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2">
                      View Movie
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
