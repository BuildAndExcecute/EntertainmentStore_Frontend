import { Eye, ThumbsUp, Play } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import type { Movie } from "@/lib/types"

type MovieCardProps = {
  movie: Movie
  aspectRatio?: "video" | "poster"
}

export function MovieCard({ movie, aspectRatio = "video" }: MovieCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm transition duration-300 hover:border-border/80 hover:shadow-lg hover:shadow-primary/5">
      <Link to={`/movies/${movie.id}`} className="block">
        <div
          className={
            aspectRatio === "poster"
              ? "relative aspect-[3/4] overflow-hidden bg-muted"
              : "relative aspect-video overflow-hidden bg-muted"
          }
        >
          <img
            src={movie.thumbnailUrl || movie.bannerUrl || "/placeholder.jpg"}
            alt={movie.title}
            className="size-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />
          
          <Link
            to={`/watch/${movie.id}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Button
              size="icon"
              className="size-10 rounded-full shadow-lg"
              aria-label={`Play ${movie.title}`}
            >
              <Play className="size-5 fill-current pl-0.5" />
            </Button>
          </Link>
        </div>

        <div className="space-y-1.5 p-4">
          <h3 className="truncate font-heading text-base font-semibold tracking-tight text-foreground transition group-hover:text-primary">
            {movie.title}
          </h3>
          
          {movie.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {movie.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            {typeof movie.views === "number" && (
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" />
                {movie.views.toLocaleString()} views
              </span>
            )}

            {typeof movie.likes === "number" && movie.likes > 0 && (
              <span className="inline-flex items-center gap-1 text-primary">
                <ThumbsUp className="size-3.5" />
                {movie.likes}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
