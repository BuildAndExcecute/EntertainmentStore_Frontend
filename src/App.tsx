import { LogIn, User } from "lucide-react"
import { Link, Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden min-h-screen bg-background text-foreground">
        <TopBar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function TopBar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Link to="/" className="font-heading text-lg font-bold tracking-tight text-foreground md:hidden">
            Streamly
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <Link to="/profile">
              <Button variant="ghost" className="gap-2">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-primary overflow-hidden">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="size-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="size-4" />
                  )}
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                  {session.user.name || session.user.email}
                </span>
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="mr-1.5 size-4" />
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default App
