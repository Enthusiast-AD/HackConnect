import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
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
  setCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed = false, setCollapsed }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border/50 bg-sidebar overflow-hidden"
      )}
    >
      {/* Toggle Button */}
      {setCollapsed && (
        <div className={cn("flex items-center p-2", collapsed ? "justify-center" : "justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )}

      <div className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        <nav className="space-y-1 px-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative group",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-primary"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md border border-border">
                  {item.label}
                </div>
              )}
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative group",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-primary"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-md border border-border">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* XP Progress */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 p-4 overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div className="whitespace-nowrap">
                <p className="text-sm font-medium">Level 12</p>
                <p className="text-xs text-muted-foreground">2,450 XP</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-primary animate-pulse-neon" />
            </div>
            <p className="text-xs text-muted-foreground mt-1 whitespace-nowrap">550 XP to Level 13</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
