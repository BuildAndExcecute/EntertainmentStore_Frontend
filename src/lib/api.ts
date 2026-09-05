import type {
  MovieDetail,
  MovieFeedbackItem,
  MoviesResult,
  UserFeedbackItem,
  UserHistoryItem,
} from "./types"

const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
).replace(/\/$/, "")

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  })

  if (!response.ok) {
    let errorMessage = `HTTP Error: ${response.status}`
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorMessage = errorJson.message
      }
    } catch {
      // json parsing failed, fallback to status
    }
    throw new Error(errorMessage)
  }

  const json = await response.json()
  if (json && typeof json === "object" && "data" in json) {
    return json.data as T
  }
  return json as T
}

export const api = {
  getMovies: (page = 1, limit = 20) =>
    request<MoviesResult>(`/movies?page=${page}&limit=${limit}`),

  getMovie: (id: string) => request<MovieDetail>(`/movies/${id}`),

  getStream: (id: string) =>
    request<{ videoUrl: string }>(`/movies/${id}/stream`),

  getUserHistory: () => request<UserHistoryItem[]>(`/user/user-history`),

  getUserFeedbacks: () => request<UserFeedbackItem[]>(`/user/user-feedbacks`),

  getMovieFeedbacks: (movieId: string) =>
    request<MovieFeedbackItem[]>(`/feedback/movie/${movieId}`),

  addFeedback: (data: { movieId: string; feedback: string }) =>
    request<null>(`/feedback`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateFeedback: (id: string, data: { feedback: string }) =>
    request<UserFeedbackItem>(`/feedback/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
}
