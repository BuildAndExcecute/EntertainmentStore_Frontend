import { Clapperboard, Film, Home, LogIn, LogOut, User, UserPlus } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate("/login")
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
            <Clapperboard className="size-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-heading text-base font-bold tracking-tight text-foreground">
              Streamly
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Movie Streaming
            </p>
          </div>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<NavLink to="/" />} tooltip="Home">
                  <Home />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton render={<NavLink to="/movies" />} tooltip="Movies">
                  <Film />
                  <span>Movies</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {session && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<NavLink to="/profile" />} tooltip="Profile">
                    <User />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {session ? (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleSignOut} tooltip="Log out">
                    <LogOut />
                    <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/login" />} tooltip="Log in">
                      <LogIn />
                      <span>Log In</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton render={<NavLink to="/signup" />} tooltip="Sign up">
                      <UserPlus />
                      <span>Sign Up</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
