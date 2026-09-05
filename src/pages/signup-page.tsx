import * as React from "react"
import { AlertCircle, Clapperboard, Loader2, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, signUp } from "@/lib/auth-client"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="size-4" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [googleLoading, setGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const validate = () => {
    if (!name.trim()) {
      setError("Full name is required.")
      return false
    }
    if (!email.trim()) {
      setError("Email address is required.")
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.")
      return false
    }
    if (!password) {
      setError("Password is required.")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      setError(null)


      const res = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
      } as any)

      if (res?.error) {
        setError(res.error.message || "Failed to create account. Email may already be registered.")
      } else {
        navigate("/")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      setError(null)

      const res = await signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/",
      })

      if (res?.error) {
        setError(res.error.message || "Google sign-in failed. Make sure Google OAuth is configured on the backend.")
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Please verify backend Google OAuth setup.")
    } finally {
      setGoogleLoading(false)
    }
  }

  const isSubmitting = loading || googleLoading

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="text-center space-y-2">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Clapperboard className="size-6" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to stream your favorite movies
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" className="w-full font-semibold" disabled={isSubmitting}>
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 size-4" />
                Sign Up
              </>
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* <Button
          type="button"
          variant="outline"
          className="w-full font-medium"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <GoogleIcon className="mr-2" />
              Continue with Google
            </>
          )}
        </Button> */}

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
