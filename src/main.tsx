import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import "./index.css"
import App from "./App.tsx"
import { ProtectedRoute } from "@/components/protected-route.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { HomePage } from "@/pages/home-page"
import { LoginPage } from "@/pages/login-page"
import { MovieDetailsPage } from "@/pages/movie-details-page"
import { MoviesPage } from "@/pages/movies-page"
import { ProfilePage } from "@/pages/profile-page"
import { SignupPage } from "@/pages/signup-page"
import { WatchPage } from "@/pages/watch-page"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "movies", element: <MoviesPage /> },
      { path: "movies/:id", element: <MovieDetailsPage /> },
      { path: "watch/:id", element: <WatchPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
