// Tipos para o chat

export interface ChatMessage {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: number;
    read: boolean;
    type: 'text' | 'image' | 'emoji';
  }
  
  export interface ChatContact {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: string;
    unreadCount?: number;
    isTyping?: boolean;
  }
  
  export interface MessageStatus {
    messageId: string;
    timestamp: number;
  }
  
  export interface UserStatus {
    userId: string;
    status: 'online' | 'offline' | 'away';
  }
  
  export interface TypingStatus {
    userId: string;
  }