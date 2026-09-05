import { createAuthClient } from "better-auth/react"

const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"
const authBaseUrl = rawApiUrl.replace(/\/$/, "") + "/auth"

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  fetchOptions: {
    credentials: "include",
  },
})

export const { useSession, signIn, signUp, signOut, getSession } = authClient
