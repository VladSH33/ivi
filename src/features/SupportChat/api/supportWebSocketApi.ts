import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ChatMessage, SupportChat, WebSocketMessage, ConnectionStatus } from "../types";
import { BASE_URL } from "@/shared/config/environment";

export const supportWebSocketApi = createApi({
  reducerPath: "supportWebSocketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["ChatMessage", "SupportChat"],
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (chatId) => `/api/support/chat/${chatId}/messages`,
      providesTags: ["ChatMessage"],
    }),
    createOrGetChat: builder.mutation<SupportChat, { userId: string }>({
      query: ({ userId }) => ({
        url: "/api/support/chat",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["SupportChat"],
    }),
    uploadFile: builder.mutation<{ fileUrl: string; fileName: string }, FormData>({
      query: (formData) => ({
        url: "/api/support/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useCreateOrGetChatMutation,
  useUploadFileMutation,
} = supportWebSocketApi;

class SupportWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageListeners: Array<(message: ChatMessage) => void> = [];
  private statusListeners: Array<(status: ConnectionStatus) => void> = [];
  private currentStatus: ConnectionStatus = 'disconnected';
  private userId: string | null = null;
  private chatId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(userId: string, chatId: string) {
    this.userId = userId;
    this.chatId = chatId;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus('connecting');
    
    this.createMockWebSocket();
  }

  private createMockWebSocket() {
    const mockWs = {
      readyState: WebSocket.OPEN,
      send: (data: string) => {
        console.log('Mock WebSocket send:', data);
        setTimeout(() => {
          this.handleMockMessage(data);
        }, 1000 + Math.random() * 2000);
      },
      close: () => {
        this.updateStatus('disconnected');
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    } as any;

    this.ws = mockWs;
    this.updateStatus('connected');
    this.startPingPong();
    this.reconnectAttempts = 0;

    setTimeout(() => {
      this.notifyMessageListeners({
        id: Date.now().toString(),
        userId: 'support',
        chatId: this.chatId!,
        content: 'Здравствуйте! Я оператор службы поддержки. Чем могу помочь?',
        type: 'text',
        timestamp: Date.now(),
        isFromSupport: true,
      });
    }, 2000);
  }

  private handleMockMessage(sentData: string) {
    try {
      const message = JSON.parse(sentData);
      if (message.type === 'message') {
        const responses = [
          'Благодарю за обращение. Рассматриваю ваш вопрос.',
          'Понятно. Сейчас проверю информацию по вашей проблеме.',
          'Я передал ваше обращение специалисту. Ожидайте ответа.',
          'Мы работаем над решением вашего вопроса.',
          'Спасибо за предоставленную информацию.',
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        this.notifyMessageListeners({
          id: Date.now().toString(),
          userId: 'support',
          chatId: this.chatId!,
          content: randomResponse,
          type: 'text',
          timestamp: Date.now(),
          isFromSupport: true,
        });
      }
    } catch (error) {
      console.error('Error handling mock message:', error);
    }
  }

  private startPingPong() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const pingMessage: WebSocketMessage = {
          type: 'ping',
          payload: {},
          timestamp: Date.now(),
        };
        this.ws.send(JSON.stringify(pingMessage));
      }
    }, 30000);
  }

  private updateStatus(status: ConnectionStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: this.userId,
        chatId: this.chatId,
        content,
        type: 'text',
        timestamp: Date.now(),
        isFromSupport: false,
      };

      const message: WebSocketMessage = {
        type: 'message',
        payload: userMessage,
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(message));
      
      this.notifyMessageListeners(userMessage);
    } else {
      console.log('WebSocket not ready:', {
        wsReady: this.ws?.readyState === WebSocket.OPEN,
        userId: this.userId,
        chatId: this.chatId
      });
    }
  }

  sendFile(fileUrl: string, fileName: string, fileType: string) {
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const message: WebSocketMessage = {
        type: 'message',
        payload: {
          id: Date.now().toString(),
          userId: this.userId,
          chatId: this.chatId,
          content: `Файл: ${fileName}`,
          type: 'file',
          timestamp: Date.now(),
          isFromSupport: false,
          fileName,
          fileUrl,
          fileType,
        },
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(message));
      this.notifyMessageListeners(message.payload as ChatMessage);
    }
  }

  sendVoiceMessage(audioUrl: string, duration: number) {
    console.log('sendVoiceMessage called with duration:', duration);
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const voiceMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: this.userId,
        chatId: this.chatId,
        content: 'Голосовое сообщение',
        type: 'voice',
        timestamp: Date.now(),
        isFromSupport: false,
        fileUrl: audioUrl,
        voiceDuration: duration,
      };
      
      console.log('Created voice message:', voiceMessage);
      console.log('voiceDuration in created message:', voiceMessage.voiceDuration);
      
      const message: WebSocketMessage = {
        type: 'message',
        payload: voiceMessage,
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(message));
      this.notifyMessageListeners(voiceMessage);
    }
  }

  onMessage(listener: (message: ChatMessage) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onStatusChange(listener: (status: ConnectionStatus) => void) {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notifyMessageListeners(message: ChatMessage) {
    console.log('notifyMessageListeners called with:', message);
    console.log('voiceDuration in notifyMessageListeners:', message.voiceDuration);
    console.log('Number of listeners:', this.messageListeners.length);
    this.messageListeners.forEach((listener, index) => {
      console.log(`Calling listener ${index} with voiceDuration:`, message.voiceDuration);
      listener(message);
    });
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.updateStatus('disconnected');
  }

  getStatus() {
    return this.currentStatus;
  }
}

export const supportWebSocketService = new SupportWebSocketService(); 