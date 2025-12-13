import { useState, useRef, useEffect } from "react";
import { X, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Team Invite Accepted",
    message: "Jane Smith has accepted your team invite",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Hackathon Reminder",
    message: "AI Innovation Challenge starts in 2 hours",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Message",
    message: "You have a new message in Code Crusaders team chat",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Profile Incomplete",
    message: "Complete your profile to increase team match rate",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

function formatTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-400";
    case "info":
      return "bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-400";
    case "warning":
      return "bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:text-yellow-400";
    case "error":
      return "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/20 border-gray-500/30";
  }
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [panelPosition, setPanelPosition] = useState({ top: 0, right: 0 });
  const bellButtonRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Calculate panel position based on bell icon
  useEffect(() => {
    if (isOpen && bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setPanelPosition({
        top: rect.bottom + 8, // 8px gap below the button
        right: window.innerWidth - rect.right, // Align right edge with bell
      });
    }
  }, [isOpen]);

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      {/* Backdrop with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      {/* Notification Bell Button */}
      <Button
        ref={bellButtonRef}
        variant="ghost"
        size="icon"
        className="relative interactive-scale"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground animate-pulse">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Panel */}
      <div
        className={cn(
          "fixed w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] rounded-2xl border border-white/40 bg-white/95 backdrop-blur-2xl shadow-2xl transition-all duration-300 ease-out ",
          "dark:bg-slate-950/90 dark:border-slate-600/60 dark:shadow-2xl dark:shadow-slate-900/50",
          isOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible pointer-events-none"
        )}
        style={{
          top: `${panelPosition.top}px`,
          right: `${panelPosition.right}px`,
          transformOrigin: "top right",
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-300/40 dark:border-slate-700/50 bg-gradient-to-r from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/15 dark:bg-primary/20">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-bold text-lg">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2.5 py-1 text-xs font-bold bg-primary/30 text-primary rounded-full shadow-sm">
                {unreadCount} new
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-slate-300/40 dark:hover:bg-slate-700/50 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[calc(100vh-14rem)] scrollbar-hide">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 opacity-30 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                We'll let you know when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-300/30 dark:divide-slate-700/40">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-slate-200/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group",
                    !notification.read && "bg-blue-50/60 dark:bg-slate-800/40 border-l-3 border-primary/40"
                  )}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Notification Indicator */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-2 h-2 rounded-full mt-2",
                        !notification.read ? "bg-primary" : "bg-transparent"
                      )}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("font-semibold text-sm", !notification.read && "text-primary")}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-300/40 dark:border-slate-700/50 flex gap-2 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-850/50">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-xs font-medium hover:bg-slate-300/40 dark:hover:bg-slate-700/60 rounded-lg"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-medium bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 border-primary/30 dark:border-primary/40 text-primary rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        )}
      </div>
    </>
  );
}