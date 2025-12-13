export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: Attachment[];
  reactions?: Reaction[];
  replyTo?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file' | 'link';
  size?: number;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Channel {
  id: string;
  name: string;
  type: 'team' | 'direct' | 'hackathon';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export interface ChatNotification {
  id: string;
  channelId: string;
  messageId: string;
  type: 'mention' | 'reply' | 'message';
  isRead: boolean;
  createdAt: Date;
}
