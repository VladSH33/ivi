export interface ChatMessage {
  id: string;
  userId: string;
  chatId: string;
  content: string;
  type: 'text' | 'file' | 'voice' | 'system';
  timestamp: number;
  isFromSupport: boolean;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
  voiceDuration?: number;
}

export interface SupportUser {
  id: string;
  email: string;
  name: string;
  isOnline: boolean;
  lastSeen?: number;
}

export interface SupportChat {
  id: string;
  userId: string;
  supportAgentId?: string;
  status: 'waiting' | 'active' | 'closed';
  createdAt: number;
  lastMessageAt: number;
}

export interface WebSocketMessage {
  type: 'message' | 'ping' | 'pong' | 'user_joined' | 'user_left' | 'typing' | 'file_uploaded';
  payload: any;
  timestamp: number;
}

export interface FileUploadData {
  file: File;
  chatId: string;
  userId: string;
}

export interface VoiceMessageData {
  audioBlob: Blob;
  duration: number;
  chatId: string;
  userId: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'; 