import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        "hover:bg-primary/10 hover:text-green-500 hover:scale-105",
        "active:scale-95"
      )}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition-all duration-500",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0 absolute"
        )}
      />
      <Moon
        className={cn(
          "h-5 w-5 transition-all duration-500",
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0 absolute"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
