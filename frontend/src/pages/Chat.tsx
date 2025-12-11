import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { ChatMessage } from "@/components/features/ChatMessage";
import {
  Search,
  Send,
  Plus,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Hash,
  Users,
  Pin,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const channels = [
  {
    id: "1",
    name: "Code Crusaders",
    type: "team" as const,
    unreadCount: 3,
    lastMessage: {
      content: "I just pushed the new feature!",
      senderName: "Jane",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  },
  {
    id: "2",
    name: "general",
    type: "hackathon" as const,
    unreadCount: 12,
    lastMessage: {
      content: "Welcome to the hackathon!",
      senderName: "Organizer",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  },
  {
    id: "3",
    name: "Jane Smith",
    type: "direct" as const,
    unreadCount: 0,
    lastMessage: {
      content: "Sounds good!",
      senderName: "Jane",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
  },
];

const messages = [
  {
    id: "1",
    channelId: "1",
    senderId: "2",
    senderName: "Jane Smith",
    content: "Hey team! I just finished the API integration. Want me to push it now?",
    type: "text" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isEdited: false,
  },
  {
    id: "2",
    channelId: "1",
    senderId: "1",
    senderName: "John Doe",
    content: "That's great! Yes, please push it. I'll review it right away.",
    type: "text" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 25),
    isEdited: false,
  },
  {
    id: "3",
    channelId: "1",
    senderId: "3",
    senderName: "Bob Smith",
    content: "I just finished the UI mockups for the dashboard. Check them out!",
    type: "text" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
    isEdited: false,
  },
  {
    id: "4",
    channelId: "1",
    senderId: "system",
    senderName: "System",
    content: "Jane Smith pushed 3 commits to main branch",
    type: "system" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
    isEdited: false,
  },
  {
    id: "5",
    channelId: "1",
    senderId: "2",
    senderName: "Jane Smith",
    content: "Done! The API endpoints are now live. Here's the documentation link: https://docs.example.com/api",
    type: "text" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
    isEdited: false,
  },
  {
    id: "6",
    channelId: "1",
    senderId: "1",
    senderName: "John Doe",
    content: "Perfect! The code looks clean. Great work everyone! 🎉",
    type: "text" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
    isEdited: false,
  },
];

const pinnedResources = [
  { id: "1", title: "Project Brief", type: "doc" },
  { id: "2", title: "API Documentation", type: "link" },
  { id: "3", title: "Design Files", type: "figma" },
];

export default function Chat() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0]);
  const [newMessage, setNewMessage] = useState("");
  const [showChannels, setShowChannels] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log("Send:", newMessage);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      <main className="lg:pl-64 pt-16 h-screen">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Channel List - Responsive */}
          <div
            className={cn(
              "border-r border-border/50 flex flex-col transition-all duration-300 bg-background",
              showChannels ? "w-72 md:w-72" : "w-0 overflow-hidden",
              "absolute lg:relative z-20 h-[calc(100vh-4rem)] lg:h-auto"
            )}
          >
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {channels.map((channel, index) => (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannel(channel);
                      if (window.innerWidth < 1024) setShowChannels(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 animate-fade-in",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      selectedChannel.id === channel.id
                        ? "bg-primary/10 border border-primary/30 shadow-sm"
                        : "hover:bg-muted"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative">
                      {channel.type === "direct" ? (
                        <Avatar className="h-10 w-10 transition-transform duration-200 hover:scale-110">
                          <AvatarFallback className="bg-muted">
                            {channel.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center transition-all duration-200 hover:bg-primary/10">
                          {channel.type === "team" ? (
                            <Users className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Hash className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      {channel.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground animate-pulse">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{channel.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(channel.lastMessage.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {channel.lastMessage.senderName}: {channel.lastMessage.content}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area - Flexible */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden interactive-scale"
                  onClick={() => setShowChannels(!showChannels)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                {selectedChannel.type === "team" ? (
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-200 hover:scale-110">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <Avatar className="h-10 w-10 transition-transform duration-200 hover:scale-110">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedChannel.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h2 className="font-semibold">{selectedChannel.name}</h2>
                  <p className="text-sm text-muted-foreground">3 members online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hidden sm:flex interactive-scale">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex interactive-scale">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:flex interactive-scale">
                  <Pin className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="interactive-scale">
                  <MoreVertical className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex interactive-scale"
                  onClick={() => setShowRightPanel(!showRightPanel)}
                >
                  {showRightPanel ? (
                    <PanelRightClose className="h-5 w-5" />
                  ) : (
                    <PanelRightOpen className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Messages - Flexible scroll area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-1 max-w-3xl mx-auto">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ChatMessage
                      message={message}
                      isOwn={message.senderId === "1"}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input - Responsive */}
            <div className="p-4 border-t border-border/50 bg-background/95 backdrop-blur-sm">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-3xl mx-auto">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden sm:flex interactive-scale"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <div className="relative flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="pr-20 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:scale-[1.01]"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hidden sm:flex interactive-scale"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 interactive-scale"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="neon"
                  size="icon"
                  className="interactive-scale"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right Sidebar - Collapsible */}
          <div
            className={cn(
              "border-l border-border/50 p-4 space-y-6 transition-all duration-300 bg-background",
              "hidden md:block",
              showRightPanel ? "w-72" : "w-0 overflow-hidden p-0"
            )}
          >
            <div className="animate-fade-in">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned Resources
              </h3>
              <div className="space-y-2">
                {pinnedResources.map((resource, index) => (
                  <Card
                    key={resource.id}
                    className="p-3 cursor-pointer card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium transition-all duration-200 hover:bg-primary/10">
                        {resource.type.toUpperCase().slice(0, 3)}
                      </div>
                      <span className="text-sm font-medium">{resource.title}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold mb-3">Team Members</h3>
              <div className="space-y-2">
                {["John Doe", "Jane Smith", "Bob Smith"].map((member, index) => (
                  <div
                    key={member}
                    className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-muted cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
                      <AvatarFallback className="bg-muted text-xs">
                        {member.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Menu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
