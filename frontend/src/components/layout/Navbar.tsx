import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationPanel } from "@/components/features/NotificationPanel";
import { 
  Zap, 
  Menu, 
  X, 
  Search,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <img src="/logo.svg" alt="HackConnect Logo" className="h-8 w-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 blur-lg bg-primary/30 group-hover:bg-primary/50 transition-all duration-300" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Hack<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="relative interactive-scale">
                  <Search className="h-5 w-5" />
                </Button>
                <NotificationPanel />
                <Link to="/settings">
                  <Button variant="ghost" size="icon" className="interactive-scale">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="interactive-scale">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" className="interactive-scale" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : !isAuthPage && (
              <>
                <Link to="/settings">
                  <Button variant="ghost" size="icon" className="interactive-scale">
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="interactive-scale">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="neon" className="interactive-scale">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="interactive-scale"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link
                to="/settings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-2 py-1 animate-slide-up flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              {!isAuthenticated && !isAuthPage && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start interactive-scale">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button variant="neon" className="w-full interactive-scale">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
              {isAuthenticated && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start interactive-scale text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
