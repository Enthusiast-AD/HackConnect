import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  User,
  Trophy,
  Calendar,
  Settings,
  Zap,
  LayoutDashboard,
} from "lucide-react";

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/explore", icon: Compass, label: "Explore" },
  { href: "/my-hackathons", icon: Calendar, label: "My Hackathons" },
  { href: "/teams/lobby", icon: Users, label: "Teams" },
  { href: "/chat", icon: MessageSquare, label: "Messages" },
  { href: "/showcase", icon: Trophy, label: "Showcase" },
];

const bottomNavItems = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border/50 bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-primary"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-border/50 py-4">
        <nav className="space-y-1 px-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-primary"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* XP Progress */}
      {!collapsed && (
        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Level 12</p>
              <p className="text-xs text-muted-foreground">2,450 XP</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-primary animate-pulse-neon" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">550 XP to Level 13</p>
        </div>
      )}
    </aside>
  );
}
