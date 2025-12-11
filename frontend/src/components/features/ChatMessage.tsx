import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";

interface ChatMessageProps {
  message: Partial<Message>;
  isOwn?: boolean;
}

export function ChatMessage({ message, isOwn = false }: ChatMessageProps) {
  const { senderName, senderAvatar, content, createdAt, type, isEdited } = message;

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (type === "system") {
    return (
      <div className="flex justify-center py-2">
        <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          {content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 py-2 px-4 group hover:bg-muted/30 transition-colors rounded-lg",
        isOwn && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={senderAvatar} />
        <AvatarFallback className="bg-primary/20 text-primary text-xs">
          {senderName?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className={cn("flex-1 min-w-0", isOwn && "text-right")}>
        <div
          className={cn(
            "flex items-baseline gap-2 mb-0.5",
            isOwn && "flex-row-reverse"
          )}
        >
          <span className="text-sm font-medium">{senderName}</span>
          <span className="text-xs text-muted-foreground">{formatTime(createdAt)}</span>
          {isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
        </div>

        <div
          className={cn(
            "inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
