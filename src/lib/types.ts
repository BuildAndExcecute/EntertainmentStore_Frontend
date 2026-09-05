export interface Movie {
  id: string
  title: string
  description?: string | null
  thumbnailUrl: string
  bannerUrl?: string | null
  views?: number
  likes?: number
  dislikes?: number
  genres?: string[]
}

export interface MovieFeedbackItem {
  id?: string
  userId: string
  feedback: string
  createdAt?: string
}

export interface MovieDetail {
  movie: Movie
  feedbacks: MovieFeedbackItem[]
}

export interface UserFeedbackItem {
  id: string
  movieId: string
  feedback: string
  updatedAt?: string
}

export interface UserHistoryItem {
  watchedAt: string
  movie: Movie
}

export interface MoviesPagination {
  page: number
  limit: number
  totalMovies: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface MoviesResult {
  movies: Movie[]
  pagination?: MoviesPagination
}

export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
  success?: boolean
}
